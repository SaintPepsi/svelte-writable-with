import writableWith from '..';
import type { WritableWith } from '../types';

export function isLocalStorageWithableMethod(
	withable: WritableWith,
): withable is typeof writableWith.localStorage {
	return withable === writableWith.localStorage;
}
