import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import writableWith from '..';
import { isHistoryWithableMethod } from '../typeguards/isHistoryWithableMethod';
import { isLocalStorageWithableMethod } from '../typeguards/isLocalStorageWithableMethod';
import { isPreviousWithableMethod } from '../typeguards/isPreviousWithableMethod';
import { isStateWithableMethod } from '../typeguards/isStateWithableMethod';
import { isWritableMethod } from '../typeguards/isWritableMethod';
import type { WritableWith } from '../types';
import { withLocalStorageBaseKey } from '../withLocalStorage';
import { expectWritableWithReturnPaths } from './expectWritableWithReturnPaths';

const localStorageTestKey = '_TEST';

function checkWithStateKeys<T>(writableWith: T) {
	// prettier-ignore
	expectWritableWithReturnPaths(
        writableWith,
        [
            'set', 'subscribe', 'update',
            'state'
        ]
    );
}

function checkWithPreviousKeys<T>(writableWith: T) {
	// prettier-ignore
	expectWritableWithReturnPaths(
        writableWith,
        [
            'set', 'subscribe', 'update',
            'previous'
        ]
    );
}

function checkWithLocalStorageKeys<T>(writableWith: T) {
	// prettier-ignore
	expectWritableWithReturnPaths(
        writableWith,
        [
            'set', 'subscribe', 'update',
        ]
    );
}

function checkWithHistoryKeys<T>(writableWith: T) {
	// prettier-ignore
	expectWritableWithReturnPaths(
		writableWith,
		[
			'set', 'subscribe', 'update',
			'history', 'popHistory'
		]
	);
}

export function testWritableWithCombination(combination: WritableWith[]) {
	const loggers = ['log', 'debug', 'trace', 'info', 'warn', 'error'] as const;

	type LogFunction = (...args: any) => void;
	type LoggedInvocation = [LogFunction, any[]];

	describe(`GIVEN ${combination.map((ww) => ww.name).join(', ')}`, () => {
		beforeEach((ctx) => {
			localStorage.clear();

			const logs: LoggedInvocation[] = [];

			const original: Record<string, LogFunction> = {};
			for (const logger of loggers) {
				original[logger] = console[logger];
				console[logger] = (...args) => logs.push([original[logger], args]);
			}

			ctx.onTestFailed(() => {
				for (const [logger, data] of logs) {
					logger.call(console, ...data);
				}
			});

			return () => {
				for (const logger of loggers) {
					console[logger] = original[logger];
				}
			};
		});

		const initialValue = 10;

		function createWritableRes() {
			console.log('combination', combination);
			return combination.reduce<any>((currentValueOrWritable, writableWithEntry) => {
				console.log('currentValueOrWritable', currentValueOrWritable);
				console.log('writableWithEntry', writableWithEntry);
				if (isStateWithableMethod(writableWithEntry)) {
					return writableWithEntry(currentValueOrWritable);
				}

				if (isLocalStorageWithableMethod(writableWithEntry)) {
					return writableWithEntry(currentValueOrWritable, localStorageTestKey);
				}

				if (isHistoryWithableMethod(writableWithEntry)) {
					return writableWithEntry(currentValueOrWritable);
				}

				if (isPreviousWithableMethod(writableWithEntry)) {
					return writableWithEntry(currentValueOrWritable);
				}

				if (isWritableMethod(writableWithEntry)) {
					return writableWithEntry(currentValueOrWritable);
				}

				return currentValueOrWritable;
			}, initialValue);
		}

		if (combination.includes(writableWith.state)) {
			it('THEN the resulting writable should have the correct keys', () => {
				const store = createWritableRes();

				checkWithStateKeys(store);
			});

			it('THEN state should match the initial value', () => {
				const store = createWritableRes();

				expect(store.state).toBe(initialValue);
			});
		}

		if (combination.includes(writableWith.previous)) {
			it('THEN the resulting writable should have the correct keys', () => {
				const store = createWritableRes();

				checkWithPreviousKeys(store);
			});

			it('THEN state should match the initial value', () => {
				const store = createWritableRes();

				store.set(20);

				expect(store.previous).toBe(initialValue);
			});
		}

		if (combination.includes(writableWith.localStorage)) {
			it('THEN the resulting writable should have the correct keys', () => {
				const store = createWritableRes();

				checkWithLocalStorageKeys(store);
			});

			it('THEN the value should get stored in localStorage', () => {
				const store = createWritableRes();
				console.log('store', store);

				const value1 = localStorage.getItem(
					`${withLocalStorageBaseKey}${localStorageTestKey}`,
				);

				console.log('value1', value1);
				console.log('get(store)', get(store));

				expect(value1).toBe(null);

				store.set(20);
				const value2 = localStorage.getItem(
					`${withLocalStorageBaseKey}${localStorageTestKey}`,
				);

				console.log('value2', value1);
				console.log('get(store)', get(store));

				expect(value2).toBe(JSON.stringify(20));
			});

			it('THEN the subscriber should fire when a storage event happens', () => {});
		}

		if (combination.includes(writableWith.history)) {
			it('THEN the resulting writable should have the correct keys', () => {
				const store = createWritableRes();

				// prettier-ignore
				checkWithHistoryKeys(store)
			});

			describe('AND the writable has not been updated yet', () => {
				it('THEN history should be an empty array', () => {
					const store = createWritableRes();

					expect(get(store.history)).toEqual([]);
				});

				it('THEN popHistory should return undefined', () => {
					const store = createWritableRes();

					expect(store.popHistory()).toBeUndefined();
				});

				it('THEN set should function correctly', () => {
					const store = createWritableRes();

					store.set(20);

					expect(get(store)).toBe(20);
					expect(get(store.history)).toEqual([10]);
				});

				it('THEN update should function correctly', () => {
					const store = createWritableRes();

					store.update(() => 20);

					expect(get(store)).toBe(20);
					expect(get(store.history)).toEqual([10]);
				});
			});
		}

		it('THEN update should function correctly', () => {
			const store = createWritableRes();
			console.log('store', store);
			store.update(() => 20);

			expect(get(store)).toBe(20);

			store.update((current: number) => current + 10);

			expect(get(store)).toBe(30);
		});

		it('THEN subscribe should function correctly', () => {
			const store = createWritableRes();

			let stateValue = get(store);

			const unsubscribe = store.subscribe((value: unknown) => {
				stateValue = value;
			});

			store.set(20);
			expect(stateValue).toBe(20);

			unsubscribe();
		});
	});
}
