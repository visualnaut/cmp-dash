import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchOrders,
  fetchOrder,
  updateOrderStatus,
  updatePaymentStatus,
  fetchServiceTypes,
  resetOrdersStore,
} from '../api/orders.api';
import { Order, OrderStatus, PaymentStatus } from '../types/order';
import { tracker } from '../lib/tracker';

export const QUERY_KEYS = {
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  serviceTypes: ['serviceTypes'] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id),
  });
}

export function useServiceTypes() {
  return useQuery({
    queryKey: QUERY_KEYS.serviceTypes,
    queryFn: fetchServiceTypes,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onMutate: async ({ id }) => {
      const orders = queryClient.getQueryData<Order[]>(QUERY_KEYS.orders);
      const previousOrder = orders?.find((o) => o.id === id);
      return { previousOrder };
    },
    onSuccess: (updatedOrder, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(updatedOrder.id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      toast.success(`Order ${updatedOrder.id} status updated to ${updatedOrder.status}`);

      tracker.track('order_status_changed', {
        orderId: updatedOrder.id,
        fromStatus: context?.previousOrder?.status,
        toStatus: updatedOrder.status,
      });
    },
    onError: (error) => {
      toast.error('Failed to update order status', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) =>
      updatePaymentStatus(id, paymentStatus),
    onMutate: async ({ id }) => {
      const orders = queryClient.getQueryData<Order[]>(QUERY_KEYS.orders);
      const previousOrder = orders?.find((o) => o.id === id);
      return { previousOrder };
    },
    onSuccess: (updatedOrder, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(updatedOrder.id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      toast.success(`Order ${updatedOrder.id} payment status updated to ${updatedOrder.paymentStatus}`);

      tracker.track('payment_status_changed', {
        orderId: updatedOrder.id,
        fromPaymentStatus: context?.previousOrder?.paymentStatus,
        toPaymentStatus: updatedOrder.paymentStatus,
      });
    },
    onError: (error) => {
      toast.error('Failed to update payment status', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    },
  });
}

export function useResetOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetOrdersStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Demo order data reset to initial state');
    },
    onError: (error) => {
      toast.error('Failed to reset order data', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    },
  });
}
