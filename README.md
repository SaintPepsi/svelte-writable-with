# svelte-writable-with

A Svelte store utility library that allows you to extend the writable.

## Installation

```bash
bun add svelte-writable-with
```

## Features

### Composition

You can pass either a value, a `writable` or a `writableWith` into a `writableWith`

This makes it so that your other writable's don't have unexpected sid-effects and still behave the same way as they normally would

Example:
```ts
const { state, previous } = `svelte-writable-with`;

type Modes = "paint" | "pan" | "erase";

const baseMode = writable('paint')
const { set, update, subscribe } = baseMode;

const modeWithState = state(baseMode);
const { set, update, subscribe, state } = baseMode;

const modeWithPreviousAndState = previous(modeWithState)
const { set, update, subscribe, state, previous } = baseMode;
```

The type becomes a bit _munted_ if you don't provide the primary type in the first `withable` i.e.:

✅ Correct types: 
```
state(previous<Record<"foo" | "bar", boolean>({}))
```
❌ Invalid types: `previous` will complain
```
state<Record<"foo" | "bar", boolean>(previous({}))
``` 


## API

Each method can take either a value or a writable.

### `withState`
usage: `writableWith.state | withState`

allows you to access the state without calling `get` from `svelte/store`

#### this utility returns:

- **[+]** _property_ `state` - 🔀 `get(store)`

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

#### this utility returns:

- **[+]** _property_ `previous` - returns the previous  value

- **[%]** _method_ `subscribe` - previous value as second argument `(value, previousValue)`
    
- **[%]** _method_ `set` - sets the previous value before setting store state
    
- **[%]** _method_ `update` - sets the previous value before updating store state

#### Usage:

```typescript
const {
    subscribe,      // Modified subscribe with 2 arguments (`value`, `previousValue`)
    set,            // Modified set updates `previous` value
    update,         // Modified update updates `previous` value
    previous,       // The previous value
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

If the `initialValue` is a `writable` and there's a value for the key in `localStorage` then the writable gets set with that key's value.

#### this utility returns:

- **[+]** initialises with the `localStorage` value for that key or the `initialValue`
    
- **[%]** _method_ `set` - sets the value in `localStorage` - `JSON.stringify` -> `set`
    
- **[%]** _method_ `update` - runs the updater with the value currently in the store and stores the value in `localStorage` - `JSON.stringify` -> `set`

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


### Goal:

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
const countPrevious = writableWith.previous(countWithState);        // ✅ Implemented
// Count with previous and localStorage
const countPrevious = writableWith.localStorage(countWithState);    // ✅ Implemented
```

#### Possible extensions include

-   `history`

## License

MIT
