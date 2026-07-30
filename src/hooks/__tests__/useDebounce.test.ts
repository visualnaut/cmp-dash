import { describe, it, expect } from 'bun:test';
import { useDebounce } from '../useDebounce';

describe('useDebounce function signature and export', () => {
  it('exports useDebounce function', () => {
    expect(typeof useDebounce).toBe('function');
  });
});
