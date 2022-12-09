import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOM,
  projectId: import.meta.env.VITE_FIREBASE_PRJ_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STG_BKT,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
//type the auth and firestore functions
const auth = getAuth();

const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  console.log(err);
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});

export { auth, db };
