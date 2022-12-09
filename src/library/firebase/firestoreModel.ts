import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
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
