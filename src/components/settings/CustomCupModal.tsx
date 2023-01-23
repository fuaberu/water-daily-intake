import { useState } from "react";
import { useSession } from "../../context/sessionContext";
import { BaseModal } from "../BaseModal";
import { updateSettings } from "../../library/firebase/firestoreModel";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export const CustomCupModal = ({ open, setOpen }: IModal) => {
  const { settings, setSession } = useSession();

  const [customCup, setCustomCup] = useState(settings.cups[8].maxAmount);

  const setCup = async () => {
    setSession((s) => ({
      ...s,
      settings: {
        ...s.settings,
        cups: s.settings.cups.map((c, i) =>
          i === 8 ? { ...c, maxAmount: customCup } : c
        ),
      },
    }));
    await updateSettings({
      cups: settings.cups.map((c, i) =>
        i === 8 ? { ...c, maxAmount: customCup } : c
      ),
    });
  };

  return (
    <BaseModal open={open} setOpen={setOpen} action={setCup}>
      <h3 className="font-semibold">Custom Cup</h3>
      <div className="w-full flex flex-col justify-center items-center py-4">
        <p className="text-3xl">
          {customCup}
          <span className="text-sm text-slate-500">{settings.unit.volume}</span>
        </p>
        <input
          type="range"
          value={customCup}
          onChange={(v) => setCustomCup(Number(v.target.value))}
          min="0"
          max="10000"
          step="50"
          className="w-full"
        />
      </div>
    </BaseModal>
  );
};
