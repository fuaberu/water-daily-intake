import { useState } from "react";
import { useSession } from "../../context/sessionContext";
import { BaseModal } from "../BaseModal";
import { updateSettings } from "../../library/firebase/firestoreModel";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export const HeightModal = ({ open, setOpen }: IModal) => {
  const { settings, setSession } = useSession();

  const [newHeight, setNewHeight] = useState(settings.height);

  const setheight = async () => {
    setSession((s) => ({
      ...s,
      settings: { ...s.settings, height: newHeight },
    }));
    await updateSettings({ height: newHeight });
  };

  return (
    <BaseModal open={open} setOpen={setOpen} action={setheight}>
      <h3 className="font-semibold">Adjust height</h3>
      <div className="w-full flex flex-col justify-center items-center py-4">
        <div className="flex flex-row rounded-lg relative bg-transparent mt-1">
          <button
            data-action="decrement"
            className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 px-4 rounded-l cursor-pointer outline-none"
            onClick={() => setNewHeight((prev) => prev - 1)}
          >
            <span className="text-2xl font-thin">−</span>
          </button>
          <div className="relative flex items-center">
            <input
              type="number"
              className="outline-none text-right w-20 py-2 bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default text-gray-700 pr-6"
              value={newHeight}
              onChange={(e) => setNewHeight(Number(e.target.value))}
            ></input>
            <span className="absolute right-0">{settings.unit.lenght}</span>
          </div>
          <button
            data-action="increment"
            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 px-4 rounded-r cursor-pointer"
            onClick={() => setNewHeight((prev) => prev + 1)}
          >
            <span className="text-2xl font-thin">+</span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
