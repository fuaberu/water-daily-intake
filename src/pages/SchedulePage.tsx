import { doc, collection } from "firebase/firestore";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Disclosure, Switch } from "../components";
import { ScheduleModal } from "../components/schedule";
import { db } from "../config/firebase";

export interface ITimer {
  id: string;
  days: number[];
  time: { hour: number; minutes: number };
  enabled: boolean;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const SchedulePage = () => {
  const [times, setTimes] = useState<ITimer[]>([
    {
      id: "dasd",
      enabled: true,
      days: [0, 1, 3],
      time: { hour: 7, minutes: 27 },
    },
    {
      id: "dasdadas",
      enabled: false,
      days: [0, 1, 3],
      time: { hour: 7, minutes: 27 },
    },
  ]);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const setEnabled = (i: number) => {
    setTimes((ts) =>
      ts.map((t, j) => (j === i ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const setDays = (id: string, day: number, add: boolean) => {
    setTimes((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              days: add
                ? [...e.days, day]
                : e.days.length > 1
                ? e.days.filter((d) => d !== day)
                : e.days,
            }
          : e
      )
    );
  };

  const deleteTimer = (id: string) => {
    setTimes((prev) => prev.filter((t) => t.id !== id));
  };

  const criarTimer = (t: string) => {
    const ref = doc(collection(db, "timers"));
    const timeCreate = {
      hour: Number(t.substring(0, 2)),
      minutes: Number(t.substring(3, 5)),
    };
    setTimes((prev) => [
      {
        days: [0, 1, 2, 3, 4, 5, 6],
        enabled: true,
        id: ref.id,
        time: timeCreate,
      },
      ...prev,
    ]);
  };
  return (
    <div className="max-w-xl mx-auto flex flex-col items-center p-6">
      <div className="py-5 w-full">
        {times.map((t, i) => (
          <div key={t.id}>
            <div className="flex w-full justify-between py-2">
              <p>{`${t.time.hour < 10 ? "0" + t.time.hour : t.time.hour}:${
                t.time.minutes < 10 ? "0" + t.time.minutes : t.time.minutes
              }`}</p>
              <Switch enabled={t.enabled} setEnabled={() => setEnabled(i)} />
            </div>
            <Disclosure head={t.days.map((d) => days[d]).join(" ")}>
              <div className="flex flex-col items-center">
                <div className="flex w-full justify-between">
                  {days.map((d, j) => (
                    <button
                      className={`rounded-full w-8 h-8 ${
                        t.days.includes(j)
                          ? "bg-sky-400 text-white hover:bg-sky-500"
                          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      } text-sm text-center`}
                      onClick={() => setDays(t.id, j, !t.days.includes(j))}
                      key={d}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <button
                  className="text-white font-semibold bg-red-400 py-1 px-3 rounded-md mt-3 hover:bg-red-500"
                  onClick={() => deleteTimer(t.id)}
                >
                  Delete
                </button>
              </div>
            </Disclosure>
          </div>
        ))}
      </div>
      <button
        className="bg-sky-400 p-3 text-white rounded-full shadow-sm shadow-slate-500 hover:bg-sky-500 focus:bg-sky-300"
        onClick={() => setTimePickerOpen((tp) => !tp)}
      >
        <FaPlus />
      </button>
      <ScheduleModal
        open={timePickerOpen}
        setOpen={setTimePickerOpen}
        action={criarTimer}
      />
    </div>
  );
};
