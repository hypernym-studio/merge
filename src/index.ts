import { isObject, isArray, isUndefined, isNull } from '@hypernym/utils'
import type { MergeSource, MergeOptions, Merge } from './types'

/**
 * Type-safe deep merge utility.
 *
 * Recursively combines multiple objects into a unified result while preserving strict types, offering fine-grained control over merge strategies.
 *
 * Provides maximum recursion depth when merging nested objects.
 *
 * @example
 *
 * ```ts
 * import { merge } from '@hypernym/merge'
 *
 * const result = merge([{ a: 1 }, { b: 2 }, { c: 3 }]) // => { a: 1, b: 2, c: 3 }
 * ```
 *
 * @see [Repository](https://github.com/hypernym-studio/merge)
 */
export function merge<T extends MergeSource[], O extends MergeOptions>(
  sources: [...T],
  options?: O & MergeOptions & { depth?: O['depth'] },
): Merge<T, O> {
  const { rules, depth = 6 } = options || {}

  return sources.reduce((prev: MergeSource, curr: MergeSource) => {
    if (prev && curr) {
      Object.keys(curr).forEach((key) => {
        if (['__proto__', 'constructor', 'prototype'].includes(key)) return

        if (depth <= 0 && isObject(curr[key])) {
          prev[key] = {}
          return
        }

        if (isArray(prev[key]) && isArray(curr[key])) {
          prev[key] =
            rules?.array === 'override'
              ? curr[key]
              : [...prev[key], ...curr[key]]
        } else if (isObject(prev[key]) && isObject(curr[key])) {
          prev[key] = merge([prev[key], curr[key]], {
            ...options,
            depth: depth - 1,
          })
        } else {
          prev[key] = isUndefined(curr[key])
            ? rules?.undefined === 'skip'
              ? prev[key]
              : curr[key]
            : isNull(curr[key])
              ? rules?.null === 'skip'
                ? prev[key]
                : curr[key]
              : curr[key]
        }
      })
    }
    return prev
  }, {}) as Merge<T, O>
}
