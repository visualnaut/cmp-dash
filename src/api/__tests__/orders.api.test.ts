import { describe, it, expect, beforeEach } from 'bun:test';
import {
  fetchOrders,
  fetchOrder,
  updateOrderStatus,
  updatePaymentStatus,
  fetchServiceTypes,
  resetOrdersStore,
  setAllSimulatedErrors,
} from '../orders.api';

describe('orders.api', () => {
  beforeEach(async () => {
    setAllSimulatedErrors(false);
    await resetOrdersStore();
  });

  describe('fetchOrders', () => {
    it('returns an array of orders', async () => {
      const orders = await fetchOrders();
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
    });

    it('returns clean copies of orders', async () => {
      const orders1 = await fetchOrders();
      const orders2 = await fetchOrders();
      expect(orders1).not.toBe(orders2); // Different array instances
    });
  });

  describe('fetchOrder', () => {
    it('returns a single order by valid ID', async () => {
      const order = await fetchOrder('ORD-1001');
      expect(order.id).toBe('ORD-1001');
      expect(order.guestName).toBe('John Smith');
    });

    it('throws error when order ID is not found', async () => {
      expect(fetchOrder('ORD-NONEXISTENT')).rejects.toThrow('not found');
    });
  });

  describe('updateOrderStatus', () => {
    it('successfully advances order status for a valid transition', async () => {
      const updated = await updateOrderStatus('ORD-1001', 'Acknowledged');
      expect(updated.status).toBe('Acknowledged');

      const refetched = await fetchOrder('ORD-1001');
      expect(refetched.status).toBe('Acknowledged');
    });

    it('throws error for an invalid status transition', async () => {
      expect(updateOrderStatus('ORD-1001', 'Completed')).rejects.toThrow('Invalid status transition');
    });

    it('throws error when updating non-existent order', async () => {
      expect(updateOrderStatus('ORD-9999', 'Acknowledged')).rejects.toThrow('not found');
    });
  });

  describe('updatePaymentStatus', () => {
    it('updates payment status to Paid', async () => {
      const updated = await updatePaymentStatus('ORD-1006', 'Paid');
      expect(updated.paymentStatus).toBe('Paid');

      const refetched = await fetchOrder('ORD-1006');
      expect(refetched.paymentStatus).toBe('Paid');
    });

    it('throws error when updating non-existent order', async () => {
      expect(updatePaymentStatus('ORD-9999', 'Paid')).rejects.toThrow('not found');
    });
  });

  describe('fetchServiceTypes', () => {
    it('returns dynamic service types list', async () => {
      const services = await fetchServiceTypes();
      expect(services).toContain('Room Service');
      expect(services).toContain('Housekeeping');
      expect(services).toContain('Laundry');
    });
  });

  describe('resetOrdersStore', () => {
    it('resets store back to initial data after mutations', async () => {
      await updateOrderStatus('ORD-1001', 'Acknowledged');
      expect((await fetchOrder('ORD-1001')).status).toBe('Acknowledged');

      await resetOrdersStore();
      expect((await fetchOrder('ORD-1001')).status).toBe('New');
    });
  });

  describe('simulated error mode', () => {
    it('throws error when simulated error mode is enabled', async () => {
      setAllSimulatedErrors(true);
      expect(fetchOrders()).rejects.toThrow('Simulated network error');
      expect(fetchOrder('ORD-1001')).rejects.toThrow('Simulated network error');
    });
  });
});
