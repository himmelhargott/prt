import { h as hmac } from './hmac-988c6f74.js';
import { s as sha256 } from './sha256-1cee21ef.js';
import { u as utils, g as getPublicKey, a as getSharedSecret, P as Point, s as signSync } from './index-171c9fcd.js';
import { f as fromByteArray_1, t as toByteArray_1 } from './index-9c2b2497.js';
import { e as concatBytes, a as bytesToHex, h as hexToBytes, p as privateKeyToBytes, b as bytesToUtf8, u as utf8ToBytes } from './keys-10ec8e4e.js';
import { b as bs58 } from './index-07b5c182.js';
import { r as ripemd160 } from './ripemd160-f7db1645.js';
import { s as sha512 } from './sha512-9db2a8ca.js';
import { F as FailedDecryptionError } from './errors-8a9f6b06.js';

function isSubtleCryptoAvailable() {
    return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}
const NO_CRYPTO_LIB = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function getCryptoLib() {
    if (isSubtleCryptoAvailable()) {
        return {
            lib: crypto.subtle,
            name: 'subtleCrypto',
        };
    }
    else {
        try {
            const nodeCrypto = require('crypto');
            return {
                lib: nodeCrypto,
                name: 'nodeCrypto',
            };
        }
        catch (error) {
            throw new Error(NO_CRYPTO_LIB);
        }
    }
}

class NodeCryptoAesCipher {
    constructor(createCipher, createDecipher) {
        this.createCipher = createCipher;
        this.createDecipher = createDecipher;
    }
    async encrypt(algorithm, key, iv, data) {
        if (algorithm !== 'aes-128-cbc' && algorithm !== 'aes-256-cbc') {
            throw new Error(`Unsupported cipher algorithm "${algorithm}"`);
        }
        const cipher = this.createCipher(algorithm, key, iv);
        const result = new Uint8Array(concatBytes(cipher.update(data), cipher.final()));
        return Promise.resolve(result);
    }
    async decrypt(algorithm, key, iv, data) {
        if (algorithm !== 'aes-128-cbc' && algorithm !== 'aes-256-cbc') {
            throw new Error(`Unsupported cipher algorithm "${algorithm}"`);
        }
        const cipher = this.createDecipher(algorithm, key, iv);
        const result = new Uint8Array(concatBytes(cipher.update(data), cipher.final()));
        return Promise.resolve(result);
    }
}
class WebCryptoAesCipher {
    constructor(subtleCrypto) {
        this.subtleCrypto = subtleCrypto;
    }
    async encrypt(algorithm, key, iv, data) {
        let algo;
        let length;
        if (algorithm === 'aes-128-cbc') {
            algo = 'AES-CBC';
            length = 128;
        }
        else if (algorithm === 'aes-256-cbc') {
            algo = 'AES-CBC';
            length = 256;
        }
        else {
            throw new Error(`Unsupported cipher algorithm "${algorithm}"`);
        }
        const cryptoKey = await this.subtleCrypto.importKey('raw', key, { name: algo, length }, false, [
            'encrypt',
        ]);
        const result = await this.subtleCrypto.encrypt({ name: algo, iv }, cryptoKey, data);
        return new Uint8Array(result);
    }
    async decrypt(algorithm, key, iv, data) {
        let algo;
        let length;
        if (algorithm === 'aes-128-cbc') {
            algo = 'AES-CBC';
            length = 128;
        }
        else if (algorithm === 'aes-256-cbc') {
            algo = 'AES-CBC';
            length = 256;
        }
        else {
            throw new Error(`Unsupported cipher algorithm "${algorithm}"`);
        }
        const cryptoKey = await this.subtleCrypto.importKey('raw', key, { name: algo, length }, false, [
            'decrypt',
        ]);
        const result = await this.subtleCrypto.decrypt({ name: algo, iv }, cryptoKey, data);
        return new Uint8Array(result);
    }
}
async function createCipher() {
    const cryptoLib = await getCryptoLib();
    if (cryptoLib.name === 'subtleCrypto') {
        return new WebCryptoAesCipher(cryptoLib.lib);
    }
    return new NodeCryptoAesCipher(cryptoLib.lib.createCipheriv, cryptoLib.lib.createDecipheriv);
}

function hashRipemd160(data) {
    return ripemd160(data);
}

function hashSha256Sync(data) {
    return sha256(data);
}
function hashSha512Sync(data) {
    return sha512(data);
}

