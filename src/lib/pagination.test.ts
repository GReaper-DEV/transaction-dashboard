import { describe, expect, it } from 'vitest'
import { paginate } from './pagination'

const items = Array.from({ length: 23 }, (_, i) => i + 1) // 1..23

describe('paginate', () => {
  it('returns the requested page and its range', () => {
    const result = paginate(items, 2, 10)
    expect(result.items).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(result).toMatchObject({ page: 2, totalPages: 3, totalItems: 23, from: 11, to: 20 })
  })

  it('returns a shorter last page', () => {
    const result = paginate(items, 3, 10)
    expect(result.items).toEqual([21, 22, 23])
    expect(result).toMatchObject({ from: 21, to: 23 })
  })

  it('clamps a page that no longer exists to the last page', () => {
    expect(paginate(items, 9, 10).page).toBe(3)
    expect(paginate(items, 0, 10).page).toBe(1)
  })

  it('handles an empty list', () => {
    expect(paginate([], 1, 10)).toMatchObject({ items: [], page: 1, totalPages: 1, from: 0, to: 0 })
  })
})
