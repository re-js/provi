// import { attach } from 'unsubscriber'
import { provide, destroy } from '.'

test('function service', () => {
  let c = 0;
  let Service = () => ++c

  expect(c).toBe(0)
  expect(provide(Service)).toBe(1)
  expect(provide(Service)).toBe(1)
  expect(c).toBe(1)
})

// test('destroy several', () => {

  
// })

