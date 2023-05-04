import { l as lib } from '../common/index-e9798b10.js';
import { d as defineCustomElements } from '../common/index-85bf153a.js';
import { d as deserializeTransaction } from '../common/transaction-49c5ef52.js';
import { A as AppConfig, U as UserSession } from '../common/userSession-8e1c1827.js';
export { A as AppConfig, U as UserSession } from '../common/userSession-8e1c1827.js';
import { C as ChainID, s as serializeCV, a as serializePostCondition } from '../common/utils-a25b7f95.js';
import { b as StacksTestnet } from '../common/network-5bbac90c.js';
import '../common/_commonjsHelpers-16be0a9e.js';
import '../common/index-9c2b2497.js';
import '../common/hmac-988c6f74.js';
import '../common/_assert-30bf9db8.js';
import '../common/utils-14f97fda.js';
import '../common/sha256-1cee21ef.js';
import '../common/_sha2-f781ad42.js';
import '../common/index-171c9fcd.js';
import '../common/keys-10ec8e4e.js';
import '../common/buffer-174571f5.js';
import '../common/errors-8a9f6b06.js';
import '../common/fetch-31299d03.js';
import '../cross-fetch/polyfill.js';
import '../common/encryption-f97960c9.js';
import '../common/index-07b5c182.js';
import '../common/index-45f36113.js';
import '../common/ripemd160-f7db1645.js';
import '../common/sha512-9db2a8ca.js';
import '../common/profileTokens-673e20ae.js';
import '../common/constants-8297e4fd.js';
import '../common/index-859a5447.js';
import '../common/index-b7cf6e7e.js';

