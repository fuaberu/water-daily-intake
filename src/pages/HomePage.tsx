import { Timestamp } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { BsDropletFill, BsDroplet, BsCup, BsCupFill } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import { Dropdown } from "../components";
import { RecordModal } from "../components/home";
import { CupModal } from "../components/home/CupModal";
import { auth, db } from "../config/firebase";
import { useSession } from "../context/sessionContext";
import {
  addRegister,
  deleteRegister,
  editRegister,
  getRegisters,
} from "../library/firebase/firestoreModel";
import "./home.css";
import moment from "moment";
import { IUnit, IVolumeUnit } from "./SettingsPage";

export interface IRecord {
  id: string;
  date: Date | Timestamp;
  cups: ICupRecord[];
  userId?: string;
  intake: { amount: number; unit: IVolumeUnit };
}

export interface ICupRecord {
  id: number;
  amount: number;
  time: Date | Timestamp;
  cup: number;
}

export interface ICup {
  id: number;
  name: string;
  maxAmount: number;
}

const audio = new Audio("/pouring-water-into-a-glass.mp3");

export const HomePage = () => {
  const { settings } = useSession();

  const [record, setRecord] = useState<IRecord>({
    id: `${auth.currentUser?.uid}-${moment().format("yyyyMMD")}`,
    cups: [],
    date: new Date(),
    userId: auth.currentUser?.uid,
    intake: { amount: settings.intake, unit: settings.unit.volume },
  });
  const [loadingRecords, setLoadingRecords] = useState(true);

  const recordsQuantity = useMemo(
    () =>
      record?.cups.reduce((acc, obj) => {
        return acc + obj.amount;
      }, 0) || 0,
    [record]
  );

  const [cupModalOpen, setCupModalOpen] = useState(false);
  const [fireworks, setFireworks] = useState(false);

  const addRecord = async () => {
    if (settings.audioToggle) {
      audio.play();
    }

    const newRegister: ICupRecord = {
      time: new Date(),
      amount: settings.cups[settings.cup].maxAmount,
      id: new Date().getTime(),
      cup: settings.cup,
    };

    if (
      recordsQuantity + newRegister.amount / settings.intake >= 1 &&
      recordsQuantity < settings.intake
    ) {
      setFireworks(true);
    }
    setRecord((prev) => ({ ...prev, cups: [...prev.cups, newRegister] }));
    await addRegister(newRegister, record.id);
  };

  const deleteRecord = async (cupRec: ICupRecord) => {
    if (!cupRec) return;
    setRecord((prev) => ({
      ...prev,
      cups: prev.cups.filter((r) => r.id !== cupRec.id),
    }));
    await deleteRegister(record.id, cupRec);
  };

  const [recordModal, setRecordModal] = useState<ICupRecord | null>(null);

  const updateRecordQuantity = async (
    recordCup: ICupRecord,
    prev: ICupRecord
  ) => {
    setRecord((prev) => ({
      ...prev,
      cups: prev.cups.map((r) => (r.id === recordCup.id ? recordCup : r)),
    }));
    setRecordModal(null);
    await editRegister(record.id, prev, recordCup);
  };

  useEffect(() => {
    (async () => {
      setLoadingRecords(true);
      let fireRegisters = await getRegisters(
        `${auth.currentUser?.uid}-${moment().format("yyyyMMD")}`,
        record
      );
      if (fireRegisters) {
        fireRegisters.cups = fireRegisters.cups.map((r) => ({
          ...r,
          time: new Date(
            r.time instanceof Timestamp ? r.time.toDate() : r.time
          ),
        }));
        setRecord(fireRegisters);
      }
      setLoadingRecords(false);
    })();
  }, []);

  return (
    <>
      <section className="flex justify-center pt-5 mb-5 relative w-80 h-72 m-auto z-30">
        <div className="relative overflow-hidden w-72 h-36 -mb-6">
          <div
            className="absolute top-0 left-0 w-72 h-72 rounded-full border- border-gray-200 border-b-teal-400 border-r-teal-400"
            style={{
              transform:
                "rotate(" +
                (45 +
                  (recordsQuantity / settings.intake >= 1
                    ? 1
                    : settings.intake > 0
                    ? recordsQuantity / settings.intake
                    : 0) *
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
          name="Change Cup"
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
              /<span className="font-bold">{settings.intake}</span>
              <span className="text-sm">{settings.unit.volume}</span>
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
              animationDelay: "-7s",
            }}
            className="w-[200%] h-14 absolute bottom-9 left-[100%] opacity-80 border-none animate-wave-moving2"
          />
          <div
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgb(14 165 233)'/%3E%3C/svg%3E")`,
            }}
            className="w-[200%] h-14 absolute bottom-9 left-[100%] opacity-60 border-none animate-wave-moving3"
          />
          <div
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgb(14 165 233)'/%3E%3C/svg%3E")`,
              animationDelay: "-3s",
            }}
            className="w-[200%] h-14 absolute bottom-9 left-[100%] opacity-60 border-none animate-wave-moving4 z-80"
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
              <p className="font-semibold text-white text-sm">
                {`${settings.cups[settings.cup].maxAmount} ${
                  settings.unit.volume
                }`}
              </p>
              <BsCup size={35} className="text-white" />
            </button>
          </div>
        </div>
      </section>
      <section className="my-5">
        {!loadingRecords && record ? (
          record.cups.length > 0 ? (
            <div className="rounded-lg shadow-xl p-6 w-10/12 max-w-lg mx-auto">
              {record.cups.map((r, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between my-3"
                  >
                    <BsCupFill className="text-sky-400 w-1/12 text-left" />{" "}
                    <p className="w-5/12 text-center">
                      {r.time instanceof Timestamp
                        ? new Date(r.time.toDate()).toLocaleDateString()
                        : r.time.toLocaleTimeString()}
                    </p>
                    <p className="w-5/12 text-center">
                      {r.amount + " " + settings.unit.volume}
                    </p>
                    <Dropdown
                      items={[
                        { text: "Delete", fun: () => deleteRecord(r) },
                        { text: "Edit", fun: () => setRecordModal(r) },
                      ]}
                      className="w-1/12 text-right"
                    />
                  </div>
                );
              })}
            </div>
          ) : null
        ) : (
          <div className="rounded-lg shadow-xl p-6 w-10/12  max-w-lg mx-auto">
            <div className="flex animate-pulse flex-row justify-between items-center space-x-5 my-3">
              <div className="w-8 bg-gray-300 h-5 rounded-full"></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md"></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md"></div>
              <div className="w-4 bg-gray-300 h-5 rounded-md"></div>
            </div>
            <div
              className="flex animate-pulse flex-row justify-between items-center space-x-5 my-3"
              style={{ animationDelay: ".3s" }}
            >
              <div className="w-8 bg-gray-300 h-5 rounded-full"></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md"></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md"></div>
              <div className="w-4 bg-gray-300 h-5 rounded-md"></div>
            </div>
            <div
              className="flex animate-pulse flex-row justify-between items-center space-x-5 my-3"
              style={{ animationDelay: ".15s" }}
            >
              <div className="w-8 bg-gray-300 h-5 rounded-full"></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md"></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md"></div>
              <div className="w-4 bg-gray-300 h-5 rounded-md"></div>
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      <CupModal setOpen={setCupModalOpen} open={cupModalOpen} />
      {recordModal && (
        <RecordModal
          setOpen={() => setRecordModal(null)}
          open={!!recordModal}
          setRecord={updateRecordQuantity}
          record={recordModal}
        />
      )}

      {/* Effects */}
      <div
        className={`absolute top-0 left-0 w-full h-full ${
          fireworks ? "block bg-opacity-50" : "hidden bg-opacity-0"
        } bg-black z-50 transition-opacity`}
      >
        <div className="relative w-full h-full overflow-hidden">
          <h3 className="fire-message text-2xl">Today's goal completed!!!</h3>
          <div
            className="firework"
            role="img"
            onAnimationEnd={() => setFireworks(false)}
          ></div>
          <div className="firework" role="img"></div>
          <div className="firework" role="img"></div>
          <div className="firework" role="img"></div>
          <div className="firework" role="img"></div>
        </div>
      </div>
    </>
  );
};
