import {
	type Invalidator,
	type Subscriber,
	type Unsubscriber,
	type Updater,
	type Writable,
	writable,
} from 'svelte/store';
import type { Simplify } from 'type-fest';
import type { UnpackWritable } from './types';
import { withState } from './withState';

// const write = writable('test' as const);

// const writeState = withState(write);
// const writeStatePrevious = withPrevious(writeState);
// const writeStatePreviousLocalStorage = withLocalStorage('_TEST', writeStatePrevious);

// type PrettyWrite = Simplify<typeof write>;
// type PrettyWriteState = Simplify<typeof writeState>;
// type PrettyWriteStatePrevious = Simplify<typeof writeStatePrevious>;
// type PrettyWriteStatePreviousLocalStorage = Simplify<typeof writeStatePreviousLocalStorage>;

// const testing = writable('test');

// const testingWithFruit = withPrevious(testing);

// type TestWritable = Writable<string>;

type WritableWithState<T> = Writable<T> & {
	state: T;
};
interface FakeWritable<T> {
	set: (this: void, value: T) => void;
	update: (this: void, updater: Updater<T>) => void;
	subscribe: (
		this: void,
		run: Subscriber<T>,
		invalidate?: Invalidator<T> | undefined,
	) => Unsubscriber;
}

type WritableTest = Writable<'test'>;
type WritableTestFake = FakeWritable<'test'>;
type WritableTestSimple = Simplify<Writable<'test'>>;
type WritableTestFakeSimple = Simplify<FakeWritable<'test'>>;

function test<T>(value: T) {
	return value as unknown as T extends Writable<any> ? 'yes' : 'no';
}

type TestWithState = WritableWithState<string>;

type WithStateUnpacked = UnpackWritable<TestWithState>;

const write = writable('test' as const);
write.set;
//     ^?
write.subscribe;
//     ^?
write.update;
//     ^?
const normalWritable = test(write);
//     ^?

const writeState = withState('test' as const);
writeState.set;
//          ^?
writeState.subscribe;
//          ^?
writeState.update;
//          ^?
writeState.state;
//          ^?
const normalwithState = test(writeState);
//     ^?

const writeStateWritable = withState(writable('test' as const));
writeState.set;
//          ^?
writeState.subscribe;
//          ^?
writeState.update;
//          ^?
writeState.state;
//          ^?
const normalwithStateWritable = test(writeStateWritable);
//     ^?
