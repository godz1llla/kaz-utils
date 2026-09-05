/**
 * Телефонные номера Казахстана.
 *
 * Формат: +7 XXX XXX XX XX (код страны 7, далее 10 цифр).
 * Мобильные распознаются по коду оператора (первые 3 цифры после кода страны).
 */

/**
 * Известные мобильные коды операторов РК (Beeline, Kcell/Activ, Tele2/Altel и др.).
 * Городские коды (727 — Алматы, 7172 — Астана) сюда не входят.
 */
export const MOBILE_PREFIXES = new Set([
  '700', '701', '702', '705', '706', '707', '708',
  '747',
  '750', '751',
  '760', '761', '762', '763', '764',
  '771', '775', '776', '777', '778',
]);

/**
 * Приводит номер к 11 цифрам, начинающимся с 7.
 * Понимает форматы: +7..., 8..., 7..., 10 цифр без кода.
 * Возвращает null, если номер не похож на казахстанский.
 */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');

  let normalized: string;
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    normalized = '7' + digits.slice(1);
  } else if (digits.length === 10) {
    normalized = '7' + digits;
  } else {
    return null;
  }

  return normalized;
}

/**
 * Проверяет, что строка — валидный казахстанский номер.
 */
export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

/**
 * Проверяет, что это мобильный номер (по коду оператора).
 */
export function isMobilePhone(input: string): boolean {
  const n = normalizePhone(input);
  return n !== null && MOBILE_PREFIXES.has(n.slice(1, 4));
}

/**
 * Форматирует номер как +7 (7XX) XXX-XX-XX.
 * Возвращает null для невалидного номера.
 */
export function formatPhone(input: string): string | null {
  const n = normalizePhone(input);
  if (n === null) return null;
  const a = n.slice(1, 4);
  const b = n.slice(4, 7);
  const c = n.slice(7, 9);
  const d = n.slice(9, 11);
  return `+7 (${a}) ${b}-${c}-${d}`;
}
