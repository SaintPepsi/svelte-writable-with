import { get, type Updater, type Writable } from 'svelte/store';
import type { SetParameterType, Tagged } from 'type-fest';
import { createWritable } from './createWritable';
import type { UnpackWritable } from './types';
import { reApplyPropertyDescriptors } from './utils/reapplyPropertyDescriptors';

type PreviousValue<T> = Tagged<T, 'Previous Value'>;
// subscribe: (
//     this: void,
//     run: (value: UnpackWritable<T>, previousValue: PreviousValue<UnpackWritable<T>>) => void,
//     invalidate?: Invalidator<T>,
// ) => Unsubscriber;
type WithPreviousRaw<T> = Omit<T, 'subscribe' | 'set' | 'update' | 'previous'> & {
	subscribe: SetParameterType<
		Writable<UnpackWritable<T>>['subscribe'],
		{ 1: (value: UnpackWritable<T>, previousValue: PreviousValue<UnpackWritable<T>>) => void }
	>;
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

	const writableRes = createWritable(initialValue);
	const { subscribe, set, update } = writableRes;
	type PreviousValue = Tagged<Value, 'Previous Value'>;

	let previousValue: PreviousValue;
	function setPreviousValue(value: Value) {
		previousValue = value as PreviousValue;
	}

	const initValue = get(writableRes);
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
		set: (value: Value) => {
			setPreviousValue(get(writableRes));
			set(value);
		},
		update: (updater: Updater<Value>) => {
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
