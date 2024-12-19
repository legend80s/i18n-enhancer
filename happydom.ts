// fix ReferenceError: Can't find variable: document

// @ts-nocheck
import { GlobalRegistrator } from '@happy-dom/global-registrator';

console.assert(globalThis.window?.document.querySelector === undefined);
GlobalRegistrator.register();
console.assert(window.document.querySelector !== undefined);

console.log();
console.log(
  `> 🍞 This file is required by bun test - https://github.com/oven-sh/bun/issues/5113 & https://bun.sh/docs/test/dom`
);
console.log();
