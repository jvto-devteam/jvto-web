/**
 * Money contract (handoff §7.1). Minor units in bigint to avoid float drift.
 * Milestone 1 — pure value type + total-safe helpers; no I/O, no rounding surprises.
 */
import type { Currency } from "./ids";

export interface Money {
  currency: Currency;
  amountMinor: bigint;
}

export const money = (currency: Currency, amountMinor: bigint | number): Money => ({
  currency,
  amountMinor: typeof amountMinor === "bigint" ? amountMinor : BigInt(Math.round(amountMinor)),
});

export const zero = (currency: Currency): Money => ({ currency, amountMinor: BigInt(0) });

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new TypeError(`currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { currency: a.currency, amountMinor: a.amountMinor + b.amountMinor };
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { currency: a.currency, amountMinor: a.amountMinor - b.amountMinor };
}

/** Sum a list; empty list requires an explicit currency. */
export function sumMoney(items: Money[], currencyIfEmpty?: Currency): Money {
  if (items.length === 0) {
    if (!currencyIfEmpty) throw new TypeError("sumMoney of empty list needs a currency");
    return zero(currencyIfEmpty);
  }
  return items.reduce((acc, m) => addMoney(acc, m));
}

export const isNegative = (m: Money): boolean => m.amountMinor < BigInt(0);
export const equalsMoney = (a: Money, b: Money): boolean =>
  a.currency === b.currency && a.amountMinor === b.amountMinor;
