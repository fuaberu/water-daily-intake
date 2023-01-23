import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import moment from "moment";
import { auth, db } from "../../config/firebase";
import { initialSettings } from "../../context/sessionContext";
import { ICupRecord, IRecord, ISettings } from "../../pages";

//  REGISTER  //

export const addRegister = async (record: ICupRecord, recordId: string) => {
  const ref = doc(db, "records", recordId);

  return await updateDoc(ref, { cups: arrayUnion(record) });
};

export const getRegisters = async (id: string, newReg: IRecord) => {
  const docRef = doc(db, "records", id);
  const recordData = await getDoc(docRef);

  if (recordData.data()) {
    const returnRegs = recordData.data() as IRecord;
    returnRegs.cups = returnRegs?.cups.sort((a, b) => b.id - a.id);
    return returnRegs;
  }

  await setDoc(docRef, newReg);
  return newReg;
};

export const deleteRegister = async (id: string, record: ICupRecord) => {
  const ref = doc(db, "records", id);

  return await updateDoc(ref, { cups: arrayRemove(record) });
};

export const editRegister = async (
  id: string,
  prev: ICupRecord,
  newRec: ICupRecord
) => {
  const ref = doc(db, "records", id);

  await updateDoc(ref, { cups: arrayRemove(prev) });
  return await updateDoc(ref, { cups: arrayUnion(newRec) });
};

export const getHistory = async (
  date: {
    month: number;
    year: number;
  },
  mode: "year" | "month" | "week"
) => {
  if (mode === "month") {
    return getMonthHistory(date);
  } else if (mode === "year") {
    return getYearHistory();
  } else if (mode === "week") {
    return getWeekHistory();
  }
};

const getMonthHistory = async (date: { month: number; year: number }) => {
  const coll = collection(db, "records");

  const query_ = query(
    coll,
    where("userId", "==", auth.currentUser?.uid),
    where("date", ">=", moment(date).startOf("month").toDate()),
    where("date", "<=", moment(date).endOf("month").toDate())
  );
  const querySnapshot = await getDocs(query_);

  const res: IRecord[] = Array(moment(date).daysInMonth()).fill(null);

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as IRecord;
    const day =
      docData.date instanceof Timestamp
        ? docData.date.toDate().getDate() - 1
        : docData.date.getDate() - 1;
    res[day] = docData;
  });

  return res;
};

const getYearHistory = async () => {
  const coll = collection(db, "records");

  const query_ = query(
    coll,
    where("userId", "==", auth.currentUser?.uid),
    where("date", ">=", moment().subtract(12, "months").toDate()),
    where("date", "<=", moment().toDate())
  );

  const res: IRecord[] = Array(12).fill(null);

  const querySnapshot = await getDocs(query_);

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as IRecord;
    const month =
      docData.date instanceof Timestamp
        ? docData.date.toDate().getMonth()
        : docData.date.getMonth();
    res[month] = docData;
  });

  return res;
};

const getWeekHistory = async () => {
  const coll = collection(db, "records");

  const query_ = query(
    coll,
    where("userId", "==", auth.currentUser?.uid),
    where(
      "date",
      ">=",
      moment({ h: 0, minute: 0, seconds: 0, milliseconds: 1 })
        .isoWeekday(1)
        .toDate()
    ),
    where(
      "date",
      "<=",
      moment({ h: 23, minute: 59, seconds: 59 }).isoWeekday(7).toDate()
    )
  );

  const res: IRecord[] = Array(7).fill(null);

  const querySnapshot = await getDocs(query_);

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as IRecord;
    const day =
      docData.date instanceof Timestamp
        ? docData.date.toDate().getDay() > 0
          ? docData.date.toDate().getDay() - 1
          : 6
        : docData.date.getDay() > 0
        ? docData.date.getDay() - 1
        : 6;
    res[day] = docData;
  });

  return res;
};

//  USER  //

export const createUserInitialSettings = async () => {
  if (!auth.currentUser?.uid) return;
  await setDoc(doc(db, "settings", auth.currentUser.uid), {
    ...initialSettings,
  });
};

export const getUserSettings = async () => {
  if (!auth.currentUser?.uid) return;
  const docRef = doc(db, "settings", auth.currentUser.uid);

  const settingsData = (await getDoc(docRef)).data() as ISettings | undefined;

  if (!settingsData) {
    createUserInitialSettings();
    return initialSettings;
  }

  return settingsData;
};

//  OTHERS  //

export const resetUserData = async () => {
  if (!auth.currentUser?.uid) return;
  // Delete settings
  await deleteDoc(doc(db, "settings", auth.currentUser.uid));
  // Delete records
  const querySnapshot = await getDocs(
    query(
      collection(db, "records"),
      where("userId", "==", auth.currentUser.uid)
    )
  );

  // Get a new write batch
  const batch = writeBatch(db);

  querySnapshot.forEach(function (doc) {
    // For each doc, add a delete operation to the batch
    batch.delete(doc.ref);
  });

  // Commit the batch
  return batch.commit();
};

//  Settings  //

export const updateSettings = async (setting: Partial<ISettings>) => {
  if (!auth.currentUser?.uid) return;
  await updateDoc(doc(db, "settings", auth.currentUser.uid), { ...setting });
};
