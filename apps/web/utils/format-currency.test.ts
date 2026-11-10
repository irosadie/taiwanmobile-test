import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  it('formats amount in NT$ with zh-TW grouping', () => {
    expect(formatCurrency(1200)).toBe('NT$ 1,200');
    expect(formatCurrency(0)).toBe('NT$ 0');
  });
});
