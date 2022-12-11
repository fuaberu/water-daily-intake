import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "../components";
import { IntakeGoalsModal } from "../components/settings";
import { auth } from "../config/firebase";
import { initialSettings, useSession } from "../context/sessionContext";
import {
  resetUserData,
  updateSettings,
} from "../library/firebase/firestoreModel";
import { ICup } from "./HomePage";
import { ITimer } from "./SchedulePage";

export interface ISettings {
  unit: { volume: "ml" | "oz"; weight: "kg" | "lbs" };
  intake: number;
  weight: number;
  gender: "male" | "female" | null;
  wakeUpTime: { hour: number; minutes: number };
  bedTime: { hour: number; minutes: number };
  timers: ITimer[];
  cup: ICup;
  audioToggle: boolean;
}

export const SettingsPage = () => {
  const { setSession, settings } = useSession();
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth);
    navigate("/");
  };

  const resetData = async () => {
    await resetUserData();
    setSession((prev) => ({ ...prev, settings: initialSettings }));
  };

  const toggleAudio = async () => {
    setSession((prev) => ({
      ...prev,
      settings: { ...prev.settings, audioToggle: !prev.settings.audioToggle },
    }));
    await updateSettings({ audioToggle: !settings.audioToggle });
  };

  //  Intake
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  return (
    <div className="max-w-2xl mx-auto pb-6">
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
            <p className="text-sky-600 font-semibold">{`${settings.unit.weight}, ${settings.unit.volume}`}</p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 active:bg-slate-200 p-3"
          onClick={() => setIntakeModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Intake Goal</p>
            <p className="text-sky-600 font-semibold">{`${settings.intake} ${settings.unit.volume}`}</p>
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
            <p className="text-sky-600 font-semibold">
              {settings.gender ? settings.gender : "Uninformed"}
            </p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Weight</p>
            <p className="text-sky-600 font-semibold">{`${settings.weight} ${settings.unit.weight}`}</p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Wake-up time</p>
            <p className="text-sky-600 font-semibold">
              {settings.wakeUpTime.hour
                ? `${settings.wakeUpTime.hour}:${settings.wakeUpTime.minutes}`
                : "-- : --"}
            </p>
          </div>
        </button>
        <button className="w-full hover:bg-slate-300 active:bg-slate-200 p-3">
          <div className="flex justify-between">
            <p>Bedtime</p>
            <p className="text-sky-600 font-semibold">
              {settings.bedTime.hour
                ? `${settings.bedTime.hour} : ${settings.bedTime.minutes}`
                : "-- : --"}
            </p>
          </div>
        </button>
      </section>
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">Other</h3>
        </div>
        <button
          className="w-full hover:bg-slate-300 active:bg-slate-200 p-3 text-left flex justify-between items-center"
          onClick={toggleAudio}
        >
          Audio
          <div
            className={`${
              settings.audioToggle ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable audio</span>
            <span
              className={`${
                settings.audioToggle ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 active:bg-slate-200 p-3 text-left"
          onClick={resetData}
        >
          Reset data
        </button>
        <button
          className="w-full hover:bg-slate-300 active:bg-slate-200 p-3 text-left"
          onClick={logout}
        >
          Log Out
        </button>
      </section>
      <IntakeGoalsModal open={intakeModalOpen} setOpen={setIntakeModalOpen} />
    </div>
  );
};
