import { useState } from "react";
import { useSession } from "../../context/sessionContext";
import { BaseModal } from "../BaseModal";
import { GrUpdate } from "react-icons/gr";
import { updateSettings } from "../../library/firebase/firestoreModel";
import { calculateWater } from "../../library/calculateWaterIntake";
import moment from "moment";
import { Timestamp } from "firebase/firestore";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export const IntakeGoalsModal = ({ open, setOpen }: IModal) => {
  const { settings, setSession } = useSession();

  const [newIntake, setNewIntake] = useState(settings.intake);

  const setIntake = async () => {
    setSession((s) => ({
      ...s,
      settings: { ...s.settings, intake: newIntake },
    }));
    await updateSettings({ intake: newIntake });
  };

  const calculateAuto = () => {
    const result = calculateWater({
      active: settings.exercise,
      age: moment().diff(
        settings.birthDay instanceof Timestamp
          ? settings.birthDay.toDate()
          : settings.birthDay,
        "years"
      ),
      gender: settings.gender,
      height: settings.height,
      weight: settings.weight,
      unit: settings.unit,
    });
    setNewIntake(Math.round((result + Number.EPSILON) * 100) / 100);
  };

  return (
    <BaseModal open={open} setOpen={setOpen} action={setIntake}>
      <h3 className="font-semibold">Adjust intake goal</h3>
      <div className="flex justify-center items-center gap-4 mt-8">
        <p className="text-3xl">
          {newIntake}
          <span className="text-sm text-slate-500">{settings.unit.volume}</span>
        </p>
        <button onClick={() => setNewIntake(settings.intake)}>
          <GrUpdate size={20} />
        </button>
      </div>
      <div className="w-full p-8">
        <input
          type="range"
          value={newIntake}
          onChange={(v) => setNewIntake(Number(v.target.value))}
          min="0"
          max="10000"
          step="50"
          className="w-full"
        />
      </div>
      <div className="w-full flex justify-center">
        <button
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-300 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={calculateAuto}
        >
          Automatic
        </button>
      </div>
    </BaseModal>
  );
};
