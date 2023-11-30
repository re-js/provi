type Ctor<T> = (() => T) | (new () => T);

export function factory(
    asyncHooks?: {
        createHook: any,
        executionAsyncId: any,
    }
): {
    provide: Provide;
    destroy: Destroy;
    isolate?: Isolate;
};

export type Provide = <T>(ctor: Ctor<T>) => T;
export type Destroy = (...args: Ctor<any>[]) => void;
export type Isolate = <T>(fn: () => Promise<T>) => Promise<T>;