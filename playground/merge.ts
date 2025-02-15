import { merge } from '@'
import { inspect } from 'node:util'

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

const result = merge([A, B, C, D])

const resultRules = merge([A, B, C, D], {
  rules: { array: 'override', undefined: 'skip', null: 'skip' },
})

console.log('result:', inspect(result, { depth: 3, colors: true }))
console.log('resultRules:', inspect(resultRules, { depth: 3, colors: true }))
