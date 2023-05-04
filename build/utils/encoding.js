import {hexToBytes} from "../_snowpack/pkg/@noble/hashes/utils.js";
export const c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const hex = "0123456789abcdef";
export function c32encode(inputHex, minLength) {
  if (!inputHex.match(/^[0-9a-fA-F]*$/)) {
    throw new Error("Not a hex-encoded string");
  }
  if (inputHex.length % 2 !== 0) {
    inputHex = `0${inputHex}`;
  }
  inputHex = inputHex.toLowerCase();
  let res = [];
  let carry = 0;
  for (let i = inputHex.length - 1; i >= 0; i--) {
    if (carry < 4) {
      const currentCode = hex.indexOf(inputHex[i]) >> carry;
      let nextCode = 0;
      if (i !== 0) {
        nextCode = hex.indexOf(inputHex[i - 1]);
      }
      const nextBits = 1 + carry;
      const nextLowBits = nextCode % (1 << nextBits) << 5 - nextBits;
      const curC32Digit = c32[currentCode + nextLowBits];
      carry = nextBits;
      res.unshift(curC32Digit);
    } else {
      carry = 0;
    }
  }
  let C32leadingZeros = 0;
  for (let i = 0; i < res.length; i++) {
    if (res[i] !== "0") {
      break;
    } else {
      C32leadingZeros++;
    }
  }
  res = res.slice(C32leadingZeros);
  const zeroPrefix = new TextDecoder().decode(hexToBytes(inputHex)).match(/^\u0000*/);
  const numLeadingZeroBytesInHex = zeroPrefix ? zeroPrefix[0].length : 0;
  for (let i = 0; i < numLeadingZeroBytesInHex; i++) {
    res.unshift(c32[0]);
  }
  if (minLength) {
    const count = minLength - res.length;
    for (let i = 0; i < count; i++) {
      res.unshift(c32[0]);
    }
  }
  return res.join("");
}
export function c32normalize(c32input) {
  return c32input.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
}
export function c32decode(c32input, minLength) {
  c32input = c32normalize(c32input);
  if (!c32input.match(`^[${c32}]*$`)) {
    throw new Error("Not a c32-encoded string");
  }
  const zeroPrefix = c32input.match(`^${c32[0]}*`);
  const numLeadingZeroBytes = zeroPrefix ? zeroPrefix[0].length : 0;
  let res = [];
  let carry = 0;
  let carryBits = 0;
  for (let i = c32input.length - 1; i >= 0; i--) {
    if (carryBits === 4) {
      res.unshift(hex[carry]);
      carryBits = 0;
      carry = 0;
    }
    const currentCode = c32.indexOf(c32input[i]) << carryBits;
    const currentValue = currentCode + carry;
    const currentHexDigit = hex[currentValue % 16];
    carryBits += 1;
    carry = currentValue >> 4;
    if (carry > 1 << carryBits) {
      throw new Error("Panic error in decoding.");
    }
    res.unshift(currentHexDigit);
  }
  res.unshift(hex[carry]);
  if (res.length % 2 === 1) {
    res.unshift("0");
  }
  let hexLeadingZeros = 0;
  for (let i = 0; i < res.length; i++) {
    if (res[i] !== "0") {
      break;
    } else {
      hexLeadingZeros++;
    }
  }
  res = res.slice(hexLeadingZeros - hexLeadingZeros % 2);
  let hexStr = res.join("");
  for (let i = 0; i < numLeadingZeroBytes; i++) {
    hexStr = `00${hexStr}`;
  }
  if (minLength) {
    const count = minLength * 2 - hexStr.length;
    for (let i = 0; i < count; i += 2) {
      hexStr = `00${hexStr}`;
    }
  }
  return hexStr;
}
