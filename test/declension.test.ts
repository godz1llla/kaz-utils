import { describe, it, expect } from 'vitest';
import { decline, inCase } from '../src/declension';

describe('decline', () => {
  it('склоняет слово на гласный, задний ряд (Алматы)', () => {
    expect(decline('Алматы')).toEqual({
      nominative: 'Алматы',
      genitive: 'Алматының',
      dative: 'Алматыға',
      accusative: 'Алматыны',
      locative: 'Алматыда',
      ablative: 'Алматыдан',
      instrumental: 'Алматымен',
    });
  });

  it('склоняет слово на носовой, задний ряд (Нұрсұлтан)', () => {
    expect(decline('Нұрсұлтан')).toEqual({
      nominative: 'Нұрсұлтан',
      genitive: 'Нұрсұлтанның',
      dative: 'Нұрсұлтанға',
      accusative: 'Нұрсұлтанды',
      locative: 'Нұрсұлтанда',
      ablative: 'Нұрсұлтаннан',
      instrumental: 'Нұрсұлтанмен',
    });
  });

  it('склоняет слово на глухой согласный, задний ряд (Асхат)', () => {
    expect(decline('Асхат')).toEqual({
      nominative: 'Асхат',
      genitive: 'Асхаттың',
      dative: 'Асхатқа',
      accusative: 'Асхатты',
      locative: 'Асхатта',
      ablative: 'Асхаттан',
      instrumental: 'Асхатпен',
    });
  });

  it('склоняет слово переднего ряда (Айгерім)', () => {
    expect(decline('Айгерім')).toEqual({
      nominative: 'Айгерім',
      genitive: 'Айгерімнің',
      dative: 'Айгерімге',
      accusative: 'Айгерімді',
      locative: 'Айгерімде',
      ablative: 'Айгерімнен',
      instrumental: 'Айгеріммен',
    });
  });
});

describe('inCase', () => {
  it('возвращает конкретный падеж', () => {
    expect(inCase('Алматы', 'dative')).toBe('Алматыға');
    expect(inCase('Алматы', 'nominative')).toBe('Алматы');
  });
});
