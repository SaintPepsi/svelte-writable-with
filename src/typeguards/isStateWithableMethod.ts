import writableWith from '..';
import type { WritableWith } from '../types';

export function isStateWithableMethod(
	withable: WritableWith,
): withable is typeof writableWith.state {
	return withable === writableWith.state;
}
