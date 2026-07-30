import { describe, it, expect } from 'bun:test';
import { isSLABreached, getMinutesSinceOrder, formatTimeAgo } from '../sla';
import { Order } from '../../types/order';

describe('sla helper functions', () => {
  const now = new Date('2026-07-30T17:00:00.000Z');

  const createOrder = (status: Order['status'], minutesAgo: number): Order => ({
    id: 'ORD-TEST',
    guestName: 'Test Guest',
    roomNumber: '101',
    service: 'Room Service',
    quantity: 1,
    amount: 20,
    orderTime: new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString(),
    status,
    paymentStatus: 'Paid',
  });

  describe('isSLABreached', () => {
    it('returns true for New orders older than 15 minutes', () => {
      const order = createOrder('New', 20);
      expect(isSLABreached(order, now)).toBe(true);
    });

    it('returns false for New orders under 15 minutes', () => {
      const order = createOrder('New', 10);
      expect(isSLABreached(order, now)).toBe(false);
    });

    it('returns false for New orders at exactly 15 minutes boundary', () => {
      const order = createOrder('New', 15);
      expect(isSLABreached(order, now)).toBe(false);
    });

    it('returns true for New orders at 16 minutes', () => {
      const order = createOrder('New', 16);
      expect(isSLABreached(order, now)).toBe(true);
    });

    it('returns false for non-New orders even if created >15m ago', () => {
      expect(isSLABreached(createOrder('Acknowledged', 30), now)).toBe(false);
      expect(isSLABreached(createOrder('In Progress', 45), now)).toBe(false);
      expect(isSLABreached(createOrder('Completed', 100), now)).toBe(false);
      expect(isSLABreached(createOrder('Cancelled', 100), now)).toBe(false);
    });
  });

  describe('getMinutesSinceOrder', () => {
    it('calculates elapsed minutes correctly', () => {
      const order = createOrder('New', 25);
      expect(getMinutesSinceOrder(order, now)).toBe(25);
    });

    it('floors fractional minutes', () => {
      const order = createOrder('New', 2);
      // 90 seconds ago = 1.5 mins -> floors to 1
      const orderTime = new Date(now.getTime() - 90 * 1000).toISOString();
      expect(getMinutesSinceOrder({ ...order, orderTime }, now)).toBe(1);
    });

    it('clamps negative differences to 0', () => {
      const futureOrderTime = new Date(now.getTime() + 60 * 1000).toISOString();
      const order = createOrder('New', 0);
      expect(getMinutesSinceOrder({ ...order, orderTime: futureOrderTime }, now)).toBe(0);
    });
  });

  describe('formatTimeAgo', () => {
    it('formats times under 1 minute as "Just now"', () => {
      const orderTime = new Date(now.getTime() - 30 * 1000).toISOString();
      expect(formatTimeAgo(orderTime, now)).toBe('Just now');
    });

    it('formats minutes under 60 correctly', () => {
      const orderTime = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
      expect(formatTimeAgo(orderTime, now)).toBe('15m ago');
    });

    it('formats hours and minutes under 24 hours', () => {
      const orderTime1 = new Date(now.getTime() - 90 * 60 * 1000).toISOString();
      expect(formatTimeAgo(orderTime1, now)).toBe('1h 30m ago');

      const orderTime2 = new Date(now.getTime() - 120 * 60 * 1000).toISOString();
      expect(formatTimeAgo(orderTime2, now)).toBe('2h ago');
    });

    it('formats days for timestamps older than 24 hours', () => {
      const orderTime = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString();
      expect(formatTimeAgo(orderTime, now)).toBe('1d ago');
    });
  });
});
