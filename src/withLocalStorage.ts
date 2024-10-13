import { get, Updater, writable, type Writable } from 'svelte/store';
import { EmptyObject } from 'type-fest';
import { isWritable } from './typeguards/isWritable';

export interface WithLocalStorageKeys {
	_TEST: string;
}

export type WithLocalStorage = EmptyObject;
export type WithLocalStorageTemp<T> = 'LocalStorage';

export type WithLocalStorageRaw<T extends Writable<T> | unknown> =
	T extends Writable<infer R>
		? T & WithLocalStorageTemp<R>
		: Writable<T> & WithLocalStorageTemp<T>;

const baseKey = 'svelte-writable-with:';

/**
 * @param key the key for the localStorage. can be extended with the interface `WithLocalStorageKeys`
 */
export function withLocalStorage<
	TKey extends keyof WithLocalStorageKeys,
	T extends Writable<WithLocalStorageKeys[TKey]> | unknown,
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

	return {
		...writableRes,
		set: (value: T) => {
			storeItem(value);
			set(value);
		},
		update: (updater: Updater<T>) => {
			const value = updater(get(writableRes));
			storeItem(value);
			set(value);
		},
	} as T extends unknown ? WithLocalStorageRaw<T> : WithLocalStorageRaw<Writable<T>>;
}
