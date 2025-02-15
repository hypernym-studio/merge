type AllSources<T extends any[], K extends PropertyKey> = {
  [I in keyof T]: K extends keyof T[I] ? T[I][K] : never
}[number]

type LastSource<T extends any[], K extends PropertyKey> = T extends [
  ...infer R,
  infer L,
]
  ? K extends keyof L
    ? L[K]
    : LastSource<R, K>
  : never

type ExtractValue<T extends MergeRecord[], K extends PropertyKey> = T extends [
  infer F extends MergeRecord,
  ...infer R extends MergeRecord[],
]
  ? K extends keyof F
    ? [F[K], ...ExtractValue<R, K>]
    : ExtractValue<R, K>
  : []

type SkipRules<O extends MergeOptions> =
  | (O['rules'] extends { undefined: 'skip' } ? undefined : never)
  | (O['rules'] extends { null: 'skip' } ? null : never)

type LastValue<
  T extends MergeRecord[],
  K extends PropertyKey,
  O extends MergeOptions,
> = T extends [...infer R extends MergeRecord[], infer L extends MergeRecord]
  ? L extends MergeRecord
    ? K extends keyof L
      ? Exclude<L[K], SkipRules<O>> extends never
        ? LastValue<R, K, O>
        : Exclude<L[K], SkipRules<O>>
      : LastValue<R, K, O>
    : never
  : never

export type MergeFn = (...a: any[]) => any
export type MergePrimitives =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | Date
  | MergeFn

export type MergeRecord = Record<PropertyKey, any>

export type MergeAllKeys<T extends any[]> = T extends [infer K, ...infer R]
  ? keyof K | MergeAllKeys<R>
  : never

export type MergeArray<T> = T extends any[] ? T[number] : never

export type MergeValue<
  T extends MergeRecord[],
  K extends PropertyKey,
  O extends MergeOptions,
> =
  Extract<LastSource<T, K>, any[]> extends never
    ? LastSource<T, K> extends MergePrimitives
      ? LastValue<T, K, O>
      : AllSources<T, K> extends MergeRecord
        ? Merge<ExtractValue<T, K>, O>
        : LastValue<T, K, O>
    : O['rules'] extends { array: 'override' }
      ? LastSource<T, K>
      : MergeArray<AllSources<T, K>>[] | Exclude<AllSources<T, K>, any[]>

export type MergeTypes<
  T extends MergeRecord[],
  O extends MergeOptions = MergeOptions,
> = {
  [K in MergeAllKeys<T>]: Exclude<MergeValue<T, K, O>, SkipRules<O>>
}

export type MergeExpand<T> = T extends infer U
  ? { [K in keyof U]: U[K] }
  : never

export type Merge<
  T extends MergeRecord[],
  O extends MergeOptions = MergeOptions,
> = MergeExpand<MergeTypes<T, O>>

export interface MergeRules {
  /**
   * Specifies the merge strategy for `array` types.
   *
   * - `combine` — Combines all values from all sources into a final result,
   * meaning that the right sources will merge the properties with the left sources and combine their values.
   * - `override` — Value from the last source overrides the others in the final result,
   * meaning that the right sources will merge the properties with the left sources and overwrite their values.
   *
   * @example
   *
   * ```ts
   * merge([{}], { rules: { array: 'combine' } })
   * ```
   *
   * @default 'combine'
   */
  array?: 'combine' | 'override'
  /**
   * Specifies the merge strategy for the `undefined` type.
   *
   * - `override` — Explicitly defined value from the last source overrides the others in the final result.
   * - `skip` — Skips the explicitly defined value from the last source and uses the defined one if any.
   *
   * @example
   *
   * ```ts
   * merge([{}], { rules: { undefined: 'override' } })
   * ```
   *
   * @default 'override'
   */
  undefined?: 'override' | 'skip'
  /**
   * Specifies the merge strategy for the `null` type.
   *
   * - `override` — Explicitly defined value from the last source overrides the others in the final result.
   * - `skip` — Skips the explicitly defined value from the last source and uses the defined one if any.
   *
   * @example
   *
   * ```ts
   * merge([{}], { rules: { null: 'override' } })
   * ```
   *
   * @default 'override'
   */
  null?: 'override' | 'skip'
}

export interface MergeOptions {
  /**
   * Defines how merging behaves for the specified types.
   *
   * @example
   *
   * ```ts
   * merge([{}], { rules: {} })
   * ```
   *
   * @default undefined
   */
  rules?: MergeRules
}

export * from './'
