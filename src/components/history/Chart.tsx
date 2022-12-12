import { useQuery } from "@tanstack/react-query";
import { SetStateAction, useMemo, useState } from "react";
import { getHistory } from "../../library/firebase/firestoreModel";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";
import { IRecord } from "../../pages";
import { useSession } from "../../context/sessionContext";
import moment from "moment";
import "./chart.css";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const Chart = () => {
  const { settings } = useSession();
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"month" | "year" | "week">("month");
  const [date, setDate] = useState(new Date());

  const { data: records } = useQuery({
    queryKey: ["history", mode],
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

      if (mode === "year") {
        amt = Math.round(
          (amt / (settings.intake * moment({ month: i }).daysInMonth())) * 100
        );
      } else {
        amt = (amt / settings.intake) * 100;
      }
      val.push({
        name: (i + 1).toString(),
        amt,
      });
    });
    return val;
  };

  const data = useMemo(
    () => (records ? fromRecordsToData(records) : []),
    [records]
  );

  const handleClick = (data: any, index: SetStateAction<number | null>) => {
    setDayIndex(index);
  };

  return (
    <div className="flex flex-col items-center px-1">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart width={150} height={40} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            tickFormatter={(tick) => {
              return `${tick}%`;
            }}
            tickCount={6}
            width={30}
            fontSize={10}
            type={"number"}
            minTickGap={20}
            interval={0}
            domain={[0, 100]}
          />
          <XAxis dataKey="name" tickSize={5} fontSize={10} />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="amt" onClick={handleClick}>
            {data.map((_, index) => (
              <Cell
                cursor="pointer"
                fill={index === dayIndex ? "#82ca9d" : "#8884d8"}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <label
        htmlFor="ToggleMode"
        className="inline-flex items-center p-1 rounded-md cursor-pointer bg-sky-400 font-bold text-sm m-auto"
      >
        <input
          id="ToggleMode"
          type="checkbox"
          className="hidden"
          value={mode}
          onChange={(e) => setMode(e.target.checked ? "month" : "year")}
        />
        <span
          className={`w-20 text-center py-1 rounded-md ${
            mode === "month" ? "bg-white" : "text-white"
          }`}
        >
          Month
        </span>
        <span
          className={`w-20 text-center py-1 rounded-r-md ${
            mode === "year" ? "bg-white" : "text-white"
          }`}
        >
          Year
        </span>
      </label>
    </div>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="py-3 px-4 bg-slate-900 text-white font-bold bg-opacity-40 rounded-md border-red-600">
        <p className="label">{`Day ${label}: ${Math.round(
          Number(payload[0].value)
        )}%`}</p>
      </div>
    );
  }

  return null;
};
