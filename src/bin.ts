import { isValidChecksum } from './iin';

/**
 * БИН (Бизнес-идентификационный номер) — 12 цифр.
 *
 * Структура:
 *   YYMM | T | F | SSSSS | K
 *   1-4    : год и месяц регистрации
 *   5      : тип юр. лица (4 — резидент, 5 — нерезидент, 6 — ИП/прочее)
 *   6      : признак (0 — головное, 1-3 — филиал/подразделение)
 *   7-11   : порядковый номер
 *   12     : контрольная цифра
 */

export type EntityType = 'resident' | 'non-resident' | 'other';

export interface ParsedBin {
  /** Год регистрации (две последние цифры). */
  year: number;
  /** Месяц регистрации (1-12). */
  month: number;
  entityType: EntityType;
  /** true, если это головная организация (признак = 0). */
  isHeadUnit: boolean;
}

const ENTITY_TYPES: Record<number, EntityType> = {
  4: 'resident',
  5: 'non-resident',
  6: 'other',
};

/**
 * Проверяет, что строка — корректный БИН (формат, поля, контрольная сумма).
 */
export function isValidBin(value: string): boolean {
  return parseBin(value) !== null;
}

/**
 * Разбирает БИН. Возвращает null, если БИН невалиден.
 */
export function parseBin(value: string): ParsedBin | null {
  if (!/^\d{12}$/.test(value)) return null;

  const month = Number(value.slice(2, 4));
  if (month < 1 || month > 12) return null;

  const typeDigit = Number(value[4]);
  const entityType = ENTITY_TYPES[typeDigit];
  if (!entityType) return null;

  const featureDigit = Number(value[5]);
  if (featureDigit > 3) return null;

  if (!isValidChecksum(value)) return null;

  return {
    year: Number(value.slice(0, 2)),
    month,
    entityType,
    isHeadUnit: featureDigit === 0,
  };
}
