import { get, writable } from 'svelte/store';
import type { ValueOf } from 'type-fest';
import { beforeEach, describe, expect, it } from 'vitest';
import writableWith from '..';
import { withLocalStorageBaseKey } from '../withLocalStorage';
import { expectWritableWithReturnPaths } from './expectWritableWithReturnPaths';

type WritableWith = ValueOf<typeof writableWith> | typeof writable;

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

export function testWritableWithCombination(combination: WritableWith[]) {
	console.log('combination', combination);

	describe(`GIVEN ${combination.map((ww) => ww.name).join(', ')}`, () => {
		beforeEach(() => {
			localStorage.clear();
		});

		const initialValue = 10;

		function createWritableRes() {
			return combination.reduce<any>((currentValueOrWritable, writableWithEntry) => {
				if (writableWithEntry === writableWith.state) {
					return writableWithEntry(currentValueOrWritable);
				}

				if (writableWithEntry === writableWith.localStorage) {
					return writableWithEntry(currentValueOrWritable, localStorageTestKey);
				}
				if (writableWithEntry === writable) {
					return writableWithEntry(currentValueOrWritable);
				}

				if (writableWithEntry === writableWith.previous) {
					return (writableWithEntry as typeof writableWith.previous)(
						currentValueOrWritable,
					);
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
				const value1 = localStorage.getItem(
					`${withLocalStorageBaseKey}${localStorageTestKey}`,
				);

				expect(value1).toBe(null);

				store.set(20);
				const value2 = localStorage.getItem(
					`${withLocalStorageBaseKey}${localStorageTestKey}`,
				);

				expect(value2).toBe(JSON.stringify(20));
			});

			it('THEN the subscriber should fire when a storage event happens', () => {});
		}

		it('THEN update should function correctly', () => {
			const store = createWritableRes();

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
