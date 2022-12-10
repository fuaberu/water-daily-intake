import { NavLink, Outlet } from "react-router-dom";
import { BsDropletHalf } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { MdHistory } from "react-icons/md";

export const Layout = () => {
  const askNotificationPermit = () => {
    if (!("Notification" in window)) {
      console.log("Browser does not support notification");
    } else if (Notification.permission !== "granted") {
      Notification.requestPermission((result) => {
        if (result === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Welcome", {
              body: "Thanks for accepting my notifications",
              icon: "/water-svg.svg",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: "Welcome to Water Reminder!",
            });
          });
        }
      });
    }
  };

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
    </div>
  );
};
