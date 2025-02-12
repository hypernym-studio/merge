<h1 align="center">Merge</h1>

<p align="center">Type-safe deep merge utility.</p>

<p align="center">
  <a href="https://github.com/hypernym-studio/merge">Repository</a>
  <span>✦</span>
  <a href="https://www.npmjs.com/package/@hypernym/merge">Package</a>
  <span>✦</span>
  <a href="https://github.com/hypernym-studio/merge/releases">Releases</a>
  <span>✦</span>
  <a href="https://github.com/hypernym-studio/merge/discussions">Discussions</a>
</p>

<br>

<pre align="center">pnpm add @hypernym/merge</pre>

<br>

## Features

- Free & Open Source
- Ultra-lightweight
- Written in TypeScript
- No External Dependencies
- Extremely Easy to Use
- API-Friendly

<blockquote>
  <sub><strong>Package size</strong>: <code>~500 B</code> minified, <code>~360 B</code> gzip</sub>
</blockquote>

## Core Concepts

- **Deep-merge**: Recursively combines multiple objects into a unified result.
- **Type-safe**: Automatically infers types from all specified sources.
- **Merge Rules**: Offers precise control over merging strategies.

## Installation

Install `@hypernym/merge` package:

```sh
# via pnpm
pnpm add @hypernym/merge
```

```sh
# via npm
npm install @hypernym/merge
```

## Usage

```ts
import { merge } from '@hypernym/merge'

const obj = merge([a, b, c])
```

## API

### Merge Function

```ts
import { merge } from '@hypernym/merge'

merge(sources, options)
```

#### sources

- Type: `object[]`
- Required: `true`

```ts
merge([{ a: 1 }, { b: 2 }, { c: 3 }]) // => { a: 1, b: 2, c: 3 }
```

#### options

- Type: `object`
- Default: `undefined`

```ts
merge([{ a: 1 }, { a: null }], { rules: { null: 'skip' } }) // => { a: 1 }
```

### Merge Type Helper

```ts
import type { Merge } from '@hypernym/merge'

type A = { a?: string }
type B = { b: string }

type Result = Merge<[A, B], { rules: { undefined: 'skip' } }> // => { a: string, b: string }
```

## Options

All options are documented with descriptions and examples so autocompletion will be offered as you type. Simply hover over the property and see what it does in the quick info tooltip.

### rules

- Type: `object`
- Default: `undefined`

Defines how merging behaves for the specified types.

#### array

- Type: `combine | override`
- Default: `combine`

Specifies the merge strategy for `array` types.

- `combine` — combines all values from all sources into a final result.
- `override` — value from the last source overrides the others in the final result.

```ts
const a = { a: [1, 2] }
const b = { a: [3, 4] }

const o1 = merge([a, b], { rules: { array: 'combine' } }) // => { a: [1, 2, 3, 4] }
const o2 = merge([a, b], { rules: { array: 'override' } }) // => { a: [3, 4] }
```

#### undefined

- Type: `override | skip`
- Default: `override`

Specifies the merge strategy for the `undefined` type.

- `override` — explicitly defined value from the last source overrides the others in the final result.
- `skip` — skips the explicitly defined value from the last source and uses the defined one if any.

```ts
const a = { a: 'hello' }
const b = { a: undefined }

const o1 = merge([a, b], { rules: { undefined: 'override' } }) // => { a: undefined }
const o2 = merge([a, b], { rules: { undefined: 'skip' } }) // => { a: 'hello' }
```

#### null

- Type: `override | skip`
- Default: `override`

Specifies the merge strategy for the `null` type.

- `override` — explicitly defined value from the last source overrides the others in the final result.
- `skip` — skips the explicitly defined value from the last source and uses the defined one if any.

```ts
const a = { a: 'hello' }
const b = { a: null }

const o1 = merge([a, b], { rules: { null: 'override' } }) // => { a: null }
const o2 = merge([a, b], { rules: { null: 'skip' } }) // => { a: 'hello' }
```

## Community

Feel free to ask questions or share new ideas.

Use the official [discussions](https://github.com/hypernym-studio/merge/discussions) to get involved.

## License

Developed in 🇭🇷 Croatia, © Hypernym Studio.

Released under the [MIT](LICENSE.txt) license.
