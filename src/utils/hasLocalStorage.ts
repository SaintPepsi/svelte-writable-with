import { BROWSER } from 'esm-env';
export const hasLocalStorage = BROWSER && typeof window !== 'undefined';
