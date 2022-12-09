import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface IDrop {
  items: { fun: () => void; text: string }[];
}

export const Dropdown = ({ items }: IDrop) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="hover:text-sky-500 p-1">
          <BiDotsVerticalRounded aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items.map((i) => (
              <Menu.Item key={i.text}>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                    onClick={i.fun}
                  >
                    {i.text}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
