import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth);
    navigate("/");
  };
  return (
    <div className="max-w-2xl mx-auto">
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">
            Reminder Settings
          </h3>
        </div>
        <Link
          className="block w-full hover:bg-slate-300 active:bg-slate-200 p-3 text-left"
          to="/schedule"
        >
          Reminder Schedule
        </Link>
      </section>
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">
            General
          </h3>
        </div>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Unit</p>
            <p className="text-sky-600 font-semibold">kg, ml</p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Intake Goal</p>
            <p className="text-sky-600 font-semibold">2840 ml</p>
          </div>
        </button>
      </section>
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">
            Personal Information
          </h3>
        </div>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Gender</p>
            <p className="text-sky-600 font-semibold">Male</p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Weight</p>
            <p className="text-sky-600 font-semibold">91 kg</p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Wake-up time</p>
            <p className="text-sky-600 font-semibold">07:00</p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Bedtime</p>
            <p className="text-sky-600 font-semibold">23:00</p>
          </div>
        </button>
      </section>
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">Other</h3>
        </div>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3 text-left">
          Reset data
        </button>
        <button
          className="w-full hover:bg-slate-300 active:bg-slate-200 p-3 text-left"
          onClick={logout}
        >
          Log Out
        </button>
      </section>
    </div>
  );
};
