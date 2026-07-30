import { Order } from '../types/order';

const SLA_THRESHOLD_MINUTES = 15;

/**
 * Checks if an order has breached SLA (>15 minutes in 'New' status).
 * Calculated snapshot-style against current system time (or provided now).
 */
export function isSLABreached(order: Order, now: Date = new Date()): boolean {
  if (order.status !== 'New') {
    return false;
  }
  const orderDate = new Date(order.orderTime);
  const diffMs = now.getTime() - orderDate.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes > SLA_THRESHOLD_MINUTES;
}

/**
 * Gets minutes elapsed since the order was created.
 */
export function getMinutesSinceOrder(order: Order, now: Date = new Date()): number {
  const orderDate = new Date(order.orderTime);
  const diffMs = now.getTime() - orderDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

/**
 * Formats time elapsed into human readable string (e.g. "12m ago", "2h 15m ago", "Just now").
 */
export function formatTimeAgo(orderTimeStr: string, now: Date = new Date()): string {
  const orderDate = new Date(orderTimeStr);
  const diffMs = now.getTime() - orderDate.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours < 24) {
    return remainingMins > 0 ? `${hours}h ${remainingMins}m ago` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
