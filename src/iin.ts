/**
 * ИИН (Индивидуальный идентификационный номер) — 12 цифр.
 *
 * Структура:
 *   YYMMDD | C | SSSS | K
 *   1-6    : дата рождения (год, месяц, день)
 *   7      : век + пол (1/2 — XIX в., 3/4 — XX в., 5/6 — XXI в.; нечётные — муж., чётные — жен.)
 *   8-11   : порядковый номер
 *   12     : контрольная цифра
 */

const WEIGHTS_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const WEIGHTS_2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];

/**
 * Проверяет контрольную цифру 12-значного ИИН/БИН.
 * Алгоритм одинаков для ИИН и БИН.
 */
export function isValidChecksum(value: string): boolean {
  if (!/^\d{12}$/.test(value)) return false;
  const digits = value.split('').map(Number);

  let sum = 0;
  for (let i = 0; i < 11; i++) sum += digits[i] * WEIGHTS_1[i];
  let control = sum % 11;

  if (control === 10) {
    sum = 0;
    for (let i = 0; i < 11; i++) sum += digits[i] * WEIGHTS_2[i];
    control = sum % 11;
    // Если и вторая свёртка даёт 10 — номер невалиден.
    if (control === 10) return false;
  }

  return control === digits[11];
}

export type Gender = 'male' | 'female';

export interface ParsedIin {
  birthDate: Date;
  gender: Gender;
  /** Век рождения: 19, 20 или 21. */
  century: number;
}

function birthCentury(genderDigit: number): number | null {
  switch (genderDigit) {
    case 1:
    case 2:
      return 19;
    case 3:
    case 4:
      return 20;
    case 5:
    case 6:
      return 21;
    default:
      return null;
  }
}

/**
 * Проверяет, что строка — корректный ИИН (формат, дата, контрольная сумма).
 */
export function isValidIin(value: string): boolean {
  return parseIin(value) !== null;
}

/**
 * Разбирает ИИН на дату рождения, пол и век.
 * Возвращает null, если ИИН невалиден.
 */
export function parseIin(value: string): ParsedIin | null {
  if (!/^\d{12}$/.test(value)) return null;

  const yy = Number(value.slice(0, 2));
  const mm = Number(value.slice(2, 4));
  const dd = Number(value.slice(4, 6));
  const genderDigit = Number(value[6]);

  const century = birthCentury(genderDigit);
  if (century === null) return null;

  const fullYear = (century - 1) * 100 + yy;
  const date = new Date(fullYear, mm - 1, dd);

  // Проверяем, что дата реальна (напр. 31 февраля не пройдёт).
  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null;
  }

  if (!isValidChecksum(value)) return null;

  return {
    birthDate: date,
    gender: genderDigit % 2 === 1 ? 'male' : 'female',
    century,
  };
}
