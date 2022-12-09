import React from "react";
import ReactDOM from "react-dom/client";
import { SessionProvider } from "./context/sessionContext";
import Router from "./Router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SessionProvider>
      <Router />
    </SessionProvider>
  </React.StrictMode>
);
