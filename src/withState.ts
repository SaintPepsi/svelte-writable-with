import { get, type Writable, writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';

export type WithState<T> = T & {
	state: UnpackWritable<T>;
};

// prettier-ignore
type WithStateRaw<T> = T extends Writable<unknown> 
    ? WithState<T> 
    : WithState<Writable<T>>;

export function withState<T>(initialValue: T) {
	const isWritableInitialValue = isWritable(initialValue);
	const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);

	return Object.assign({}, writableRes, {
		get state() {
			return get(writableRes);
		},
	}) as unknown as WithStateRaw<T>;
}
