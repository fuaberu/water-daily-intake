import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
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
        {loading ? (
          <div>
            <div className="border-t-transparent border-solid animate-spin rounded-full border-slate-500 border-4 h-6 w-6 mr-3"></div>
          </div>
        ) : (
          <FcGoogle size={24} className="mr-3" />
        )}
        Login With Google
      </button>
    </div>
  );
};
