# svelte-writable-with

A Svelte store utility library that allows you to extend the writable.

## Installation

```bash
bun add svelte-writable-with
```

## API

Each method can take either a value or a writable.

### `withState`
usage: `writableWith.state | withState`

allows you to access the state without calling `get` from `svelte/store`

#### Usage:

```ts
const {
    state,      // The current state of the writable.
    // ... writable return values
} = withState(1337);
```

#### Example:

Property access:

```ts
const currentBenefit = withState("spinach");

const vegetableBenefits = {
    spinach: "Iron, vitamins, energy",
    broccoli: "Fiber, heart health",
    carrots: "Eye health, beta-carotene",
    kale: "Vitamins, bone support",
    sweetPotatoes: "Fiber, digestion",
    tomatoes: "Lycopene, heart health",
    cauliflower: "Fiber, digestion",
    peppers: "Vitamins, immunity",
    brusselsSprouts: "Fiber, detox",
    zucchini: "Low-calorie, hydration",
};

function getBenefit() {
    return vegetableBenefits[currentBenefit.state];
}
```

### `withPrevious`
usage: `writableWith.previous | withPrevious`

keeps track of the last value.

#### Usage:

```typescript
const {
    subscribe,      // Modified subscribe with 2 arguments (`value`, `previousValue`)
    set,            // Modified set updates `previous` value
    update,         // Modified update updates `previous` value
    previous,       // The previous value
    state,          // The current state of the writable. see `withState`
} = withPrevious(1337);
```

#### Example:

setting the writable back to the last value

```ts
type States = "paint" | "pan" | "erase"; 
const mode = withPrevious<States>("paint");

// Some condition to change mode
mode.set("pan");

// Some condition to return
mode.set(mode.previous);
```


### `withLocalStorage`

usage: `writableWith.localStorage | withLocalStorage`

Stores the value in localStorage under a specific key prefixed with `svelte-writable-with:`

Keys and values are managed through the `WithLocalStorageKeys` interface

in your `app.d.ts` or `global.d.ts` add the following:

```ts
declare module 'svelte-writable-with' {
	interface WithLocalStorageKeys {
		SOME_KEY: number;
	}
}
```

#### Features:
- Typed Keys and values - extendable `interface` ✅
- Automatic `JSON.parse`-ing and `JSON.stringify`-ing ✅
- [Storage Events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) ❌
- Schema Safe Parser ❌ (any?, [zod?](https://zod.dev/))

#### Usage:

```typescript
const {
    set,            // Modified set updates `localStorage`
    update,         // Modified update updates `localStorage`
    state,          // The current state of the writable. see `withState`
    // ... writable return values
} = withLocalStorage('SOME_KEY', 1337);
```

#### Example:

setting the writable back to the last value

```ts
type States = "paint" | "pan" | "erase"; 
const mode = withPrevious<States>("paint");

// Some condition to change mode
mode.set("pan");

// Some condition to return
mode.set(mode.previous);
```


### Plan:

The goal is to create an intuitive api that lets you extend and update and add more stuff. based on what your writable requires

Example with direct values:

```ts
writableWith.state(1337);                       // ✅ Implemented
writableWith.previous(1337);                    // ✅ Implemented
writableWith.localStorage('SOME_KEY', 1337);    // ✅ Implemented
```

Example with writable values:

```ts
const count = writable(0);
writableWith.state(count);                      // ✅ Implemented
writableWith.previous(count);                   // ✅ Implemented
writableWith.localStorage('SOME_KEY', count);   // ✅ Implemented
```

Example with extended with's:

```ts
const count = writable(0);
const countWithState = writableWith.state(count);                   // ✅ Implemented
// Count with state and previous
const countPrevious = writableWith.previous(countWithState);        // ❌ Not Implemented
// Count with previous and localStorage
const countPrevious = writableWith.localStorage(countWithState);    // ❌ Not Implemented
```

#### Possible extensions include

-   `history`

## License

MIT
