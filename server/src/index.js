import { factory } from 'provi';
import asyncHooks from 'async_hooks';

const { provide, destroy, isolate } = factory(asyncHooks);

export {
  provide,
  destroy,
  isolate
}