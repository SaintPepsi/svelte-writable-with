import { isWithable } from './typeguards/isWithable';
import type { UnpackWritable } from './types';
import { withLocalStorage, withLocalStorageBaseKey } from './withLocalStorage';
import { withPrevious } from './withPrevious';
import { withState } from './withState';

const writableWith = {
	state: withState,
	previous: withPrevious,
	localStorage: withLocalStorage,
};

export default writableWith;

export { isWithable, withLocalStorage, withLocalStorageBaseKey, withPrevious, withState };

export type { UnpackWritable };
