import { describe, it, expect } from 'bun:test';
import {
  getNextStatuses,
  isTerminal,
  canCancel,
  getPrimaryNextStatus,
  canMarkPaymentPaid,
} from '../order-state-machine';

describe('order-state-machine', () => {
  describe('getNextStatuses', () => {
    it('returns Acknowledged and Cancelled for New status', () => {
      expect(getNextStatuses('New')).toEqual(['Acknowledged', 'Cancelled']);
    });

    it('returns In Progress and Cancelled for Acknowledged status', () => {
      expect(getNextStatuses('Acknowledged')).toEqual(['In Progress', 'Cancelled']);
    });

    it('returns Completed and Cancelled for In Progress status', () => {
      expect(getNextStatuses('In Progress')).toEqual(['Completed', 'Cancelled']);
    });

    it('returns empty array for Completed (terminal status)', () => {
      expect(getNextStatuses('Completed')).toEqual([]);
    });

    it('returns empty array for Cancelled (terminal status)', () => {
      expect(getNextStatuses('Cancelled')).toEqual([]);
    });
  });

  describe('isTerminal', () => {
    it('identifies Completed as terminal', () => {
      expect(isTerminal('Completed')).toBe(true);
    });

    it('identifies Cancelled as terminal', () => {
      expect(isTerminal('Cancelled')).toBe(true);
    });

    it('identifies non-terminal statuses correctly', () => {
      expect(isTerminal('New')).toBe(false);
      expect(isTerminal('Acknowledged')).toBe(false);
      expect(isTerminal('In Progress')).toBe(false);
    });
  });

  describe('canCancel', () => {
    it('allows cancelling from non-terminal states', () => {
      expect(canCancel('New')).toBe(true);
      expect(canCancel('Acknowledged')).toBe(true);
      expect(canCancel('In Progress')).toBe(true);
    });

    it('disallows cancelling from terminal states', () => {
      expect(canCancel('Completed')).toBe(false);
      expect(canCancel('Cancelled')).toBe(false);
    });
  });

  describe('getPrimaryNextStatus', () => {
    it('returns next operational status along hot path', () => {
      expect(getPrimaryNextStatus('New')).toBe('Acknowledged');
      expect(getPrimaryNextStatus('Acknowledged')).toBe('In Progress');
      expect(getPrimaryNextStatus('In Progress')).toBe('Completed');
    });

    it('returns null for terminal states', () => {
      expect(getPrimaryNextStatus('Completed')).toBeNull();
      expect(getPrimaryNextStatus('Cancelled')).toBeNull();
    });
  });

  describe('canMarkPaymentPaid', () => {
    it('allows marking Pending or Failed payments as Paid', () => {
      expect(canMarkPaymentPaid('Pending')).toBe(true);
      expect(canMarkPaymentPaid('Failed')).toBe(true);
    });

    it('disallows marking already Paid payments', () => {
      expect(canMarkPaymentPaid('Paid')).toBe(false);
    });
  });
});
