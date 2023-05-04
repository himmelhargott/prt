import { r as hexToInt } from './keys-10ec8e4e.js';

const COORDINATE_BYTES = 32;
function parseRecoverableSignatureVrs(signature) {
    if (signature.length < COORDINATE_BYTES * 2 * 2 + 1) {
        throw new Error('Invalid signature');
    }
    const recoveryIdHex = signature.slice(0, 2);
    const r = signature.slice(2, 2 + COORDINATE_BYTES * 2);
    const s = signature.slice(2 + COORDINATE_BYTES * 2);
    return {
        recoveryId: hexToInt(recoveryIdHex),
        r,
        s,
    };
}
function signatureVrsToRsv(signature) {
    return signature.slice(2) + signature.slice(0, 2);
}
function signatureRsvToVrs(signature) {
    return signature.slice(-2) + signature.slice(0, -2);
}

function equals(a, b) {
    if (a.byteLength !== b.byteLength)
        return false;
    for (let i = 0; i < a.byteLength; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
function readUInt16BE(source, offset) {
    return ((source[offset + 0] << 8) | source[offset + 1]) >>> 0;
}
function writeUInt16BE(source, value, offset) {
    source[offset + 0] = value >>> 8;
    source[offset + 1] = value >>> 0;
}
function readUInt8(source, offset) {
    return source[offset];
}
function writeUInt8(destination, value, offset) {
    destination[offset] = value;
}
function readUInt16LE(source, offset) {
    return ((source[offset + 0] << 0) >>> 0) | ((source[offset + 1] << 8) >>> 0);
}
function writeUInt16LE(destination, value, offset) {
    destination[offset + 0] = value & 255;
    value >>>= 8;
    destination[offset + 1] = value & 255;
}
function readUInt32BE(source, offset) {
    return (source[offset] * 2 ** 24 +
        source[offset + 1] * 2 ** 16 +
        source[offset + 2] * 2 ** 8 +
        source[offset + 3]);
}
function writeUInt32BE(destination, value, offset) {
    destination[offset + 3] = value;
    value >>>= 8;
    destination[offset + 2] = value;
    value >>>= 8;
    destination[offset + 1] = value;
    value >>>= 8;
    destination[offset] = value;
}
function readUInt32LE(source, offset) {
    return (((source[offset + 0] << 0) >>> 0) |
        ((source[offset + 1] << 8) >>> 0) |
        ((source[offset + 2] << 16) >>> 0) |
        ((source[offset + 3] << 24) >>> 0));
}
function writeUInt32LE(destination, value, offset) {
    destination[offset + 0] = value & 255;
    value >>>= 8;
    destination[offset + 1] = value & 255;
    value >>>= 8;
    destination[offset + 2] = value & 255;
    value >>>= 8;
    destination[offset + 3] = value & 255;
}

export { readUInt8 as a, readUInt16BE as b, writeUInt8 as c, writeUInt16LE as d, writeUInt32LE as e, readUInt16LE as f, readUInt32LE as g, equals as h, signatureVrsToRsv as i, writeUInt16BE as j, parseRecoverableSignatureVrs as p, readUInt32BE as r, signatureRsvToVrs as s, writeUInt32BE as w };
