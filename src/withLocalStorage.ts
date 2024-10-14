import type { Updater } from 'svelte/store';
import { get, writable, type Writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';

export interface WithLocalStorageKeys {
	_TEST: string;
}

export type WithLocalStorage<TKey, T> = T & {
	set: (value: UnpackWritable<T>) => void;
	update: (updater: Updater<UnpackWritable<T>>) => void;
};

type WithLocalStorageRaw<TKey, T> =
	T extends Writable<unknown> ? WithLocalStorage<TKey, T> : WithLocalStorage<TKey, Writable<T>>;

const baseKey = 'svelte-writable-with:';

/**
 * @param key the key for the localStorage. can be extended with the interface `WithLocalStorageKeys`
 */
export function withLocalStorage<
	T,
	TKey extends keyof WithLocalStorageKeys = keyof WithLocalStorageKeys,
>(key: TKey, initialValue: T) {
	const storageKey = `${baseKey}${key}`;

	const isInitialValueWritable = isWritable(initialValue);

	const storedValue = localStorage.getItem(storageKey);

	function safeParse(value: string | null): T | undefined {
		try {
			if (value) {
				return JSON.parse(value);
			}
		} catch (e) {
			console.error(e);
		}
	}

	const getWritable = (): Writable<T> => {
		const parsedValue = safeParse(storedValue);

		if (isInitialValueWritable) {
			if (parsedValue) {
				initialValue.set(parsedValue);
			}

			return initialValue;
		}

		return writable(parsedValue);
	};

	const writableRes = getWritable();

	const { set } = writableRes;

	const storeItem = (value: T) => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	};

	return Object.assign({}, writableRes, {
		set: (value: T) => {
			storeItem(value);
			set(value);
		},
		update: (updater: Updater<T>) => {
			const value = updater(get(writableRes));
			storeItem(value);
			set(value);
		},
	}) as unknown as WithLocalStorageRaw<TKey, T>;
}
