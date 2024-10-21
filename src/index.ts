import { isWithable } from './typeguards/isWithable';
import type { UnpackWritable } from './types';
import { withHistory } from './withHistory';
import { withLocalStorage, withLocalStorageBaseKey } from './withLocalStorage';
import { withPrevious } from './withPrevious';
import { withState } from './withState';

const writableWith = {
	state: withState,
	previous: withPrevious,
	localStorage: withLocalStorage,
	history: withHistory,
};

export default writableWith;

export {
	isWithable,
	withHistory,
	withLocalStorage,
	withLocalStorageBaseKey,
	withPrevious,
	withState,
};

export type { UnpackWritable };
