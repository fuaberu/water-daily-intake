import { ReactNode } from "react";
import { Disclosure as HeadlessDisclosure } from "@headlessui/react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
interface IProps {
  head: string;
  children: ReactNode;
}

export const Disclosure = ({ head, children }: IProps) => {
  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <>
          <HeadlessDisclosure.Button className="py-2 flex w-full justify-between items-center text-gray-500 text-sm">
            {head} {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </HeadlessDisclosure.Button>
          <HeadlessDisclosure.Panel className="py-3">
            {children}
          </HeadlessDisclosure.Panel>
        </>
      )}
    </HeadlessDisclosure>
  );
};
