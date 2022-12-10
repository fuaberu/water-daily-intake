import { NavLink, Outlet } from "react-router-dom";
import { BsDropletHalf } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { useEffect, useState } from "react";

export const Layout = () => {
  const [notifyOpen, setNotifyOpen] = useState(false);

  const askNotificationPermit = () => {
    if (!("Notification" in window)) {
      console.log("Browser does not support notification");
    } else if (Notification.permission !== "granted") {
      Notification.requestPermission((result) => {
        if (result === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Welcome", {
              body: "Thanks for accepting my notifications",
              icon: "https://toppng.com//public/uploads/preview/middlefinger-cat-cats-funnycat-meme-memesfreetoedit-middle-finger-cat-11562887943iuk5ajvaeg.png",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: "Welcome to Water Reminder!",
            });
          });
        }
      });
    }
    setNotifyOpen(false);
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      setNotifyOpen(true);
    }
  }, []);

  return (
    <div className="w-full min-h-screen">
      <nav className="flex items-center justify-center h-16 bg-sky-400 shadow-md">
        <ul className="flex items-center h-full gap-3">
          <li className="h-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "block h-full pt-1 border-b-2 border-b-white"
                  : "block h-full pt-1 border-b-2 border-b-transparent"
              }
            >
              <div className="flex items-center p-4 rounded-lg hover:bg-sky-500 focus:bg-sky-500 text-white">
                <BsDropletHalf className="mr-3" />
                Home
              </div>
            </NavLink>
          </li>
          <li className="h-full">
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive
                  ? "block h-full pt-1 border-b-2 border-b-white"
                  : "block h-full pt-1 border-b-2 border-b-transparent"
              }
            >
              <div className="flex items-center p-4 rounded-lg hover:bg-sky-500 focus:bg-sky-500 text-white">
                <MdHistory className="mr-3" />
                History
              </div>
            </NavLink>
          </li>
          <li className="h-full">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "block h-full pt-1 border-b-2 border-b-white"
                  : "block h-full pt-1 border-b-2 border-b-transparent"
              }
            >
              <div className="flex items-center p-4 rounded-lg hover:bg-sky-500 focus:bg-sky-500 text-white">
                <IoIosSettings className="mr-3" />
                Settings
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
      {notifyOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 bottom-4 overflow-hidden rounded-lg bg-slate-500 text-left shadow-xl w-11/12 max-w-sm">
          <div className="p-4 text-white">
            <h3 className="font-semibold text-lg mb-3">
              Accept our Notifications
            </h3>
            <p>
              Improve your experience in the App, by receiving notifications! 😊
            </p>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={askNotificationPermit}
            >
              Ok
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setNotifyOpen((o) => !o)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
