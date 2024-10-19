import { writable } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { isWithable } from './isWithable';

describe('isWithable', () => {
	it('should return true for a valid writable store', () => {
		const store = writable(0);
		expect(isWithable(store)).toBe(true);
	});

	it('should return false for an object without subscribe method', () => {
		const invalidStore = {
			set: () => {},
			update: () => {},
		};
		expect(isWithable(invalidStore)).toBe(false);
	});

	it('should return false for an object without set method', () => {
		const invalidStore = {
			subscribe: () => {},
			update: () => {},
		};
		expect(isWithable(invalidStore)).toBe(false);
	});

	it('should return false for an object without update method', () => {
		const invalidStore = {
			subscribe: () => {},
			set: () => {},
		};
		expect(isWithable(invalidStore)).toBe(false);
	});

	it('should return false for a non-object value', () => {
		expect(isWithable(null)).toBe(false);
		expect(isWithable(undefined)).toBe(false);
		expect(isWithable(42)).toBe(false);
		expect(isWithable('string')).toBe(false);
		expect(isWithable([])).toBe(false);
	});

	it('should return false for an object with incorrect method signatures', () => {
		const invalidStore = {
			subscribe: 'not a function',
			set: 'not a function',
			update: 'not a function',
		};
		expect(isWithable(invalidStore)).toBe(false);
	});

	it('should return false for an object that has writable keys but also additional keys', () => {
		const invalidStore = {
			subscribe: () => {},
			set: () => {},
			update: () => {},
			great: () => {},
		};
		expect(isWithable(invalidStore)).toBe(true);
	});
});
