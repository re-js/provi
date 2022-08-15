import { un } from 'unsubscriber'
import { factory } from 'provi'
import * as client from 'provi/client'
import * as server from 'provi/server'

const { provide, destroy } = factory();

test('function service', () => {
  let c = 0;
  let Service = () => ++c

  expect(c).toBe(0)
  expect(provide(Service)).toBe(1)
  expect(provide(Service)).toBe(1)
  expect(c).toBe(1)
})

test('class service', () => {
  let c = 0;
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