const BITCOIN_PUBKEYHASH = 0x00;
utils.hmacSha256Sync = (key, ...msgs) => {
    const h = hmac.create(sha256, key);
    msgs.forEach(msg => h.update(msg));
    return h.digest();
};
function makeECPrivateKey() {
    return bytesToHex(utils.randomPrivateKey());
}
function base58Encode(hash) {
    const checksum = sha256(sha256(hash));
    return bs58.encode(concatBytes(hash, checksum).slice(0, hash.length + 4));
}
function base58CheckEncode(version, hash) {
    return base58Encode(concatBytes(new Uint8Array([version]), hash.slice(0, 20)));
}
function publicKeyToBtcAddress(publicKey, version = BITCOIN_PUBKEYHASH) {
    const publicKeyBytes = typeof publicKey === 'string' ? hexToBytes(publicKey) : publicKey;
    const publicKeyHash160 = hashRipemd160(hashSha256Sync(publicKeyBytes));
    return base58CheckEncode(version, publicKeyHash160);
}
function getPublicKeyFromPrivate(privateKey) {
    const privateKeyBytes = privateKeyToBytes(privateKey);
    return bytesToHex(getPublicKey(privateKeyBytes.slice(0, 32), true));
}
function isValidPrivateKey(privateKey) {
    return utils.isValidPrivateKey(privateKeyToBytes(privateKey));
}

utils.hmacSha256Sync = (key, ...msgs) => {
    const h = hmac.create(sha256, key);
    msgs.forEach(msg => h.update(msg));
    return h.digest();
};
var InvalidPublicKeyReason;
(function (InvalidPublicKeyReason) {
    InvalidPublicKeyReason["InvalidFormat"] = "InvalidFormat";
    InvalidPublicKeyReason["IsNotPoint"] = "IsNotPoint";
})(InvalidPublicKeyReason || (InvalidPublicKeyReason = {}));
async function aes256CbcEncrypt(iv, key, plaintext) {
    const cipher = await createCipher();
    return await cipher.encrypt('aes-256-cbc', key, iv, plaintext);
}
async function aes256CbcDecrypt(iv, key, ciphertext) {
    const cipher = await createCipher();
    return await cipher.decrypt('aes-256-cbc', key, iv, ciphertext);
}
function hmacSha256(key, content) {
    return hmac(sha256, key, content);
}
function equalsConstTime(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    let res = 0;
    for (let i = 0; i < a.length; i++) {
        res |= a[i] ^ b[i];
    }
    return res === 0;
}
function sharedSecretToKeys(sharedSecret) {
    const hashedSecret = hashSha512Sync(sharedSecret);
    return {
        encryptionKey: hashedSecret.slice(0, 32),
        hmacKey: hashedSecret.slice(32),
    };
}
function allHexChars(maybe) {
    return maybe.match(/^[0-9a-f]+$/i) !== null;
}
function isValidPublicKey(pub) {
    const invalidFormat = {
        result: false,
        reason_data: 'Invalid public key format',
        reason: InvalidPublicKeyReason.InvalidFormat,
    };
    const invalidPoint = {
        result: false,
        reason_data: 'Public key is not a point',
        reason: InvalidPublicKeyReason.IsNotPoint,
    };
    if (pub.length !== 66 && pub.length !== 130)
        return invalidFormat;
    const firstByte = pub.slice(0, 2);
    if (pub.length === 130 && firstByte !== '04')
        return invalidFormat;
    if (pub.length === 66 && firstByte !== '02' && firstByte !== '03')
        return invalidFormat;
    if (!allHexChars(pub))
        return invalidFormat;
    try {
        const point = Point.fromHex(pub);
        point.assertValidity();
        return {
            result: true,
            reason_data: null,
            reason: null,
        };
    }
    catch (e) {
        return invalidPoint;
    }
}
async function encryptECIES(publicKey, content, wasString, cipherTextEncoding) {
    const validity = isValidPublicKey(publicKey);
    if (!validity.result) {
        throw validity;
    }
    const ephemeralPrivateKey = utils.randomPrivateKey();
    const ephemeralPublicKey = getPublicKey(ephemeralPrivateKey, true);
    let sharedSecret = getSharedSecret(ephemeralPrivateKey, publicKey, true);
    sharedSecret = sharedSecret.slice(1);
    const sharedKeys = sharedSecretToKeys(sharedSecret);
    const initializationVector = utils.randomBytes(16);
    const cipherText = await aes256CbcEncrypt(initializationVector, sharedKeys.encryptionKey, content);
    const macData = concatBytes(initializationVector, ephemeralPublicKey, cipherText);
    const mac = hmacSha256(sharedKeys.hmacKey, macData);
    let cipherTextString;
    if (!cipherTextEncoding || cipherTextEncoding === 'hex') {
        cipherTextString = bytesToHex(cipherText);
    }
    else if (cipherTextEncoding === 'base64') {
        cipherTextString = fromByteArray_1(cipherText);
    }
    else {
        throw new Error(`Unexpected cipherTextEncoding "${cipherTextEncoding}"`);
    }
    const result = {
        iv: bytesToHex(initializationVector),
        ephemeralPK: bytesToHex(ephemeralPublicKey),
        cipherText: cipherTextString,
        mac: bytesToHex(mac),
        wasString,
    };
    if (cipherTextEncoding && cipherTextEncoding !== 'hex') {
        result.cipherTextEncoding = cipherTextEncoding;
    }
    return result;
}
async function decryptECIES(privateKey, cipherObject) {
    if (!cipherObject.ephemeralPK) {
        throw new FailedDecryptionError('Unable to get public key from cipher object. ' +
            'You might be trying to decrypt an unencrypted object.');
    }
    const ephemeralPK = cipherObject.ephemeralPK;
    let sharedSecret = getSharedSecret(privateKey, ephemeralPK, true);
    sharedSecret = sharedSecret.slice(1);
    const sharedKeys = sharedSecretToKeys(sharedSecret);
    const ivBytes = hexToBytes(cipherObject.iv);
    let cipherTextBytes;
    if (!cipherObject.cipherTextEncoding || cipherObject.cipherTextEncoding === 'hex') {
        cipherTextBytes = hexToBytes(cipherObject.cipherText);
    }
    else if (cipherObject.cipherTextEncoding === 'base64') {
        cipherTextBytes = toByteArray_1(cipherObject.cipherText);
    }
    else {
        throw new Error(`Unexpected cipherTextEncoding "${cipherObject.cipherText}"`);
    }
    const macData = concatBytes(ivBytes, hexToBytes(ephemeralPK), cipherTextBytes);
    const actualMac = hmacSha256(sharedKeys.hmacKey, macData);
    const expectedMac = hexToBytes(cipherObject.mac);
    if (!equalsConstTime(expectedMac, actualMac)) {
        throw new FailedDecryptionError('Decryption failed: failure in MAC check');
    }
    const plainText = await aes256CbcDecrypt(ivBytes, sharedKeys.encryptionKey, cipherTextBytes);
    if (cipherObject.wasString) {
        return bytesToUtf8(plainText);
    }
    return plainText;
}
function signECDSA(privateKey, content) {
    const contentBytes = typeof content === 'string' ? utf8ToBytes(content) : content;
    const publicKey = getPublicKeyFromPrivate(privateKey);
    const contentHash = hashSha256Sync(contentBytes);
    const signature = signSync(contentHash, privateKey);
    return {
        signature: bytesToHex(signature),
        publicKey,
    };
}

