import writableWith from '..';
import type { WritableWith } from '../types';

export function isHistoryWithableMethod(
	withable: WritableWith,
): withable is typeof writableWith.history {
	return withable === writableWith.history;
}
