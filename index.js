const
  { unsubscriber, collect, run } = require('unsubscriber'),

  factory = () => {
    const
      services = new Map(),

      provide = (ctor) => {
        let h = services.get(ctor)
        if (!h) {
          const unsubs = unsubscriber()
          try {
            h = [
              collect(unsubs, () => (
                ctor.prototype === void 0
                  ? ctor()
                  : new ctor()
              )),
              unsubs
            ]
          } catch (e) {
            if (e.message === 'Maximum call stack size exceeded') {
              console.error(e);
              throw new Error('Circullar dependency detection');
            } else {
              throw e;
            }
          }
          services.set(ctor, h)
        }
        return h[0]
      },

      destroy = function () {
        const keys = new Set(
          arguments.length > 0
            ? arguments
            : services.keys()
        )
        for (let key of keys) {
          const h = services.get(key)
          if (h) {
            services.delete(key)
            run(h[1])
          }
        }
      }

    return {
      provide,
      destroy
    }
  }

module.exports = {
  factory
}