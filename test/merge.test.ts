import { merge } from '@'
import { describe, test, expect } from 'vitest'

describe('Merge', () => {
  const A = {
    a: true,
    b: {
      c: {
        d: [1, 2, 3],
      },
      e: {
        f: true,
      },
    },
  }
  const B = {
    a: 'merge',
    b: {
      c: {
        d: ['4', '5', '6'],
      },
      e: {
        f: {
          g: 33,
        },
      },
      h: [23, 33],
    },
  }
  const C = {
    i: {
      j: 77,
      k: 99,
    },
  }
  const D = {
    i: {
      j: undefined,
      k: null,
    },
  }

  test('should create a merged object', () => {
    const result = merge([A, B, C, D])

    expect(result).toStrictEqual({
      a: 'merge',
      b: {
        c: { d: [1, 2, 3, '4', '5', '6'] },
        e: { f: { g: 33 } },
        h: [23, 33],
      },
      i: { j: undefined, k: null },
    })
  })

  test('should create a merged object with custom rules', () => {
    const resultRules = merge([A, B, C, D], {
      rules: { array: 'override', undefined: 'skip', null: 'skip' },
    })

    expect(resultRules).toStrictEqual({
      a: 'merge',
      b: { c: { d: ['4', '5', '6'] }, e: { f: { g: 33 } }, h: [23, 33] },
      i: { j: 77, k: 99 },
    })
  })
})
