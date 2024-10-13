import type { Writable } from 'svelte/store';
import { z } from 'zod';

export function isWritable<TValue extends unknown, TWritable extends Writable<TValue>>(
	value: TWritable | TValue,
): value is TWritable {
	const parseRes = z
		.object({
			subscribe: z.function(z.tuple([]), z.any()),
			set: z.function(z.tuple([z.any()]), z.void()),
			update: z.function(z.tuple([z.function(z.tuple([z.any()]), z.any())]), z.void()),
		})
		.safeParse(value);
	return parseRes.success;
}
