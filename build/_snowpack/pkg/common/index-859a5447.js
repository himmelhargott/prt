import { c as createCommonjsModule } from './_commonjsHelpers-16be0a9e.js';
import { l as utils } from './utils-14f97fda.js';
import { b as sha256 } from './sha256-1cee21ef.js';
import { s as src } from './index-45f36113.js';

var encoding = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.c32decode = exports.c32normalize = exports.c32encode = exports.c32 = void 0;

exports.c32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const hex = '0123456789abcdef';
/**
 * Encode a hex string as a c32 string.  Note that the hex string is assumed
 * to be big-endian (and the resulting c32 string will be as well).
 * @param {string} inputHex - the input to encode
 * @param {number} minLength - the minimum length of the c32 string
 * @returns {string} the c32check-encoded representation of the data, as a string
 */
function c32encode(inputHex, minLength) {
    // must be hex
    if (!inputHex.match(/^[0-9a-fA-F]*$/)) {
        throw new Error('Not a hex-encoded string');
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
            // carry = 0, nextBits is 1, carry = 1, nextBits is 2
            const nextBits = 1 + carry;
            const nextLowBits = nextCode % (1 << nextBits) << (5 - nextBits);
            const curC32Digit = exports.c32[currentCode + nextLowBits];
            carry = nextBits;
            res.unshift(curC32Digit);
        }
        else {
            carry = 0;
        }
    }
    let C32leadingZeros = 0;
    for (let i = 0; i < res.length; i++) {
        if (res[i] !== '0') {
            break;
        }
        else {
            C32leadingZeros++;
        }
    }
    res = res.slice(C32leadingZeros);
    const zeroPrefix = new TextDecoder().decode((0, utils.hexToBytes)(inputHex)).match(/^\u0000*/);
    const numLeadingZeroBytesInHex = zeroPrefix ? zeroPrefix[0].length : 0;
    for (let i = 0; i < numLeadingZeroBytesInHex; i++) {
        res.unshift(exports.c32[0]);
    }
    if (minLength) {
        const count = minLength - res.length;
        for (let i = 0; i < count; i++) {
            res.unshift(exports.c32[0]);
        }
    }
    return res.join('');
}
exports.c32encode = c32encode;
/*
 * Normalize a c32 string
 * @param {string} c32input - the c32-encoded input string
 * @returns {string} the canonical representation of the c32 input string
 */
function c32normalize(c32input) {
    // must be upper-case
    // replace all O's with 0's
    // replace all I's and L's with 1's
    return c32input.toUpperCase().replace(/O/g, '0').replace(/L|I/g, '1');
}
exports.c32normalize = c32normalize;
/*
 * Decode a c32 string back into a hex string.  Note that the c32 input
 * string is assumed to be big-endian (and the resulting hex string will
 * be as well).
 * @param {string} c32input - the c32-encoded input to decode
 * @param {number} minLength - the minimum length of the output hex string (in bytes)
 * @returns {string} the hex-encoded representation of the data, as a string
 */
function c32decode(c32input, minLength) {
    c32input = c32normalize(c32input);
    // must result in a c32 string
    if (!c32input.match(`^[${exports.c32}]*$`)) {
        throw new Error('Not a c32-encoded string');
    }
    const zeroPrefix = c32input.match(`^${exports.c32[0]}*`);
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
        const currentCode = exports.c32.indexOf(c32input[i]) << carryBits;
        const currentValue = currentCode + carry;
        const currentHexDigit = hex[currentValue % 16];
        carryBits += 1;
        carry = currentValue >> 4;
        if (carry > 1 << carryBits) {
            throw new Error('Panic error in decoding.');
        }
        res.unshift(currentHexDigit);
    }
    // one last carry
    res.unshift(hex[carry]);
    if (res.length % 2 === 1) {
        res.unshift('0');
    }
    let hexLeadingZeros = 0;
    for (let i = 0; i < res.length; i++) {
        if (res[i] !== '0') {
            break;
        }
        else {
            hexLeadingZeros++;
        }
    }
    res = res.slice(hexLeadingZeros - (hexLeadingZeros % 2));
    let hexStr = res.join('');
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
exports.c32decode = c32decode;
});

var checksum = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.c32checkDecode = exports.c32checkEncode = void 0;



/**
 * Get the c32check checksum of a hex-encoded string
 * @param {string} dataHex - the hex string
 * @returns {string} the c32 checksum, as a bin-encoded string
 */
