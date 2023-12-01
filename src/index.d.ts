type Ctor<T> = (() => T) | (new () => T);

type AsyncHooks = {
    createHook: any,
    executionAsyncId: any,
}

export function factory(): {
    provide: Provide;
    destroy: Destroy;
    set_async_hooks: (asyncHooks: AsyncHooks) => Isolate;
};

export type Provide = <T>(ctor: Ctor<T>) => T;
export type Destroy = (...args: Ctor<any>[]) => void;
export type Isolate = <T>(fn: () => Promise<T>) => Promise<T>;