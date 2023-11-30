type Ctor<T> = (() => T) | (new () => T);

export function factory(
    asyncHooks?: {
        createHook: any,
        executionAsyncId: any,
    }
): {
    provide: <T>(ctor: Ctor<T>) => T;
    destroy: (...args: Ctor<any>[]) => void;
    isolate: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Provide = ReturnType<typeof factory>["provide"];
export type Destroy = ReturnType<typeof factory>["destroy"];
export type Isolate = ReturnType<typeof factory>["isolate"];