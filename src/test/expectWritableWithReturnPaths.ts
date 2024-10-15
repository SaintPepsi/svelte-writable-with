import _ from 'lodash';
import { expect } from 'vitest';

export function expectWritableWithReturnPaths<T>(writableWith: T, keys: string[] = []) {
	expect(keys.length).toBeGreaterThan(0);

	keys.forEach((key) => {
		const hasKey = _.has(writableWith, key);
		expect(hasKey).toBe(true);
	});
}
