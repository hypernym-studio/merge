import type { Merge } from '@/types'
import { describe, test, expectTypeOf } from 'vitest'

describe('Merge Types', () => {
  test('should override values correctly', () => {
    type A = {
      a: string
      b: number
      c: boolean
      d: bigint
      e: symbol
      f: Date
      g: () => void
      h: boolean[]
      i: {
        j: string
        k: boolean
        l: number
      }
    }

    type B = {
      a: boolean
      b: string
      c: number
      d: Date
      e: () => void
      f: symbol
      g: bigint
      h: object
      i: string[]
    }

    type Result = Merge<[A, B]>

    expectTypeOf<Result>().toEqualTypeOf<B>()
  })

  test('should deeply override values correctly', () => {
    type A = {
      o: {
        o: {
          a: string
          b: number
          c?: boolean
          d: bigint
          e?: symbol
          f: Date
          g: () => void
          h?: boolean[]
          i: {
            j: string
            k: boolean
            l: number
          }
        }
      }
    }

    type B = {
      o: {
        o: {
          a: boolean
          b?: string
          c: number
          d: Date
          e?: () => void
          f?: symbol
          g: bigint
          h: object
          i?: string[]
        }
      }
    }

    type Result = Merge<[A, B]>

    expectTypeOf<Result>().toEqualTypeOf<{
      o: {
        o: {
          a: boolean
          b: string | undefined
          c: number
          d: Date
          e: (() => void) | undefined
          f: symbol | undefined
          g: bigint
          h: object
          i: string[] | undefined
        }
      }
    }>()
  })

  test('should handle undefined and null correctly', () => {
    type A = {
      a?: string
      b?: number
      c: {
        d?: boolean[]
        e?: string
      }
      f: string[]
    }

    type B = {
      a?: undefined
      b?: null
    }

    type C = {
      c: undefined
      f: null
    }

    type Result = Merge<[A, B, C]>

    expectTypeOf<Result>().toEqualTypeOf<{
      a: undefined
      b: null | undefined
      c: undefined
      f: null
    }>()

    type ResultUndefinedSkip = Merge<
      [A, B, C],
      { rules: { undefined: 'skip' } }
    >

    expectTypeOf<ResultUndefinedSkip>().toEqualTypeOf<{
      a: string
      b: null
      c: {
        d: boolean[]
        e: string
      }
      f: null
    }>()

    type ResultNullSkip = Merge<[A, B, C], { rules: { null: 'skip' } }>

    expectTypeOf<ResultNullSkip>().toEqualTypeOf<{
      a: undefined
      b: undefined
      c: undefined
      f: string[]
    }>()
  })

  test('should handle arrays correctly', () => {
    type A = {
      a?: string[]
      b: (number | null | undefined)[]
      c: undefined[]
      d: null[]
      e?: boolean[]
    }

    type B = {
      a?: (number | boolean)[]
      b?: string[]
      c?: boolean[]
      d: (object | Date)[]
      e?: symbol[]
    }

    type ResultCombine = Merge<[A, B], { rules: { array: 'combine' } }>

    expectTypeOf<ResultCombine>().toEqualTypeOf<{
      a: (string | number | boolean)[] | undefined
      b: (string | number | null | undefined)[] | undefined
      c: (boolean | undefined)[] | undefined
      d: (object | Date | null)[]
      e: (boolean | symbol)[] | undefined
    }>()

    type ResultCombineSkip = Merge<
      [A, B],
      { rules: { array: 'combine'; undefined: 'skip'; null: 'skip' } }
    >

    expectTypeOf<ResultCombineSkip>().toEqualTypeOf<{
      a: (string | number | boolean)[]
      b: (string | number | null | undefined)[]
      c: (boolean | undefined)[]
      d: (object | Date | null)[]
      e: (boolean | symbol)[]
    }>()

    type ResultOverride = Merge<[A, B], { rules: { array: 'override' } }>

    expectTypeOf<ResultOverride>().toEqualTypeOf<{
      a: (number | boolean)[] | undefined
      b: string[] | undefined
      c: boolean[] | undefined
      d: (object | Date)[]
      e: symbol[] | undefined
    }>()

    type ResultOverrideSkip = Merge<
      [A, B],
      { rules: { array: 'override'; undefined: 'skip'; null: 'skip' } }
    >

    expectTypeOf<ResultOverrideSkip>().toEqualTypeOf<{
      a: (number | boolean)[]
      b: string[]
      c: boolean[]
      d: (object | Date)[]
      e: symbol[]
    }>()
  })

  test('should deeply handle arrays correctly', () => {
    type A = {
      o: {
        o: {
          a?: string[]
          b: (number | null | undefined)[]
          c: undefined[]
          d: null[]
          e?: boolean[]
        }
      }
    }

    type B = {
      o: {
        o: {
          a?: (number | boolean)[]
          b?: string[]
          c?: boolean[]
          d: (object | Date)[]
          e?: symbol[]
        }
      }
    }

    type ResultCombine = Merge<[A, B], { rules: { array: 'combine' } }>

    expectTypeOf<ResultCombine>().toEqualTypeOf<{
      o: {
        o: {
          a: (string | number | boolean)[] | undefined
          b: (string | number | null | undefined)[] | undefined
          c: (boolean | undefined)[] | undefined
          d: (object | Date | null)[]
          e: (boolean | symbol)[] | undefined
        }
      }
    }>()

    type ResultCombineSkip = Merge<
      [A, B],
      { rules: { array: 'combine'; undefined: 'skip'; null: 'skip' } }
    >

    expectTypeOf<ResultCombineSkip>().toEqualTypeOf<{
      o: {
        o: {
          a: (string | number | boolean)[]
          b: (string | number | null | undefined)[]
          c: (boolean | undefined)[]
          d: (object | Date | null)[]
          e: (boolean | symbol)[]
        }
      }
    }>()

    type ResultOverride = Merge<[A, B], { rules: { array: 'override' } }>

    expectTypeOf<ResultOverride>().toEqualTypeOf<{
      o: {
        o: {
          a: (number | boolean)[] | undefined
          b: string[] | undefined
          c: boolean[] | undefined
          d: (object | Date)[]
          e: symbol[] | undefined
        }
      }
    }>()

    type ResultOverrideSkip = Merge<
      [A, B],
      { rules: { array: 'override'; undefined: 'skip'; null: 'skip' } }
    >

    expectTypeOf<ResultOverrideSkip>().toEqualTypeOf<{
      o: {
        o: {
          a: (number | boolean)[]
          b: string[]
          c: boolean[]
          d: (object | Date)[]
          e: symbol[]
        }
      }
    }>()
  })

  test('should create a deep merged interface', () => {
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

    type Result = Merge<
      [A, B, C, D],
      {
        rules: { array: 'override'; undefined: 'skip'; null: 'skip' }
      }
    >

    expectTypeOf<Result>().toEqualTypeOf<{
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

  test('should handle depth correctly', () => {
    type A = {
      a: boolean[]
      b: {
        c: {
          d: string
          e: {
            f: number
          }
        }
      }
      d: boolean
      e: {
        f: string
        g: number[]
      }
    }

    type B = {
      a?: string[]
      b: {
        a: number
      }
      d: number
      e: {
        f: number[]
        g?: string
      }
    }

    type C = {
      i?: string | null
    }

    type ResultDepth0 = Merge<[A, B, C], { depth: 0 }>

    expectTypeOf<ResultDepth0>().toEqualTypeOf<{
      a: string[] | undefined
      b: unknown
      d: number
      e: unknown
      i: string | null | undefined
    }>()

    type ResultDepth1 = Merge<[A, B, C], { depth: 1 }>

    expectTypeOf<ResultDepth1>().toEqualTypeOf<{
      a: (string | boolean)[] | undefined
      b: {
        a: number
        c: unknown
      }
      d: number
      e: {
        f: number[]
        g: string | undefined
      }
      i: string | null | undefined
    }>()

    type ResultDepth2 = Merge<[A, B, C], { depth: 2 }>

    expectTypeOf<ResultDepth2>().toEqualTypeOf<{
      a: (string | boolean)[] | undefined
      b: {
        a: number
        c: {
          d: string
          e: unknown
        }
      }
      i: string | null | undefined
      d: number
      e: {
        f: number[]
        g: string | undefined
      }
    }>()

    type ResultDepth3 = Merge<[A, B, C], { depth: 3 }>

    expectTypeOf<ResultDepth3>().toEqualTypeOf<{
      a: (string | boolean)[] | undefined
      b: {
        a: number
        c: {
          d: string
          e: {
            f: number
          }
        }
      }
      i: string | null | undefined
      d: number
      e: {
        f: number[]
        g: string | undefined
      }
    }>()
  })
})
