import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components";
import { useSession } from "./context/sessionContext";
import {
  LoginPage,
  ErrorPage,
  HomePage,
  HistoryPage,
  SettingsPage,
  SchedulePage,
} from "./pages";

const Router = () => {
  const { loggedIn } = useSession();

  const routes = loggedIn
    ? createBrowserRouter([
        {
          path: "/",
          element: <Layout />,
          errorElement: <ErrorPage />,
          children: [
            { path: "/", element: <HomePage /> },
            { path: "history", element: <HistoryPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "schedule", element: <SchedulePage /> },
          ],
        },
      ])
    : createBrowserRouter([
        {
          path: "/",
          element: <LoginPage />,
          errorElement: <ErrorPage />,
        },
      ]);

  return <RouterProvider router={routes} />;
};

export default Router;
