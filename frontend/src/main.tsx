import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

import Root from "./routes/root";
// @ts-ignore
import ErrorPage from "@/error-page.jsx";
import AppShell from "@/components/AppShell.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <AppShell/>,
      },
      // {
      //   path: "/catalogs/:catalogSlug/services",
      //   Component: AppShell,
      // }
    ],
  },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>,
)
