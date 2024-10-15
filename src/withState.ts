import { get, type Writable, writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';
import { reApplyPropertyDescriptors } from './utils/reapplyPropertyDescriptors';

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

	const withStateRes = {
		...writableRes,
		get state() {
			return get(writableRes);
		},
	};

	reApplyPropertyDescriptors(writableRes, withStateRes);

	return withStateRes as any;
};
