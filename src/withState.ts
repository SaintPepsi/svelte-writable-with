import { get, writable, type Writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';

export interface WithState<T> extends Writable<T> {
	state: T;
}

export function withState<T>(initialValue: T | Writable<T>): WithState<T> {
	const isWritableInitialValue = isWritable<T>(initialValue);
	const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);

	return {
		...writableRes,
		get state() {
			return get(writableRes);
		},
	};
}
