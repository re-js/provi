# provi

<!--
[![npm version](https://img.shields.io/npm/v/provi?style=flat-square)](https://www.npmjs.com/package/provi) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/provi?style=flat-square)](https://bundlephobia.com/result?p=provi) [![code coverage](https://img.shields.io/coveralls/github/re-js/provi?style=flat-square)](https://coveralls.io/github/re-js/provi)--> 
[![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](index.d.ts)

Minimalistic and cute Service Provider without Dependency Injection overhead.

- You can use it at any place of your application without rewriting your application's architecture or other preparations or initializations.
- Each dependency can be a class or function.
- Feel free with your shared logic

The **service provider** pattern - also called _service locator_ pattern.

```javascript
import { provide } from "provi";

class Db { /* ... */ }
class Server { /* ... */ }

// Define dependencies using "provide" function
export default class App {
  db = provide(Db);
  server = provide(Server);
  // ...
  start() {
    this.db.init();
    // ...
  }
}
```

Installation

```bash
npm install provi
```

Enjoy your code!