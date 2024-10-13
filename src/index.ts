import { isWritable } from './typeguards/isWritable';
import { withLocalStorage, WithLocalStorageKeys, WithLocalStorageRaw } from './withLocalStorage';
import { withPrevious, WithPreviousRaw } from './withPrevious';
import { withState, WithStateRaw } from './withState';
const writableWith = {
	state: withState,
	previous: withPrevious,
	localStorage: withLocalStorage,
};

export default writableWith;

export type WithLocalStorage<T> = WithLocalStorageRaw<T>;
export type WithPrevious<T> = WithPreviousRaw<T>;
export type WithState<T> = WithStateRaw<T>;

export { isWritable, withLocalStorage, WithLocalStorageKeys, withPrevious, withState };
