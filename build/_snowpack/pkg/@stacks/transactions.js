import { H as ClarityType, j as cloneDeep, S as StacksMessageType, I as PostConditionType, J as parsePrincipalString, P as PubKeyEncoding, A as AuthType, h as SigningError, K as validateTxId, T as TransactionVersion, L as publicKeyToString, f as getPublicKey, M as createStacksPrivateKey, N as omit, O as pubKeyfromPrivKey, Q as publicKeyFromBytes, U as createStandardPrincipal, W as createContractPrincipal, X as cvToHex, Y as parseReadOnlyResponse, v as PostConditionMode, Z as createContractCallPayload, b as AddressHashMode, q as createLPList, _ as AddressVersion, $ as NoEstimateAvailableError, G as serializePayload, R as RECOVERABLE_ECDSA_SIG_LENGTH_BYTES } from '../common/utils-a25b7f95.js';
export { u as AnchorMode, B as BytesReader, C as ChainID, ag as FungibleConditionCode, ac as bufferCV, af as bufferCVFromString, a7 as contractPrincipalCV, M as createStacksPrivateKey, X as cvToHex, a1 as falseCV, g as getAddressFromPublicKey, a4 as intCV, aa as listCV, a2 as noneCV, Y as parseReadOnlyResponse, a8 as responseErrorCV, a9 as responseOkCV, s as serializeCV, a as serializePostCondition, a3 as someCV, a6 as standardPrincipalCV, ae as stringAsciiCV, ad as stringUtf8CV, a0 as trueCV, ab as tupleCV, a5 as uintCV } from '../common/utils-a25b7f95.js';
import { l as lib } from '../common/index-859a5447.js';
import { i as isSingleSig, n as nextVerification, c as createSingleSigSpendingCondition, a as createMultiSigSpendingCondition, b as createSponsoredAuth, e as createStandardAuth, S as StacksTransaction } from '../common/transaction-49c5ef52.js';
export { d as deserializeTransaction } from '../common/transaction-49c5ef52.js';
import { u as utf8ToBytes, v as asciiToBytes, j as intToBigInt, a as bytesToHex, h as hexToBytes } from '../common/keys-10ec8e4e.js';
import { a as StacksNetwork, b as StacksTestnet, S as StacksMainnet } from '../common/network-5bbac90c.js';
import { c as createFetchFn } from '../common/fetch-31299d03.js';
import '../common/ripemd160-f7db1645.js';
import '../common/_sha2-f781ad42.js';
import '../common/_assert-30bf9db8.js';
import '../common/utils-14f97fda.js';
import '../common/_commonjsHelpers-16be0a9e.js';
import '../common/sha256-1cee21ef.js';
import '../common/sha512-9db2a8ca.js';
import '../common/index-171c9fcd.js';
import '../common/index-b7cf6e7e.js';
import '../common/hmac-988c6f74.js';
import '../common/buffer-174571f5.js';
import '../common/constants-8297e4fd.js';
import '../common/index-45f36113.js';
import '../cross-fetch/polyfill.js';

function getCVTypeString(val) {
    switch (val.type) {
        case ClarityType.BoolTrue:
        case ClarityType.BoolFalse:
            return 'bool';
        case ClarityType.Int:
            return 'int';
        case ClarityType.UInt:
            return 'uint';
        case ClarityType.Buffer:
            return `(buff ${val.buffer.length})`;
        case ClarityType.OptionalNone:
            return '(optional none)';
        case ClarityType.OptionalSome:
            return `(optional ${getCVTypeString(val.value)})`;
        case ClarityType.ResponseErr:
            return `(response UnknownType ${getCVTypeString(val.value)})`;
        case ClarityType.ResponseOk:
            return `(response ${getCVTypeString(val.value)} UnknownType)`;
        case ClarityType.PrincipalStandard:
        case ClarityType.PrincipalContract:
            return 'principal';
        case ClarityType.List:
            return `(list ${val.list.length} ${val.list.length ? getCVTypeString(val.list[0]) : 'UnknownType'})`;
        case ClarityType.Tuple:
            return `(tuple ${Object.keys(val.data)
                .map(key => `(${key} ${getCVTypeString(val.data[key])})`)
                .join(' ')})`;
        case ClarityType.StringASCII:
            return `(string-ascii ${asciiToBytes(val.data).length})`;
        case ClarityType.StringUTF8:
            return `(string-utf8 ${utf8ToBytes(val.data).length})`;
    }
}

