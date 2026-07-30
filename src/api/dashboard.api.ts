import { OrderMetrics, TopSellingService, OpsHealthCheck } from '../types/order';
import { ensureOrdersLoaded, getSimulatedErrorConfig } from './orders.api';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchOrderMetrics(): Promise<OrderMetrics> {
  await delay(350);
  if (getSimulatedErrorConfig().metrics) {
    throw new Error('Failed to load operational metrics. Simulated network error.');
  }

  const orders = await ensureOrdersLoaded();
  const now = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const activeOrders = orders.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled');
  const activeGuestSet = new Set(activeOrders.map((o) => o.guestName));

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'New' || o.status === 'Acknowledged'
  ).length;

  const ordersToday = orders.filter((o) => isSameDay(new Date(o.orderTime), now));
  const revenueToday = ordersToday.reduce((sum, o) => sum + o.amount, 0);
  const completedToday = ordersToday.filter((o) => o.status === 'Completed').length;

  const paidOrders = orders.filter((o) => o.amount > 0);
  const averageOrderValue =
    paidOrders.length > 0
      ? Math.round(paidOrders.reduce((sum, o) => sum + o.amount, 0) / paidOrders.length)
      : 0;

  return {
    activeGuests: activeGuestSet.size,
    pendingOrders: pendingOrdersCount,
    revenueToday,
    completedToday,
    averageOrderValue,
    totalOrders: orders.length,
  };
}

export async function fetchTopSellingServices(): Promise<TopSellingService[]> {
  await delay(300);
  if (getSimulatedErrorConfig().topSelling) {
    throw new Error('Failed to load top selling services data. Simulated network error.');
  }

  const orders = await ensureOrdersLoaded();
  const serviceCounts: Record<string, { count: number; totalRevenue: number }> = {};
  orders.forEach((o) => {
    if (!serviceCounts[o.service]) {
      serviceCounts[o.service] = { count: 0, totalRevenue: 0 };
    }
    serviceCounts[o.service].count += 1;
    serviceCounts[o.service].totalRevenue += o.amount;
  });

  return Object.entries(serviceCounts)
    .map(([service, stats]) => ({
      service,
      count: stats.count,
      totalRevenue: stats.totalRevenue,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchOpsHealthCheck(): Promise<OpsHealthCheck> {
  await delay(250);
  if (getSimulatedErrorConfig().opsHealth) {
    throw new Error('Failed to load operational health check status. Simulated network error.');
  }

  const orders = await ensureOrdersLoaded();
  return {
    newOrders: orders.filter((o) => o.status === 'New').length,
    acknowledged: orders.filter((o) => o.status === 'Acknowledged').length,
    inProgress: orders.filter((o) => o.status === 'In Progress').length,
    failedPayments: orders.filter((o) => o.paymentStatus === 'Failed').length,
  };
}