var N = Object.defineProperty, M = Object.defineProperties;
var L = Object.getOwnPropertyDescriptors;
var P = Object.getOwnPropertySymbols;
var D = Object.prototype.hasOwnProperty, R = Object.prototype.propertyIsEnumerable;
var k = (t, e, n) => e in t ? N(t, e, {enumerable: true, configurable: true, writable: true, value: n}) : t[e] = n, i = (t, e) => {
  for (var n in e || (e = {}))
    D.call(e, n) && k(t, n, e[n]);
  if (P)
    for (var n of P(e))
      R.call(e, n) && k(t, n, e[n]);
  return t;
}, p = (t, e) => M(t, L(e));
var f = (t, e) => {
  var n = {};
  for (var r in t)
    D.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && P)
    for (var r of P(t))
      e.indexOf(r) < 0 && R.call(t, r) && (n[r] = t[r]);
  return n;
};
function d() {
  return window.StacksProvider || window.BlockstackProvider;
}
var U = "7.3.1";
typeof window != "undefined" && (window.__CONNECT_VERSION__ = U);
var B = (t) => {
  if (!t) {
    let e = new AppConfig(["store_write"], document.location.href);
    t = new UserSession({appConfig: e});
  }
  return t;
}, A = async (t) => {
  let e = d();
  if (!e)
    throw new Error("Unable to authenticate without Hiro Wallet extension");
  let {redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: o, sendToSignIn: a = false, userSession: c, appDetails: u} = t, l = B(c);
  l.isUserSignedIn() && l.signUserOut();
  let m = l.generateAndStoreTransitKey(), $ = l.makeAuthRequest(m, `${document.location.origin}${n}`, `${document.location.origin}${r}`, l.appConfig.scopes, void 0, void 0, {sendToSignIn: a, appDetails: u, connectVersion: U});
  try {
    let T = await e.authenticationRequest($);
    await l.handlePendingSignIn(T);
    let h = lib.decodeToken(T), X = h == null ? void 0 : h.payload;
    s == null || s({authResponse: T, authResponsePayload: X, userSession: l});
  } catch (T) {
    console.error("[Connect] Error during auth request", T), o == null || o();
  }
};
var J = Array.from({length: 256}, (t, e) => e.toString(16).padStart(2, "0"));
function S(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (let n of t)
    e += J[n];
  return e;
}
function I(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  let e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    let s = r * 2, o = e.slice(s, s + 2), a = Number.parseInt(o, 16);
    if (Number.isNaN(a) || a < 0)
      throw new Error("Invalid byte sequence");
    n[r] = a;
  }
  return n;
}
var z = ((r) => (r.ContractCall = "contract_call", r.ContractDeploy = "smart_contract", r.STXTransfer = "token_transfer", r))(z || {}), Y = ((o) => (o.BUFFER = "buffer", o.UINT = "uint", o.INT = "int", o.PRINCIPAL = "principal", o.BOOL = "bool", o))(Y || {});
var x = (t) => {
  let e = t;
  if (!e) {
    let n = new AppConfig(["store_write"], document.location.href);
    e = new UserSession({appConfig: n});
  }
  return e;
};
function g(t) {
  try {
    return x(t).loadUserData().appPrivateKey;
  } catch (e) {
    return false;
  }
}
var y = (t) => {
  let n = x(t).loadUserData().appPrivateKey, r = lib.SECP256K1Client.derivePublicKey(n);
  return {privateKey: n, publicKey: r};
};
function st(t) {
  var c;
  let {stxAddress: e, userSession: n, network: r} = t;
  if (e)
    return e;
  if (!n || !r)
    return;
  let s = (c = n == null ? void 0 : n.loadUserData().profile) == null ? void 0 : c.stxAddress, o = {[ChainID.Mainnet]: "mainnet", [ChainID.Testnet]: "testnet"};
  return s == null ? void 0 : s[o[r.chainId]];
}
function it(t) {
  let e = t.network || new StacksTestnet(), n = x(t.userSession), r = p(i({}, t), {network: e, userSession: n});
  return i({stxAddress: st(r)}, r);
}
function E(t) {
  return t.map((e) => S(serializePostCondition(e)));
}
async function C(t, e) {
  let {postConditions: n} = t;
  return n && typeof n[0] != "string" && (n = E(n)), new lib.TokenSigner("ES256k", e).signAsync(p(i({}, t), {postConditions: n}));
}
function w(t) {
  let {postConditions: e} = t;
  return e && typeof e[0] != "string" && (e = E(e)), lib.createUnsecuredToken(p(i({}, t), {postConditions: e}));
}
var at = async ({token: t, options: e}) => {
  var r, s, o;
  let n = d();
  if (!n)
    throw new Error("Hiro Wallet not installed");
  try {
    let a = await n.transactionRequest(t), {txRaw: c} = a, u = I(c.replace(/^0x/, "")), l = deserializeTransaction(u);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, p(i({}, a), {stacksTransaction: l}));
      return;
    }
    (s = e.onFinish) == null || s.call(e, p(i({}, a), {stacksTransaction: l}));
  } catch (a) {
    console.error("[Connect] Error during transaction request", a), (o = e.onCancel) == null || o.call(e);
  }
}, pt = async (t) => {
  let c = t, {functionArgs: e, appDetails: n, userSession: r} = c, s = f(c, ["functionArgs", "appDetails", "userSession"]), o = e.map((u) => typeof u == "string" ? u : S(serializeCV(u)));
  if (g(r)) {
    let {privateKey: u, publicKey: l} = y(r), m = p(i({}, s), {functionArgs: o, txType: "contract_call", publicKey: l});
    return n && (m.appDetails = n), C(m, u);
  }
  let a = p(i({}, s), {functionArgs: o, txType: "contract_call"});
  return n && (a.appDetails = n), w(a);
};
async function O(t, e) {
  let n = await e(i(i({}, it(t)), t));
  return at({token: n, options: t});
}
function le(t) {
  return O(t, pt);
}
var Mt = ((o) => (o[o.DEFAULT = 0] = "DEFAULT", o[o.ALL = 1] = "ALL", o[o.NONE = 2] = "NONE", o[o.SINGLE = 3] = "SINGLE", o[o.ANYONECANPAY = 128] = "ANYONECANPAY", o))(Mt || {});
var _t = (t) => {
  if (d()) {
    A(t);
    return;
  }
  if (typeof window !== void 0) {
    defineCustomElements();
    let e = document.createElement("connect-modal");
    e.authOptions = t, document.body.appendChild(e);
    let n = (r) => {
      r.key === "Escape" && (document.removeEventListener("keydown", n), e.remove());
    };
    document.addEventListener("keydown", n);
  }
};

export { le as openContractCall, _t as showConnect };
