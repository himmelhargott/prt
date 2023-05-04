import { c as createCommonjsModule, g as getDefaultExportFromNamespaceIfNotNamed, a as commonjsGlobal } from './_commonjsHelpers-16be0a9e.js';
import { b as base64Js } from './index-9c2b2497.js';
import { a as hmac } from './hmac-988c6f74.js';
import { b as sha256$1 } from './sha256-1cee21ef.js';
import { e as esm, _ as _nodeResolve_empty } from './index-171c9fcd.js';
import { l as utils } from './utils-14f97fda.js';

var base64Url = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.unescape = exports.escape = exports.pad = void 0;

function pad(base64) {
    return `${base64}${'='.repeat(4 - (base64.length % 4 || 4))}`;
}
exports.pad = pad;
function escape(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
exports.escape = escape;
function unescape(base64Url) {
    return pad(base64Url).replace(/-/g, '+').replace(/_/g, '/');
}
exports.unescape = unescape;
function encode(base64) {
    return escape((0, base64Js.fromByteArray)(new TextEncoder().encode(base64)));
}
exports.encode = encode;
function decode(base64Url) {
    return new TextDecoder().decode((0, base64Js.toByteArray)(pad(unescape(base64Url))));
}
exports.decode = decode;

});

var ecdsaSigFormatter = createCommonjsModule(function (module, exports) {
//  NOTICE
//  Copyright 2015 D2L Corporation
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.joseToDer = exports.derToJose = void 0;
// The following code is adapted from https://github.com/Brightspace/node-ecdsa-sig-formatter


function getParamSize(keySize) {
    return ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1);
}
const paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521),
};
function getParamBytesForAlg(alg) {
    const paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
        return paramBytes;
    }
    throw new Error(`Unknown algorithm "${alg}"`);
}
const MAX_OCTET = 0x80;
const CLASS_UNIVERSAL = 0;
const PRIMITIVE_BIT = 0x20;
const TAG_SEQ = 0x10;
const TAG_INT = 0x02;
const ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | (CLASS_UNIVERSAL << 6);
const ENCODED_TAG_INT = TAG_INT | (CLASS_UNIVERSAL << 6);
function signatureAsBytes(signature) {
    if (signature instanceof Uint8Array) {
        return signature;
    }
    else if ('string' === typeof signature) {
        return (0, base64Js.toByteArray)((0, base64Url.pad)(signature));
    }
    throw new TypeError('ECDSA signature must be a Base64 string or a Uint8Array');
}
function derToJose(signature, alg) {
    const signatureBytes = signatureAsBytes(signature);
    const paramBytes = getParamBytesForAlg(alg);
    // the DER encoded param should at most be the param size, plus a padding
    // zero, since due to being a signed integer
    const maxEncodedParamLength = paramBytes + 1;
    const inputLength = signatureBytes.length;
    let offset = 0;
    if (signatureBytes[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
    }
    let seqLength = signatureBytes[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signatureBytes[offset++];
    }
    if (inputLength - offset < seqLength) {
        throw new Error(`"seq" specified length of "${seqLength}", only "${inputLength - offset}" remaining`);
    }
    if (signatureBytes[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
    }
    const rLength = signatureBytes[offset++];
    if (inputLength - offset - 2 < rLength) {
        throw new Error(`"r" specified length of "${rLength}", only "${inputLength - offset - 2}" available`);
    }
    if (maxEncodedParamLength < rLength) {
        throw new Error(`"r" specified length of "${rLength}", max of "${maxEncodedParamLength}" is acceptable`);
    }
    const rOffset = offset;
    offset += rLength;
    if (signatureBytes[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
    }
    const sLength = signatureBytes[offset++];
    if (inputLength - offset !== sLength) {
        throw new Error(`"s" specified length of "${sLength}", expected "${inputLength - offset}"`);
    }
    if (maxEncodedParamLength < sLength) {
        throw new Error(`"s" specified length of "${sLength}", max of "${maxEncodedParamLength}" is acceptable`);
    }
    const sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
        throw new Error(`Expected to consume entire array, but "${inputLength - offset}" bytes remain`);
    }
    const rPadding = paramBytes - rLength;
    const sPadding = paramBytes - sLength;
    const dst = new Uint8Array(rPadding + rLength + sPadding + sLength);
    for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
    }
    dst.set(signatureBytes.subarray(rOffset + Math.max(-rPadding, 0), rOffset + rLength), offset);
    offset = paramBytes;
    for (const o = offset; offset < o + sPadding; ++offset) {
        dst[offset] = 0;
    }
    dst.set(signatureBytes.subarray(sOffset + Math.max(-sPadding, 0), sOffset + sLength), offset);
    return (0, base64Url.escape)((0, base64Js.fromByteArray)(dst));
}
exports.derToJose = derToJose;
function countPadding(buf, start, stop) {
    let padding = 0;
    while (start + padding < stop && buf[start + padding] === 0) {
        ++padding;
    }
    const needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
        --padding;
    }
    return padding;
}
function joseToDer(signature, alg) {
    signature = signatureAsBytes(signature);
    const paramBytes = getParamBytesForAlg(alg);
    const signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
        throw new TypeError(`"${alg}" signatures must be "${paramBytes * 2}" bytes, saw "${signatureBytes}"`);
    }
    const rPadding = countPadding(signature, 0, paramBytes);
    const sPadding = countPadding(signature, paramBytes, signature.length);
    const rLength = paramBytes - rPadding;
    const sLength = paramBytes - sPadding;
    const rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    const shortLength = rsBytes < MAX_OCTET;
    const dst = new Uint8Array((shortLength ? 2 : 3) + rsBytes);
    let offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
        // Bit 8 has value "0"
        // bits 7-1 give the length.
        dst[offset++] = rsBytes;
    }
    else {
        // Bit 8 of first octet has value "1"
        // bits 7-1 give the number of additional length octets.
        dst[offset++] = MAX_OCTET | 1;
        // length, base 256
        dst[offset++] = rsBytes & 0xff;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
        dst[offset++] = 0;
        dst.set(signature.subarray(0, paramBytes), offset);
        offset += paramBytes;
    }
    else {
        dst.set(signature.subarray(rPadding, paramBytes), offset);
        offset += paramBytes - rPadding;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
        dst[offset++] = 0;
        dst.set(signature.subarray(paramBytes), offset);
    }
    else {
        dst.set(signature.subarray(paramBytes + sPadding), offset);
    }
    return dst;
}
exports.joseToDer = joseToDer;

});

