import { set_async_hooks } from 'provi/client';
import asyncHooks from 'async_hooks';

const isolate = set_async_hooks(asyncHooks);

export {
  isolate
}