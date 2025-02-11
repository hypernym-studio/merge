export interface MergeOptions {
  skip?: ('array' | 'undefined' | 'null')[]
}

export type MergeRecord = Record<string, any>

export type MergeAllKeys<T extends any[]> = T extends [infer K, ...infer R]
  ? keyof K | MergeAllKeys<R>
  : never

export type MergeUnion<T extends any[], K, O extends MergeOptions> = {
  [I in keyof T]: K extends keyof T[I]
    ? O['skip'] extends (infer U)[]
      ? Exclude<
          T[I][K],
          U extends 'undefined' ? undefined : U extends 'null' ? null : never
        >
      : T[I][K]
    : never
}[number]

export type MergeArray<U> = U extends any[] ? U[number] : never

export type MergeValue<T> = [MergeArray<T>] extends [never]
  ? T
  : MergeArray<T>[] | Exclude<T, any[]>

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

export * from './'
