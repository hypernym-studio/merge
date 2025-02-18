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

  test('should handle depth correctly', () => {
    const resultDepth0 = merge([A, B, C, D], { depth: 0 })

    expect(resultDepth0).toStrictEqual({
      a: 'merge',
      b: {},
      i: {},
    })

    const resultDepth1 = merge([A, B, C, D], { depth: 1 })

    expect(resultDepth1).toStrictEqual({
      a: 'merge',
      b: { c: {}, e: {}, h: [23, 33] },
      i: { j: undefined, k: null },
    })

    const resultDepth2 = merge([A, B, C, D], { depth: 2 })

    expect(resultDepth2).toStrictEqual({
      a: 'merge',
      b: {
        c: { d: [1, 2, 3, '4', '5', '6'] },
        e: { f: {} },
        h: [23, 33],
      },
      i: { j: undefined, k: null },
    })

    const resultDepth3 = merge([A, B, C, D], { depth: 3 })

    expect(resultDepth3).toStrictEqual({
      a: 'merge',
      b: {
        c: { d: [1, 2, 3, '4', '5', '6'] },
        e: { f: { g: 33 } },
        h: [23, 33],
      },
      i: { j: undefined, k: null },
    })
  })
})
