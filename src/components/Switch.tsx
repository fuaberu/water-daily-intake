import { useState } from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";

interface IProps {
  enabled: boolean;
  setEnabled: () => void;
}

export const Switch = ({ enabled, setEnabled }: IProps) => {
  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </HeadlessSwitch>
  );
};
