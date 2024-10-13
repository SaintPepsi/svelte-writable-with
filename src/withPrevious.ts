import { get, writable, type Unsubscriber, type Updater, type Writable } from "svelte/store";
import type { Tagged } from "type-fest";
import { isWritable } from "./typeguards/isWritable";

type PreviousValue<T> = Tagged<T, "Previous Value">;

type SubscriberWithPrevious<T> = (value: T, previousValue: PreviousValue<T>) => void;

export interface WithPrevious<T> extends Writable<T> {
    subscribe(this: void, run: SubscriberWithPrevious<T>, invalidate?: () => void): Unsubscriber;
    previous: PreviousValue<T>;
    state: T;
}

export function withPrevious<T>(initialValue: T | Writable<T>): WithPrevious<T> {
    const isWritableInitialValue = isWritable<T>(initialValue);

    const writableRes = isWritableInitialValue ? initialValue : writable(initialValue);
    const { subscribe, set, update } = writableRes;

    let previousValue = (isWritableInitialValue ? get(initialValue) : initialValue) as PreviousValue<T>;

    function subscribeWithPrevious(run: SubscriberWithPrevious<T>, invalidate: () => void) {
        return subscribe((value) => {
            run(value, previousValue);
            previousValue = value as PreviousValue<T>;
        }, invalidate);
    }

    return {
        ...writableRes,
        subscribe: subscribeWithPrevious,
        set: (value: T) => {
            previousValue = get(writableRes) as PreviousValue<T>;
            set(value);
        },
        update: (updater: Updater<T>) => {
            previousValue = get(writableRes) as PreviousValue<T>;
            update(updater);
        },
        get previous() {
            return previousValue;
        },
        get state() {
            return get(writableRes);
        },
    };
}
