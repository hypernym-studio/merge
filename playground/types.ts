import type { Merge } from '@/types'

type A1 = {
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

type B1 = {
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

type C1 = {
  i: {
    j: number
    k: number
  }
}

type D1 = {
  i: {
    j?: undefined
    k?: null
  }
}

export type ResultDefault = Merge<[A1, B1, C1, D1]>

export type ResultRules = Merge<
  [A1, B1, C1, D1],
  {
    rules: { array: 'override'; undefined: 'skip'; null: 'skip' }
  }
>

type A2 = {
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

type B2 = {
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

type C2 = {
  i?: string | null
}

export type ResultDepth0 = Merge<[A2, B2, C2], { depth: 0 }>

export type ResultDepth1 = Merge<[A2, B2, C2], { depth: 1 }>
