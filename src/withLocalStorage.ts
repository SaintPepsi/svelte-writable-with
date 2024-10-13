import { get, Updater, writable, type Writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';

export interface WithLocalStorageKeys {
	// _TEST: string;
}

export interface WithLocalStorage<T> extends Writable<T> {
	state: T;
}

const baseKey = 'svelte-writable-with:';

/**
 * @param key the key for the localStorage. can be extended with the interface `WithLocalStorageKeys`
 */
export function withLocalStorage<
	TKey extends keyof WithLocalStorageKeys,
	TValue extends WithLocalStorageKeys[TKey],
>(
	key: TKey,
	initialValue?: TValue | Writable<TValue>,
): WithLocalStorage<WithLocalStorageKeys[TKey]> {
	const isWritableInitialValue = isWritable<TValue>(initialValue);

	const storageKey = `${baseKey}${key}`;
	const storedValue = localStorage.getItem(storageKey);
	const parsedValue = storedValue === null ? initialValue : JSON.parse(storedValue);
	const writableRes = isWritableInitialValue ? parsedValue : writable(parsedValue);
	const { set } = writableRes;

	const storeItem = (value: TValue) => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	};

	return {
		...writableRes,
		set: (value: TValue) => {
			storeItem(value);
			set(value);
		},
		update: (updater: Updater<TValue>) => {
			const value = updater(get(writableRes));
			storeItem(value);
			set(value);
		},
		get state() {
			return get(writableRes);
		},
	};
}
