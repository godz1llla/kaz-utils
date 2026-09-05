import { describe, it, expect } from 'vitest';
import {
  normalizePhone,
  isValidPhone,
  isMobilePhone,
  formatPhone,
} from '../src/phone';

describe('normalizePhone', () => {
  it('нормализует разные форматы к 11 цифрам с 7', () => {
    expect(normalizePhone('+7 701 234 56 78')).toBe('77012345678');
    expect(normalizePhone('8 (701) 234-56-78')).toBe('77012345678');
    expect(normalizePhone('7012345678')).toBe('77012345678');
  });

  it('возвращает null для непохожего на номер', () => {
    expect(normalizePhone('123')).toBeNull();
    expect(normalizePhone('abcdefghij')).toBeNull();
  });
});

describe('isValidPhone / isMobilePhone', () => {
  it('валидирует корректный мобильный', () => {
    expect(isValidPhone('+7 701 234 56 78')).toBe(true);
    expect(isMobilePhone('+7 701 234 56 78')).toBe(true);
  });

  it('городской номер валиден, но не мобильный', () => {
    // +7 727 (Алматы) — вторая цифра 2, не мобильный
    expect(isValidPhone('+7 727 250 00 00')).toBe(true);
    expect(isMobilePhone('+7 727 250 00 00')).toBe(false);
  });
});

describe('formatPhone', () => {
  it('форматирует в +7 (XXX) XXX-XX-XX', () => {
    expect(formatPhone('87012345678')).toBe('+7 (701) 234-56-78');
  });

  it('возвращает null для невалидного', () => {
    expect(formatPhone('123')).toBeNull();
  });
});
