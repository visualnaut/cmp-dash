import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import {
  setSimulatedErrorConfig,
  getSimulatedErrorConfig,
  setAllSimulatedErrors,
} from '../../api/orders.api';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../hooks/useOrders';
import { DASHBOARD_QUERY_KEYS } from '../../hooks/useDashboard';
import { SimulatedErrorConfig } from '../../types/order';

export const AppShell: React.FC = () => {
  const [errorConfig, setErrorConfig] = useState<SimulatedErrorConfig>(getSimulatedErrorConfig());
  const queryClient = useQueryClient();

  const handleToggleErrorConfig = (key: keyof SimulatedErrorConfig) => {
    const nextValue = !errorConfig[key];
    const newConfig = { ...errorConfig, [key]: nextValue };
    setSimulatedErrorConfig({ [key]: nextValue });
    setErrorConfig(newConfig);

    // Invalidate affected query keys
    if (key === 'orders') {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    } else if (key === 'metrics') {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.metrics });
    } else if (key === 'topSelling') {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.topSelling });
    } else if (key === 'opsHealth') {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.opsHealth });
    }
  };

  const handleToggleAllErrors = (enabled: boolean) => {
    setAllSimulatedErrors(enabled);
    setErrorConfig(getSimulatedErrorConfig());
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  return (
    <div className="flex min-h-screen bg-base-200/50">
      <Sidebar
        errorConfig={errorConfig}
        onToggleErrorConfig={handleToggleErrorConfig}
        onToggleAllErrors={handleToggleAllErrors}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main id="main-content" role="main" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
