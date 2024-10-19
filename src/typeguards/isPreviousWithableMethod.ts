import writableWith from '..';
import type { WritableWith } from '../types';

export function isPreviousWithableMethod(
	withable: WritableWith,
): withable is typeof writableWith.previous {
	return withable === writableWith.previous;
}
