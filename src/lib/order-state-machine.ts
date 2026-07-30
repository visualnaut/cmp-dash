import { OrderStatus, PaymentStatus } from '../types/order';

/**
 * Returns the next valid status transitions for a given order status.
 * State machine: New -> Acknowledged -> In Progress -> Completed
 * Cancelled can be reached from any non-terminal state.
 */
export function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  switch (currentStatus) {
    case 'New':
      return ['Acknowledged', 'Cancelled'];
    case 'Acknowledged':
      return ['In Progress', 'Cancelled'];
    case 'In Progress':
      return ['Completed', 'Cancelled'];
    case 'Completed':
    case 'Cancelled':
      return []; // Terminal states
    default:
      return [];
  }
}

/**
 * Checks if the order is in a terminal state (Completed or Cancelled).
 */
export function isTerminal(status: OrderStatus): boolean {
  return status === 'Completed' || status === 'Cancelled';
}

/**
 * Checks if an order can be cancelled from its current status.
 */
export function canCancel(status: OrderStatus): boolean {
  return !isTerminal(status);
}

/**
 * Returns the primary next action for an order status (hot-path action).
 */
export function getPrimaryNextStatus(status: OrderStatus): OrderStatus | null {
  switch (status) {
    case 'New':
      return 'Acknowledged';
    case 'Acknowledged':
      return 'In Progress';
    case 'In Progress':
      return 'Completed';
    default:
      return null;
  }
}

/**
 * Checks if payment status can be marked as Paid manually.
 */
export function canMarkPaymentPaid(paymentStatus: PaymentStatus): boolean {
  return paymentStatus === 'Pending' || paymentStatus === 'Failed';
}
