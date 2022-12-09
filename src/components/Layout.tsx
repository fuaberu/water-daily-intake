import { Link, Outlet } from "react-router-dom";
import { BsDropletHalf } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { MdHistory } from "react-icons/md";

export const Layout = () => {
  return (
    <div className="w-full min-h-screen">
      <nav className="flex items-center justify-center h-16 bg-sky-300">
        <ul className="flex items-center">
          <li>
            <Link
              to="/"
              className="flex items-center p-4 rounded-lg hover:bg-sky-400 active:bg-sky-500"
            >
              <BsDropletHalf className="mr-3" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className="flex items-center p-4 rounded-lg hover:bg-sky-400 active:bg-sky-500"
            >
              <MdHistory className="mr-3" />
              History
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center p-4 rounded-lg hover:bg-sky-400 active:bg-sky-500"
            >
              <IoIosSettings className="mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};
