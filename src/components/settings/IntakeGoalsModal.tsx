import { useState } from "react";
import { useSession } from "../../context/sessionContext";
import { BaseModal } from "../BaseModal";
import { GrUpdate } from "react-icons/gr";
import { updateSettings } from "../../library/firebase/firestoreModel";

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
    </BaseModal>
  );
};
