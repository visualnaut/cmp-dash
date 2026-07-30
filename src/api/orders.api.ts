import { Order, OrderStatus, PaymentStatus, SimulatedErrorConfig } from '../types/order';
import { mockServiceTypes } from './mock-data';
import { getNextStatuses } from '../lib/order-state-machine';
import seedData from '../../public/mocks/orders.json';

// In-memory state persistent during browser session
let ordersStore: Order[] | null = null;

let simulatedErrorConfig: SimulatedErrorConfig = {
  orders: false,
  metrics: false,
  topSelling: false,
  opsHealth: false,
  mutations: false,
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export function setSimulatedErrorConfig(partial: Partial<SimulatedErrorConfig>) {
  simulatedErrorConfig = { ...simulatedErrorConfig, ...partial };
}

export function getSimulatedErrorConfig(): SimulatedErrorConfig {
  return { ...simulatedErrorConfig };
}

export function setAllSimulatedErrors(enabled: boolean) {
  simulatedErrorConfig = {
    orders: enabled,
    metrics: enabled,
    topSelling: enabled,
    opsHealth: enabled,
    mutations: enabled,
  };
}

function adjustTimestamps(orders: Order[]): Order[] {
  if (orders.length === 0) return orders;
  const now = new Date().getTime();
  // Find the most recent order time in the mock data
  const maxTime = Math.max(...orders.map((o) => new Date(o.orderTime).getTime()));
  // Shift all timestamps so the most recent order is 2 minutes ago
  const offset = now - (2 * 60 * 1000) - maxTime;

  return orders.map((order) => {
    const origTime = new Date(order.orderTime).getTime();
    return {
      ...order,
      orderTime: new Date(origTime + offset).toISOString(),
    };
  });
}

export async function ensureOrdersLoaded(): Promise<Order[]> {
  if (!ordersStore) {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/mocks/orders.json');
        if (res.ok) {
          const data: Order[] = await res.json();
          ordersStore = adjustTimestamps(data);
          return ordersStore;
        }
      }
    } catch {
      // Fallback to static seed data
    }
    const data = JSON.parse(JSON.stringify(seedData)) as Order[];
    ordersStore = adjustTimestamps(data);
  }
  return ordersStore;
}

export async function fetchOrders(): Promise<Order[]> {
  await delay(400);
  if (simulatedErrorConfig.orders) {
    throw new Error('Unable to load orders from server. Simulated network error.');
  }
  const store = await ensureOrdersLoaded();
  return JSON.parse(JSON.stringify(store));
}

export async function fetchOrder(id: string): Promise<Order> {
  await delay(300);
  if (simulatedErrorConfig.orders) {
    throw new Error(`Unable to fetch order ${id}. Simulated network error.`);
  }
  const store = await ensureOrdersLoaded();
  const order = store.find((o) => o.id === id);
  if (!order) {
    throw new Error(`Order ${id} not found.`);
  }
  return JSON.parse(JSON.stringify(order));
}

export async function updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order> {
  await delay(400);
  if (simulatedErrorConfig.mutations) {
    throw new Error('Failed to update order status. Simulated network error.');
  }
  const store = await ensureOrdersLoaded();
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) {
    throw new Error(`Order ${id} not found.`);
  }

  const currentOrder = store[index];
  const allowedNext = getNextStatuses(currentOrder.status);

  if (!allowedNext.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentOrder.status} to ${newStatus}`);
  }

  const updatedOrder: Order = {
    ...currentOrder,
    status: newStatus,
  };

  store[index] = updatedOrder;
  return JSON.parse(JSON.stringify(updatedOrder));
}

export async function updatePaymentStatus(id: string, newPaymentStatus: PaymentStatus): Promise<Order> {
  await delay(400);
  if (simulatedErrorConfig.mutations) {
    throw new Error('Failed to update payment status. Simulated network error.');
  }
  const store = await ensureOrdersLoaded();
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) {
    throw new Error(`Order ${id} not found.`);
  }

  const updatedOrder: Order = {
    ...store[index],
    paymentStatus: newPaymentStatus,
  };

  store[index] = updatedOrder;
  return JSON.parse(JSON.stringify(updatedOrder));
}

export async function fetchServiceTypes(): Promise<string[]> {
  await delay(200);
  return [...mockServiceTypes];
}

export async function resetOrdersStore(): Promise<Order[]> {
  await delay(200);
  const data = JSON.parse(JSON.stringify(seedData)) as Order[];
  ordersStore = adjustTimestamps(data);
  return JSON.parse(JSON.stringify(ordersStore));
}
