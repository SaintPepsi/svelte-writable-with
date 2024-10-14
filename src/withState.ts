import { get, type Writable, writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';

type WithStateRaw<T> = Omit<T, 'state'> & {
	// set: Writable<UnpackWritable<T>>['set'];
	// update: Writable<UnpackWritable<T>>['update'];
	// subscribe: Writable<UnpackWritable<T>>['subscribe'];
	state: UnpackWritable<T>;
};

// prettier-ignore
/**
 * Thanks to [ViewableGravy](https://github.com/ViewableGravy) for help with the types
 */
export type WithState<T> = WithStateRaw<
    T extends Writable<unknown> 
        ? T 
        : Writable<T>
>

export const withState = <T>(initialValue: T): WithState<T> => {
	const isWritableInitialValue = isWritable(initialValue);
	const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);

	return {
		...writableRes,
		get state() {
			return get(writableRes);
		},
	} as any;
};
