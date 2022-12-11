import React from "react";
import ReactDOM from "react-dom/client";
import { SessionProvider } from "./context/sessionContext";
import Router from "./Router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Router />
      </SessionProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
