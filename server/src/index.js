import { factory } from 'provi';
import asyncHooks from 'node:async_hooks';

const { provide, destroy, isolate } = factory(asyncHooks);

export {
  provide,
  destroy,
  isolate
}