import { writable, type Writable } from 'svelte/store';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { withLocalStorage, type WithLocalStorage } from './withLocalStorage';
import { withPrevious, type WithPrevious } from './withPrevious';
import { withState, type WithState } from './withState';

// for some reason `expectTypeOf` is not working

describe('Types Test', () => {
	describe('GIVEN you pass a raw value', () => {
		it('THEN withState should have the correct type', () => {
			const writeState = withState('test');

			expect(writeState.set).toBeDefined();
			expect(writeState.subscribe).toBeDefined();
			expect(writeState.update).toBeDefined();
			expect(writeState.state).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeState).toEqualTypeOf<
                WithState<Writable<string>>
            >();
		});

		it('THEN withPrevious should have the correct type', () => {
			const writePrevious = withPrevious('test');

			expect(writePrevious.set).toBeDefined();
			expect(writePrevious.subscribe).toBeDefined();
			expect(writePrevious.update).toBeDefined();
			expect(writePrevious.previous).toBeDefined();

			// prettier-ignore
			expectTypeOf(writePrevious).toEqualTypeOf<
                WithPrevious<Writable<string>>
            >();
		});

		it('THEN withLocalStorage should have the correct type', () => {
			const writeLocalStorage = withLocalStorage('_TEST', 'test');
			expect(writeLocalStorage.set).toBeDefined();
			expect(writeLocalStorage.subscribe).toBeDefined();
			expect(writeLocalStorage.update).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeLocalStorage).toEqualTypeOf<
				WithLocalStorage<'_TEST', Writable<string>>
			>();
		});
	});

	describe('GIVEN you pass a typed value', () => {
		it('THEN withState should have the correct type', () => {
			const writeState = withState('test' as const);

			expect(writeState.set).toBeDefined();
			expect(writeState.subscribe).toBeDefined();
			expect(writeState.update).toBeDefined();
			expect(writeState.state).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeState).toEqualTypeOf<
                WithState<Writable<'test'>>
            >();
		});

		it('THEN withPrevious should have the correct type', () => {
			const writePrevious = withPrevious('test' as const);

			expect(writePrevious.set).toBeDefined();
			expect(writePrevious.subscribe).toBeDefined();
			expect(writePrevious.update).toBeDefined();
			expect(writePrevious.previous).toBeDefined();

			// prettier-ignore
			expectTypeOf(writePrevious).toEqualTypeOf<
                WithPrevious<Writable<'test'>>
            >();
		});

		it('THEN withLocalStorage should have the correct type', () => {
			const writeLocalStorage = withLocalStorage('_TEST', 'test' as const);

			expect(writeLocalStorage.set).toBeDefined();
			expect(writeLocalStorage.subscribe).toBeDefined();
			expect(writeLocalStorage.update).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeLocalStorage).toEqualTypeOf<
				WithLocalStorage<'_TEST', Writable<'test'>>
			>();
		});
	});

	describe('GIVEN you pass a writable value with raw value', () => {
		it('THEN withState should have the correct type', () => {
			const writeState = withState(writable('test'));

			expect(writeState.set).toBeDefined();
			expect(writeState.subscribe).toBeDefined();
			expect(writeState.update).toBeDefined();
			expect(writeState.state).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeState).toEqualTypeOf<
                WithState<Writable<string>>
            >();
		});

		it('THEN withPrevious should have the correct type', () => {
			const writePrevious = withPrevious(writable('test'));

			expect(writePrevious.set).toBeDefined();
			expect(writePrevious.subscribe).toBeDefined();
			expect(writePrevious.update).toBeDefined();
			expect(writePrevious.previous).toBeDefined();

			// prettier-ignore
			expectTypeOf(writePrevious).toEqualTypeOf<
                WithPrevious<Writable<string>>
            >();
		});

		it('THEN withLocalStorage should have the correct type', () => {
			const writeLocalStorage = withLocalStorage('_TEST', writable('test'));

			expect(writeLocalStorage.set).toBeDefined();
			expect(writeLocalStorage.subscribe).toBeDefined();
			expect(writeLocalStorage.update).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeLocalStorage).toEqualTypeOf<
                WithLocalStorage<"_TEST", Writable<string>>
            >();
		});
	});

	describe('GIVEN you pass a writable value with typed value', () => {
		it('THEN withState should have the correct type', () => {
			const writeState = withState(writable('test' as const));

			expect(writeState.set).toBeDefined();
			expect(writeState.subscribe).toBeDefined();
			expect(writeState.update).toBeDefined();
			expect(writeState.state).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeState).toEqualTypeOf<
                WithState<Writable<'test'>>
            >();
		});

		it('THEN withPrevious should have the correct type', () => {
			const writePrevious = withPrevious(writable('test' as const));

			expect(writePrevious.set).toBeDefined();
			expect(writePrevious.subscribe).toBeDefined();
			expect(writePrevious.update).toBeDefined();
			expect(writePrevious.previous).toBeDefined();

			// prettier-ignore
			expectTypeOf(writePrevious).toEqualTypeOf<
                WithPrevious<Writable<'test'>>
            >();
		});

		it('THEN withLocalStorage should have the correct type', () => {
			const writeLocalStorage = withLocalStorage('_TEST', writable('test' as const));

			expect(writeLocalStorage.set).toBeDefined();
			expect(writeLocalStorage.subscribe).toBeDefined();
			expect(writeLocalStorage.update).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeLocalStorage).toEqualTypeOf<
                WithLocalStorage<"_TEST", Writable<"test">>
            >();
		});
	});

	describe('GIVEN you pass a withState with raw value', () => {
		it('THEN withPrevious should have the correct type', () => {
			const writeState = withPrevious(withState('test'));

			expect(writeState.set).toBeDefined();
			expect(writeState.subscribe).toBeDefined();
			expect(writeState.update).toBeDefined();
			expect(writeState.state).toBeDefined();
			expect(writeState.previous).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeState).toEqualTypeOf<
                WithPrevious<WithState<Writable<string>>>
            >();
		});

		it('THEN withLocalStorage should have the correct type', () => {
			const writePrevious = withLocalStorage('_TEST', withState('test'));

			expect(writePrevious.set).toBeDefined();
			expect(writePrevious.subscribe).toBeDefined();
			expect(writePrevious.update).toBeDefined();
			expect(writePrevious.state).toBeDefined();

			// prettier-ignore
			expectTypeOf(writePrevious).toEqualTypeOf<
                WithLocalStorage<
                    "_TEST",
                    WithState<Writable<string>>
                >
			>();
		});

		describe('AND you pass withPrevious', () => {
			it('THEN withLocalStorage should have the correct type', () => {
				const writePrevious = withLocalStorage('_TEST', withPrevious(withState('test')));

				expect(writePrevious.set).toBeDefined();
				expect(writePrevious.subscribe).toBeDefined();
				expect(writePrevious.update).toBeDefined();
				expect(writePrevious.state).toBeDefined();
				expect(writePrevious.previous).toBeDefined();

				// prettier-ignore
				expectTypeOf(writePrevious).toEqualTypeOf<
                    WithLocalStorage<
                        "_TEST",
                        WithPrevious<
                            WithState<Writable<string>>
                        >
                    >
				>();
			});
		});

		describe('AND you pass withLocalStorage', () => {
			it('THEN withPrevious should have the correct type', () => {
				const writePrevious = withPrevious(withLocalStorage('_TEST', withState('test')));

				expect(writePrevious.set).toBeDefined();
				expect(writePrevious.subscribe).toBeDefined();
				expect(writePrevious.update).toBeDefined();
				expect(writePrevious.state).toBeDefined();
				expect(writePrevious.previous).toBeDefined();

				// prettier-ignore
				expectTypeOf(writePrevious).toEqualTypeOf<
                    WithPrevious<
                        WithLocalStorage<
                            "_TEST",
                            WithState<Writable<string>>
                        >
                    >
				>();
			});
		});
	});

	describe('GIVEN you pass a withState with typed value', () => {
		it('THEN withPrevious should have the correct type', () => {
			const writeState = withPrevious(withState('test' as const));

			expect(writeState.set).toBeDefined();
			expect(writeState.subscribe).toBeDefined();
			expect(writeState.update).toBeDefined();
			expect(writeState.state).toBeDefined();
			expect(writeState.previous).toBeDefined();

			// prettier-ignore
			expectTypeOf(writeState).toEqualTypeOf<
                WithPrevious<WithState<Writable<'test'>>>
            >();
		});

		it('THEN withLocalStorage should have the correct type', () => {
			const writePrevious = withLocalStorage('_TEST', withState('test' as const));

			expect(writePrevious.set).toBeDefined();
			expect(writePrevious.subscribe).toBeDefined();
			expect(writePrevious.update).toBeDefined();
			expect(writePrevious.state).toBeDefined();

			// prettier-ignore
			expectTypeOf(writePrevious).toEqualTypeOf<
                WithLocalStorage<
                    "_TEST",
                    WithState<Writable<"test">>
                >
			>();
		});

		describe('AND you pass withLocalStorage', () => {
			it('THEN withPrevious should have the correct type', () => {
				const writePrevious = withPrevious(
					withLocalStorage('_TEST', withState('test' as const)),
				);

				expect(writePrevious.set).toBeDefined();
				expect(writePrevious.subscribe).toBeDefined();
				expect(writePrevious.update).toBeDefined();
				expect(writePrevious.state).toBeDefined();
				expect(writePrevious.previous).toBeDefined();

				// prettier-ignore
				expectTypeOf(writePrevious).toEqualTypeOf<
                    WithPrevious<
                        WithLocalStorage<
                            "_TEST",
                            WithState<Writable<"test">>
                        >
                    >
				>();
			});
		});
	});
});
