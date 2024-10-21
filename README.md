[![CI](https://github.com/SaintPepsi/svelte-writable-with/actions/workflows/ci.yml/badge.svg)](https://github.com/SaintPepsi/svelte-writable-with/actions/workflows/ci.yml)
# svelte-writable-with

A Svelte store utility library that allows you to extend the writable.

Working with Svelte's `get` to retrieve writable values can feel cumbersome, especially with the import clutter from many libraries. `withState`, inspired by [TanStack Store](https://tanstack.com/store/latest), allows you to access values directly via `store.state`. 

This utility library will evolve to include other useful features.

## Why `writableWith`?
_Old way (verbose):_
```ts
const store = writable('foo');
const value = get(store);
const desiredValue = someRecord[value];
```

_New way (cleaner):_
```ts
const store = state(writable('foo'));
const desiredValue = someRecord[store.state];
```

## Installation

```bash
bun add svelte-writable-with
```

## Features

### Composition

`writableWith` is flexible. You can pass a direct value, a `writable`, or another `writableWith`. This keeps writables predictable and avoids introducing unwanted side effects.

Example:
```ts
import { state, previous } from 'svelte-writable-with';

type Modes = "paint" | "pan" | "erase";

const baseMode = writable('paint')
const { set, update, subscribe } = baseMode;

const modeWithState = state(baseMode);
const { set, update, subscribe, state } = baseMode;

const modeWithPreviousAndState = previous(modeWithState)
const { set, update, subscribe, state, previous } = baseMode;
```

Ensure you provide the primary type in the first **"withable"** to avoid type issues. _(Working on improving this 🤓)_

✅ Correct types: 
```ts
state(previous(writable<Record<"foo" | "bar", boolean>>({})))
```
❌ Invalid types: `previous` will complain
```ts
state<Record<"foo" | "bar", boolean>>(previous(writable({})))
``` 


## API

Each method can take either a value or a writable.

### `withState`
usage: `writableWith.state | withState`

Allows access to the store's state directly, without using Svelte's `get`

#### this utility returns:

- **[+]** _property_ `state` - Accesses the store state directly, replacing `get(store)`.

#### Usage:

```ts
const {
    state,      // The current state of the writable.
    // ... writable return values
} = withState(writable(1337));
```

#### Example:

Property access:

```ts
const currentBenefit = withState(writable<"spinach" | "broccoli">("spinach"));

const vegetableBenefits = {
    spinach: "Iron, vitamins, energy",
    broccoli: "Fiber, heart health",
};

function getBenefit() {
    return vegetableBenefits[currentBenefit.state];
}
```

### `withPrevious`
usage: `writableWith.previous | withPrevious`

keeps track of the last value.

#### this utility returns:

- **[+]** _property_ `previous` - Returns the previous value before the store was updated.

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
} = withPrevious(writable(1337));
```

#### Example:

setting the writable back to the last value

```ts
type States = "paint" | "pan" | "erase"; 
const mode = withPrevious(writable<States>("paint"));

// Some condition to change mode
mode.set("pan");

// Some condition to return
mode.set(mode.previous);
```


### `withLocalStorage`

usage: `writableWith.localStorage | withLocalStorage`

Stores the value in localStorage under a specific key prefixed with `svelte-writable-with:`

If the `initialValue` is a `writable` or `writableWith`, it initializes the store with the value from `localStorage` (if present).

#### this utility returns:

- **[+]** initialises with the `localStorage` value for that key or the `initialValue`
    
- **[%]** _method_ `set` - sets the value in `localStorage` - `JSON.stringify` -> `set`
    
- **[%]** _method_ `update` - runs the updater with the value currently in the store and stores the value in `localStorage` - `JSON.stringify` -> `set`

#### Note: `withLocalStorage` is still being refined. Here are a few limitations:

**⚠️ currently keys are not strongly typed and are just strings.**

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
} = withLocalStorage('SOME_KEY', writable(1337));
```

#### Example:

setting the writable back to the last value

```ts
type States = "paint" | "pan" | "erase"; 
const mode = withPrevious(writable<States>("paint"));

// Change the mode
mode.set("pan");

// Revert to the previous mode
mode.set(mode.previous);
```




### `withHistory`
usage: `writableWith.history | withHistory`

keeps track of an indefinite history of values.

#### this utility returns:

- **[+]** _property_ `history` - Returns the history writable.

- **[+]** _method_ `pop` - removes last value from the history object (if it exists), sets the state with the popped value and then returns the popped value

- **[%]** _method_ `subscribe` - history value as second argument `(value, history)`
    
- **[%]** _method_ `set` - pushes the value to history before setting store state
    
- **[%]** _method_ `update` - pushes the value to history before updating store state

#### Usage:

```typescript
const {
    subscribe,      // Modified subscribe with 2 arguments (`value`, `history`)
    set,            // Modified set updates `history` value
    update,         // Modified update updates `history` value
    history,		// The history writable
	pop, 			// removes last value from history and returns it (updates main store with returned value)
} = withHistory(writable(1337));
```

#### Example:

setting the writable back to the last value

```ts
type States = "paint" | "pan" | "erase"; 
const mode = withHistory(writable<States>("paint"));

// Some condition to change mode
mode.set("pan");
// history = ['paint']
mode.set("paint");
// history = ['paint', 'pan']
mode.set("erase");
// history = ['paint', 'pan', 'paint']

// Some code...

const paintValue1 = mode.pop();
// paintValue1 === 'paint'
// history === ['paint', 'pan']
const panValue = mode.pop();
// panValue === 'pan'
// history === ['paint']
const paintValue2 = mode.pop();
// paintValue2 === 'paint'
// history === []

const originalMode = get(mode) // "paint"
```

### Common Issues:

- Using any writable where a `$state` rune is expected, i.e. `"Type 'WithState<string, Writable<boolean>>' is not assignable to type 'boolean | null | undefined'."`

    use `fromStore` -> `import { fromStore } from 'svelte/store';` to create a reactive `$state` rune .e.g:
    ```html
    <script lang="ts">
    export let isDebuggerEnabled = withLocalStorage(writable(false), 'DebuggerEnabled');
	export let isChecked = fromStore(isDebuggerEnabled);
    </script>
    <input type="checkbox" id="debugger" name="debugger" bind:checked={isChecked.current} />
    <label for="debugger">Debugger</label>
    ```
    

### Goal:

The goal of `svelte-writable-with` is to offer an intuitive API for extending and enhancing `writable` stores based on your specific needs.


#### Possible future extensions include

-   `history`

## License

MIT
