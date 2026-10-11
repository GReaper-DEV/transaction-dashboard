import type { Money } from '../types'

const LOCALE = 'en-IE'

/** How many decimals a currency uses: EUR → 2, JPY → 0. Taken from Intl, not hard-coded. */
function fractionDigits(currency: string): number {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
}

/** Minor units → decimal number, e.g. 4523 EUR → 45.23, 8990 JPY → 8990. */
export function toMajorUnits(money: Money): number {
  return money.minor / 10 ** fractionDigits(money.currency)
}

/**
 * Formats money for display, e.g. "€4,823.17", "JP¥8,990", "US$129.99".
 * With `showSign`, positive amounts get a "+" and negative ones a "-".
 */
export function formatMoney(money: Money, { showSign = false } = {}): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: money.currency,
    signDisplay: showSign ? 'exceptZero' : 'auto',
  }).format(toMajorUnits(money))
}
