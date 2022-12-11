import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import moment from "moment";
import { auth, db } from "../../config/firebase";
import { initialSettings } from "../../context/sessionContext";
import { ICup, IRecord, ISettings } from "../../pages";

//  REGISTER  //

export const addRegister = async (
  record: IRecord,
  ref: DocumentReference<DocumentData>
) => {
  try {
    return await setDoc(ref, record);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getRegisters = async ({
  dateBegin,
  dateEnd,
}: {
  dateBegin?: Date;
  dateEnd?: Date;
}) => {
  let q = null;

  if (dateBegin && dateEnd) {
    q = query(
      collection(db, "records"),
      where("userId", "==", auth.currentUser?.uid),
      where("time", ">=", dateBegin),
      where("time", "<=", dateEnd),
      orderBy("time", "desc")
    );
  } else if (dateEnd) {
    q = query(
      collection(db, "records"),
      where("userId", "==", auth.currentUser?.uid),
      where("time", "<=", dateEnd),
      orderBy("time", "desc")
    );
  } else if (dateBegin) {
    q = query(
      collection(db, "records"),
      where("userId", "==", auth.currentUser?.uid),
      where("time", ">=", dateBegin),
      orderBy("time", "desc")
    );
  } else {
    q = query(
      collection(db, "records"),
      where("userId", "==", auth.currentUser?.uid),
      orderBy("time", "desc")
    );
  }

  const querySnapshot = await getDocs(q);

  const res: IRecord[] = [];

  querySnapshot.forEach((doc) => {
    res.push(doc.data() as IRecord);
  });
  return res;
};

export const deleteRegister = async (id: string) => {
  return await deleteDoc(doc(db, "records", id));
};

export const editRegister = async (id: string, dados: Partial<IRecord>) => {
  const ref = doc(db, "records", id);

  return await updateDoc(ref, { ...dados });
};

export const getHistory = async (
  date: {
    month: number;
    year: number;
  },
  mode: "year" | "month" | "week"
) => {
  console.log(mode);
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
    where("time", ">=", moment(date).startOf("month").toDate()),
    where("time", "<=", moment(date).endOf("month").toDate())
  );
  const querySnapshot = await getDocs(query_);

  const res: IRecord[][] = Array(moment(date).daysInMonth()).fill([]);

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as IRecord;
    const day =
      docData.time instanceof Timestamp
        ? docData.time.toDate().getDate() - 1
        : docData.time.getDate() - 1;
    res[day] = [...res[day], docData];
  });

  return res;
};

const getYearHistory = async () => {
  const coll = collection(db, "records");

  const query_ = query(
    coll,
    where("userId", "==", auth.currentUser?.uid),
    where("time", ">=", moment().subtract(12, "months").toDate()),
    where("time", "<=", moment().toDate())
  );

  const res: IRecord[][] = Array(12).fill([]);

  const querySnapshot = await getDocs(query_);

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as IRecord;
    const month =
      docData.time instanceof Timestamp
        ? docData.time.toDate().getMonth()
        : docData.time.getMonth();
    res[month] = [...res[month], docData];
  });

  return res;
};

const getWeekHistory = async () => {
  const coll = collection(db, "records");

  const query_ = query(
    coll,
    where("userId", "==", auth.currentUser?.uid),
    where("time", ">=", moment().isoWeekday(1).toDate()),
    where("time", "<=", moment().isoWeekday(7).toDate())
  );

  const res: IRecord[][] = Array(7).fill([]);

  const querySnapshot = await getDocs(query_);

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as IRecord;
    const day =
      docData.time instanceof Timestamp
        ? docData.time.toDate().getDay() > 0
          ? docData.time.toDate().getDay() - 1
          : 6
        : docData.time.getDay() > 0
        ? docData.time.getDay() - 1
        : 6;
    res[day] = [...res[day], docData];
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
