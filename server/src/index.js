import { factory } from 'provi';
import asyncHooks from 'async_hooks';

const { provide, destroy, set_async_hooks } = factory();
const isolate = set_async_hooks(asyncHooks);

export {
  provide,
  destroy,
  isolate
}