var ClarityAbiTypeId;
(function (ClarityAbiTypeId) {
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeUInt128"] = 1] = "ClarityAbiTypeUInt128";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeInt128"] = 2] = "ClarityAbiTypeInt128";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeBool"] = 3] = "ClarityAbiTypeBool";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypePrincipal"] = 4] = "ClarityAbiTypePrincipal";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeNone"] = 5] = "ClarityAbiTypeNone";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeBuffer"] = 6] = "ClarityAbiTypeBuffer";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeResponse"] = 7] = "ClarityAbiTypeResponse";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeOptional"] = 8] = "ClarityAbiTypeOptional";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeTuple"] = 9] = "ClarityAbiTypeTuple";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeList"] = 10] = "ClarityAbiTypeList";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeStringAscii"] = 11] = "ClarityAbiTypeStringAscii";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeStringUtf8"] = 12] = "ClarityAbiTypeStringUtf8";
    ClarityAbiTypeId[ClarityAbiTypeId["ClarityAbiTypeTraitReference"] = 13] = "ClarityAbiTypeTraitReference";
})(ClarityAbiTypeId || (ClarityAbiTypeId = {}));
const isClarityAbiPrimitive = (val) => typeof val === 'string';
const isClarityAbiBuffer = (val) => val.buffer !== undefined;
const isClarityAbiStringAscii = (val) => val['string-ascii'] !== undefined;
const isClarityAbiStringUtf8 = (val) => val['string-utf8'] !== undefined;
const isClarityAbiResponse = (val) => val.response !== undefined;
const isClarityAbiOptional = (val) => val.optional !== undefined;
const isClarityAbiTuple = (val) => val.tuple !== undefined;
const isClarityAbiList = (val) => val.list !== undefined;
function getTypeUnion(val) {
    if (isClarityAbiPrimitive(val)) {
        if (val === 'uint128') {
            return { id: ClarityAbiTypeId.ClarityAbiTypeUInt128, type: val };
        }
        else if (val === 'int128') {
            return { id: ClarityAbiTypeId.ClarityAbiTypeInt128, type: val };
        }
        else if (val === 'bool') {
            return { id: ClarityAbiTypeId.ClarityAbiTypeBool, type: val };
        }
        else if (val === 'principal') {
            return { id: ClarityAbiTypeId.ClarityAbiTypePrincipal, type: val };
        }
        else if (val === 'trait_reference') {
            return { id: ClarityAbiTypeId.ClarityAbiTypeTraitReference, type: val };
        }
        else if (val === 'none') {
            return { id: ClarityAbiTypeId.ClarityAbiTypeNone, type: val };
        }
        else {
            throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(val)}`);
        }
    }
    else if (isClarityAbiBuffer(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeBuffer, type: val };
    }
    else if (isClarityAbiResponse(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeResponse, type: val };
    }
    else if (isClarityAbiOptional(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeOptional, type: val };
    }
    else if (isClarityAbiTuple(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeTuple, type: val };
    }
    else if (isClarityAbiList(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeList, type: val };
    }
    else if (isClarityAbiStringAscii(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeStringAscii, type: val };
    }
    else if (isClarityAbiStringUtf8(val)) {
        return { id: ClarityAbiTypeId.ClarityAbiTypeStringUtf8, type: val };
    }
    else {
        throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(val)}`);
    }
}
function getTypeString(val) {
    if (isClarityAbiPrimitive(val)) {
        if (val === 'int128') {
            return 'int';
        }
        else if (val === 'uint128') {
            return 'uint';
        }
        return val;
    }
    else if (isClarityAbiBuffer(val)) {
        return `(buff ${val.buffer.length})`;
    }
    else if (isClarityAbiStringAscii(val)) {
        return `(string-ascii ${val['string-ascii'].length})`;
    }
    else if (isClarityAbiStringUtf8(val)) {
        return `(string-utf8 ${val['string-utf8'].length})`;
    }
    else if (isClarityAbiResponse(val)) {
        return `(response ${getTypeString(val.response.ok)} ${getTypeString(val.response.error)})`;
    }
    else if (isClarityAbiOptional(val)) {
        return `(optional ${getTypeString(val.optional)})`;
    }
    else if (isClarityAbiTuple(val)) {
        return `(tuple ${val.tuple.map(t => `(${t.name} ${getTypeString(t.type)})`).join(' ')})`;
    }
    else if (isClarityAbiList(val)) {
        return `(list ${val.list.length} ${getTypeString(val.list.type)})`;
    }
    else {
        throw new Error(`Type string unsupported for Clarity type: ${JSON.stringify(val)}`);
    }
}
function matchType(cv, abiType) {
    const union = getTypeUnion(abiType);
    switch (cv.type) {
        case ClarityType.BoolTrue:
        case ClarityType.BoolFalse:
            return union.id === ClarityAbiTypeId.ClarityAbiTypeBool;
        case ClarityType.Int:
            return union.id === ClarityAbiTypeId.ClarityAbiTypeInt128;
        case ClarityType.UInt:
            return union.id === ClarityAbiTypeId.ClarityAbiTypeUInt128;
        case ClarityType.Buffer:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeBuffer &&
                union.type.buffer.length >= cv.buffer.length);
        case ClarityType.StringASCII:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeStringAscii &&
                union.type['string-ascii'].length >= cv.data.length);
        case ClarityType.StringUTF8:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeStringUtf8 &&
                union.type['string-utf8'].length >= cv.data.length);
        case ClarityType.OptionalNone:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeNone ||
                union.id === ClarityAbiTypeId.ClarityAbiTypeOptional);
        case ClarityType.OptionalSome:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeOptional &&
                matchType(cv.value, union.type.optional));
        case ClarityType.ResponseErr:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeResponse &&
                matchType(cv.value, union.type.response.error));
        case ClarityType.ResponseOk:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypeResponse &&
                matchType(cv.value, union.type.response.ok));
        case ClarityType.PrincipalContract:
            return (union.id === ClarityAbiTypeId.ClarityAbiTypePrincipal ||
                union.id === ClarityAbiTypeId.ClarityAbiTypeTraitReference);
        case ClarityType.PrincipalStandard:
            return union.id === ClarityAbiTypeId.ClarityAbiTypePrincipal;
        case ClarityType.List:
            return (union.id == ClarityAbiTypeId.ClarityAbiTypeList &&
                union.type.list.length >= cv.list.length &&
                cv.list.every(val => matchType(val, union.type.list.type)));
        case ClarityType.Tuple:
            if (union.id == ClarityAbiTypeId.ClarityAbiTypeTuple) {
                const tuple = cloneDeep(cv.data);
                for (let i = 0; i < union.type.tuple.length; i++) {
                    const abiTupleEntry = union.type.tuple[i];
                    const key = abiTupleEntry.name;
                    const val = tuple[key];
                    if (val) {
                        if (!matchType(val, abiTupleEntry.type)) {
                            return false;
                        }
                        delete tuple[key];
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        default:
            return false;
    }
}
function validateContractCall(payload, abi) {
    const filtered = abi.functions.filter(fn => fn.name === payload.functionName.content);
    if (filtered.length === 1) {
        const abiFunc = filtered[0];
        const abiArgs = abiFunc.args;
        if (payload.functionArgs.length !== abiArgs.length) {
            throw new Error(`Clarity function expects ${abiArgs.length} argument(s) but received ${payload.functionArgs.length}`);
        }
        for (let i = 0; i < payload.functionArgs.length; i++) {
            const payloadArg = payload.functionArgs[i];
            const abiArg = abiArgs[i];
            if (!matchType(payloadArg, abiArg.type)) {
                const argNum = i + 1;
                throw new Error(`Clarity function \`${payload.functionName.content}\` expects argument ${argNum} to be of type ${getTypeString(abiArg.type)}, not ${getCVTypeString(payloadArg)}`);
            }
        }
        return true;
    }
    else if (filtered.length === 0) {
        throw new Error(`ABI doesn't contain a function with the name ${payload.functionName.content}`);
    }
    else {
        throw new Error(`Malformed ABI. Contains multiple functions with the name ${payload.functionName.content}`);
    }
}

function createSTXPostCondition(principal, conditionCode, amount) {
    if (typeof principal === 'string') {
        principal = parsePrincipalString(principal);
    }
    return {
        type: StacksMessageType.PostCondition,
        conditionType: PostConditionType.STX,
        principal,
        conditionCode,
        amount: intToBigInt(amount, false),
    };
}

class TransactionSigner {
    constructor(transaction) {
        this.transaction = transaction;
        this.sigHash = transaction.signBegin();
        this.originDone = false;
        this.checkOversign = true;
        this.checkOverlap = true;
        const spendingCondition = transaction.auth.spendingCondition;
        if (spendingCondition && !isSingleSig(spendingCondition)) {
            if (spendingCondition.fields.filter(field => field.contents.type === StacksMessageType.MessageSignature).length >= spendingCondition.signaturesRequired) {
                throw new Error('SpendingCondition has more signatures than are expected');
            }
            spendingCondition.fields.forEach(field => {
                if (field.contents.type === StacksMessageType.MessageSignature) {
                    const signature = field.contents;
                    const nextVerify = nextVerification(this.sigHash, transaction.auth.authType, spendingCondition.fee, spendingCondition.nonce, PubKeyEncoding.Compressed, signature);
                    this.sigHash = nextVerify.nextSigHash;
                }
            });
        }
    }
    static createSponsorSigner(transaction, spendingCondition) {
        if (transaction.auth.authType != AuthType.Sponsored) {
            throw new SigningError('Cannot add sponsor to non-sponsored transaction');
        }
        const tx = cloneDeep(transaction);
        tx.setSponsor(spendingCondition);
        const originSigHash = tx.verifyOrigin();
        const signer = new this(tx);
        signer.originDone = true;
        signer.sigHash = originSigHash;
        signer.checkOversign = true;
        signer.checkOverlap = true;
        return signer;
    }
    signOrigin(privateKey) {
        if (this.checkOverlap && this.originDone) {
            throw new SigningError('Cannot sign origin after sponsor key');
        }
        if (this.transaction.auth === undefined) {
            throw new SigningError('"transaction.auth" is undefined');
        }
        if (this.transaction.auth.spendingCondition === undefined) {
            throw new SigningError('"transaction.auth.spendingCondition" is undefined');
        }
        if (!isSingleSig(this.transaction.auth.spendingCondition)) {
            const spendingCondition = this.transaction.auth.spendingCondition;
            if (this.checkOversign &&
                spendingCondition.fields.filter(field => field.contents.type === StacksMessageType.MessageSignature).length >= spendingCondition.signaturesRequired) {
                throw new Error('Origin would have too many signatures');
            }
        }
        const nextSighash = this.transaction.signNextOrigin(this.sigHash, privateKey);
        this.sigHash = nextSighash;
    }
    appendOrigin(publicKey) {
        if (this.checkOverlap && this.originDone) {
            throw Error('Cannot append public key to origin after sponsor key');
        }
        if (this.transaction.auth === undefined) {
            throw new Error('"transaction.auth" is undefined');
        }
        if (this.transaction.auth.spendingCondition === undefined) {
            throw new Error('"transaction.auth.spendingCondition" is undefined');
        }
        this.transaction.appendPubkey(publicKey);
    }
    signSponsor(privateKey) {
        if (this.transaction.auth === undefined) {
            throw new SigningError('"transaction.auth" is undefined');
        }
        if (this.transaction.auth.authType !== AuthType.Sponsored) {
            throw new SigningError('"transaction.auth.authType" is not AuthType.Sponsored');
        }
        const nextSighash = this.transaction.signNextSponsor(this.sigHash, privateKey);
        this.sigHash = nextSighash;
        this.originDone = true;
    }
    getTxInComplete() {
        return cloneDeep(this.transaction);
    }
    resume(transaction) {
        this.transaction = cloneDeep(transaction);
        this.sigHash = transaction.signBegin();
    }
}

async function getNonce(address, network) {
    const derivedNetwork = StacksNetwork.fromNameOrNetwork(network ?? new StacksMainnet());
    const url = derivedNetwork.getAccountApiUrl(address);
    const response = await derivedNetwork.fetchFn(url);
    if (!response.ok) {
        let msg = '';
        try {
            msg = await response.text();
        }
        catch (error) { }
        throw new Error(`Error fetching nonce. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
    }
    const responseText = await response.text();
    const result = JSON.parse(responseText);
    return BigInt(result.nonce);
}
async function estimateTransferUnsafe(transaction, network) {
    const requestHeaders = {
        Accept: 'application/text',
    };
    const fetchOptions = {
        method: 'GET',
        headers: requestHeaders,
    };
    const derivedNetwork = StacksNetwork.fromNameOrNetwork(network ?? deriveNetwork(transaction));
    const url = derivedNetwork.getTransferFeeEstimateApiUrl();
    const response = await derivedNetwork.fetchFn(url, fetchOptions);
    if (!response.ok) {
        let msg = '';
        try {
            msg = await response.text();
        }
        catch (error) { }
        throw new Error(`Error estimating transaction fee. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
    }
    const feeRateResult = await response.text();
    const txBytes = BigInt(transaction.serialize().byteLength);
    const feeRate = BigInt(feeRateResult);
    return feeRate * txBytes;
}
async function estimateTransaction(transactionPayload, estimatedLen, network) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            transaction_payload: bytesToHex(serializePayload(transactionPayload)),
            ...(estimatedLen ? { estimated_len: estimatedLen } : {}),
        }),
    };
    const derivedNetwork = StacksNetwork.fromNameOrNetwork(network ?? new StacksMainnet());
    const url = derivedNetwork.getTransactionFeeEstimateApiUrl();
    const response = await derivedNetwork.fetchFn(url, options);
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        if (body?.reason === 'NoEstimateAvailable') {
            throw new NoEstimateAvailableError(body?.reason_data?.message ?? '');
        }
        throw new Error(`Error estimating transaction fee. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${body}"`);
    }
    const data = await response.json();
    return data.estimations;
}
async function broadcastTransaction(transaction, network, attachment) {
    const rawTx = transaction.serialize();
    const derivedNetwork = StacksNetwork.fromNameOrNetwork(network ?? deriveNetwork(transaction));
    const url = derivedNetwork.getBroadcastApiUrl();
    return broadcastRawTransaction(rawTx, url, attachment, derivedNetwork.fetchFn);
}
async function broadcastRawTransaction(rawTx, url, attachment, fetchFn = createFetchFn()) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': attachment ? 'application/json' : 'application/octet-stream' },
        body: attachment
            ? JSON.stringify({
                tx: bytesToHex(rawTx),
                attachment: bytesToHex(attachment),
            })
            : rawTx,
    };
    const response = await fetchFn(url, options);
    if (!response.ok) {
        try {
            return (await response.json());
        }
        catch (e) {
            throw Error(`Failed to broadcast transaction: ${e.message}`);
        }
    }
    const text = await response.text();
    const txid = text.replace(/["]+/g, '');
    if (!validateTxId(txid))
        throw new Error(text);
    return { txid };
}
async function getAbi(address, contractName, network) {
    const options = {
        method: 'GET',
    };
    const derivedNetwork = StacksNetwork.fromNameOrNetwork(network);
    const url = derivedNetwork.getAbiApiUrl(address, contractName);
    const response = await derivedNetwork.fetchFn(url, options);
    if (!response.ok) {
        const msg = await response.text().catch(() => '');
        throw new Error(`Error fetching contract ABI for contract "${contractName}" at address ${address}. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
    }
    return JSON.parse(await response.text());
}
function deriveNetwork(transaction) {
    switch (transaction.version) {
        case TransactionVersion.Mainnet:
            return new StacksMainnet();
        case TransactionVersion.Testnet:
            return new StacksTestnet();
    }
}
async function makeUnsignedContractCall(txOptions) {
    const defaultOptions = {
        fee: BigInt(0),
        nonce: BigInt(0),
        network: new StacksMainnet(),
        postConditionMode: PostConditionMode.Deny,
        sponsored: false,
    };
    const options = Object.assign(defaultOptions, txOptions);
    const payload = createContractCallPayload(options.contractAddress, options.contractName, options.functionName, options.functionArgs);
    if (options?.validateWithAbi) {
        let abi;
        if (typeof options.validateWithAbi === 'boolean') {
            if (options?.network) {
                abi = await getAbi(options.contractAddress, options.contractName, options.network);
            }
            else {
                throw new Error('Network option must be provided in order to validate with ABI');
            }
        }
        else {
            abi = options.validateWithAbi;
        }
        validateContractCall(payload, abi);
    }
    let spendingCondition = null;
    let authorization = null;
    if ('publicKey' in options) {
        spendingCondition = createSingleSigSpendingCondition(AddressHashMode.SerializeP2PKH, options.publicKey, options.nonce, options.fee);
    }
    else {
        spendingCondition = createMultiSigSpendingCondition(AddressHashMode.SerializeP2SH, options.numSignatures, options.publicKeys, options.nonce, options.fee);
    }
    if (options.sponsored) {
        authorization = createSponsoredAuth(spendingCondition);
    }
    else {
        authorization = createStandardAuth(spendingCondition);
    }
    const network = StacksNetwork.fromNameOrNetwork(options.network);
    const postConditions = [];
    if (options.postConditions && options.postConditions.length > 0) {
        options.postConditions.forEach(postCondition => {
            postConditions.push(postCondition);
        });
    }
    const lpPostConditions = createLPList(postConditions);
    const transaction = new StacksTransaction(network.version, authorization, payload, lpPostConditions, options.postConditionMode, options.anchorMode, network.chainId);
    if (txOptions.fee === undefined || txOptions.fee === null) {
        const fee = await estimateTransactionFeeWithFallback(transaction, network);
        transaction.setFee(fee);
    }
    if (txOptions.nonce === undefined || txOptions.nonce === null) {
        const addressVersion = network.version === TransactionVersion.Mainnet
            ? AddressVersion.MainnetSingleSig
            : AddressVersion.TestnetSingleSig;
        const senderAddress = lib.c32address(addressVersion, transaction.auth.spendingCondition.signer);
        const txNonce = await getNonce(senderAddress, network);
        transaction.setNonce(txNonce);
    }
    return transaction;
}
async function makeContractCall(txOptions) {
    if ('senderKey' in txOptions) {
        const publicKey = publicKeyToString(getPublicKey(createStacksPrivateKey(txOptions.senderKey)));
        const options = omit(txOptions, 'senderKey');
        const transaction = await makeUnsignedContractCall({ publicKey, ...options });
        const privKey = createStacksPrivateKey(txOptions.senderKey);
        const signer = new TransactionSigner(transaction);
        signer.signOrigin(privKey);
        return transaction;
    }
    else {
        const options = omit(txOptions, 'signerKeys');
        const transaction = await makeUnsignedContractCall(options);
        const signer = new TransactionSigner(transaction);
        let pubKeys = txOptions.publicKeys;
        for (const key of txOptions.signerKeys) {
            const pubKey = pubKeyfromPrivKey(key);
            pubKeys = pubKeys.filter(pk => pk !== bytesToHex(pubKey.data));
            signer.signOrigin(createStacksPrivateKey(key));
        }
        for (const key of pubKeys) {
            signer.appendOrigin(publicKeyFromBytes(hexToBytes(key)));
        }
        return transaction;
    }
}
function makeStandardSTXPostCondition(address, conditionCode, amount) {
    return createSTXPostCondition(createStandardPrincipal(address), conditionCode, amount);
}
function makeContractSTXPostCondition(address, contractName, conditionCode, amount) {
    return createSTXPostCondition(createContractPrincipal(address, contractName), conditionCode, amount);
}
async function callReadOnlyFunction(readOnlyFunctionOptions) {
    const defaultOptions = {
        network: new StacksMainnet(),
    };
    const options = Object.assign(defaultOptions, readOnlyFunctionOptions);
    const { contractName, contractAddress, functionName, functionArgs, senderAddress } = options;
    const network = StacksNetwork.fromNameOrNetwork(options.network);
    const url = network.getReadOnlyFunctionCallApiUrl(contractAddress, contractName, functionName);
    const args = functionArgs.map(arg => cvToHex(arg));
    const body = JSON.stringify({
        sender: senderAddress,
        arguments: args,
    });
    const response = await network.fetchFn(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const msg = await response.text().catch(() => '');
        throw new Error(`Error calling read-only function. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
    }
    return response.json().then(responseJson => parseReadOnlyResponse(responseJson));
}
function estimateTransactionByteLength(transaction) {
    const hashMode = transaction.auth.spendingCondition.hashMode;
    const multiSigHashModes = [AddressHashMode.SerializeP2SH, AddressHashMode.SerializeP2WSH];
    if (multiSigHashModes.includes(hashMode)) {
        const multiSigSpendingCondition = transaction.auth
            .spendingCondition;
        const existingSignatures = multiSigSpendingCondition.fields.filter(field => field.contents.type === StacksMessageType.MessageSignature).length;
        const totalSignatureLength = (multiSigSpendingCondition.signaturesRequired - existingSignatures) *
            (RECOVERABLE_ECDSA_SIG_LENGTH_BYTES + 1);
        return transaction.serialize().byteLength + totalSignatureLength;
    }
    else {
        return transaction.serialize().byteLength;
    }
}
async function estimateTransactionFeeWithFallback(transaction, network) {
    try {
        const estimatedLen = estimateTransactionByteLength(transaction);
        return (await estimateTransaction(transaction.payload, estimatedLen, network))[1].fee;
    }
    catch (error) {
        if (error instanceof NoEstimateAvailableError) {
            return await estimateTransferUnsafe(transaction, network);
        }
        throw error;
    }
}

export { broadcastTransaction, callReadOnlyFunction, makeContractCall, makeContractSTXPostCondition, makeStandardSTXPostCondition };
