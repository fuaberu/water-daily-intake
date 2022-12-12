import { useState } from "react";
import { useSession } from "../../context/sessionContext";
import { BaseModal } from "../BaseModal";
import { updateSettings } from "../../library/firebase/firestoreModel";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { Listbox } from "@headlessui/react";
import { MdCheck } from "react-icons/md";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const genders: ("male" | "female")[] = ["female", "male"];

export const GenderModal = ({ open, setOpen }: IModal) => {
  const { settings, setSession } = useSession();

  const [newGender, setNewGender] = useState(settings.gender);

  const setGender = async () => {
    setSession((s) => ({
      ...s,
      settings: { ...s.settings, gender: newGender },
    }));
    await updateSettings({ gender: newGender });
  };

  return (
    <BaseModal open={open} setOpen={setOpen} action={setGender}>
      <h3 className="font-semibold">Adjust Gender</h3>
      <div className="w-full flex flex-col justify-center items-center py-4">
        <Listbox value={newGender} onChange={setNewGender}>
          <Listbox.Button className="bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default text-gray-700 py-2 w-8/12 rounded-md uppercase">
            {newGender}
          </Listbox.Button>
          <Listbox.Options className="w-8/12 rounded-md overflow-hidden mt-1 bg-slate-100">
            {genders.map((gender) => (
              <Listbox.Option
                className="p-1 w-full"
                key={gender}
                value={gender}
              >
                {({ active, selected }) => (
                  <span
                    className={`${
                      active ? "bg-slate-300 font-bold" : ""
                    } flex items-center gap-2 p-2 w-full rounded-md uppercase`}
                  >
                    {selected && <MdCheck />}
                    {gender}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </BaseModal>
  );
};
