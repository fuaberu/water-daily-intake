import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components";
import { useSession } from "./context/sessionContext";
import { ErrorPage, LoginPage } from "./pages";

//  Code Spliting
const HomePage = lazy(() =>
  import("./pages").then((modules) => {
    return { default: modules.HomePage };
  })
);
const HistoryPage = lazy(() =>
  import("./pages").then((modules) => {
    return { default: modules.HistoryPage };
  })
);
const SettingsPage = lazy(() =>
  import("./pages").then((modules) => {
    return { default: modules.SettingsPage };
  })
);
// const SchedulePage = lazy(() =>
//   import("./pages").then((modules) => {
//     return { default: modules.SchedulePage };
//   })
// );

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
            // { path: "schedule", element: <SchedulePage /> },
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
