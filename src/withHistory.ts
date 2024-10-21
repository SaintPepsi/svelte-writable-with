import { get, writable, type Unsubscriber, type Updater, type Writable } from 'svelte/store';
import { createWritable } from './createWritable';
import type { UnpackWritable } from './types';
import { reApplyPropertyDescriptors } from './utils/reapplyPropertyDescriptors';

type History<T> = UnpackWritable<T>[];

type WithHistorySubscribeRun<T> = (value: UnpackWritable<T>, history: History<T>) => void;
type WithHistoryInvalidate<T> = Parameters<Writable<UnpackWritable<T>>['subscribe']>['1'];

type WithHistoryRawSubscribe<T> = (
	run: WithHistorySubscribeRun<T>,
	invalidate?: WithHistoryInvalidate<T>,
) => Unsubscriber;

type WithHistoryRaw<T> = Omit<T, 'subscribe' | 'set' | 'update' | 'history' | 'popHistory'> & {
	subscribe: WithHistoryRawSubscribe<T>;
	set: (value: UnpackWritable<T>) => void;
	update: (updater: Updater<UnpackWritable<T>>) => void;
	history: Writable<History<T>>;
	popHistory: () => UnpackWritable<T> | undefined;
};

/**
 * Thanks to [ViewableGravy](https://github.com/ViewableGravy) for help with the types
 */
export type WithHistory<T> = WithHistoryRaw<T extends Writable<unknown> ? T : Writable<T>>;

export const withHistory = <T>(initialValue: T): WithHistory<T> => {
	type Value = UnpackWritable<T>;
	const writableRes = createWritable(initialValue);

	const { subscribe, set } = writableRes;

	const historyWritable = writable<History<T>>([]);

	const withHistoryRes = {
		...writableRes,
		subscribe: (run: WithHistorySubscribeRun<T>, invalidate?: WithHistoryInvalidate<T>) => {
			return subscribe((value) => {
				run(value, get(historyWritable));
			}, invalidate);
		},
		set: (value: Value) => {
			historyWritable.update((history) => [...history, get(writableRes)]);
			set(value);
		},
		update: (updater: Updater<Value>) => {
			historyWritable.update((history) => [...history, get(writableRes)]);
			writableRes.update(updater);
		},
		get history() {
			return historyWritable;
		},
		popHistory: () => {
			const lastEntry = get(historyWritable).at(-1);
			if (lastEntry) {
				historyWritable.update((history) => history.slice(0, -1));
				set(lastEntry);
			}
			return lastEntry;
		},
	};

	reApplyPropertyDescriptors(writableRes, withHistoryRes);

	return withHistoryRes as any;
};
