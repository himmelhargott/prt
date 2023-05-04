export { A as AppConfig, w as BLOCKSTACK_APP_PRIVATE_KEY_LABEL, B as BLOCKSTACK_HANDLER, s as BLOCKSTACK_STORAGE_LABEL, D as DEFAULT_BLOCKSTACK_HOST, x as DEFAULT_CORE_NODE, t as DEFAULT_PROFILE, u as DEFAULT_SCOPE, L as LOCALSTORAGE_SESSION_KEY, N as NAME_LOOKUP_PATH, U as UserSession, d as decryptPrivateKey, h as doPublicKeysMatchIssuer, j as doSignaturesMatchPublicKeys, f as fetchAppManifest, r as getAddressFromDID, g as getAuthRequestFromURL, q as getDIDType, i as isExpirationDateValid, e as isIssuanceDateValid, k as isManifestUriValid, l as isRedirectUriValid, m as makeAuthRequest, a as makeAuthRequestToken, b as makeAuthResponse, o as makeDIDFromAddress, p as makeDIDFromPublicKey, v as verifyAuthRequest, n as verifyAuthRequestAndLoadManifest, c as verifyAuthResponse } from '../common/userSession-8e1c1827.js';
import { S as StacksMainnet, a as StacksNetwork } from '../common/network-5bbac90c.js';
import { r as resolveZoneFileToProfile } from '../common/profile-55e97daa.js';
import '../common/keys-10ec8e4e.js';
import '../common/errors-8a9f6b06.js';
import '../common/index-e9798b10.js';
import '../common/_commonjsHelpers-16be0a9e.js';
import '../common/index-9c2b2497.js';
import '../common/hmac-988c6f74.js';
import '../common/_assert-30bf9db8.js';
import '../common/utils-14f97fda.js';
import '../common/sha256-1cee21ef.js';
import '../common/_sha2-f781ad42.js';
import '../common/index-171c9fcd.js';
import '../common/fetch-31299d03.js';
import '../cross-fetch/polyfill.js';
import '../common/encryption-f97960c9.js';
import '../common/index-07b5c182.js';
import '../common/index-45f36113.js';
import '../common/ripemd160-f7db1645.js';
import '../common/sha512-9db2a8ca.js';
import '../common/profileTokens-673e20ae.js';
import '../common/utils-a25b7f95.js';
import '../common/index-859a5447.js';
import '../common/index-b7cf6e7e.js';
import '../common/buffer-174571f5.js';
import '../common/constants-8297e4fd.js';
import '../common/index-b8e17bd2.js';
import '../common/index-9c645bf7.js';
import '../common/async-37eab521.js';

function lookupProfile(lookupOptions) {
    if (!lookupOptions.username) {
        return Promise.reject(new Error('No username provided'));
    }
    const defaultOptions = {
        network: new StacksMainnet(),
    };
    const options = Object.assign(defaultOptions, lookupOptions);
    const network = StacksNetwork.fromNameOrNetwork(options.network);
    let lookupPromise;
    if (options.zoneFileLookupURL) {
        const url = `${options.zoneFileLookupURL.replace(/\/$/, '')}/${options.username}`;
        lookupPromise = network.fetchFn(url).then(response => response.json());
    }
    else {
        lookupPromise = network.getNameInfo(options.username);
    }
    return lookupPromise.then((responseJSON) => {
        if (responseJSON.hasOwnProperty('zonefile') && responseJSON.hasOwnProperty('address')) {
            return resolveZoneFileToProfile(responseJSON.zonefile, responseJSON.address, network.fetchFn);
        }
        else {
            throw new Error('Invalid zonefile lookup response: did not contain `address`' + ' or `zonefile` field');
        }
    });
}

export { lookupProfile };
