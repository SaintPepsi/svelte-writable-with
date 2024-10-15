import { describe, expect, it, vi } from 'vitest';
import { getCombinations } from './getCombinations';

const logNames = false;
function logFnNames(combinations: ReturnType<typeof vi.fn>[][]) {
	if (!logNames) return;
	combinations.forEach((fns) => {
		const names = fns
			.map((fn) => {
				return fn.getMockName();
			})
			.join(', ');
		console.log('names', fns.length, names);
	});
}

describe('getCombinations', () => {
	describe('GIVEN the combinations values are strings', () => {
		it('should give correct number of combinations for 2 strings', () => {
			const combinations = getCombinations(['foo', 'bar']);

			expect(combinations.length).toBe(3);
		});

		it('should give correct number of combinations for 3 strings', () => {
			const combinations = getCombinations(['foo', 'bar', 'baz']);

			expect(combinations.length).toBe(7);
		});

		it('should give correct number of combinations for 4 strings', () => {
			const combinations = getCombinations(['foo', 'bar', 'baz', 'qux']);

			expect(combinations.length).toBe(15);
		});

		it('should give correct number of combinations for 5 strings', () => {
			const combinations = getCombinations(['foo', 'bar', 'baz', 'qux', 'quux']);

			expect(combinations.length).toBe(31);
		});
	});

	describe('GIVEN the combinations values are methods', () => {
		it('should give correct number of combinations for 2 methods', () => {
			const fn1 = vi.fn().mockName('fn1');
			const fn2 = vi.fn().mockName('fn2');

			const combinations = getCombinations([fn1, fn2]);
			logFnNames(combinations);

			expect(combinations.length).toBe(3);
		});

		it('should give correct number of combinations for 3 methods', () => {
			const fn1 = vi.fn().mockName('fn1');
			const fn2 = vi.fn().mockName('fn2');
			const fn3 = vi.fn().mockName('fn3');
			const combinations = getCombinations([fn1, fn2, fn3]);
			logFnNames(combinations);

			expect(combinations.length).toBe(7);
		});

		it('should give correct number of combinations for 4 methods', () => {
			const fn1 = vi.fn().mockName('fn1');
			const fn2 = vi.fn().mockName('fn2');
			const fn3 = vi.fn().mockName('fn3');
			const fn4 = vi.fn().mockName('fn4');
			const combinations = getCombinations([fn1, fn2, fn3, fn4]);
			logFnNames(combinations);

			expect(combinations.length).toBe(15);
		});

		it('should give correct number of combinations for 5 methods', () => {
			const fn1 = vi.fn().mockName('fn1');
			const fn2 = vi.fn().mockName('fn2');
			const fn3 = vi.fn().mockName('fn3');
			const fn4 = vi.fn().mockName('fn4');
			const fn5 = vi.fn().mockName('fn5');
			const combinations = getCombinations([fn1, fn2, fn3, fn4, fn5]);

			logFnNames(combinations);

			expect(combinations.length).toBe(31);
		});
	});
});
