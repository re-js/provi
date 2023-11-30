import { un } from 'unsubscriber'
import { factory } from './src'
import * as client from './client/src'
import * as server from './server/src'

import asyncHooks from 'node:async_hooks';
const { provide, destroy, isolate } = factory(asyncHooks)

test('function service', () => {
  let c = 0
  let Service = () => ++c

  expect(c).toBe(0)
  expect(provide(Service)).toBe(1)
  expect(provide(Service)).toBe(1)
  expect(c).toBe(1)
})

test('class service', () => {
  let c = 0
  class Service {
    c: number
    constructor() {
      this.c = ++c
    }
  }

  expect(c).toBe(0)
  expect(provide(Service)).toEqual({ c: 1 })
  expect(provide(Service)).toEqual({ c: 1 })
  expect(c).toBe(1)
})

test('destroy', () => {
  let spy_a = jest.fn()
  let spy_b = jest.fn()
  let spy_c = jest.fn()

  let A = () => spy_a()
  let B = () => spy_b()
  let C = () => spy_c()

  provide(A)
  provide(B)
  provide(C)

  expect(spy_a).toBeCalledTimes(1)
  expect(spy_b).toBeCalledTimes(1)
  expect(spy_c).toBeCalledTimes(1)

  destroy(A, C)

  provide(A)
  provide(B)
  provide(C)

  expect(spy_a).toBeCalledTimes(2)
  expect(spy_b).toBeCalledTimes(1)
  expect(spy_c).toBeCalledTimes(2)

  destroy()

  provide(A)
  provide(B)
  provide(C)

  expect(spy_a).toBeCalledTimes(3)
  expect(spy_b).toBeCalledTimes(2)
  expect(spy_c).toBeCalledTimes(3)
})

test('client instance', () => {
  let Service = jest.fn().mockImplementation(() => [1])

  expect(client.provide(Service)).toStrictEqual([1])
  expect(client.provide(Service)).toStrictEqual([1])
  expect(Service).toBeCalledTimes(1)

  client.destroy()
  expect(client.provide(Service)).toStrictEqual([1])
  expect(Service).toBeCalledTimes(2)
})

test('server instance', () => {
  let Service = jest.fn().mockImplementation(() => [1])

  expect(server.provide(Service)).toStrictEqual([1])
  expect(server.provide(Service)).toStrictEqual([1])
  expect(Service).toBeCalledTimes(1)

  server.destroy()
  expect(server.provide(Service)).toStrictEqual([1])
  expect(Service).toBeCalledTimes(2)
})

test('destroy the never existed instance', () => {
  const A = () => {}
  destroy(A)
})

test('destroy with unsubscriber', () => {
  const spy = jest.fn()
  const A = () => {
    un(spy)
  }
  provide(A)
  expect(spy).toBeCalledTimes(0)
  destroy()
  expect(spy).toBeCalledTimes(1)
})

test('cycle', () => {

  const A: any = () => provide(B)
  const B = () => provide(A)

  expect(() => {
    provide(B)
  }).toThrowError('Circullar dependency detection')

})

test('isolate', async () => {
  const un_spy = [jest.fn(), jest.fn(), jest.fn()]

  let curr_index = 0
  const A = () => {
    const i = curr_index++
    un(() => un_spy[i]())
    return i
  }

  run_context(0).then((r) => {
    expect(r).toBe(0)
  })
  run_context(1).then((r) => {
    expect(r).toBe(1)
  })
  run_context(2).then((r) => {
    expect(r).toBe(2)
  })

  await new Promise(r => setTimeout(r, 350))

  expect(un_spy[0]).toBeCalled()
  expect(un_spy[1]).toBeCalled()
  expect(un_spy[2]).toBeCalled()


  async function run_context(i: number) {
    const r = await isolate(async () => {
      expect(provide(A)).toBe(i)

      await new Promise(r => {
        expect(provide(A)).toBe(i)

        setTimeout(() => {
          expect(provide(A)).toBe(i)
          r(1)
        }, Math.floor(Math.random() * 100))
      })
      expect(provide(A)).toBe(i)

      expect(un_spy[i]).not.toBeCalled()

      return i
    })

    expect(un_spy[i]).toBeCalled()
    return r
  }

})