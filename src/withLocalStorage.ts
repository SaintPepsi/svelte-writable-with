import type { Updater } from 'svelte/store';
import { get, writable, type Writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';
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
	console.log("typeof window === 'undefined'", typeof window === 'undefined');
	const storageKey = `${withLocalStorageBaseKey}${key}`;

	const isInitialValueWritable = isWritable(initialValue);

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
		if (!hasLocalStorage) return null;
		localStorage.setItem(storageKey, JSON.stringify(value));
	};

	const withPreviousRes = {
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
	};

	reApplyPropertyDescriptors(writableRes, withPreviousRes);

	return withPreviousRes as any;
};
