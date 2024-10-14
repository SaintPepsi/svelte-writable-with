import { get, writable, type Unsubscriber, type Updater, type Writable } from 'svelte/store';
import type { Tagged } from 'type-fest';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';

type PreviousValue<T> = Tagged<T, 'Previous Value'>;

type SubscriberWithPrevious<T> = (value: T, previousValue: PreviousValue<T>) => void;

export type WithPrevious<T> = T & {
	subscribe(
		run: SubscriberWithPrevious<UnpackWritable<T>>,
		invalidate?: () => void,
	): Unsubscriber;
	set(value: UnpackWritable<T>): void;
	update(updater: Updater<UnpackWritable<T>>): void;
	previous: PreviousValue<UnpackWritable<T>>;
};

type WithPreviousRaw<T> = T extends Writable<unknown> ? WithPrevious<T> : WithPrevious<Writable<T>>;

export function withPrevious<T>(initialValue: T) {
	type Value = UnpackWritable<T>;
	const isWritableInitialValue = isWritable<T, Writable<T>>(initialValue);

	const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);
	type PreviousValue = Tagged<Value, 'Previous Value'>;
	const { subscribe, set, update } = writableRes;

	let previousValue: PreviousValue;
	function setPreviousValue(value: T) {
		previousValue = value as PreviousValue;
	}

	const initValue = isWritableInitialValue ? get(initialValue) : initialValue;
	setPreviousValue(initValue);

	return Object.assign({}, writableRes, {
		subscribe: (
			run: (value: Value, previousValue: PreviousValue) => void,
			invalidate?: () => void,
		) => {
			return subscribe((value) => {
				run(value as Value, previousValue);
				setPreviousValue(value);
			}, invalidate);
		},
		set: (value: T) => {
			setPreviousValue(get(writableRes));
			set(value);
		},
		update: (updater: Updater<T>) => {
			setPreviousValue(get(writableRes));
			update(updater);
		},
		get previous() {
			return previousValue;
		},
	}) as unknown as WithPreviousRaw<T>;
}
