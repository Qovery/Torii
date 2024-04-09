import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.css";

import AppShell from "@/components/AppShell.tsx";
import SelfServiceWithTitle from "./components/self-service/SelfService";
import { Providers } from "./providers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "/self-service",
        element: <SelfServiceWithTitle />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);
