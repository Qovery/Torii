import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider, createStore } from "jotai";
import { DevTools } from "jotai-devtools";

function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = getQueryClient();
  const jotaiStore = createStore();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={jotaiStore}>
        <DevTools store={jotaiStore} />
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </JotaiProvider>
    </QueryClientProvider>
  );
};
