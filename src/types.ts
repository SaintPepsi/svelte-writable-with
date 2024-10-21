import type { writable, Writable } from 'svelte/store';
import type { ValueOf } from 'type-fest';
import type writableWith from '.';

// Gets the value of the writable
export type UnpackWritable<T> = T extends Writable<infer R> ? R : T;
export type WritableWith = ValueOf<typeof writableWith> | typeof writable;
