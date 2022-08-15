type Constructor<T = any> = (() => T) | (new () => T);

type Provide = <T>(Constructor: Constructor<T>) => T;
type Destroy = {
  (...Constructors: Constructor[]): void;
  (): void
};

export declare const factory: () => {
  provide: Provide
  destroy: Destroy
}