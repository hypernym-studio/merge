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

type ExtractValue<T extends MergeSource[], K extends PropertyKey> = T extends [
  infer F extends MergeSource,
  ...infer R extends MergeSource[],
]
  ? K extends keyof F
    ? [F[K], ...ExtractValue<R, K>]
    : ExtractValue<R, K>
  : []

type SkipRules<O extends MergeOptions> =
  | (O['rules'] extends { undefined: 'skip' } ? undefined : never)
  | (O['rules'] extends { null: 'skip' } ? null : never)

type LastValue<
  T extends MergeSource[],
  K extends PropertyKey,
  O extends MergeOptions,
> = T extends [...infer R, infer L]
  ? K extends keyof L
    ? Exclude<L[K], SkipRules<O>> extends never
      ? LastValue<R extends MergeSource[] ? R : [], K, O>
      : Exclude<L[K], SkipRules<O>>
    : LastValue<R extends MergeSource[] ? R : [], K, O>
  : never

type ArrayValue<
  T extends MergeSource[],
  K extends PropertyKey,
  O extends MergeOptions,
> = O['rules'] extends { array: 'override' }
  ? LastSource<T, K>
  :
      | MergeArray<Extract<AllSources<T, K>, any[]>>[]
      | Exclude<LastSource<T, K>, any[]>

type BuildTuple<L extends number, T extends any[] = []> = T['length'] extends L
  ? T
  : BuildTuple<L, [...T, any]>

type Decrement<N extends number> =
  BuildTuple<N> extends [any, ...infer R] ? R['length'] : never

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

export type MergeSource = MergeRecord | undefined

export type MergeAllKeys<T extends any[]> = T extends [infer K, ...infer R]
  ? keyof K | MergeAllKeys<R extends any[] ? R : []>
  : never

export type MergeArray<T> = T extends any[] ? T[number] : never

export type MergeValue<
  T extends MergeSource[],
  K extends PropertyKey,
  O extends MergeOptions,
> = O['depth'] extends 0
  ? LastSource<T, K> extends any[]
    ? ArrayValue<T, K, O>
    : LastSource<T, K> extends MergeRecord
      ? unknown
      : LastSource<T, K>
  : Extract<LastSource<T, K>, any[]> extends never
    ? Extract<AllSources<T, K>, any[]> extends never
      ? LastSource<T, K> extends MergePrimitives
        ? LastValue<T, K, O>
        : Exclude<AllSources<T, K>, SkipRules<O>> extends MergeRecord
          ? MergeTypes<
              ExtractValue<T, K>,
              {
                rules: O['rules']
                depth: Decrement<O['depth'] extends number ? O['depth'] : 6>
              }
            >
          : LastValue<T, K, O>
      : LastValue<T, K, O>
    : ArrayValue<T, K, O>

export type MergeExpand<T> = T extends infer U
  ? { [K in keyof U]: U[K] }
  : never

export type MergeTypes<
  T extends MergeSource[],
  O extends MergeOptions = MergeOptions,
> = MergeExpand<{
  [K in MergeAllKeys<T>]: Exclude<MergeValue<T, K, O>, SkipRules<O>>
}>

export type Merge<
  T extends MergeSource[],
  O extends MergeOptions = MergeOptions,
> = MergeTypes<T, O>

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
   * - `skip` — Skips the explicitly defined value from the last source and uses the defined one.
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
   * - `skip` — Skips the explicitly defined value from the last source and uses the defined one.
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
  /**
   * Specifies the maximum recursion depth when merging nested objects.
   *
   * The depth counter is a safeguard that limits recursion, improving compiler performance, and prevents possible infinite type instantiation issues during type-checking.
   *
   * In most cases, you won't need to change this.
   *
   * @example
   *
   * ```ts
   * merge([{}], { depth: 9 })
   * ```
   *
   * @default 6
   */
  depth?: number
}

export * from './'
