import { isWritable } from './typeguards/isWritable';
import { withLocalStorage, WithLocalStorageKeys } from './withLocalStorage';
import { withPrevious } from './withPrevious';
import { withState } from './withState';
const writableWith = {
	state: withState,
	previous: withPrevious,
	localStorage: withLocalStorage,
};

export default writableWith;

export { isWritable, withLocalStorage, WithLocalStorageKeys, withPrevious, withState };
