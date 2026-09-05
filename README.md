# kaz-utils

> 🇰🇿 Утилиты для казахстанского контекста: валидация **ИИН/БИН**, транслитерация **кириллица↔латиница**, **склонение** имён по падежам и работа с **телефонами РК**.

Zero-dependency, TypeScript, ESM + CommonJS. То, что каждый KZ-разработчик пишет заново из проекта в проект — собрано в одну типизированную библиотеку.

```bash
npm install kaz-utils
```

## Возможности

- ✅ **ИИН/БИН** — валидация по контрольной сумме + разбор (дата рождения, пол, тип юр. лица)
- 🔤 **Транслитерация** — казахская кириллица ↔ латиница (стандарт 2021)
- 📝 **Склонение** — 7 падежей с сингармонизмом
- 📞 **Телефоны** — нормализация, валидация, определение мобильного, форматирование

---

## ИИН / БИН

```ts
import { isValidIin, parseIin, isValidBin, parseBin } from 'kaz-utils';

isValidIin('900101301233'); // true

parseIin('900101301233');
// { birthDate: 1990-01-01, gender: 'male', century: 20 }

isValidBin('050440012343'); // true

parseBin('050440012343');
// { year: 5, month: 4, entityType: 'resident', isHeadUnit: true }
```

## Транслитерация

```ts
import { toLatin, toCyrillic } from 'kaz-utils';

toLatin('Қазақстан');   // 'Qazaqstan'
toLatin('Нұрсұлтан');   // 'Nūrsūltan'
toLatin('Шымкент');     // 'Şımkent'

toCyrillic('qazaqstan'); // 'қазақстан'
```

Своя таблица соответствий:

```ts
import { toLatin, CYR_TO_LAT } from 'kaz-utils';
toLatin('текст', { ...CYR_TO_LAT, /* переопределения */ });
```

> ℹ️ За основу взят латинский алфавит 2021 года. Обратная транслитерация (`toCyrillic`) лоссовая из-за неоднозначности.

## Склонение

```ts
import { decline, inCase } from 'kaz-utils';

decline('Алматы');
// {
//   nominative:   'Алматы',
//   genitive:     'Алматының',
//   dative:       'Алматыға',
//   accusative:   'Алматыны',
//   locative:     'Алматыда',
//   ablative:     'Алматыдан',
//   instrumental: 'Алматымен',
// }

inCase('Айгерім', 'dative'); // 'Айгерімге'
```

> ℹ️ Покрывает регулярные существительные и имена. Слова с притяжательными аффиксами и исключения могут склоняться иначе.

## Телефоны

```ts
import { normalizePhone, isValidPhone, isMobilePhone, formatPhone } from 'kaz-utils';

normalizePhone('8 (701) 234-56-78'); // '77012345678'
isValidPhone('+7 701 234 56 78');    // true
isMobilePhone('+7 701 234 56 78');   // true
isMobilePhone('+7 727 250 00 00');   // false (городской, Алматы)
formatPhone('87012345678');          // '+7 (701) 234-56-78'
```

---

## API

| Функция | Описание |
|---|---|
| `isValidIin(s)` / `parseIin(s)` | Валидация / разбор ИИН |
| `isValidBin(s)` / `parseBin(s)` | Валидация / разбор БИН |
| `isValidChecksum(s)` | Проверка контрольной суммы (12 цифр) |
| `toLatin(s, map?)` / `toCyrillic(s, map?)` | Транслитерация |
| `decline(word)` / `inCase(word, case)` | Склонение |
| `normalizePhone` / `isValidPhone` / `isMobilePhone` / `formatPhone` | Телефоны |

## Разработка

```bash
npm install
npm test        # vitest
npm run build   # tsup → ESM + CJS + .d.ts
```

## Лицензия

[MIT](LICENSE)
