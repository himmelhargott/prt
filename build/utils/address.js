import {c32checkEncode, c32checkDecode} from "./checksum.js";
import * as base58check from "./base58check.js";
import {bytesToHex} from "../_snowpack/pkg/@noble/hashes/utils.js";
export const versions = {
  mainnet: {
    p2pkh: 22,
    p2sh: 20
  },
  testnet: {
    p2pkh: 26,
    p2sh: 21
  }
};
const ADDR_BITCOIN_TO_STACKS = {};
ADDR_BITCOIN_TO_STACKS[0] = versions.mainnet.p2pkh;
ADDR_BITCOIN_TO_STACKS[5] = versions.mainnet.p2sh;
ADDR_BITCOIN_TO_STACKS[111] = versions.testnet.p2pkh;
ADDR_BITCOIN_TO_STACKS[196] = versions.testnet.p2sh;
const ADDR_STACKS_TO_BITCOIN = {};
ADDR_STACKS_TO_BITCOIN[versions.mainnet.p2pkh] = 0;
ADDR_STACKS_TO_BITCOIN[versions.mainnet.p2sh] = 5;
ADDR_STACKS_TO_BITCOIN[versions.testnet.p2pkh] = 111;
ADDR_STACKS_TO_BITCOIN[versions.testnet.p2sh] = 196;
export function c32address(version, hash160hex) {
  if (!hash160hex.match(/^[0-9a-fA-F]{40}$/)) {
    throw new Error("Invalid argument: not a hash160 hex string");
  }
  const c32string = c32checkEncode(version, hash160hex);
  return `S${c32string}`;
}
export function c32addressDecode(c32addr) {
  if (c32addr.length <= 5) {
    throw new Error("Invalid c32 address: invalid length");
  }
  if (c32addr[0] != "S") {
    throw new Error('Invalid c32 address: must start with "S"');
  }
  return c32checkDecode(c32addr.slice(1));
}
export function b58ToC32(b58check, version = -1) {
  const addrInfo = base58check.decode(b58check);
  const hash160String = bytesToHex(addrInfo.data);
  const addrVersion = parseInt(bytesToHex(addrInfo.prefix), 16);
  let stacksVersion;
  if (version < 0) {
    stacksVersion = addrVersion;
    if (ADDR_BITCOIN_TO_STACKS[addrVersion] !== void 0) {
      stacksVersion = ADDR_BITCOIN_TO_STACKS[addrVersion];
    }
  } else {
    stacksVersion = version;
  }
  return c32address(stacksVersion, hash160String);
}
export function c32ToB58(c32string, version = -1) {
  const addrInfo = c32addressDecode(c32string);
  const stacksVersion = addrInfo[0];
  const hash160String = addrInfo[1];
  let bitcoinVersion;
  if (version < 0) {
    bitcoinVersion = stacksVersion;
    if (ADDR_STACKS_TO_BITCOIN[stacksVersion] !== void 0) {
      bitcoinVersion = ADDR_STACKS_TO_BITCOIN[stacksVersion];
    }
  } else {
    bitcoinVersion = version;
  }
  let prefix = bitcoinVersion.toString(16);
  if (prefix.length === 1) {
    prefix = `0${prefix}`;
  }
  return base58check.encode(hash160String, prefix);
}
