import { useState } from "react";
import { useSession } from "../../context/sessionContext";
import { BaseModal } from "../BaseModal";
import { updateSettings } from "../../library/firebase/firestoreModel";
import { Listbox } from "@headlessui/react";
import { MdCheck } from "react-icons/md";
import { IExercise } from "../../pages";
import { convertActiveNames } from "../../library/helpers";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const exercises: IExercise[] = [
  "no-active",
  "lightly-active",
  "moderately-active",
  "very-active",
];

export const ActiveModal = ({ open, setOpen }: IModal) => {
  const { settings, setSession } = useSession();

  const [newActive, setNewActive] = useState(settings.exercise);

  const setExercise = async () => {
    setSession((s) => ({
      ...s,
      settings: { ...s.settings, exercise: newActive },
    }));
    await updateSettings({ exercise: newActive });
  };

  return (
    <BaseModal open={open} setOpen={setOpen} action={setExercise}>
      <h3 className="font-semibold">Adjust exercise</h3>
      <div className="w-full flex flex-col justify-center items-center py-4">
        <Listbox value={newActive} onChange={setNewActive}>
          <Listbox.Button className="bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default text-gray-700 py-2 w-8/12 rounded-md uppercase">
            {convertActiveNames(newActive)}
          </Listbox.Button>
          <Listbox.Options className="w-8/12 rounded-md overflow-hidden cursor-pointer mt-1 bg-slate-100">
            {exercises.map((exercise) => (
              <Listbox.Option
                className="p-1 w-full"
                key={exercise}
                value={exercise}
              >
                {({ active, selected }) => (
                  <span
                    className={`${
                      active ? "bg-slate-300 font-bold" : ""
                    } flex items-center gap-2 p-2 w-full rounded-md uppercase`}
                  >
                    {selected && <MdCheck />}
                    {convertActiveNames(exercise)}
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
