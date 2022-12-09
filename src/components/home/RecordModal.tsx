import { Transition, Dialog } from "@headlessui/react";
import { useRef, Fragment, useState, useEffect } from "react";
import { decimalToFraction } from "../../library/helpers";
import { IRecord } from "../../pages";
import { Cup } from "./cup/Cup";

interface IModal {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  setRecord: (arg0: IRecord) => void;
  record: IRecord;
}

export const RecordModal = ({ open, setOpen, setRecord, record }: IModal) => {
  const cancelButtonRef = useRef(null);
  const [newIntake, setNewIntake] = useState(record.quantity);

  const updateRecord = () => {
    setOpen(false);
    setRecord({
      ...record,
      quantity: Math.round((newIntake + Number.EPSILON) * 100) / 100,
    });
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="text-center mt-0 mb-3">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Edit Record
                      </Dialog.Title>
                    </div>
                    <p>
                      <span className="font-semibold">Intake at </span>{" "}
                      {record.time.toLocaleTimeString()}
                    </p>
                    <div className="my-10">
                      <Cup value={newIntake / record.cup.maxAmount} />
                    </div>
                    <div className="flex justify-between my-4">
                      {[0.25, 0.5, 0.75, 1].map((p) => (
                        <button
                          key={p}
                          className="p-1"
                          onClick={() => setNewIntake(record.cup.maxAmount * p)}
                        >
                          <div
                            className={`rounded-full border-2 p-2 hover:border-sky-600 ${
                              record.cup.maxAmount * p === newIntake
                                ? "bg-sky-300"
                                : "border-slate-400"
                            }`}
                          >
                            {decimalToFraction(p)}
                          </div>
                          <p className="text-xs text-slate-400">
                            {Math.round(
                              (record.cup.maxAmount * p + Number.EPSILON) * 100
                            ) / 100}{" "}
                            ml
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={updateRecord}
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
