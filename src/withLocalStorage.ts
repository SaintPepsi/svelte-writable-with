import type { Updater } from 'svelte/store';
import { get, writable, type Writable } from 'svelte/store';
import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';

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

const baseKey = 'svelte-writable-with:';

/**
 * @param key the key for the localStorage. can be extended with the interface `WithLocalStorageKeys`
 */
export const withLocalStorage = <T, TKey extends string>(
	key: TKey,
	initialValue: T,
): WithLocalStorage<TKey, T> => {
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

			// return initialValue;
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
	} as any;
};
