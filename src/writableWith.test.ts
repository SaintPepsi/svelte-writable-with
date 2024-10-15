import type { writable } from 'svelte/store';
import type { ValueOf } from 'type-fest';
import { describe } from 'vitest';
import writableWith from '.';
import { testWritableWithCombination } from './test/testWritableWithCombination';
import { getCombinations } from './utils/getCombinations';

const { localStorage, previous, state } = writableWith;
type WritableWith = ValueOf<typeof writableWith> | typeof writable;

describe('Writable With Combinations', () => {
	const writableWithMethods = Object.values(writableWith);

	const writableWithCombinations = getCombinations(writableWithMethods);

	writableWithCombinations.forEach((methods) => {
		console.log('methods', methods);

		testWritableWithCombination(methods);
	});
});

/**
 * methods
 * localStorage, previous, state
 *
 * filteredMethods
 * previous, state
 *
 * methods
 * previous, state
 *
 * filteredMethods
 * state
 */
