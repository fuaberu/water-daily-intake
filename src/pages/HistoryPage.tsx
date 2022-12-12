import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Chart } from "../components/history/Chart";
import { useSession } from "../context/sessionContext";
import { getHistory } from "../library/firebase/firestoreModel";
import { IRecord } from "./HomePage";
import { FaHeartbeat, FaHeartBroken, FaHeart } from "react-icons/fa";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const HistoryPage = () => {
  const { settings } = useSession();
  const { data: records } = useQuery({
    queryKey: ["history", "week"],
    queryFn: ({ queryKey }) =>
      getHistory(
        { year: 2022, month: 11 },
        queryKey[1] as "month" | "year" | "week"
      ),
    staleTime: Infinity,
  });

  const fromRecordsToData = (rs: IRecord[][]) => {
    const val: { name: string; amt: number }[] = [];

    rs.forEach((d, i) => {
      let amt = d.reduce((acc, r) => acc + r.quantity, 0);
      amt = (amt / settings.intake) * 100;
      console.log(d, i);

      val.push({
        name: days[i],
        amt,
      });
    });
    return val;
  };

  const data = useMemo(
    () => (records ? fromRecordsToData(records) : []),
    [records]
  );
  return (
    <div className="h-80 mt-6">
      <div className="max-w-3xl m-auto">
        <Chart />
      </div>
      <section className="bg-sky-500 text-white mt-4">
        <div className="max-w-3xl p-4 m-auto">
          <h3>Weekly Completion</h3>
          <div className="flex justify-between py-4">
            {data.map((d, i) => {
              return (
                <div className="flex flex-col items-center" key={i}>
                  <div className="rounded-full bg-sky-600 w-7 h-7 flex justify-center items-center relative duration-300 group">
                    {d.amt >= 100 ? (
                      <FaHeartbeat className="text-green-300" />
                    ) : d.amt > 0 ? (
                      <FaHeart className="text-orange-300" />
                    ) : (
                      <FaHeartBroken className="text-red-300" />
                    )}
                    <span className="absolute hidden group-hover:flex -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                      {`${Math.round(d.amt)}%`}
                    </span>
                  </div>
                  <span>{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
