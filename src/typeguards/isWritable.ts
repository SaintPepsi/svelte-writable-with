import type { Writable } from "svelte/store";
import { z } from "zod";

export function isWritable<T>(value: unknown): value is Writable<T> {
    return z
        .object({
            subscribe: z.function(z.tuple([]), z.any()),
            set: z.function(z.tuple([z.any()]), z.void()),
            update: z.function(z.tuple([z.function(z.tuple([z.any()]), z.any())]), z.void()),
        })
        .safeParse(value).success;
}