function c32checksum(dataHex) {
    const dataHash = (0, sha256.sha256)((0, sha256.sha256)((0, utils.hexToBytes)(dataHex)));
    const checksum = (0, utils.bytesToHex)(dataHash.slice(0, 4));
    return checksum;
}
/**
 * Encode a hex string as a c32check string.  This is a lot like how
 * base58check works in Bitcoin-land, but this algorithm uses the
 * z-base-32 alphabet instead of the base58 alphabet.  The algorithm
 * is as follows:
 * * calculate the c32checksum of version + data
 * * c32encode version + data + c32checksum
 * @param {number} version - the version string (between 0 and 31)
 * @param {string} data - the data to encode
 * @returns {string} the c32check representation
 */
function c32checkEncode(version, data) {
    if (version < 0 || version >= 32) {
        throw new Error('Invalid version (must be between 0 and 31)');
    }
    if (!data.match(/^[0-9a-fA-F]*$/)) {
        throw new Error('Invalid data (not a hex string)');
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
    const c32str = (0, encoding.c32encode)(`${data}${checksumHex}`);
    return `${encoding.c32[version]}${c32str}`;
}
exports.c32checkEncode = c32checkEncode;
/*
 * Decode a c32check string back into its version and data payload.  This is
 * a lot like how base58check works in Bitcoin-land, but this algorithm uses
 * the z-base-32 alphabet instead of the base58 alphabet.  The algorithm
 * is as follows:
 * * extract the version, data, and checksum
 * * verify the checksum matches c32checksum(version + data)
 * * return data
 * @param {string} c32data - the c32check-encoded string
 * @returns {array} [version (number), data (string)].  The returned data
 * will be a hex string.  Throws an exception if the checksum does not match.
 */
function c32checkDecode(c32data) {
    c32data = (0, encoding.c32normalize)(c32data);
    const dataHex = (0, encoding.c32decode)(c32data.slice(1));
    const versionChar = c32data[0];
    const version = encoding.c32.indexOf(versionChar);
    const checksum = dataHex.slice(-8);
    let versionHex = version.toString(16);
    if (versionHex.length === 1) {
        versionHex = `0${versionHex}`;
    }
    if (c32checksum(`${versionHex}${dataHex.substring(0, dataHex.length - 8)}`) !== checksum) {
        throw new Error('Invalid c32check string: checksum mismatch');
    }
    return [version, dataHex.substring(0, dataHex.length - 8)];
}
exports.c32checkDecode = c32checkDecode;
});

var base58check = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;



const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function encode(data, prefix = '00') {
    const dataBytes = typeof data === 'string' ? (0, utils.hexToBytes)(data) : data;
    const prefixBytes = typeof prefix === 'string' ? (0, utils.hexToBytes)(prefix) : data;
    if (!(dataBytes instanceof Uint8Array) || !(prefixBytes instanceof Uint8Array)) {
        throw new TypeError('Argument must be of type Uint8Array or string');
    }
    const checksum = (0, sha256.sha256)((0, sha256.sha256)(new Uint8Array([...prefixBytes, ...dataBytes])));
    return src(ALPHABET).encode([...prefixBytes, ...dataBytes, ...checksum.slice(0, 4)]);
}
exports.encode = encode;
function decode(string) {
    const bytes = src(ALPHABET).decode(string);
    const prefixBytes = bytes.slice(0, 1);
    const dataBytes = bytes.slice(1, -4);
    // todo: for better performance replace spread with `concatBytes` method
    const checksum = (0, sha256.sha256)((0, sha256.sha256)(new Uint8Array([...prefixBytes, ...dataBytes])));
    bytes.slice(-4).forEach((check, index) => {
        if (check !== checksum[index]) {
            throw new Error('Invalid checksum');
        }
    });
    return { prefix: prefixBytes, data: dataBytes };
}
exports.decode = decode;
});

var address = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.c32ToB58 = exports.b58ToC32 = exports.c32addressDecode = exports.c32address = exports.versions = void 0;



exports.versions = {
    mainnet: {
        p2pkh: 22,
        p2sh: 20, // 'M'
    },
    testnet: {
        p2pkh: 26,
        p2sh: 21, // 'N'
    },
};
// address conversion : bitcoin to stacks
const ADDR_BITCOIN_TO_STACKS = {};
ADDR_BITCOIN_TO_STACKS[0] = exports.versions.mainnet.p2pkh;
ADDR_BITCOIN_TO_STACKS[5] = exports.versions.mainnet.p2sh;
ADDR_BITCOIN_TO_STACKS[111] = exports.versions.testnet.p2pkh;
ADDR_BITCOIN_TO_STACKS[196] = exports.versions.testnet.p2sh;
// address conversion : stacks to bitcoin
const ADDR_STACKS_TO_BITCOIN = {};
ADDR_STACKS_TO_BITCOIN[exports.versions.mainnet.p2pkh] = 0;
ADDR_STACKS_TO_BITCOIN[exports.versions.mainnet.p2sh] = 5;
ADDR_STACKS_TO_BITCOIN[exports.versions.testnet.p2pkh] = 111;
ADDR_STACKS_TO_BITCOIN[exports.versions.testnet.p2sh] = 196;
/**
 * Make a c32check address with the given version and hash160
 * The only difference between a c32check string and c32 address
 * is that the letter 'S' is pre-pended.
 * @param {number} version - the address version number
 * @param {string} hash160hex - the hash160 to encode (must be a hash160)
 * @returns {string} the address
 */
