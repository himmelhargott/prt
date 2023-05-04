import { l as lib } from './index-e9798b10.js';
import { g as getAddressFromPublicKey } from './utils-a25b7f95.js';
import { f as nextYear, m as makeUUID4 } from './keys-10ec8e4e.js';

function signProfileToken(profile, privateKey, subject, issuer, signingAlgorithm = 'ES256K', issuedAt = new Date(), expiresAt = nextYear()) {
    if (signingAlgorithm !== 'ES256K') {
        throw new Error('Signing algorithm not supported');
    }
    const publicKey = lib.SECP256K1Client.derivePublicKey(privateKey);
    if (!subject) {
        subject = { publicKey };
    }
    if (!issuer) {
        issuer = { publicKey };
    }
    const tokenSigner = new lib.TokenSigner(signingAlgorithm, privateKey);
    const payload = {
        jti: makeUUID4(),
        iat: issuedAt.toISOString(),
        exp: expiresAt.toISOString(),
        subject,
        issuer,
        claim: profile,
    };
    return tokenSigner.sign(payload);
}
function verifyProfileToken(token, publicKeyOrAddress) {
    const decodedToken = lib.decodeToken(token);
    const payload = decodedToken.payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    if (payload.hasOwnProperty('subject') && payload.subject) {
        if (!payload.subject.hasOwnProperty('publicKey')) {
            throw new Error("Token doesn't have a subject public key");
        }
    }
    else {
        throw new Error("Token doesn't have a subject");
    }
    if (payload.hasOwnProperty('issuer') && payload.issuer) {
        if (!payload.issuer.hasOwnProperty('publicKey')) {
            throw new Error("Token doesn't have an issuer public key");
        }
    }
    else {
        throw new Error("Token doesn't have an issuer");
    }
    if (!payload.hasOwnProperty('claim')) {
        throw new Error("Token doesn't have a claim");
    }
    const issuerPublicKey = payload.issuer.publicKey;
    const address = getAddressFromPublicKey(issuerPublicKey);
    if (publicKeyOrAddress === issuerPublicKey) ;
    else if (publicKeyOrAddress === address) ;
    else {
        throw new Error('Token issuer public key does not match the verifying value');
    }
    const tokenVerifier = new lib.TokenVerifier(decodedToken.header.alg, issuerPublicKey);
    if (!tokenVerifier) {
        throw new Error('Invalid token verifier');
    }
    const tokenVerified = tokenVerifier.verify(token);
    if (!tokenVerified) {
        throw new Error('Token verification failed');
    }
    return decodedToken;
}
function extractProfile(token, publicKeyOrAddress = null) {
    let decodedToken;
    if (publicKeyOrAddress) {
        decodedToken = verifyProfileToken(token, publicKeyOrAddress);
    }
    else {
        decodedToken = lib.decodeToken(token);
    }
    let profile = {};
    if (decodedToken.hasOwnProperty('payload')) {
        const payload = decodedToken.payload;
        if (typeof payload === 'string') {
            throw new Error('Unexpected token payload type of string');
        }
        if (payload.hasOwnProperty('claim')) {
            profile = payload.claim;
        }
    }
    return profile;
}

export { extractProfile as e, signProfileToken as s };
