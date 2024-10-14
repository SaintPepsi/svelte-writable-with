import { isWritable } from './typeguards/isWritable';
import type { UnpackWritable } from './types';
import { withLocalStorage } from './withLocalStorage';
import { withPrevious } from './withPrevious';
import { withState } from './withState';

const writableWith = {
	state: withState,
	previous: withPrevious,
	localStorage: withLocalStorage,
};

export default writableWith;

export { isWritable, withLocalStorage, withPrevious, withState };

export type { UnpackWritable };
