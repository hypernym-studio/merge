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
  <sub><strong>Package size</strong>: <code>~560 B</code> minified, <code>~370 B</code> gzip</sub>
</blockquote>

## Core Concepts

- **Deep-merge**: Recursively combines multiple objects into a unified result.
- **Type-safe**: Automatically infers types from all specified sources.
- **Merge Rules**: Offers precise control over merging strategies.
- **Depth Limit**: Provides maximum recursion depth when merging nested objects.

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

const resultDepth = merge([A, B, C, D], { depth: 1 })
```

**Output: result**

```ts
// Merged Result
{
  a: 'merge',
  b: {
    c: { d: [1, 2, 3, '4', '5', '6'] },
    e: { f: { g: 33 } },
    h: [23, 33],
  },
  i: { j: undefined, k: null },
}
```

```ts
// Automatically Infered Types
{
  a: string
  b: {
    c: {
      d: (string | number)[]
    }
    e: {
      f: {
        g: number
      }
    }
    h: number[]
  }
  i: {
    j: undefined
    k: null
  }
}
```

**Output: resultRules**

```ts
// Merged Result With Custom Rules
{
  a: 'merge',
  b: { c: { d: ['4', '5', '6'] }, e: { f: { g: 33 } }, h: [23, 33] },
  i: { j: 77, k: 99 },
}
```

```ts
// Automatically Infered Types
{
  a: string
  b: {
    c: {
      d: string[]
    }
    e: {
      f: {
        g: number
      }
    }
    h: number[]
  }
  i: {
    j: number
    k: number
  }
}
```

**Output: resultDepth**

```ts
// Merged Result With Custom Depth
{
  a: 'merge',
  b: { c: {}, e: {}, h: [23, 33] },
  i: { j: undefined, k: null },
}
```

```ts
// Automatically Infered Types
{
  a: string
  b: {
    c: unknown
    e: unknown
    h: number[]
  }
  i: {
    j: undefined
    k: null
  }
}
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

Merge<sources, options>
```

#### sources

- Type: `object[]`
- Required: `true`

```ts
Merge<[{ a: number }, { b: number }, { c: number }]> // => { a: number, b: number, c: number }
```

#### options

- Type: `object`
- Default: `undefined`

```ts
Merge<[{ a: number }, { a: null }], { rules: { null: 'skip' } }> // => { a: number }
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

- `combine` — Combines all values from all sources into a final result, meaning that the right sources will merge the properties with the left sources and combine their values.
- `override` — Value from the last source overrides the others in the final result, meaning that the right sources will merge the properties with the left sources and overwrite their values.

```ts
const A = { a: [1, 2] }
const B = { a: [3, 4] }

const resultCombine = merge([A, B], { rules: { array: 'combine' } }) // => { a: [1, 2, 3, 4] }
const resultOverride = merge([A, B], { rules: { array: 'override' } }) // => { a: [3, 4] }
```

#### undefined

- Type: `override | skip`
- Default: `override`

Specifies the merge strategy for the `undefined` type.

- `override` — Explicitly defined value from the last source overrides the others in the final result.
- `skip` — Skips the explicitly defined value from the last source and uses the defined one.

```ts
const A = { a: 'hello' }
const B = { a: undefined }

const resultOverride = merge([A, B], { rules: { undefined: 'override' } }) // => { a: undefined }
const resultSkip = merge([A, B], { rules: { undefined: 'skip' } }) // => { a: 'hello' }
```

#### null

- Type: `override | skip`
- Default: `override`

Specifies the merge strategy for the `null` type.

- `override` — Explicitly defined value from the last source overrides the others in the final result.
- `skip` — Skips the explicitly defined value from the last source and uses the defined one.

```ts
const A = { a: 'hello' }
const B = { a: null }

const resultOverride = merge([A, B], { rules: { null: 'override' } }) // => { a: null }
const resultSkip = merge([A, B], { rules: { null: 'skip' } }) // => { a: 'hello' }
```

### depth

- Type: `number`
- Default: `6`

Specifies the maximum recursion depth when merging nested objects.

The depth counter is a safeguard that limits recursion, improving compiler performance, and prevents possible infinite type instantiation issues during type-checking.

In most cases, you won't need to change this.

```ts
const resultDepth = merge([A, B], { depth: 3 })
```

## Community

Feel free to ask questions or share new ideas.

Use the official [discussions](https://github.com/hypernym-studio/merge/discussions) to get involved.

## License

Developed in 🇭🇷 Croatia, © Hypernym Studio.

Released under the [MIT](LICENSE.txt) license.
