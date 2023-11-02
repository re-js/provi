const
  { unsubscriber, collect, run } = require('unsubscriber'),

  async_hooks = typeof global !== 'undefined'
    && require(
      [97, 115, 121, 110, 99, 95, 104, 111, 111, 107, 115]
        .map(code => String.fromCharCode(code))
        .join('')
    ),

  factory = () => {
    let
      zone_id = 0, // root zone
      hook

    const
      zone_index = new Map(),
      zone_parent_index = new Map(),

      zones = new Map(),

      isolate = (fn) => {
        if (!async_hooks) {
          throw new Error('Isolate only possible on node environment')
        }

        if (!hook) {
          hook = async_hooks.createHook({
            init(async_id, _type, trigger_async_id) {
              zone_index.set(async_id, zone_index.get(trigger_async_id))
            },
            before(async_id) {
              zone_id = zone_index.get(async_id) || 0 // root zone
            },
            destroy(async_id) {
              zone_index.delete(async_id)
            },
          }).enable()
        }
        return new Promise((resolve, reject) => {
          process.nextTick(async () => {
            zone_id = async_hooks.executionAsyncId()
            zone_parent_index.set(zone_id, zone_index.get(zone_id) || 0) // root zone
            zone_index.set(zone_id, zone_id)
            try {
              resolve(await fn())
            } catch (e) {
              reject(e)
            }
            finally {
              zone_parent_index.delete(zone_id)
              destroy()
            }
          })
        })
      },

      get_instances = () => {
        if (!zones.has(zone_id)) {
          zones.set(zone_id, new Map())
        }
        return zones.get(zone_id)
      },

      provide = (ctor) => {
        let h = get_instances().get(ctor)
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
              throw new Error('Circullar dependency detection')
            } else {
              throw e
            }
          }
          get_instances().set(ctor, h)
        }
        return h[0]
      },

      destroy = function () {
        const
          no_arguments = arguments.length === 0,
          keys = new Set(
            no_arguments
              ? get_instances().keys()
              : arguments
          )

        for (let key of keys) {
          const h = get_instances().get(key)
          if (h) {
            get_instances().delete(key)
            run(h[1])
          }
        }

        if (no_arguments && zones.has(zone_id)) {
          zones.delete(zone_id)
        }
      }

    return {
      provide,
      destroy,
      isolate
    }
  }

module.exports = {
  factory
}