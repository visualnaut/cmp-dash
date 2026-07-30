import { useQuery } from '@tanstack/react-query';
import {
  fetchOrderMetrics,
  fetchTopSellingServices,
  fetchOpsHealthCheck,
} from '../api/dashboard.api';

export const DASHBOARD_QUERY_KEYS = {
  metrics: ['dashboard', 'metrics'] as const,
  topSelling: ['dashboard', 'topSelling'] as const,
  opsHealth: ['dashboard', 'opsHealth'] as const,
};

export function useOrderMetrics() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.metrics,
    queryFn: fetchOrderMetrics,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopSellingServices() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.topSelling,
    queryFn: fetchTopSellingServices,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOpsHealthCheck() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.opsHealth,
    queryFn: fetchOpsHealthCheck,
    staleTime: 1000 * 60 * 5,
  });
}
