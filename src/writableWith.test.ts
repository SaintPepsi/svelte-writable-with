import { describe } from 'vitest';
import writableWith from '.';
import { testWritableWithCombination } from './test/testWritableWithCombination';
import { getCombinations } from './utils/getCombinations';

describe('Writable With Combinations', () => {
	const writableWithMethods = Object.values(writableWith);

	const writableWithCombinations = getCombinations(writableWithMethods);

	writableWithCombinations.forEach((methods) => {
		testWritableWithCombination(methods);
	});
});