function c32address(version, hash160hex) {
    if (!hash160hex.match(/^[0-9a-fA-F]{40}$/)) {
        throw new Error('Invalid argument: not a hash160 hex string');
    }
    const c32string = (0, checksum.c32checkEncode)(version, hash160hex);
    return `S${c32string}`;
}
exports.c32address = c32address;
/**
 * Decode a c32 address into its version and hash160
 * @param {string} c32addr - the c32check-encoded address
 * @returns {[number, string]} a tuple with the version and hash160
 */
function c32addressDecode(c32addr) {
    if (c32addr.length <= 5) {
        throw new Error('Invalid c32 address: invalid length');
    }
    if (c32addr[0] != 'S') {
        throw new Error('Invalid c32 address: must start with "S"');
    }
    return (0, checksum.c32checkDecode)(c32addr.slice(1));
}
exports.c32addressDecode = c32addressDecode;
/*
 * Convert a base58check address to a c32check address.
 * Try to convert the version number if one is not given.
 * @param {string} b58check - the base58check encoded address
 * @param {number} version - the version number, if not inferred from the address
 * @returns {string} the c32 address with the given version number (or the
 *   semantically-equivalent c32 version number, if not given)
 */
function b58ToC32(b58check, version = -1) {
    const addrInfo = base58check.decode(b58check);
    const hash160String = (0, utils.bytesToHex)(addrInfo.data);
    const addrVersion = parseInt((0, utils.bytesToHex)(addrInfo.prefix), 16);
    let stacksVersion;
    if (version < 0) {
        stacksVersion = addrVersion;
        if (ADDR_BITCOIN_TO_STACKS[addrVersion] !== undefined) {
            stacksVersion = ADDR_BITCOIN_TO_STACKS[addrVersion];
        }
    }
    else {
        stacksVersion = version;
    }
    return c32address(stacksVersion, hash160String);
}
exports.b58ToC32 = b58ToC32;
/*
 * Convert a c32check address to a base58check address.
 * @param {string} c32string - the c32check address
 * @param {number} version - the version number, if not inferred from the address
 * @returns {string} the base58 address with the given version number (or the
 *    semantically-equivalent bitcoin version number, if not given)
 */
function c32ToB58(c32string, version = -1) {
    const addrInfo = c32addressDecode(c32string);
    const stacksVersion = addrInfo[0];
    const hash160String = addrInfo[1];
    let bitcoinVersion;
    if (version < 0) {
        bitcoinVersion = stacksVersion;
        if (ADDR_STACKS_TO_BITCOIN[stacksVersion] !== undefined) {
            bitcoinVersion = ADDR_STACKS_TO_BITCOIN[stacksVersion];
        }
    }
    else {
        bitcoinVersion = version;
    }
    let prefix = bitcoinVersion.toString(16);
    if (prefix.length === 1) {
        prefix = `0${prefix}`;
    }
    return base58check.encode(hash160String, prefix);
}
exports.c32ToB58 = c32ToB58;
});

var lib = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.b58ToC32 = exports.c32ToB58 = exports.versions = exports.c32normalize = exports.c32addressDecode = exports.c32address = exports.c32checkDecode = exports.c32checkEncode = exports.c32decode = exports.c32encode = void 0;

Object.defineProperty(exports, "c32encode", { enumerable: true, get: function () { return encoding.c32encode; } });
Object.defineProperty(exports, "c32decode", { enumerable: true, get: function () { return encoding.c32decode; } });
Object.defineProperty(exports, "c32normalize", { enumerable: true, get: function () { return encoding.c32normalize; } });

Object.defineProperty(exports, "c32checkEncode", { enumerable: true, get: function () { return checksum.c32checkEncode; } });
Object.defineProperty(exports, "c32checkDecode", { enumerable: true, get: function () { return checksum.c32checkDecode; } });

Object.defineProperty(exports, "c32address", { enumerable: true, get: function () { return address.c32address; } });
Object.defineProperty(exports, "c32addressDecode", { enumerable: true, get: function () { return address.c32addressDecode; } });
Object.defineProperty(exports, "c32ToB58", { enumerable: true, get: function () { return address.c32ToB58; } });
Object.defineProperty(exports, "b58ToC32", { enumerable: true, get: function () { return address.b58ToC32; } });
Object.defineProperty(exports, "versions", { enumerable: true, get: function () { return address.versions; } });
});

export { lib as l };
