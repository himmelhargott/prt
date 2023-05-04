const config = {
    network: {
        layer1: 'placeholder',
    },
    logLevel: 'debug',
};

const levels = ['debug', 'info', 'warn', 'error', 'none'];
const levelToInt = {};
for (let index = 0; index < levels.length; index++) {
    const level = levels[index];
    levelToInt[level] = index;
}
class Logger {
    static error(message) {
        if (!this.shouldLog('error'))
            return;
        console.error(this.logMessage('error', message));
    }
    static warn(message) {
        if (!this.shouldLog('warn'))
            return;
        console.warn(this.logMessage('warn', message));
    }
    static info(message) {
        if (!this.shouldLog('info'))
            return;
        console.log(this.logMessage('info', message));
    }
    static debug(message) {
        if (!this.shouldLog('debug'))
            return;
        console.log(this.logMessage('debug', message));
    }
    static logMessage(level, message) {
        return `[${level.toUpperCase()}] ${message}`;
    }
    static shouldLog(level) {
        const currentLevel = levelToInt[config.logLevel];
        return currentLevel <= levelToInt[level];
    }
}

const BLOCKSTACK_HANDLER = 'blockstack';
function nextYear() {
    return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
}
function nextMonth() {
    return new Date(new Date().setMonth(new Date().getMonth() + 1));
}
function nextHour() {
    return new Date(new Date().setHours(new Date().getHours() + 1));
}
function isLaterVersion(v1, v2) {
    if (v1 === undefined || v1 === '') {
        v1 = '0.0.0';
    }
    if (v2 === undefined || v1 === '') {
        v2 = '0.0.0';
    }
    const v1tuple = v1.split('.').map(x => parseInt(x, 10));
    const v2tuple = v2.split('.').map(x => parseInt(x, 10));
    for (let index = 0; index < v2.length; index++) {
        if (index >= v1.length) {
            v2tuple.push(0);
        }
        if (v1tuple[index] < v2tuple[index]) {
            return false;
        }
    }
    return true;
}
function makeUUID4() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}
function isSameOriginAbsoluteUrl(uri1, uri2) {
    try {
        const parsedUri1 = new URL(uri1);
        const parsedUri2 = new URL(uri2);
        const port1 = parseInt(parsedUri1.port || '0', 10) | 0 || (parsedUri1.protocol === 'https:' ? 443 : 80);
        const port2 = parseInt(parsedUri2.port || '0', 10) | 0 || (parsedUri2.protocol === 'https:' ? 443 : 80);
        const match = {
            scheme: parsedUri1.protocol === parsedUri2.protocol,
            hostname: parsedUri1.hostname === parsedUri2.hostname,
            port: port1 === port2,
            absolute: (uri1.includes('http://') || uri1.includes('https://')) &&
                (uri2.includes('http://') || uri2.includes('https://')),
        };
        return match.scheme && match.hostname && match.port && match.absolute;
    }
    catch (error) {
        console.log(error);
        console.log('Parsing error in same URL origin check');
        return false;
    }
}
function getGlobalScope() {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available');
}
function getAPIUsageErrorMessage(scopeObject, apiName, usageDesc) {
    if (usageDesc) {
        return `Use of '${usageDesc}' requires \`${apiName}\` which is unavailable on the '${scopeObject}' object within the currently executing environment.`;
    }
    else {
        return `\`${apiName}\` is unavailable on the '${scopeObject}' object within the currently executing environment.`;
    }
}
function getGlobalObject(name, { throwIfUnavailable, usageDesc, returnEmptyObject } = {}) {
    let globalScope = undefined;
    try {
        globalScope = getGlobalScope();
        if (globalScope) {
            const obj = globalScope[name];
            if (obj) {
                return obj;
            }
        }
    }
    catch (error) {
        Logger.error(`Error getting object '${name}' from global scope '${globalScope}': ${error}`);
    }
    if (throwIfUnavailable) {
        const errMsg = getAPIUsageErrorMessage(globalScope, name.toString(), usageDesc);
        Logger.error(errMsg);
        throw new Error(errMsg);
    }
    if (returnEmptyObject) {
        return {};
    }
    return undefined;
}
function intToBytes(value, signed, byteLength) {
    return bigIntToBytes(intToBigInt(value, signed), byteLength);
}
function intToBigInt(value, signed) {
    let parsedValue = value;
    if (typeof parsedValue === 'number') {
        if (!Number.isInteger(parsedValue)) {
            throw new RangeError(`Invalid value. Values of type 'number' must be an integer.`);
        }
        return BigInt(parsedValue);
    }
    if (typeof parsedValue === 'string') {
        if (parsedValue.toLowerCase().startsWith('0x')) {
            let hex = parsedValue.slice(2);
            hex = hex.padStart(hex.length + (hex.length % 2), '0');
            parsedValue = hexToBytes(hex);
        }
        else {
            try {
                return BigInt(parsedValue);
            }
            catch (error) {
                if (error instanceof SyntaxError) {
                    throw new RangeError(`Invalid value. String integer '${parsedValue}' is not finite.`);
                }
            }
        }
    }
    if (typeof parsedValue === 'bigint') {
        return parsedValue;
    }
    if (parsedValue instanceof Uint8Array) {
        if (signed) {
            const bn = fromTwos(BigInt(`0x${bytesToHex(parsedValue)}`), BigInt(parsedValue.byteLength * 8));
            return BigInt(bn.toString());
        }
        else {
            return BigInt(`0x${bytesToHex(parsedValue)}`);
        }
    }
    if (parsedValue != null &&
        typeof parsedValue === 'object' &&
        parsedValue.constructor.name === 'BN') {
        return BigInt(parsedValue.toString());
    }
    throw new TypeError(`Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.`);
}
function with0x(value) {
    return value.startsWith('0x') ? value : `0x${value}`;
}
function hexToBigInt(hex) {
    if (typeof hex !== 'string')
        throw new TypeError(`hexToBigInt: expected string, got ${typeof hex}`);
    return BigInt(`0x${hex}`);
}
function intToHex(integer, lengthBytes = 8) {
    const value = typeof integer === 'bigint' ? integer : intToBigInt(integer, false);
    return value.toString(16).padStart(lengthBytes * 2, '0');
}
function hexToInt(hex) {
    return parseInt(hex, 16);
}
function bigIntToBytes(value, length = 16) {
    const hex = intToHex(value, length);
    return hexToBytes(hex);
}
function toTwos(value, width) {
    if (value < -(BigInt(1) << (width - BigInt(1))) ||
        (BigInt(1) << (width - BigInt(1))) - BigInt(1) < value) {
        throw `Unable to represent integer in width: ${width}`;
    }
    if (value >= BigInt(0)) {
        return BigInt(value);
    }
    return value + (BigInt(1) << width);
}
function nthBit(value, n) {
    return value & (BigInt(1) << n);
}
function fromTwos(value, width) {
    if (nthBit(value, width - BigInt(1))) {
        return value - (BigInt(1) << width);
    }
    return value;
}
const hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
function bytesToHex(uint8a) {
    if (!(uint8a instanceof Uint8Array))
        throw new Error('Uint8Array expected');
    let hex = '';
    for (const u of uint8a) {
        hex += hexes[u];
    }
    return hex;
}
function hexToBytes(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError(`hexToBytes: expected string, got ${typeof hex}`);
    }
    const paddedHex = hex.length % 2 ? `0${hex}` : hex;
    const array = new Uint8Array(paddedHex.length / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = paddedHex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
function utf8ToBytes(str) {
    return new TextEncoder().encode(str);
}
function bytesToUtf8(arr) {
    return new TextDecoder().decode(arr);
}
function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0; i < str.length; i++) {
        byteArray.push(str.charCodeAt(i) & 0xff);
    }
    return new Uint8Array(byteArray);
}
function bytesToAscii(arr) {
    return String.fromCharCode.apply(null, arr);
}
function isNotOctet(octet) {
    return !Number.isInteger(octet) || octet < 0 || octet > 255;
}
function octetsToBytes(numbers) {
    if (numbers.some(isNotOctet))
        throw new Error('Some values are invalid bytes.');
    return new Uint8Array(numbers);
}
function concatBytes(...arrays) {
    if (!arrays.every(a => a instanceof Uint8Array))
        throw new Error('Uint8Array list expected');
    if (arrays.length === 1)
        return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
    }
    return result;
}
function concatArray(elements) {
    return concatBytes(...elements.map(e => {
        if (typeof e === 'number')
            return octetsToBytes([e]);
        if (e instanceof Array)
            return octetsToBytes(e);
        return e;
    }));
}

function privateKeyToBytes(privateKey) {
    const privateKeyBuffer = typeof privateKey === 'string' ? hexToBytes(privateKey) : privateKey;
    if (privateKeyBuffer.length != 32 && privateKeyBuffer.length != 33) {
        throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${privateKeyBuffer.length}`);
    }
    if (privateKeyBuffer.length == 33 && privateKeyBuffer[32] !== 1) {
        throw new Error('Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01');
    }
    return privateKeyBuffer;
}

export { BLOCKSTACK_HANDLER as B, Logger as L, bytesToHex as a, bytesToUtf8 as b, nextHour as c, isLaterVersion as d, concatBytes as e, nextYear as f, getGlobalObject as g, hexToBytes as h, isSameOriginAbsoluteUrl as i, intToBigInt as j, concatArray as k, hexToBigInt as l, makeUUID4 as m, nextMonth as n, intToHex as o, privateKeyToBytes as p, intToBytes as q, hexToInt as r, bigIntToBytes as s, toTwos as t, utf8ToBytes as u, asciiToBytes as v, bytesToAscii as w, with0x as x };
