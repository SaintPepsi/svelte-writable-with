import { get, type Unsubscriber, type Updater, type Writable } from 'svelte/store';
import { createWritable } from './createWritable';
import type { UnpackWritable } from './types';
import { reApplyPropertyDescriptors } from './utils/reapplyPropertyDescriptors';

type WithPreviousRawSubscribe<T> = (
	run: (value: UnpackWritable<T>, previousValue: UnpackWritable<T>) => void,
	invalidate?: Parameters<Writable<UnpackWritable<T>>['subscribe']>['1'],
) => Unsubscriber;

type WithPreviousRaw<T> = Omit<T, 'subscribe' | 'set' | 'update' | 'previous'> & {
	subscribe: WithPreviousRawSubscribe<T>;
	set: (value: UnpackWritable<T>) => void;
	update: (updater: Updater<UnpackWritable<T>>) => void;
	previous: UnpackWritable<T>;
};

/**
 * Thanks to [ViewableGravy](https://github.com/ViewableGravy) for help with the types
 */
export type WithPrevious<T> = WithPreviousRaw<T extends Writable<unknown> ? T : Writable<T>>;

export const withPrevious = <T>(initialValue: T): WithPrevious<T> => {
	type Value = UnpackWritable<T>;

	const writableRes = createWritable(initialValue);
	const { subscribe, set, update } = writableRes;

	const initValue = get(writableRes);
	let previousValue: Value = initValue;

	const withPreviousRes = {
		...writableRes,
		subscribe: (
			run: (value: Value, previousValue: Value) => void,
			invalidate?: Parameters<Writable<UnpackWritable<T>>['subscribe']>['1'],
		) => {
			return subscribe((value) => {
				console.log('previousValue', previousValue);
				run(value, previousValue);
			}, invalidate);
		},
		set: (value: Value) => {
			previousValue = get(writableRes);
			set(value);
		},
		update: (updater: Updater<Value>) => {
			previousValue = get(writableRes);
			update(updater);
		},
		get previous() {
			return previousValue;
		},
	};

	reApplyPropertyDescriptors(writableRes, withPreviousRes);

	return withPreviousRes as any;
};
