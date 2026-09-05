/**
 * Транслитерация казахского текста между кириллицей и латиницей.
 *
 * За основу взят латинский алфавит образца 2021 года (умлауты и диакритика:
 * Ә→Ä, Ғ→Ğ, Қ→Q, Ң→Ñ, Ө→Ö, Ұ→Ū, Ү→Ü, Ш→Ş, Ч→Ç, Ы→I/ı, І→İ/i).
 *
 * Таблица вынесена в CYR_TO_LAT — при необходимости её можно переопределить
 * через параметр `map` функций transliterate*.
 */

export type TranslitMap = Record<string, string>;

/** Кириллица → латиница (2021). Пары регистров заданы явно. */
export const CYR_TO_LAT: TranslitMap = {
  А: 'A', а: 'a',
  Ә: 'Ä', ә: 'ä',
  Б: 'B', б: 'b',
  В: 'V', в: 'v',
  Г: 'G', г: 'g',
  Ғ: 'Ğ', ғ: 'ğ',
  Д: 'D', д: 'd',
  Е: 'E', е: 'e',
  Ж: 'J', ж: 'j',
  З: 'Z', з: 'z',
  И: 'I', и: 'i',
  Й: 'Y', й: 'y',
  К: 'K', к: 'k',
  Қ: 'Q', қ: 'q',
  Л: 'L', л: 'l',
  М: 'M', м: 'm',
  Н: 'N', н: 'n',
  Ң: 'Ñ', ң: 'ñ',
  О: 'O', о: 'o',
  Ө: 'Ö', ө: 'ö',
  П: 'P', п: 'p',
  Р: 'R', р: 'r',
  С: 'S', с: 's',
  Т: 'T', т: 't',
  У: 'U', у: 'u',
  Ұ: 'Ū', ұ: 'ū',
  Ү: 'Ü', ү: 'ü',
  Ф: 'F', ф: 'f',
  Х: 'H', х: 'h',
  Һ: 'H', һ: 'h',
  Ц: 'Ts', ц: 'ts',
  Ч: 'Ç', ч: 'ç',
  Ш: 'Ş', ш: 'ş',
  Щ: 'Şş', щ: 'şş',
  Ъ: '', ъ: '',
  Ы: 'I', ы: 'ı',
  І: 'İ', і: 'i',
  Ь: '', ь: '',
  Э: 'E', э: 'e',
  Ю: 'Iu', ю: 'iu',
  Я: 'Ia', я: 'ia',
  Ё: 'Io', ё: 'io',
};

function invertMap(map: TranslitMap): TranslitMap {
  const inverted: TranslitMap = {};
  // Более длинные латинские последовательности должны иметь приоритет при
  // обратном разборе — но т.к. обратная транслитерация неоднозначна,
  // берём первое встретившееся соответствие.
  for (const [cyr, lat] of Object.entries(map)) {
    if (lat === '') continue;
    if (!(lat in inverted)) inverted[lat] = cyr;
  }
  return inverted;
}

/** Латиница → кириллица (обратная таблица; преобразование лоссовое). */
export const LAT_TO_CYR: TranslitMap = invertMap(CYR_TO_LAT);

/**
 * Кириллица → латиница.
 */
export function toLatin(text: string, map: TranslitMap = CYR_TO_LAT): string {
  let result = '';
  for (const ch of text) {
    result += ch in map ? map[ch] : ch;
  }
  return result;
}

/**
 * Латиница → кириллица (лоссово: диграфы Ts/Iu/Ia и совпадающие буквы
 * восстанавливаются приблизительно).
 */
export function toCyrillic(text: string, map: TranslitMap = LAT_TO_CYR): string {
  // Сортируем ключи по убыванию длины, чтобы диграфы (Şş, Ts, Iu…) шли первыми.
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);

  let result = '';
  let i = 0;
  outer: while (i < text.length) {
    for (const key of keys) {
      if (text.startsWith(key, i)) {
        result += map[key];
        i += key.length;
        continue outer;
      }
    }
    result += text[i];
    i += 1;
  }
  return result;
}
