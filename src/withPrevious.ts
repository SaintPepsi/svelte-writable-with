import {
	get,
	writable,
	type Invalidator,
	type Unsubscriber,
	type Updater,
	type Writable,
} from 'svelte/store';
import type { Tagged } from 'type-fest';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';
import { reApplyPropertyDescriptors } from './utils/reapplyPropertyDescriptors';

type PreviousValue<T> = Tagged<T, 'Previous Value'>;

type WithPreviousRaw<T> = Omit<T, 'subscribe' | 'set' | 'update' | 'previous'> & {
	subscribe: (
		this: void,
		run: (value: UnpackWritable<T>, previousValue: PreviousValue<UnpackWritable<T>>) => void,
		invalidate?: Invalidator<UnpackWritable<T>>,
	) => Unsubscriber;
	set: (value: UnpackWritable<T>) => void;
	update: (updater: Updater<UnpackWritable<T>>) => void;
	previous: PreviousValue<UnpackWritable<T>>;
};

/**
 * Thanks to [ViewableGravy](https://github.com/ViewableGravy) for help with the types
 */
export type WithPrevious<T> = WithPreviousRaw<T extends Writable<unknown> ? T : Writable<T>>;

export const withPrevious = <T>(initialValue: T): WithPrevious<T> => {
	type Value = UnpackWritable<T>;
	const isWritableInitialValue = isWritable(initialValue);

	const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);
	const { subscribe, set, update } = writableRes;
	type PreviousValue = Tagged<Value, 'Previous Value'>;

	let previousValue: PreviousValue;
	function setPreviousValue(value: T) {
		previousValue = value as PreviousValue;
	}

	const initValue = isWritableInitialValue ? get(initialValue) : initialValue;
	setPreviousValue(initValue);

	const withPreviousRes = {
		...writableRes,
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
	};

	reApplyPropertyDescriptors(writableRes, withPreviousRes);

	return withPreviousRes as any;
};
