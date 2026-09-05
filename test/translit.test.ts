import { describe, it, expect } from 'vitest';
import { toLatin, toCyrillic } from '../src/translit';

describe('toLatin', () => {
  it('транслитерирует характерные казахские буквы', () => {
    expect(toLatin('Қазақстан')).toBe('Qazaqstan');
    expect(toLatin('Шымкент')).toBe('Şımkent');
    expect(toLatin('Нұрсұлтан')).toBe('Nūrsūltan');
    expect(toLatin('Әбіш')).toBe('Äbiş');
  });

  it('сохраняет пробелы и незнакомые символы', () => {
    expect(toLatin('Астана 2024')).toBe('Astana 2024');
  });
});

describe('toCyrillic', () => {
  it('восстанавливает однозначные слова', () => {
    expect(toCyrillic('qazaqstan')).toBe('қазақстан');
  });

  it('обрабатывает диграфы (Ş → ш)', () => {
    expect(toCyrillic('şımkent')).toBe('шымкент');
  });
});
