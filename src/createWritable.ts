import { writable, type Writable } from 'svelte/store';
import { isWithable, type UnpackWritable } from '.';

export function createWritable<T>(value: T): Writable<UnpackWritable<T>> {
	if (isWithable(value)) {
		return value as any;
	}
	return writable(value) as any;
}
