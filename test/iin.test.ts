import { describe, it, expect } from 'vitest';
import { isValidIin, parseIin, isValidChecksum } from '../src/iin';

// Валидные ИИН (контрольная сумма рассчитана по алгоритму).
const VALID_IIN = '900101301233'; // 1990-01-01, мужчина

describe('isValidChecksum', () => {
  it('принимает корректную контрольную сумму', () => {
    expect(isValidChecksum(VALID_IIN)).toBe(true);
  });

  it('отклоняет неверную контрольную цифру', () => {
    expect(isValidChecksum('900101301234')).toBe(false);
  });

  it('отклоняет неверный формат', () => {
    expect(isValidChecksum('12345')).toBe(false);
    expect(isValidChecksum('90010130123a')).toBe(false);
  });
});

describe('isValidIin', () => {
  it('принимает валидный ИИН', () => {
    expect(isValidIin(VALID_IIN)).toBe(true);
  });

  it('отклоняет неверную длину', () => {
    expect(isValidIin('90010130123')).toBe(false);
    expect(isValidIin('9001013012333')).toBe(false);
  });

  it('отклоняет несуществующую дату (32 января)', () => {
    // подменяем день на 32 — дата невалидна
    expect(isValidIin('900132301233')).toBe(false);
  });

  it('отклоняет неверную цифру века/пола (0)', () => {
    expect(isValidIin('900101001233')).toBe(false);
  });
});

describe('parseIin', () => {
  it('разбирает дату рождения, пол и век', () => {
    const parsed = parseIin(VALID_IIN);
    expect(parsed).not.toBeNull();
    expect(parsed!.gender).toBe('male');
    expect(parsed!.century).toBe(20);
    expect(parsed!.birthDate.getFullYear()).toBe(1990);
    expect(parsed!.birthDate.getMonth()).toBe(0);
    expect(parsed!.birthDate.getDate()).toBe(1);
  });

  it('возвращает null для невалидного ИИН', () => {
    expect(parseIin('000000000000')).toBeNull();
  });
});
