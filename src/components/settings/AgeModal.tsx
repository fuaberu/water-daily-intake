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

export const AgeModal = ({ open, setOpen }: IModal) => {
  const { settings, setSession } = useSession();

  const [newAge, setNewAge] = useState(
    settings.birthDay instanceof Timestamp
      ? settings.birthDay.toDate()
      : settings.birthDay
  );

  const setAge = async () => {
    setSession((s) => ({
      ...s,
      settings: { ...s.settings, birthDay: newAge },
    }));
    await updateSettings({ birthDay: newAge });
  };

  return (
    <BaseModal open={open} setOpen={setOpen} action={setAge}>
      <h3 className="font-semibold">Adjust BirthDay</h3>
      <div className="w-full flex flex-col justify-center items-center py-4">
        <input
          type="date"
          className="bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default text-gray-700 p-2 rounded-md"
          value={moment(newAge).format("YYYY-MM-DD")}
          onChange={(e) => setNewAge(new Date(e.target.value))}
        ></input>
      </div>
    </BaseModal>
  );
};
