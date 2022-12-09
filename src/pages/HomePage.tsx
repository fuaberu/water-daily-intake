import { collection, doc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsDropletFill, BsDroplet, BsCup, BsCupFill } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import { Dropdown } from "../components";
import { RecordModal } from "../components/home";
import { CupModal, ICup } from "../components/home/CupModal";
import { auth, db } from "../config/firebase";
import {
  addRegister,
  deleteRegister,
  editRegister,
  getRegisters,
} from "../library/firebase/firestoreModel";

export interface IRecord {
  id: string;
  time: Date;
  quantity: number;
  userId?: string;
}

export const HomePage = () => {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const recordsQuantity = records.reduce((acc, obj) => {
    return acc + obj.quantity;
  }, 0);

  const [quantity, setQuantity] = useState(300);

  const [cupModalOpen, setCupModalOpen] = useState(false);
  const setCup = (cup: ICup) => {};

  const total = 2860;
  const unit = "ml";

  const addRecord = async () => {
    const ref = doc(collection(db, "records"));
    const newRegister = {
      time: new Date(),
      quantity,
      userId: auth.currentUser?.uid,
      id: ref.id,
    };
    setRecords((prev) => [newRegister, ...prev]);
    await addRegister(newRegister, ref);
  };
  const deleteRecord = async (id: string) => {
    if (!id) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
    await deleteRegister(id);
  };

  const [recordModal, setRecordModal] = useState<IRecord | null>(null);
  const updateRecordQuantity = async (record: IRecord) => {
    setRecords((rc) => rc.map((r) => (r.id === record.id ? record : r)));
    setRecordModal(null);
    await editRegister(record.id, { quantity: record.quantity });
  };

  useEffect(() => {
    (async () => {
      setLoadingRecords(true);
      const fireRegisters = await getRegisters({
        dateBegin: ((d) => new Date(d.setDate(d.getDate() - 1)))(new Date()),
      });
      if (fireRegisters) {
        setRecords(
          fireRegisters.map((r) => ({
            ...r,
            time: new Date(
              r.time instanceof Timestamp ? r.time.toDate() : r.time
            ),
          }))
        );
      }
      setLoadingRecords(false);
    })();
  }, []);

  return (
    <div>
      <section className="flex justify-center pt-5 mb-5 relative w-80 h-72 m-auto z-30">
        <div className="relative overflow-hidden w-72 h-36 -mb-6">
          <div
            className="absolute top-0 left-0 w-72 h-72 rounded-full border- border-gray-200 border-b-teal-400 border-r-teal-400"
            style={{
              transform:
                "rotate(" +
                (45 +
                  (recordsQuantity / total > 1 ? 1 : recordsQuantity / total) *
                    100 *
                    1.8) +
                "deg)",
              borderWidth: 5,
            }}
          ></div>
        </div>
        <BsDroplet size={24} className="absolute left-2 top-44" />
        <BsDropletFill
          size={24}
          className="absolute right-1 top-44 text-sky-400"
        />
        <button
          className="absolute right-1 bottom-0 rounded-full shadow-custom bg-white"
          onClick={() => setCupModalOpen((op) => !op)}
        >
          <div className="p-2 rounded-full">
            <BsCup size={35} className="text-black " />
          </div>
          <div className="p-1 rounded-full absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
            <GrUpdate size={10} />
          </div>
        </button>
        <div className="absolute rounded-full w-60 h-60 top-11 left-1/2 -translate-x-1/2 shadow-custom overflow-hidden">
          {!loadingRecords ? (
            <p className="absolute left-1/2 bottom-1/2 -translate-x-1/2 text-3xl">
              <span className="text-sky-500 font-semibold">
                {recordsQuantity}
              </span>
              /<span className="font-bold">{total}</span>
              <span className="text-sm">ml</span>
            </p>
          ) : (
            <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 text-3xl flex items-center animate-pulse">
              <div className="w-16 mx-1 bg-gray-300 h-7 rounded-full "></div>/
              <div className="w-16 mx-1 bg-gray-300 h-7 rounded-full "></div>
            </div>
          )}
          <p className="absolute left-1/2 bottom-24 -translate-x-1/2 text-sm font-semibold">
            Daily Drink Target
          </p>
          <div
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgb(14 165 233)'/%3E%3C/svg%3E")`,
              animationDelay: "-3s",
            }}
            className="w-[200%] h-14 absolute bottom-9 left-[100%] opacity-95 border-none animate-wave-moving1"
          />
          <div
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgb(14 165 233)'/%3E%3C/svg%3E")`,
            }}
            className="w-[200%] h-14 absolute bottom-9 left-[100%] opacity-60 border-none animate-wave-moving2"
          />
          <div
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgb(14 165 233)'/%3E%3C/svg%3E")`,
              animationDelay: "-1s",
            }}
            className="w-[200%] h-14 absolute bottom-9 left-[100%] opacity-60 border-none animate-wave-moving z-80"
          />
          <div className="rounded-full absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex items-end z-10">
            <button
              className="w-full h-[30%] bg-sky-500 hover:bg-sky-400 active:bg-sky-300 flex justify-center items-center flex-col clip"
              style={{
                borderTopLeftRadius: "250px 80px",
                borderTopRightRadius: "250px 80px",
              }}
              onClick={addRecord}
            >
              <p className="font-semibold text-white text-sm">300 ml</p>
              <BsCup size={35} className="text-white" />
            </button>
          </div>
        </div>
      </section>
      <section className="my-5">
        {!loadingRecords ? (
          <div className="rounded-lg shadow-xl p-6 w-10/12 max-w-lg mx-auto">
            {records.map((r, i) => {
              return (
                <div key={i} className="flex items-center justify-between my-3">
                  <BsCupFill className="text-sky-400" />{" "}
                  <p>
                    {r.time instanceof Timestamp
                      ? new Date(r.time.toDate()).toLocaleDateString()
                      : r.time.toLocaleTimeString()}
                  </p>
                  <p>{r.quantity + " " + unit}</p>
                  <Dropdown
                    items={[
                      { text: "Delete", fun: () => deleteRecord(r.id) },
                      { text: "Edit", fun: () => setRecordModal(r) },
                    ]}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg shadow-xl p-6 w-10/12  max-w-lg mx-auto">
            <div className="flex animate-pulse flex-row items-center space-x-5 my-3">
              <div className="w-12 bg-gray-300 h-5 rounded-full "></div>
              <div className="w-36 bg-gray-300 h-5 rounded-md "></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md "></div>
            </div>
            <div
              className="flex animate-pulse flex-row items-center space-x-5 my-3"
              style={{ animationDelay: ".3s" }}
            >
              <div className="w-12 bg-gray-300 h-5 rounded-full "></div>
              <div className="w-36 bg-gray-300 h-5 rounded-md "></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md "></div>
            </div>
            <div
              className="flex animate-pulse flex-row items-center space-x-5 my-3"
              style={{ animationDelay: ".15s" }}
            >
              <div className="w-12 bg-gray-300 h-5 rounded-full "></div>
              <div className="w-36 bg-gray-300 h-5 rounded-md "></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md "></div>
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      <CupModal setOpen={setCupModalOpen} open={cupModalOpen} setCup={setCup} />
      {recordModal && (
        <RecordModal
          setOpen={() => setRecordModal(null)}
          open={!!recordModal}
          setRecord={updateRecordQuantity}
          record={recordModal}
        />
      )}
    </div>
  );
};
