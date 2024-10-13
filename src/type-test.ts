import { writable } from 'svelte/store';
import { Simplify } from 'type-fest';
import { withLocalStorage } from './withLocalStorage';
import { withPrevious } from './withPrevious';
import { withState } from './withState';

const write = writable('test' as const);

const writeState = withState(write);
const writeStatePrevious = withPrevious(writeState);
const writeStatePreviousLocalStorage = withLocalStorage('_TEST', writeStatePrevious);

type PrettyWrite = Simplify<typeof write>;
type PrettyWriteState = Simplify<typeof writeState>;
type PrettyWriteStatePrevious = Simplify<typeof writeStatePrevious>;
type PrettyWriteStatePreviousLocalStorage = Simplify<typeof writeStatePreviousLocalStorage>;
