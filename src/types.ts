import type { Writable } from 'svelte/store';

// Gets the value of the writable
export type UnpackWritable<T> = T extends Writable<infer R> ? R : T;
