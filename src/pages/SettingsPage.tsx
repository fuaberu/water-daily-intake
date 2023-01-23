import { signOut } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ActiveModal,
  AgeModal,
  CustomCupModal,
  GenderModal,
  HeightModal,
  IntakeGoalsModal,
  WeightModal,
} from "../components/settings";
import { auth } from "../config/firebase";
import { initialSettings, useSession } from "../context/sessionContext";
import {
  resetUserData,
  updateSettings,
} from "../library/firebase/firestoreModel";
import { convertActiveNames } from "../library/helpers";
import { ICup } from "./HomePage";

export type IExercise =
  | "lightly-active"
  | "moderately-active"
  | "very-active"
  | "no-active";

export interface IUnit {
  volume: IVolumeUnit;
  weight: IWeightUnit;
  lenght: ILengthUnit;
}

export type IVolumeUnit = "ml" | "oz";
export type IWeightUnit = "kg" | "lbs";
export type ILengthUnit = "cm" | "in";

export interface ISettings {
  unit: IUnit;
  intake: number;
  weight: number;
  height: number;
  gender: "male" | "female";
  birthDay: Date | Timestamp;
  exercise: IExercise;
  cup: number;
  audioToggle: boolean;
  cups: ICup[];
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

  //  personal Info
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [customCupOpen, setCustomCupOpen] = useState(false);
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [heightModalOpen, setHeightModalOpen] = useState(false);
  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const [activeModalOpen, setActiveModalOpen] = useState(false);
  return (
    <div className="max-w-2xl mx-auto pb-6">
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">
            General
          </h3>
        </div>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <div className="flex justify-between">
            <p>Unit</p>
            <span className="underline underline-offset-1 decoration-sky-500">
              Coming soon
            </span>
            <p className="text-sky-600 font-semibold">{`${settings.unit.weight}, ${settings.unit.volume}, ${settings.unit.lenght}`}</p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setIntakeModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Intake Goal</p>
            <p className="text-sky-600 font-semibold">{`${settings.intake} ${settings.unit.volume}`}</p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setCustomCupOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Custom Cup</p>
            <p className="text-sky-600 font-semibold">{`${settings.cups[8].maxAmount} ${settings.unit.volume}`}</p>
          </div>
        </button>
      </section>
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">
            Personal Information
          </h3>
        </div>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setAgeModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Birthday</p>
            <p className="text-sky-600 font-semibold">
              {settings.birthDay
                ? moment(
                    settings.birthDay instanceof Timestamp
                      ? settings.birthDay.toDate()
                      : settings.birthDay
                  ).format("DD/MM/YYYY")
                : "Uninformed"}
            </p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setGenderModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Gender</p>
            <p className="text-sky-600 font-semibold">
              {settings.gender ? settings.gender : "Uninformed"}
            </p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setWeightModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Weight</p>
            <p className="text-sky-600 font-semibold">{`${settings.weight} ${settings.unit.weight}`}</p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setHeightModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Height</p>
            <p className="text-sky-600 font-semibold">{`${settings.height} ${settings.unit.lenght}`}</p>
          </div>
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3"
          onClick={() => setActiveModalOpen((o) => !o)}
        >
          <div className="flex justify-between">
            <p>Exercise Level</p>
            <p className="text-sky-600 font-semibold">
              {convertActiveNames(settings.exercise)}
            </p>
          </div>
        </button>
      </section>
      <section>
        <div className="p-3">
          <h3 className="text-slate-500 border-b-2 border-slate-300">Other</h3>
        </div>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3 text-left flex justify-between items-center"
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
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3 text-left"
          onClick={resetData}
        >
          Reset data
        </button>
        <button
          className="w-full hover:bg-slate-300 rounded-md active:bg-slate-200 p-3 text-left"
          onClick={logout}
        >
          Log Out
        </button>
      </section>
      <IntakeGoalsModal open={intakeModalOpen} setOpen={setIntakeModalOpen} />
      <CustomCupModal open={customCupOpen} setOpen={setCustomCupOpen} />
      <WeightModal open={weightModalOpen} setOpen={setWeightModalOpen} />
      <HeightModal open={heightModalOpen} setOpen={setHeightModalOpen} />
      <AgeModal open={ageModalOpen} setOpen={setAgeModalOpen} />
      <GenderModal open={genderModalOpen} setOpen={setGenderModalOpen} />
      <ActiveModal open={activeModalOpen} setOpen={setActiveModalOpen} />
    </div>
  );
};
