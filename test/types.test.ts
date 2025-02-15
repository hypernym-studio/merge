import type { Merge } from '@/types'
import { describe, test, expectTypeOf } from 'vitest'

describe('Merge Types', () => {
  type A = {
    a: boolean
    b: {
      c: {
        d: number[]
      }
      e: {
        f: boolean
      }
    }
  }

  type B = {
    a: string
    b: {
      c: {
        d?: string[]
      }
      e: {
        f: {
          g: number
        }
      }
      h?: number[]
    }
  }

  type C = {
    i: {
      j: number
      k: number
    }
  }

  type D = {
    i: {
      j?: undefined
      k?: null
    }
  }

  test('should create a merged interface', () => {
    type Result = Merge<[A, B, C, D]>

    expectTypeOf<Result>().toEqualTypeOf<{
      a: string
      b: {
        c: {
          d: (string | number)[] | undefined
        }
        e: {
          f: {
            g: number
          }
        }
        h: number[] | undefined
      }
      i: {
        j: undefined
        k: null | undefined
      }
    }>()
  })

  test('should create a merged interface with custom rules', () => {
    type ResultRules = Merge<
      [A, B, C, D],
      {
        rules: { array: 'override'; undefined: 'skip'; null: 'skip' }
      }
    >

    expectTypeOf<ResultRules>().toEqualTypeOf<{
      a: string
      b: {
        c: {
          d: string[]
        }
        e: {
          f: {
            g: number
          }
        }
        h: number[]
      }
      i: {
        j: number
        k: number
      }
    }>()
  })
})
