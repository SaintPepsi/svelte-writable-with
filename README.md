# svelte-writable-with

A Svelte store utility library that allows you to extend the writable.

## Installation

```bash
bun add svelte-writable-with
```

## API

Each method can take either a value or a writable.

### `withState`

allows you to access the state without calling `get` from `svelte/store`

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

keeps track of the last value.

```typescript
const {
    subscribe,      // Modified subscribe with 2 arguments (value, previousValue)
    set,            // Modified set updates previousValue
    update,         // Modified update updates previousValue
    previous,       // The previous value
    state,          // The current state of the writable. see `withState`
} = withPrevious(1337);
```

### Plan:

The goal is to create an intuitive api that lets you extend and update and add more stuff. based on what your writable requires

Example with direct values:

```ts
writableWith.state(1337);
writableWith.previous(1337);
writableWith.history(1337);
```

Example with writable values:

```ts
const count = writable(0);
writableWith.state(count);
writableWith.previous(count);
writableWith.history(count);
```

Example with extended with's:

```ts
const count = writable(0);
const countWithState = writableWith.state(count);
// Count with state and previous
const countPrevious = writableWith.previous(countWithState);
// Count with state and history
const countHistory = writableWith.history(countWithState);
```

#### Possible extensions include

-   `localStorage`

## License

MIT
