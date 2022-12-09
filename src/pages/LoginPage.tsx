import { FirebaseError } from "firebase/app";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Spinner } from "../components";
import { createUserInitialSettings } from "../library/firebase/firestoreModel";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res) {
        if (getAdditionalUserInfo(res)?.isNewUser) {
          await createUserInitialSettings();
        }
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        alert(err.message);
      } else {
        console.log(err);
      }
    }
    setLoading(false);
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
        onClick={signInWithGoogle}
      >
        {loading ? <Spinner /> : <FcGoogle size={24} className="mr-3" />}
        Login With Google
      </button>
    </div>
  );
};
