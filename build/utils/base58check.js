"use strict";
import {sha256} from "../_snowpack/pkg/@noble/hashes/sha256.js";
import {hexToBytes} from "../_snowpack/pkg/@noble/hashes/utils.js";
import * as basex from "../_snowpack/pkg/base-x.js";
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export function encode(data, prefix = "00") {
  const dataBytes = typeof data === "string" ? hexToBytes(data) : data;
  const prefixBytes = typeof prefix === "string" ? hexToBytes(prefix) : data;
  if (!(dataBytes instanceof Uint8Array) || !(prefixBytes instanceof Uint8Array)) {
    throw new TypeError("Argument must be of type Uint8Array or string");
  }
  const checksum = sha256(sha256(new Uint8Array([...prefixBytes, ...dataBytes])));
  return basex(ALPHABET).encode([...prefixBytes, ...dataBytes, ...checksum.slice(0, 4)]);
}
export function decode(string) {
  const bytes = basex(ALPHABET).decode(string);
  const prefixBytes = bytes.slice(0, 1);
  const dataBytes = bytes.slice(1, -4);
  const checksum = sha256(sha256(new Uint8Array([...prefixBytes, ...dataBytes])));
  bytes.slice(-4).forEach((check, index) => {
    if (check !== checksum[index]) {
      throw new Error("Invalid checksum");
    }
  });
  return {prefix: prefixBytes, data: dataBytes};
}
