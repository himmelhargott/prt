import { g as getGlobalObject, n as nextMonth, m as makeUUID4, b as bytesToUtf8, h as hexToBytes, a as bytesToHex, u as utf8ToBytes, B as BLOCKSTACK_HANDLER$1, i as isSameOriginAbsoluteUrl, c as nextHour, L as Logger, d as isLaterVersion } from './keys-10ec8e4e.js';
import { I as InvalidDIDError, a as InvalidStateError, N as NoSessionDataError, M as MissingParameterError, L as LoginFailedError } from './errors-8a9f6b06.js';
import { l as lib } from './index-e9798b10.js';
import { c as createFetchFn } from './fetch-31299d03.js';
import { p as publicKeyToBtcAddress, d as decryptECIES, m as makeECPrivateKey, e as encryptECIES, i as isValidPrivateKey, a as encryptContent, b as decryptContent } from './encryption-f97960c9.js';
import { S as StacksMainnet } from './network-5bbac90c.js';
import { e as extractProfile } from './profileTokens-673e20ae.js';
import { B as BLOCKSTACK_DEFAULT_GAIA_HUB_URL } from './constants-8297e4fd.js';

const BLOCKSTACK_HANDLER = 'blockstack';
const BLOCKSTACK_STORAGE_LABEL = 'blockstack';
const DEFAULT_BLOCKSTACK_HOST = 'https://browser.blockstack.org/auth';
const DEFAULT_PROFILE = {
    '@type': 'Person',
    '@context': 'http://schema.org',
};
const DEFAULT_SCOPE = ["store_write"];
const BLOCKSTACK_APP_PRIVATE_KEY_LABEL = 'blockstack-transit-private-key';
const DEFAULT_CORE_NODE = 'https://stacks-node-api.stacks.co';
const NAME_LOOKUP_PATH = '/v1/names';
const LOCALSTORAGE_SESSION_KEY = 'blockstack-session';

class AppConfig {
    constructor(scopes = DEFAULT_SCOPE.slice(), appDomain = getGlobalObject('location', { returnEmptyObject: true })
        ?.origin, redirectPath = '', manifestPath = '/manifest.json', coreNode = undefined, authenticatorURL = DEFAULT_BLOCKSTACK_HOST) {
        this.appDomain = appDomain;
        this.scopes = scopes;
        this.redirectPath = redirectPath;
        this.manifestPath = manifestPath;
        this.coreNode = coreNode;
        this.authenticatorURL = authenticatorURL;
    }
    redirectURI() {
        return `${this.appDomain}${this.redirectPath}`;
    }
    manifestURI() {
        return `${this.appDomain}${this.manifestPath}`;
    }
}

function makeDIDFromAddress(address) {
    return `did:btc-addr:${address}`;
}
function makeDIDFromPublicKey(publicKey) {
    return `did:ecdsa-pub:${publicKey}`;
}
function getDIDType(decentralizedID) {
    const didParts = decentralizedID.split(':');
    if (didParts.length !== 3) {
        throw new InvalidDIDError('Decentralized IDs must have 3 parts');
    }
    if (didParts[0].toLowerCase() !== 'did') {
        throw new InvalidDIDError('Decentralized IDs must start with "did"');
    }
    return didParts[1].toLowerCase();
}
function getAddressFromDID(decentralizedID) {
    if (decentralizedID) {
        const didType = getDIDType(decentralizedID);
        if (didType === 'btc-addr') {
            return decentralizedID.split(':')[2];
        }
        else {
            return undefined;
        }
    }
    return undefined;
}

