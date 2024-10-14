import type { Writable } from 'svelte/store';

// Gets the value of the writable
export type UnpackWritable<T extends Writable<unknown> | unknown> =
	T extends Writable<infer R> ? R : T;