var errors = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenError = exports.MissingParametersError = void 0;
class MissingParametersError extends Error {
    constructor(message) {
        super();
        this.name = 'MissingParametersError';
        this.message = message || '';
    }
}
exports.MissingParametersError = MissingParametersError;
class InvalidTokenError extends Error {
    constructor(message) {
        super();
        this.name = 'InvalidTokenError';
        this.message = message || '';
    }
}
exports.InvalidTokenError = InvalidTokenError;

});

var secp256k1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECP256K1Client = void 0;






// required to use noble secp https://github.com/paulmillr/noble-secp256k1
esm.utils.hmacSha256Sync = (key, ...msgs) => {
    const h = hmac.hmac.create(sha256$1.sha256, key);
    msgs.forEach(msg => h.update(msg));
    return h.digest();
};
class SECP256K1Client {
    static derivePublicKey(privateKey, compressed = true) {
        if (privateKey.length === 66) {
            privateKey = privateKey.slice(0, 64);
        }
        if (privateKey.length < 64) {
            // backward compatibly accept too short private keys
            privateKey = privateKey.padStart(64, '0');
        }
        return (0, utils.bytesToHex)(esm.getPublicKey(privateKey, compressed));
    }
    static signHash(signingInputHash, privateKey, format = 'jose') {
        // make sure the required parameters are provided
        if (!signingInputHash || !privateKey) {
            throw new errors.MissingParametersError('a signing input hash and private key are all required');
        }
        const derSignature = esm.signSync(signingInputHash, privateKey.slice(0, 64), {
            der: true,
            canonical: false,
        });
        if (format === 'der')
            return (0, utils.bytesToHex)(derSignature);
        if (format === 'jose')
            return (0, ecdsaSigFormatter.derToJose)(derSignature, 'ES256');
        throw Error('Invalid signature format');
    }
    static loadSignature(joseSignature) {
        // create and return the DER-formatted signature bytes
        return (0, ecdsaSigFormatter.joseToDer)(joseSignature, 'ES256');
    }
    static verifyHash(signingInputHash, derSignatureBytes, publicKey) {
        // make sure the required parameters are provided
        if (!signingInputHash || !derSignatureBytes || !publicKey) {
            throw new errors.MissingParametersError('a signing input hash, der signature, and public key are all required');
        }
        return esm.verify(derSignatureBytes, signingInputHash, publicKey, { strict: false });
    }
}
exports.SECP256K1Client = SECP256K1Client;
SECP256K1Client.algorithmName = 'ES256K';

});