const VERSION = '1.4.0';
function generateTransitKey() {
    const transitKey = makeECPrivateKey();
    return transitKey;
}
const makeAuthRequest = makeAuthRequestToken;
function makeAuthRequestToken(transitPrivateKey, redirectURI, manifestURI, scopes = DEFAULT_SCOPE.slice(), appDomain, expiresAt = nextMonth().getTime(), extraParams = {}) {
    const getWindowOrigin = (paramName) => {
        const location = getGlobalObject('location', {
            throwIfUnavailable: true,
            usageDesc: `makeAuthRequest([${paramName}=undefined])`,
        });
        return location?.origin;
    };
    if (!redirectURI) {
        redirectURI = `${getWindowOrigin('redirectURI')}/`;
    }
    if (!manifestURI) {
        manifestURI = `${getWindowOrigin('manifestURI')}/manifest.json`;
    }
    if (!appDomain) {
        appDomain = getWindowOrigin('appDomain');
    }
    const payload = Object.assign({}, extraParams, {
        jti: makeUUID4(),
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(expiresAt / 1000),
        iss: null,
        public_keys: [],
        domain_name: appDomain,
        manifest_uri: manifestURI,
        redirect_uri: redirectURI,
        version: VERSION,
        do_not_include_profile: true,
        supports_hub_url: true,
        scopes,
    });
    const publicKey = lib.SECP256K1Client.derivePublicKey(transitPrivateKey);
    payload.public_keys = [publicKey];
    const address = publicKeyToBtcAddress(publicKey);
    payload.iss = makeDIDFromAddress(address);
    const tokenSigner = new lib.TokenSigner('ES256k', transitPrivateKey);
    const token = tokenSigner.sign(payload);
    return token;
}
async function encryptPrivateKey(publicKey, privateKey) {
    const encryptedObj = await encryptECIES(publicKey, utf8ToBytes(privateKey), true);
    const encryptedJSON = JSON.stringify(encryptedObj);
    return bytesToHex(utf8ToBytes(encryptedJSON));
}
async function decryptPrivateKey(privateKey, hexedEncrypted) {
    const unhexedString = bytesToUtf8(hexToBytes(hexedEncrypted));
    const encryptedObj = JSON.parse(unhexedString);
    const decrypted = await decryptECIES(privateKey, encryptedObj);
    if (typeof decrypted !== 'string') {
        throw new Error('Unable to correctly decrypt private key');
    }
    else {
        return decrypted;
    }
}
async function makeAuthResponse(privateKey, profile = {}, metadata, coreToken = null, appPrivateKey = null, expiresAt = nextMonth().getTime(), transitPublicKey = null, hubUrl = null, blockstackAPIUrl = null, associationToken = null, appPrivateKeyFromWalletSalt = null) {
    const publicKey = lib.SECP256K1Client.derivePublicKey(privateKey);
    const address = publicKeyToBtcAddress(publicKey);
    let privateKeyPayload = appPrivateKey;
    let coreTokenPayload = coreToken;
    let additionalProperties = {};
    if (appPrivateKey !== undefined && appPrivateKey !== null) {
        if (transitPublicKey !== undefined && transitPublicKey !== null) {
            privateKeyPayload = await encryptPrivateKey(transitPublicKey, appPrivateKey);
            if (coreToken !== undefined && coreToken !== null) {
                coreTokenPayload = await encryptPrivateKey(transitPublicKey, coreToken);
            }
        }
        additionalProperties = {
            email: metadata?.email ? metadata.email : null,
            profile_url: metadata?.profileUrl ? metadata.profileUrl : null,
            hubUrl,
            blockstackAPIUrl,
            associationToken,
            version: VERSION,
        };
    }
    const payload = Object.assign({}, {
        jti: makeUUID4(),
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(expiresAt / 1000),
        iss: makeDIDFromAddress(address),
        private_key: privateKeyPayload,
        public_keys: [publicKey],
        appPrivateKeyFromWalletSalt,
        profile,
        core_token: coreTokenPayload,
    }, additionalProperties);
    const tokenSigner = new lib.TokenSigner('ES256k', privateKey);
    return tokenSigner.sign(payload);
}

