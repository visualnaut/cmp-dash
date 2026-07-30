import React from 'react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TrackerProvider } from './lib/tracker/TrackerProvider';
import { AppRoutes } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TrackerProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
          <AppRoutes />
        </BrowserRouter>
      </TrackerProvider>
    </QueryClientProvider>
  );
};

export default App;
