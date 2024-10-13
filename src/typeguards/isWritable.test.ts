import { describe, expect, it } from 'bun:test';
import { writable } from 'svelte/store';
import { isWritable } from './isWritable';

describe('isWritable', () => {
	it('should return true for a valid writable store', () => {
		const store = writable(0);
		expect(isWritable(store)).toBe(true);
	});

	it('should return false for an object without subscribe method', () => {
		const invalidStore = {
			set: () => {},
			update: () => {}
		};
		expect(isWritable(invalidStore)).toBe(false);
	});

	it('should return false for an object without set method', () => {
		const invalidStore = {
			subscribe: () => {},
			update: () => {}
		};
		expect(isWritable(invalidStore)).toBe(false);
	});

	it('should return false for an object without update method', () => {
		const invalidStore = {
			subscribe: () => {},
			set: () => {}
		};
		expect(isWritable(invalidStore)).toBe(false);
	});

	it('should return false for a non-object value', () => {
		expect(isWritable(null)).toBe(false);
		expect(isWritable(undefined)).toBe(false);
		expect(isWritable(42)).toBe(false);
		expect(isWritable('string')).toBe(false);
		expect(isWritable([])).toBe(false);
	});

	it('should return false for an object with incorrect method signatures', () => {
		const invalidStore = {
			subscribe: 'not a function',
			set: 'not a function',
			update: 'not a function'
		};
		expect(isWritable(invalidStore)).toBe(false);
	});
});