function getAuthRequestFromURL() {
    const location = getGlobalObject('location', {
        throwIfUnavailable: true,
        usageDesc: 'getAuthRequestFromURL',
    });
    const params = new URLSearchParams(location?.search);
    return params.get('authRequest')?.replaceAll(`${BLOCKSTACK_HANDLER$1}:`, '') ?? null;
}
async function fetchAppManifest(authRequest, fetchFn = createFetchFn()) {
    if (!authRequest) {
        throw new Error('Invalid auth request');
    }
    const payload = lib.decodeToken(authRequest).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    const manifestURI = payload.manifest_uri;
    try {
        const response = await fetchFn(manifestURI);
        const responseText = await response.text();
        const responseJSON = JSON.parse(responseText);
        return { ...responseJSON, manifestURI };
    }
    catch (error) {
        console.log(error);
        throw new Error('Could not fetch manifest.json');
    }
}

function doSignaturesMatchPublicKeys(token) {
    const payload = lib.decodeToken(token).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    const publicKeys = payload.public_keys;
    if (publicKeys.length === 1) {
        const publicKey = publicKeys[0];
        try {
            const tokenVerifier = new lib.TokenVerifier('ES256k', publicKey);
            return tokenVerifier.verify(token);
        }
        catch (e) {
            return false;
        }
    }
    else {
        throw new Error('Multiple public keys are not supported');
    }
}
function doPublicKeysMatchIssuer(token) {
    const payload = lib.decodeToken(token).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    const publicKeys = payload.public_keys;
    const addressFromIssuer = getAddressFromDID(payload.iss);
    if (publicKeys.length === 1) {
        const addressFromPublicKeys = publicKeyToBtcAddress(publicKeys[0]);
        if (addressFromPublicKeys === addressFromIssuer) {
            return true;
        }
    }
    else {
        throw new Error('Multiple public keys are not supported');
    }
    return false;
}
function isIssuanceDateValid(token) {
    const payload = lib.decodeToken(token).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    if (payload.iat) {
        if (typeof payload.iat !== 'number') {
            return false;
        }
        const issuedAt = new Date(payload.iat * 1000);
        if (new Date().getTime() < issuedAt.getTime()) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
function isExpirationDateValid(token) {
    const payload = lib.decodeToken(token).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    if (payload.exp) {
        if (typeof payload.exp !== 'number') {
            return false;
        }
        const expiresAt = new Date(payload.exp * 1000);
        if (new Date().getTime() > expiresAt.getTime()) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
function isManifestUriValid(token) {
    const payload = lib.decodeToken(token).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    return isSameOriginAbsoluteUrl(payload.domain_name, payload.manifest_uri);
}
function isRedirectUriValid(token) {
    const payload = lib.decodeToken(token).payload;
    if (typeof payload === 'string') {
        throw new Error('Unexpected token payload type of string');
    }
    return isSameOriginAbsoluteUrl(payload.domain_name, payload.redirect_uri);
}
async function verifyAuthRequest(token) {
    if (lib.decodeToken(token).header.alg === 'none') {
        throw new Error('Token must be signed in order to be verified');
    }
    const values = await Promise.all([
        isExpirationDateValid(token),
        isIssuanceDateValid(token),
        doSignaturesMatchPublicKeys(token),
        doPublicKeysMatchIssuer(token),
        isManifestUriValid(token),
        isRedirectUriValid(token),
    ]);
    return values.every(val => val);
}
async function verifyAuthRequestAndLoadManifest(token) {
    const valid = await verifyAuthRequest(token);
    if (!valid) {
        throw new Error('Token is an invalid auth request');
    }
    return fetchAppManifest(token);
}
async function verifyAuthResponse(token) {
    const conditions = await Promise.all([
        isExpirationDateValid(token),
        isIssuanceDateValid(token),
        doSignaturesMatchPublicKeys(token),
        doPublicKeysMatchIssuer(token),
    ]);
    return conditions.every(val => val);
}

const SESSION_VERSION = '1.0.0';
class SessionData {
    constructor(options) {
        this.version = SESSION_VERSION;
        this.userData = options.userData;
        this.transitKey = options.transitKey;
        this.etags = options.etags ? options.etags : {};
    }
    static fromJSON(json) {
        if (json.version !== SESSION_VERSION) {
            throw new InvalidStateError(`JSON data version ${json.version} not supported by SessionData`);
        }
        const options = {
            coreNode: json.coreNode,
            userData: json.userData,
            transitKey: json.transitKey,
            etags: json.etags,
        };
        return new SessionData(options);
    }
    toString() {
        return JSON.stringify(this);
    }
}

class SessionDataStore {
    constructor(sessionOptions) {
        if (sessionOptions) {
            const newSessionData = new SessionData(sessionOptions);
            this.setSessionData(newSessionData);
        }
    }
    getSessionData() {
        throw new Error('Abstract class');
    }
    setSessionData(_session) {
        throw new Error('Abstract class');
    }
    deleteSessionData() {
        throw new Error('Abstract class');
    }
}
class InstanceDataStore extends SessionDataStore {
    constructor(sessionOptions) {
        super(sessionOptions);
        if (!this.sessionData) {
            this.setSessionData(new SessionData({}));
        }
    }
    getSessionData() {
        if (!this.sessionData) {
            throw new NoSessionDataError('No session data was found.');
        }
        return this.sessionData;
    }
    setSessionData(session) {
        this.sessionData = session;
        return true;
    }
    deleteSessionData() {
        this.setSessionData(new SessionData({}));
        return true;
    }
}
class LocalStorageStore extends SessionDataStore {
    constructor(sessionOptions) {
        super(sessionOptions);
        if (sessionOptions &&
            sessionOptions.storeOptions &&
            sessionOptions.storeOptions.localStorageKey &&
            typeof sessionOptions.storeOptions.localStorageKey === 'string') {
            this.key = sessionOptions.storeOptions.localStorageKey;
        }
        else {
            this.key = LOCALSTORAGE_SESSION_KEY;
        }
        const data = localStorage.getItem(this.key);
        if (!data) {
            const sessionData = new SessionData({});
            this.setSessionData(sessionData);
        }
    }
    getSessionData() {
        const data = localStorage.getItem(this.key);
        if (!data) {
            throw new NoSessionDataError('No session data was found in localStorage');
        }
        const dataJSON = JSON.parse(data);
        return SessionData.fromJSON(dataJSON);
    }
    setSessionData(session) {
        localStorage.setItem(this.key, session.toString());
        return true;
    }
    deleteSessionData() {
        localStorage.removeItem(this.key);
        this.setSessionData(new SessionData({}));
        return true;
    }
}

const GLOBAL_DETECTION_CACHE_KEY = '_blockstackDidCheckEchoReply';
const ECHO_REPLY_PARAM = 'echoReply';
const AUTH_CONTINUATION_PARAM = 'authContinuation';
function getQueryStringParams(query) {
    if (!query) {
        return {};
    }
    const trimmed = /^[?#]/.test(query) ? query.slice(1) : query;
    return trimmed.split('&').reduce((params, param) => {
        const [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
    }, {});
}
function protocolEchoReplyDetection() {
    let globalScope;
    if (typeof self !== 'undefined') {
        globalScope = self;
    }
    else if (typeof window !== 'undefined') {
        globalScope = window;
    }
    else {
        return false;
    }
    if (!globalScope.location || !globalScope.localStorage) {
        return false;
    }
    const existingDetection = globalScope[GLOBAL_DETECTION_CACHE_KEY];
    if (typeof existingDetection === 'boolean') {
        return existingDetection;
    }
    const searchParams = getQueryStringParams(globalScope.location.search);
    const echoReplyParam = searchParams[ECHO_REPLY_PARAM];
    if (echoReplyParam) {
        globalScope[GLOBAL_DETECTION_CACHE_KEY] = true;
        const echoReplyKey = `echo-reply-${echoReplyParam}`;
        globalScope.localStorage.setItem(echoReplyKey, 'success');
        globalScope.setTimeout(() => {
            const authContinuationParam = searchParams[AUTH_CONTINUATION_PARAM];
            globalScope.location.href = authContinuationParam;
        }, 10);
        return true;
    }
    return false;
}

class UserSession {
    constructor(options) {
        let runningInBrowser = true;
        if (typeof window === 'undefined' && typeof self === 'undefined') {
            runningInBrowser = false;
        }
        if (options && options.appConfig) {
            this.appConfig = options.appConfig;
        }
        else if (runningInBrowser) {
            this.appConfig = new AppConfig();
        }
        else {
            throw new MissingParameterError('You need to specify options.appConfig');
        }
        if (options && options.sessionStore) {
            this.store = options.sessionStore;
        }
        else if (runningInBrowser) {
            if (options) {
                this.store = new LocalStorageStore(options.sessionOptions);
            }
            else {
                this.store = new LocalStorageStore();
            }
        }
        else if (options) {
            this.store = new InstanceDataStore(options.sessionOptions);
        }
        else {
            this.store = new InstanceDataStore();
        }
    }
    makeAuthRequestToken(transitKey, redirectURI, manifestURI, scopes, appDomain, expiresAt = nextHour().getTime(), extraParams = {}) {
        const appConfig = this.appConfig;
        if (!appConfig) {
            throw new InvalidStateError('Missing AppConfig');
        }
        transitKey = transitKey || this.generateAndStoreTransitKey();
        redirectURI = redirectURI || appConfig.redirectURI();
        manifestURI = manifestURI || appConfig.manifestURI();
        scopes = scopes || appConfig.scopes;
        appDomain = appDomain || appConfig.appDomain;
        return makeAuthRequestToken(transitKey, redirectURI, manifestURI, scopes, appDomain, expiresAt, extraParams);
    }
    generateAndStoreTransitKey() {
        const sessionData = this.store.getSessionData();
        const transitKey = generateTransitKey();
        sessionData.transitKey = transitKey;
        this.store.setSessionData(sessionData);
        return transitKey;
    }
    getAuthResponseToken() {
        const search = getGlobalObject('location', {
            throwIfUnavailable: true,
            usageDesc: 'getAuthResponseToken',
        })?.search;
        const params = new URLSearchParams(search);
        return params.get('authResponse') ?? '';
    }
    isSignInPending() {
        try {
            const isProtocolEcho = protocolEchoReplyDetection();
            if (isProtocolEcho) {
                Logger.info('protocolEchoReply detected from isSignInPending call, the page is about to redirect.');
                return true;
            }
        }
        catch (error) {
            Logger.error(`Error checking for protocol echo reply isSignInPending: ${error}`);
        }
        return !!this.getAuthResponseToken();
    }
    isUserSignedIn() {
        return !!this.store.getSessionData().userData;
    }
    async handlePendingSignIn(authResponseToken = this.getAuthResponseToken(), fetchFn = createFetchFn()) {
        const sessionData = this.store.getSessionData();
        if (sessionData.userData) {
            throw new LoginFailedError('Existing user session found.');
        }
        const transitKey = this.store.getSessionData().transitKey;
        let coreNode = this.appConfig && this.appConfig.coreNode;
        if (!coreNode) {
            const network = new StacksMainnet();
            coreNode = network.bnsLookupUrl;
        }
        const tokenPayload = lib.decodeToken(authResponseToken).payload;
        if (typeof tokenPayload === 'string') {
            throw new Error('Unexpected token payload type of string');
        }
        const isValid = await verifyAuthResponse(authResponseToken);
        if (!isValid) {
            throw new LoginFailedError('Invalid authentication response.');
        }
        let appPrivateKey = tokenPayload.private_key;
        let coreSessionToken = tokenPayload.core_token;
        if (isLaterVersion(tokenPayload.version, '1.1.0')) {
            if (transitKey !== undefined && transitKey != null) {
                if (tokenPayload.private_key !== undefined && tokenPayload.private_key !== null) {
                    try {
                        appPrivateKey = (await decryptPrivateKey(transitKey, tokenPayload.private_key));
                    }
                    catch (e) {
                        Logger.warn('Failed decryption of appPrivateKey, will try to use as given');
                        if (!isValidPrivateKey(tokenPayload.private_key)) {
                            throw new LoginFailedError('Failed decrypting appPrivateKey. Usually means' +
                                ' that the transit key has changed during login.');
                        }
                    }
                }
                if (coreSessionToken !== undefined && coreSessionToken !== null) {
                    try {
                        coreSessionToken = (await decryptPrivateKey(transitKey, coreSessionToken));
                    }
                    catch (e) {
                        Logger.info('Failed decryption of coreSessionToken, will try to use as given');
                    }
                }
            }
            else {
                throw new LoginFailedError('Authenticating with protocol > 1.1.0 requires transit' + ' key, and none found.');
            }
        }
        let hubUrl = BLOCKSTACK_DEFAULT_GAIA_HUB_URL;
        let gaiaAssociationToken;
        if (isLaterVersion(tokenPayload.version, '1.2.0') &&
            tokenPayload.hubUrl !== null &&
            tokenPayload.hubUrl !== undefined) {
            hubUrl = tokenPayload.hubUrl;
        }
        if (isLaterVersion(tokenPayload.version, '1.3.0') &&
            tokenPayload.associationToken !== null &&
            tokenPayload.associationToken !== undefined) {
            gaiaAssociationToken = tokenPayload.associationToken;
        }
        const userData = {
            profile: tokenPayload.profile,
            email: tokenPayload.email,
            decentralizedID: tokenPayload.iss,
            identityAddress: getAddressFromDID(tokenPayload.iss),
            appPrivateKey,
            coreSessionToken,
            authResponseToken,
            hubUrl,
            appPrivateKeyFromWalletSalt: tokenPayload.appPrivateKeyFromWalletSalt,
            coreNode: tokenPayload.blockstackAPIUrl,
            gaiaAssociationToken,
        };
        const profileURL = tokenPayload.profile_url;
        if (!userData.profile && profileURL) {
            const response = await fetchFn(profileURL);
            if (!response.ok) {
                userData.profile = Object.assign({}, DEFAULT_PROFILE);
            }
            else {
                const responseText = await response.text();
                const wrappedProfile = JSON.parse(responseText);
                userData.profile = extractProfile(wrappedProfile[0].token);
            }
        }
        else {
            userData.profile = tokenPayload.profile;
        }
        sessionData.userData = userData;
        this.store.setSessionData(sessionData);
        return userData;
    }
    loadUserData() {
        const userData = this.store.getSessionData().userData;
        if (!userData) {
            throw new InvalidStateError('No user data found. Did the user sign in?');
        }
        return userData;
    }
    encryptContent(content, options) {
        const opts = Object.assign({}, options);
        if (!opts.privateKey) {
            opts.privateKey = this.loadUserData().appPrivateKey;
        }
        return encryptContent(content, opts);
    }
    decryptContent(content, options) {
        const opts = Object.assign({}, options);
        if (!opts.privateKey) {
            opts.privateKey = this.loadUserData().appPrivateKey;
        }
        return decryptContent(content, opts);
    }
    signUserOut(redirectURL) {
        this.store.deleteSessionData();
        if (redirectURL) {
            if (typeof location !== 'undefined' && location.href) {
                location.href = redirectURL;
            }
        }
    }
}
UserSession.prototype.makeAuthRequest = UserSession.prototype.makeAuthRequestToken;

export { AppConfig as A, BLOCKSTACK_HANDLER as B, DEFAULT_BLOCKSTACK_HOST as D, LOCALSTORAGE_SESSION_KEY as L, NAME_LOOKUP_PATH as N, UserSession as U, makeAuthRequestToken as a, makeAuthResponse as b, verifyAuthResponse as c, decryptPrivateKey as d, isIssuanceDateValid as e, fetchAppManifest as f, getAuthRequestFromURL as g, doPublicKeysMatchIssuer as h, isExpirationDateValid as i, doSignaturesMatchPublicKeys as j, isManifestUriValid as k, isRedirectUriValid as l, makeAuthRequest as m, verifyAuthRequestAndLoadManifest as n, makeDIDFromAddress as o, makeDIDFromPublicKey as p, getDIDType as q, getAddressFromDID as r, BLOCKSTACK_STORAGE_LABEL as s, DEFAULT_PROFILE as t, DEFAULT_SCOPE as u, verifyAuthRequest as v, BLOCKSTACK_APP_PRIVATE_KEY_LABEL as w, DEFAULT_CORE_NODE as x };