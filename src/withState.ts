import { get, writable, type Writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';

type WithState<T> = {
	state: T;
};

export type WithStateRaw<T extends Writable<T> | unknown> =
	T extends Writable<infer R> ? T & WithState<R> : Writable<T> & WithState<T>;

export function withState<T extends Writable<T> | unknown>(initialValue: T) {
	const isWritableInitialValue = isWritable(initialValue);
	const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);

	return {
		...writableRes,
		get state() {
			return get(writableRes);
		},
	} as T extends unknown ? WithStateRaw<T> : WithStateRaw<Writable<T>>;
}
