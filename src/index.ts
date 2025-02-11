import { isObject, isArray, isUndefined, isNull } from '@hypernym/utils'
import type { MergeRecord, MergeOptions, Merge } from './types'

/**
 * Type-safe deep merge utility.
 *
 * Recursively combines multiple objects into a unified result while preserving strict types, offering fine-grained control over merge strategies.
 *
 * @example
 *
 * ```ts
 * import { merge } from '@hypernym/merge'
 * ```
 *
 * @see [Repository](https://github.com/hypernym-studio/merge)
 */
export function merge<T extends MergeRecord[], O extends MergeOptions>(
  sources: [...T],
  options?: O,
): Merge<T, O> {
  const { skip } = options || {}

  return sources.reduce((prev: MergeRecord, curr: MergeRecord) => {
    if (prev && curr) {
      Object.keys(curr).forEach((key) => {
        if (['__proto__', 'constructor', 'prototype'].includes(key)) return

        if (isArray(prev[key]) && isArray(curr[key])) {
          prev[key] = skip?.includes('array')
            ? curr[key]
            : [...prev[key], ...curr[key]]
        } else if (isObject(prev[key]) && isObject(curr[key])) {
          prev[key] = merge([prev[key], curr[key]], options)
        } else {
          prev[key] = isUndefined(curr[key])
            ? skip?.includes('undefined')
              ? prev[key]
              : curr[key]
            : isNull(curr[key])
              ? skip?.includes('null')
                ? prev[key]
                : curr[key]
              : curr[key]
        }
      })
    }
    return prev
  }, {}) as Merge<T, O>
}
