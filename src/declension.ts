/**
 * Склонение казахских существительных и имён по 7 падежам (септік).
 *
 * Учитывается сингармонизм (жуан/жіңішке — задний/передний ряд) и характер
 * последнего звука основы (гласный, звонкий, глухой, носовой).
 *
 * Покрывает регулярные случаи. Слова с притяжательными аффиксами и отдельные
 * исключения могут склоняться иначе.
 */

export type Case =
  | 'nominative' // атау
  | 'genitive' // ілік
  | 'dative' // барыс
  | 'accusative' // табыс
  | 'locative' // жатыс
  | 'ablative' // шығыс
  | 'instrumental'; // көмектес

export type Declension = Record<Case, string>;

const BACK_VOWELS = new Set(['а', 'о', 'ұ', 'ы', 'у', 'я']);
const FRONT_VOWELS = new Set(['ә', 'ө', 'ү', 'і', 'е', 'и', 'э']);
const VOWELS = new Set([...BACK_VOWELS, ...FRONT_VOWELS]);

const NASALS = new Set(['м', 'н', 'ң']);
const VOICELESS = new Set(['к', 'қ', 'п', 'с', 'т', 'ф', 'х', 'һ', 'ц', 'ч', 'ш', 'щ']);
const VOICED_STOPS = new Set(['б', 'в', 'г', 'ғ', 'д']);

type EndType = 'vowel' | 'nasal' | 'voiceless' | 'voiced';

/** Определяет передний (front) или задний (back) ряд по последнему гласному. */
function isFront(word: string): boolean {
  const lower = word.toLowerCase();
  for (let i = lower.length - 1; i >= 0; i--) {
    if (VOWELS.has(lower[i])) return FRONT_VOWELS.has(lower[i]);
  }
  return true; // по умолчанию — передний ряд
}

function endType(word: string): EndType {
  const last = word.toLowerCase().slice(-1);
  if (VOWELS.has(last)) return 'vowel';
  if (NASALS.has(last)) return 'nasal';
  if (VOICELESS.has(last)) return 'voiceless';
  return 'voiced';
}

/** Выбирает вариант окончания по ряду: [задний, передний]. */
function harmonize(word: string, back: string, front: string): string {
  return isFront(word) ? front : back;
}

function genitive(word: string, end: EndType): string {
  if (end === 'vowel' || end === 'nasal') return harmonize(word, 'ның', 'нің');
  if (end === 'voiceless') return harmonize(word, 'тың', 'тің');
  return harmonize(word, 'дың', 'дің');
}

function dative(word: string, end: EndType): string {
  if (end === 'voiceless') return harmonize(word, 'қа', 'ке');
  return harmonize(word, 'ға', 'ге');
}

function accusative(word: string, end: EndType): string {
  if (end === 'vowel') return harmonize(word, 'ны', 'ні');
  if (end === 'voiceless') return harmonize(word, 'ты', 'ті');
  return harmonize(word, 'ды', 'ді');
}

function locative(word: string, end: EndType): string {
  if (end === 'voiceless') return harmonize(word, 'та', 'те');
  return harmonize(word, 'да', 'де');
}

function ablative(word: string, end: EndType): string {
  if (end === 'nasal') return harmonize(word, 'нан', 'нен');
  if (end === 'voiceless') return harmonize(word, 'тан', 'тен');
  return harmonize(word, 'дан', 'ден');
}

function instrumental(word: string, end: EndType): string {
  // Көмектес не подчиняется сингармонизму (всегда -мен/-бен/-пен).
  if (end === 'voiceless') return 'пен';
  if (VOICED_STOPS.has(word.toLowerCase().slice(-1))) return 'бен';
  return 'мен';
}

/**
 * Возвращает форму слова в указанном падеже.
 */
export function inCase(word: string, grammaticalCase: Case): string {
  if (grammaticalCase === 'nominative') return word;
  const end = endType(word);
  const suffixes: Record<Exclude<Case, 'nominative'>, () => string> = {
    genitive: () => genitive(word, end),
    dative: () => dative(word, end),
    accusative: () => accusative(word, end),
    locative: () => locative(word, end),
    ablative: () => ablative(word, end),
    instrumental: () => instrumental(word, end),
  };
  return word + suffixes[grammaticalCase]();
}

/**
 * Возвращает все 7 падежных форм слова.
 */
export function decline(word: string): Declension {
  return {
    nominative: word,
    genitive: inCase(word, 'genitive'),
    dative: inCase(word, 'dative'),
    accusative: inCase(word, 'accusative'),
    locative: inCase(word, 'locative'),
    ablative: inCase(word, 'ablative'),
    instrumental: inCase(word, 'instrumental'),
  };
}
