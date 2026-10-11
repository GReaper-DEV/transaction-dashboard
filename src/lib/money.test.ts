import { describe, expect, it } from 'vitest'
import { formatMoney, toMajorUnits } from './money'

describe('money', () => {
  it('uses the right number of decimals for each currency', () => {
    expect(toMajorUnits({ minor: 4523, currency: 'EUR' })).toBe(45.23)
    expect(toMajorUnits({ minor: 8990, currency: 'JPY' })).toBe(8990) // yen have no decimals
  })

  it('formats amounts with their currency', () => {
    expect(formatMoney({ minor: 482317, currency: 'EUR' })).toBe('€4,823.17')
    expect(formatMoney({ minor: 8990, currency: 'JPY' })).toBe('JP¥8,990')
    expect(formatMoney({ minor: 12999, currency: 'USD' })).toBe('US$129.99')
  })

  it('shows a sign for credits and debits when asked', () => {
    expect(formatMoney({ minor: 3550, currency: 'EUR' }, { showSign: true })).toBe('+€35.50')
    expect(formatMoney({ minor: -3550, currency: 'EUR' }, { showSign: true })).toBe('-€35.50')
  })
})
