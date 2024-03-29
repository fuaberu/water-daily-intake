import { Transition, Dialog, RadioGroup } from "@headlessui/react";
import { useRef, Fragment } from "react";
import { BsFillCupFill } from "react-icons/bs";
import { useSession } from "../../context/sessionContext";
import { updateSettings } from "../../library/firebase/firestoreModel";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export const CupModal = ({ open, setOpen }: IModal) => {
  const cancelButtonRef = useRef(null);
  const { settings, setSession } = useSession();

  const setCup = async (id: number) => {
    setSession((prev) => ({
      ...prev,
      settings: { ...prev.settings, cup: id },
    }));

    await updateSettings({ cup: id });
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Switch Cup
                      </Dialog.Title>
                      <RadioGroup
                        value={settings.cup}
                        onChange={setCup}
                        className="mt-2 grid grid-cols-3 gap-4 w-full"
                      >
                        {settings.cups.map((c) => (
                          <RadioGroup.Option
                            value={c.id}
                            key={c.name}
                            className="cursor-pointer"
                          >
                            {({ checked }) => (
                              <>
                                <span
                                  className={`flex flex-col items-center justify-center rounded-md py-3 hover:bg-slate-300 h-full ${
                                    checked ? "bg-blue-200" : ""
                                  }`}
                                >
                                  <BsFillCupFill
                                    size={
                                      20 + (c.maxAmount / 20) * 0.7 > 50
                                        ? 50
                                        : 20 + (c.maxAmount / 20) * 0.7
                                    }
                                    className="fill-sky-400"
                                  />
                                  {`${c.maxAmount} ${settings.unit.volume}`}
                                </span>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Ok
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