async function encryptContent(content, options) {
    const opts = Object.assign({}, options);
    let privateKey;
    if (!opts.publicKey) {
        if (!opts.privateKey) {
            throw new Error('Either public key or private key must be supplied for encryption.');
        }
        opts.publicKey = getPublicKeyFromPrivate(opts.privateKey);
    }
    const wasString = typeof opts.wasString === 'boolean' ? opts.wasString : typeof content === 'string';
    const contentBytes = typeof content === 'string' ? utf8ToBytes(content) : content;
    const cipherObject = await encryptECIES(opts.publicKey, contentBytes, wasString, opts.cipherTextEncoding);
    let cipherPayload = JSON.stringify(cipherObject);
    if (opts.sign) {
        if (typeof opts.sign === 'string') {
            privateKey = opts.sign;
        }
        else if (!privateKey) {
            privateKey = opts.privateKey;
        }
        const signatureObject = signECDSA(privateKey, cipherPayload);
        const signedCipherObject = {
            signature: signatureObject.signature,
            publicKey: signatureObject.publicKey,
            cipherText: cipherPayload,
        };
        cipherPayload = JSON.stringify(signedCipherObject);
    }
    return cipherPayload;
}
function decryptContent(content, options) {
    const opts = Object.assign({}, options);
    if (!opts.privateKey) {
        throw new Error('Private key is required for decryption.');
    }
    try {
        const cipherObject = JSON.parse(content);
        return decryptECIES(opts.privateKey, cipherObject);
    }
    catch (err) {
        if (err instanceof SyntaxError) {
            throw new Error('Failed to parse encrypted content JSON. The content may not ' +
                'be encrypted. If using getFile, try passing { decrypt: false }.');
        }
        else {
            throw err;
        }
    }
}

export { encryptContent as a, decryptContent as b, decryptECIES as d, encryptECIES as e, isValidPrivateKey as i, makeECPrivateKey as m, publicKeyToBtcAddress as p };
