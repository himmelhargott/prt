import { g as getDefaultExportFromNamespaceIfNotNamed, c as createCommonjsModule, a as commonjsGlobal } from '../common/_commonjsHelpers-16be0a9e.js';

// native patch for: node-fetch, whatwg-fetch
// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
var global = getGlobal();
var nodeFetch = global.fetch.bind(global);
const Headers = global.Headers;
const Request = global.Request;
const Response = global.Response;

var nodeFetch$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': nodeFetch,
  Headers: Headers,
  Request: Request,
  Response: Response
});

var nodeFetch$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(nodeFetch$1);

var nodePonyfill = createCommonjsModule(function (module, exports) {
const realFetch = nodeFetch$2.default || nodeFetch$2;

const fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url;
  }
  return realFetch.call(this, url, options)
};

fetch.ponyfill = true;

module.exports = exports = fetch;
exports.fetch = fetch;
exports.Headers = nodeFetch$2.Headers;
exports.Request = nodeFetch$2.Request;
exports.Response = nodeFetch$2.Response;

// Needed for TypeScript consumers without esModuleInterop.
exports.default = fetch;
});

const fetch = nodePonyfill.fetch.bind({});

fetch.polyfill = true;

if (!commonjsGlobal.fetch) {
  commonjsGlobal.fetch = fetch;
  commonjsGlobal.Response = nodePonyfill.Response;
  commonjsGlobal.Headers = nodePonyfill.Headers;
  commonjsGlobal.Request = nodePonyfill.Request;
}

var nodePolyfill = {

};

export default nodePolyfill;