var cryptoClients_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoClients = exports.SECP256K1Client = void 0;

Object.defineProperty(exports, "SECP256K1Client", { enumerable: true, get: function () { return secp256k1.SECP256K1Client; } });
const cryptoClients = {
    ES256K: secp256k1.SECP256K1Client,
};
exports.cryptoClients = cryptoClients;

});

var require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(_nodeResolve_empty);

var sha256 = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashSha256Async = exports.hashSha256 = void 0;

function hashSha256(input) {
    return (0, sha256$1.sha256)(input);
}
exports.hashSha256 = hashSha256;
function hashSha256Async(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isSubtleCryptoAvailable = typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
            if (isSubtleCryptoAvailable) {
                // Use the W3C Web Crypto API if available (running in a web browser).
                const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
                const hash = yield crypto.subtle.digest('SHA-256', bytes);
                return new Uint8Array(hash);
            }
            else {
                // Otherwise try loading the Node.js `crypto` module (running in Node.js, or an older browser with a polyfill).
                const nodeCrypto = require$$0;
                if (!nodeCrypto.createHash) {
                    throw new Error('`crypto` module does not contain `createHash`');
                }
                return Promise.resolve(nodeCrypto.createHash('sha256').update(input).digest());
            }
        }
        catch (error) {
            console.log(error);
            console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, ' +
                'nor the or the Node.js `require("crypto").createHash` module is available. ' +
                'Falling back to JS implementation.');
            return Promise.resolve(hashSha256(input));
        }
    });
}
exports.hashSha256Async = hashSha256Async;

});

var signer = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSigner = exports.createUnsecuredToken = void 0;




function createSigningInput(payload, header) {
    const tokenParts = [];
    // add in the header
    const encodedHeader = base64Url.encode(JSON.stringify(header));
    tokenParts.push(encodedHeader);
    // add in the payload
    const encodedPayload = base64Url.encode(JSON.stringify(payload));
    tokenParts.push(encodedPayload);
    // prepare the message
    const signingInput = tokenParts.join('.');
    // return the signing input
    return signingInput;
}
function createUnsecuredToken(payload) {
    const header = { typ: 'JWT', alg: 'none' };
    return createSigningInput(payload, header) + '.';
}
exports.createUnsecuredToken = createUnsecuredToken;
class TokenSigner {
    constructor(signingAlgorithm, rawPrivateKey) {
        if (!(signingAlgorithm && rawPrivateKey)) {
            throw new errors.MissingParametersError('a signing algorithm and private key are required');
        }
        if (typeof signingAlgorithm !== 'string') {
            throw new Error('signing algorithm parameter must be a string');
        }
        signingAlgorithm = signingAlgorithm.toUpperCase();
        if (!cryptoClients_1.cryptoClients.hasOwnProperty(signingAlgorithm)) {
            throw new Error('invalid signing algorithm');
        }
        this.tokenType = 'JWT';
        this.cryptoClient = cryptoClients_1.cryptoClients[signingAlgorithm];
        this.rawPrivateKey = rawPrivateKey;
    }
    header(header = {}) {
        const defaultHeader = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
        return Object.assign({}, defaultHeader, header);
    }
    sign(payload, expanded = false, customHeader = {}) {
        // generate the token header
        const header = this.header(customHeader);
        // prepare the message to be signed
        const signingInput = createSigningInput(payload, header);
        const signingInputHash = (0, sha256.hashSha256)(signingInput);
        return this.createWithSignedHash(payload, expanded, header, signingInput, signingInputHash);
    }
    signAsync(payload, expanded = false, customHeader = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate the token header
            const header = this.header(customHeader);
            // prepare the message to be signed
            const signingInput = createSigningInput(payload, header);
            const signingInputHash = yield (0, sha256.hashSha256Async)(signingInput);
            return this.createWithSignedHash(payload, expanded, header, signingInput, signingInputHash);
        });
    }
    createWithSignedHash(payload, expanded, header, signingInput, signingInputHash) {
        // sign the message and add in the signature
        const signature = this.cryptoClient.signHash(signingInputHash, this.rawPrivateKey);
        if (expanded) {
            const signedToken = {
                header: [base64Url.encode(JSON.stringify(header))],
                payload: JSON.stringify(payload),
                signature: [signature],
            };
            return signedToken;
        }
        else {
            return [signingInput, signature].join('.');
        }
    }
}
exports.TokenSigner = TokenSigner;

});

