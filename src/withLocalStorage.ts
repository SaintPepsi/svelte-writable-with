import type { Updater } from 'svelte/store';
import { get, type Writable } from 'svelte/store';
import { createWritable } from './createWritable';
import type { UnpackWritable } from './types';
import { hasLocalStorage } from './utils/hasLocalStorage';
import { reApplyPropertyDescriptors } from './utils/reapplyPropertyDescriptors';

type WithLocalStorageRaw<TKey, T> = Omit<T, 'subscribe' | 'set' | 'update'> & {
	set: (value: UnpackWritable<T>) => void;
	update: (updater: Updater<UnpackWritable<T>>) => void;
	subscribe: Writable<UnpackWritable<T>>['subscribe'];
};

/**
 * Thanks to [ViewableGravy](https://github.com/ViewableGravy) for help with the types
 */
export type WithLocalStorage<TKey, T> = WithLocalStorageRaw<
	TKey,
	T extends Writable<unknown> ? T : Writable<T>
>;

export const withLocalStorageBaseKey = 'svelte-writable-with:';

/**
 * @param key the key for the localStorage. can be extended with the interface `WithLocalStorageKeys`
 */
export const withLocalStorage = <T>(initialValue: T, key: string): WithLocalStorage<string, T> => {
	type Value = UnpackWritable<T>;
	const storageKey = `${withLocalStorageBaseKey}${key}`;

	function getStoredValue() {
		if (!hasLocalStorage) return null;
		const storedValue = localStorage.getItem(storageKey);
		if (storedValue === 'undefined') {
			localStorage.removeItem(storageKey);
			return null;
		}

		return storedValue;
	}

	const storedValue = getStoredValue();

	function safeParse(value: string | null): Value | undefined {
		try {
			if (value) {
				return JSON.parse(value);
			}
		} catch (e) {
			console.error(e);
		}
	}

	const writableRes = createWritable(initialValue);

	const parsedValue = safeParse(storedValue);
	if (parsedValue) {
		writableRes.set(parsedValue);
	}

	const { set } = writableRes;

	const storeItem = (value: Value) => {
		if (!hasLocalStorage) return null;
		localStorage.setItem(storageKey, JSON.stringify(value));
	};

	const withPreviousRes = {
		...writableRes,
		set: (value: Value) => {
			storeItem(value);
			set(value);
		},
		update: (updater: Updater<Value>) => {
			const value = updater(get(writableRes));
			storeItem(value);
			set(value);
		},
	};

	reApplyPropertyDescriptors(writableRes, withPreviousRes);

	return withPreviousRes as any;
};
