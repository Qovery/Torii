import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import ErrorPage from "@/error-page.jsx";
import AppShell from "@/components/AppShell.tsx";
import { createRouter } from "@swan-io/chicane";
import { match } from "ts-pattern";

const Router = createRouter({
  Home: "/",
});

const App = () => {
  const route = Router.useRoute(["Home"]);

  return match(route)
    .with({ name: "Home" }, () => <AppShell/>)
    .otherwise(() => <ErrorPage/>);
};

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
