import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { IRecord } from "../../pages";

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
