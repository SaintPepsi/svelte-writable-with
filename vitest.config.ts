import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		setupFiles: ['vitest-localstorage-mock'],
		mockReset: false,
	},
});
