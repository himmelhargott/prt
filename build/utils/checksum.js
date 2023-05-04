import {sha256} from "../_snowpack/pkg/@noble/hashes/sha256.js";
import {bytesToHex, hexToBytes} from "../_snowpack/pkg/@noble/hashes/utils.js";
import {c32, c32decode, c32encode, c32normalize} from "./encoding.js";
function c32checksum(dataHex) {
  const dataHash = sha256(sha256(hexToBytes(dataHex)));
  const checksum = bytesToHex(dataHash.slice(0, 4));
  return checksum;
}
export function c32checkEncode(version, data) {
  if (version < 0 || version >= 32) {
    throw new Error("Invalid version (must be between 0 and 31)");
  }
  if (!data.match(/^[0-9a-fA-F]*$/)) {
    throw new Error("Invalid data (not a hex string)");
  }
  data = data.toLowerCase();
  if (data.length % 2 !== 0) {
    data = `0${data}`;
  }
  let versionHex = version.toString(16);
  if (versionHex.length === 1) {
    versionHex = `0${versionHex}`;
  }
  const checksumHex = c32checksum(`${versionHex}${data}`);
  const c32str = c32encode(`${data}${checksumHex}`);
  return `${c32[version]}${c32str}`;
}
export function c32checkDecode(c32data) {
  c32data = c32normalize(c32data);
  const dataHex = c32decode(c32data.slice(1));
  const versionChar = c32data[0];
  const version = c32.indexOf(versionChar);
  const checksum = dataHex.slice(-8);
  let versionHex = version.toString(16);
  if (versionHex.length === 1) {
    versionHex = `0${versionHex}`;
  }
  if (c32checksum(`${versionHex}${dataHex.substring(0, dataHex.length - 8)}`) !== checksum) {
    throw new Error("Invalid c32check string: checksum mismatch");
  }
  return [version, dataHex.substring(0, dataHex.length - 8)];
}