var verifier = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVerifier = void 0;




class TokenVerifier {
    constructor(signingAlgorithm, rawPublicKey) {
        if (!(signingAlgorithm && rawPublicKey)) {
            throw new errors.MissingParametersError('a signing algorithm and public key are required');
        }
        if (typeof signingAlgorithm !== 'string') {
            throw 'signing algorithm parameter must be a string';
        }
        signingAlgorithm = signingAlgorithm.toUpperCase();
        if (!cryptoClients_1.cryptoClients.hasOwnProperty(signingAlgorithm)) {
            throw 'invalid signing algorithm';
        }
        this.tokenType = 'JWT';
        this.cryptoClient = cryptoClients_1.cryptoClients[signingAlgorithm];
        this.rawPublicKey = rawPublicKey;
    }
    verify(token) {
        if (typeof token === 'string') {
            return this.verifyCompact(token, false);
        }
        else if (typeof token === 'object') {
            return this.verifyExpanded(token, false);
        }
        else {
            return false;
        }
    }
    verifyAsync(token) {
        if (typeof token === 'string') {
            return this.verifyCompact(token, true);
        }
        else if (typeof token === 'object') {
            return this.verifyExpanded(token, true);
        }
        else {
            return Promise.resolve(false);
        }
    }
    verifyCompact(token, async) {
        // decompose the token into parts
        const tokenParts = token.split('.');
        // calculate the signing input hash
        const signingInput = tokenParts[0] + '.' + tokenParts[1];
        const performVerify = (signingInputHash) => {
            // extract the signature as a DER array
            const derSignatureBytes = this.cryptoClient.loadSignature(tokenParts[2]);
            // verify the signed hash
            return this.cryptoClient.verifyHash(signingInputHash, derSignatureBytes, this.rawPublicKey);
        };
        if (async) {
            return (0, sha256.hashSha256Async)(signingInput).then(signingInputHash => performVerify(signingInputHash));
        }
        else {
            const signingInputHash = (0, sha256.hashSha256)(signingInput);
            return performVerify(signingInputHash);
        }
    }
    verifyExpanded(token, async) {
        const signingInput = [token['header'].join('.'), base64Url.encode(token['payload'])].join('.');
        let verified = true;
        const performVerify = (signingInputHash) => {
            token['signature'].map((signature) => {
                const derSignatureBytes = this.cryptoClient.loadSignature(signature);
                const signatureVerified = this.cryptoClient.verifyHash(signingInputHash, derSignatureBytes, this.rawPublicKey);
                if (!signatureVerified) {
                    verified = false;
                }
            });
            return verified;
        };
        if (async) {
            return (0, sha256.hashSha256Async)(signingInput).then(signingInputHash => performVerify(signingInputHash));
        }
        else {
            const signingInputHash = (0, sha256.hashSha256)(signingInput);
            return performVerify(signingInputHash);
        }
    }
}
exports.TokenVerifier = TokenVerifier;

});

var decode = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;

function decodeToken(token) {
    if (typeof token === 'string') {
        // decompose the token into parts
        const tokenParts = token.split('.');
        const header = JSON.parse(base64Url.decode(tokenParts[0]));
        const payload = JSON.parse(base64Url.decode(tokenParts[1]));
        const signature = tokenParts[2];
        // return the token object
        return {
            header: header,
            payload: payload,
            signature: signature,
        };
    }
    else if (typeof token === 'object') {
        if (typeof token.payload !== 'string') {
            throw new Error('Expected token payload to be a base64 or json string');
        }
        let payload = token.payload;
        if (token.payload[0] !== '{') {
            payload = base64Url.decode(payload);
        }
        const allHeaders = [];
        token.header.map((headerValue) => {
            const header = JSON.parse(base64Url.decode(headerValue));
            allHeaders.push(header);
        });
        return {
            header: allHeaders,
            payload: JSON.parse(payload),
            signature: token.signature,
        };
    }
}
exports.decodeToken = decodeToken;

});

var lib = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(signer, exports);
__exportStar(verifier, exports);
__exportStar(decode, exports);
__exportStar(errors, exports);
__exportStar(cryptoClients_1, exports);

});

export { lib as l };
