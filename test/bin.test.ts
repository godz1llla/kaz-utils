import { describe, it, expect } from 'vitest';
import { isValidBin, parseBin } from '../src/bin';

const VALID_BIN = '050440012343'; // рег. 2005-04, резидент, головная организация

describe('isValidBin', () => {
  it('принимает валидный БИН', () => {
    expect(isValidBin(VALID_BIN)).toBe(true);
  });

  it('отклоняет неверную контрольную сумму', () => {
    expect(isValidBin('050440012344')).toBe(false);
  });

  it('отклоняет неверный тип юр. лица (5-я цифра не 4/5/6)', () => {
    expect(isValidBin('050410012343')).toBe(false);
  });

  it('отклоняет неверный месяц', () => {
    expect(isValidBin('051340012343')).toBe(false);
  });
});

describe('parseBin', () => {
  it('разбирает поля БИН', () => {
    const parsed = parseBin(VALID_BIN);
    expect(parsed).not.toBeNull();
    expect(parsed!.year).toBe(5);
    expect(parsed!.month).toBe(4);
    expect(parsed!.entityType).toBe('resident');
    expect(parsed!.isHeadUnit).toBe(true);
  });

  it('возвращает null для невалидного БИН', () => {
    expect(parseBin('000000000000')).toBeNull();
  });
});
