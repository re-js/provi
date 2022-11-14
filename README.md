# provi

[![npm version](https://img.shields.io/npm/v/provi?style=flat-square)](https://www.npmjs.com/package/provi)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/provi?style=flat-square)](https://bundlephobia.com/result?p=provi)
[![code coverage](https://img.shields.io/coveralls/github/re-js/provi?style=flat-square)](https://coveralls.io/github/re-js/provi)
[![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](index.d.ts)

Minimalistic and cute Service Provider for server environment (node.js, bun) and for clients (browser, native).

- You can use it at any place of your application without rewriting your application's architecture or other preparations or initializations.
- Each dependency can be a class or function.
- Feel free with your shared logic.

The **service provider** pattern - also called _service locator_ pattern.

Advantages over Dependency Injection:

  - Zero configuration, easy to use everywhere whole your app.
  - Start-time and run-time dependency resolving, solving the circular dependency problem.
  - Smaller bundle size.

node.js or bun usage

```javascript
import { provide } from "provi/server"

class Db { /* ... */ }

// Define dependencies using "provide" function
export class App {
  db = provide(Db)
  // ...
  start() {
    this.db.init()
    // ...
  }
}
```

browser or native usage

```javascript
import { provide } from "provi/client"

// Define dependencies using "provide" function
export class Auth {
  user = provide(User)
  // ...
  logout() {
    if (this.user.isAnonymous) return
    // ...
  }
}
```

in both ways you can use plain javascript functions as dependency constructor

```javascript
import { provide } from "provi/client"

export const User => {
  // ...
}
```

**Isolation of async scopes** (only in node environment)

Run your app in isolated Service Provider scope. All instances cached for this will be isolated from all cached instances in other scopes. Useful for implementing SSR.

```javascript
import { isolate } from "provi/client"

const html = await isolate(async () => {
  const { run } = provide(Logic); // Isolated instance of app logic
  await run();
  // ...
  return ReactDOMServer.renderToString(<App />);
});
```

Each isolated instance will be destroyed at the end of the isolated asynchronous function.


**Installation**

```bash
npm install provi
```

Enjoy your code!