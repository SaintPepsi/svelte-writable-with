import { writable } from 'svelte/store';

export function isWritableMethod(value: any): value is typeof writable {
	return value === writable;
}
