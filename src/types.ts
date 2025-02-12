type LastSource<T extends any[], K> = T extends [...infer R, infer L]
  ? K extends keyof L
    ? L[K]
    : LastSource<R, K>
  : never

type AllSources<T extends any[], K> = {
  [I in keyof T]: K extends keyof T[I] ? T[I][K] : never
}[number]

type SkipNullable<T, O extends MergeOptions> = Exclude<
  T,
  | (O['rules'] extends { undefined: 'skip' } ? undefined : never)
  | (O['rules'] extends { null: 'skip' } ? null : never)
>

export type MergeAllKeys<T extends any[]> = T extends [infer K, ...infer R]
  ? keyof K | MergeAllKeys<R>
  : never

export type MergeRecord = Record<PropertyKey, any>

export type MergeArray<U> = U extends any[] ? U[number] : never

export type MergeValue<T> = [MergeArray<T>] extends [never]
  ? T
  : MergeArray<T>[] | Exclude<T, any[]>

export type MergeUnion<
  T extends any[],
  K,
  O extends MergeOptions,
> = O['rules'] extends { array: 'override' }
  ? SkipNullable<LastSource<T, K>, O>
  : SkipNullable<AllSources<T, K>, O>

export type MergeTypes<
  T extends MergeRecord[],
  O extends MergeOptions = MergeOptions,
> = {
  [K in MergeAllKeys<T>]: MergeValue<MergeUnion<T, K, O>>
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
   * - `combine` — combines all values from all sources into a final result.
   * - `override` — value from the last source overrides the others in the final result.
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
   * - `override` — explicitly defined value from the last source overrides the others in the final result.
   * - `skip` — skips the explicitly defined value from the last source and uses the defined one if any.
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
   * - `override` — explicitly defined value from the last source overrides the others in the final result.
   * - `skip` — skips the explicitly defined value from the last source and uses the defined one if any.
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
