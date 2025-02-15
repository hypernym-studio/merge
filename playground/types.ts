import type { Merge } from '@/types'

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

export type Result = Merge<[A, B, C, D]>

export type ResultRules = Merge<
  [A, B, C, D],
  { rules: { array: 'override'; undefined: 'skip'; null: 'skip' } }
>
