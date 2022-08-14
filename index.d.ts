type Constructor<T = any> = (() => T) | (new () => T);

export declare const provide: <T>(Constructor: Constructor<T>) => T;
export declare const destroy: {
  (...Constructors: Constructor[]): void;
  (): void
};