import { r as ripemd160 } from './ripemd160-f7db1645.js';
import { s as sha256 } from './sha256-1cee21ef.js';
import { a as sha512_256 } from './sha512-9db2a8ca.js';
import { u as utils, g as getPublicKey$1, S as Signature, P as Point, s as signSync } from './index-171c9fcd.js';
import { l as lib } from './index-859a5447.js';
import { l as lodash_clonedeep } from './index-b7cf6e7e.js';
import { h as hmac } from './hmac-988c6f74.js';
import { h as hexToBytes, u as utf8ToBytes, j as intToBigInt, a as bytesToHex, p as privateKeyToBytes, k as concatArray, l as hexToBigInt, o as intToHex, q as intToBytes, r as hexToInt, b as bytesToUtf8, e as concatBytes, s as bigIntToBytes, t as toTwos, v as asciiToBytes, w as bytesToAscii, x as with0x } from './keys-10ec8e4e.js';
import { p as parseRecoverableSignatureVrs, w as writeUInt32BE, r as readUInt32BE, a as readUInt8, b as readUInt16BE } from './buffer-174571f5.js';
import { P as PRIVATE_KEY_COMPRESSED_LENGTH } from './constants-8297e4fd.js';

var ChainID;
(function (ChainID) {
    ChainID[ChainID["Testnet"] = 2147483648] = "Testnet";
    ChainID[ChainID["Mainnet"] = 1] = "Mainnet";
})(ChainID || (ChainID = {}));
const DEFAULT_CHAIN_ID = ChainID.Mainnet;
const MAX_STRING_LENGTH_BYTES = 128;
const CLARITY_INT_SIZE = 128;
const CLARITY_INT_BYTE_SIZE = 16;
const COINBASE_LENGTH_BYTES = 32;
const RECOVERABLE_ECDSA_SIG_LENGTH_BYTES = 65;
const COMPRESSED_PUBKEY_LENGTH_BYTES = 32;
const UNCOMPRESSED_PUBKEY_LENGTH_BYTES = 64;
const MEMO_MAX_LENGTH_BYTES = 34;
var StacksMessageType;
(function (StacksMessageType) {
    StacksMessageType[StacksMessageType["Address"] = 0] = "Address";
    StacksMessageType[StacksMessageType["Principal"] = 1] = "Principal";
    StacksMessageType[StacksMessageType["LengthPrefixedString"] = 2] = "LengthPrefixedString";
    StacksMessageType[StacksMessageType["MemoString"] = 3] = "MemoString";
    StacksMessageType[StacksMessageType["AssetInfo"] = 4] = "AssetInfo";
    StacksMessageType[StacksMessageType["PostCondition"] = 5] = "PostCondition";
    StacksMessageType[StacksMessageType["PublicKey"] = 6] = "PublicKey";
    StacksMessageType[StacksMessageType["LengthPrefixedList"] = 7] = "LengthPrefixedList";
    StacksMessageType[StacksMessageType["Payload"] = 8] = "Payload";
    StacksMessageType[StacksMessageType["MessageSignature"] = 9] = "MessageSignature";
    StacksMessageType[StacksMessageType["StructuredDataSignature"] = 10] = "StructuredDataSignature";
    StacksMessageType[StacksMessageType["TransactionAuthField"] = 11] = "TransactionAuthField";
})(StacksMessageType || (StacksMessageType = {}));
var PayloadType;
(function (PayloadType) {
    PayloadType[PayloadType["TokenTransfer"] = 0] = "TokenTransfer";
    PayloadType[PayloadType["SmartContract"] = 1] = "SmartContract";
    PayloadType[PayloadType["VersionedSmartContract"] = 6] = "VersionedSmartContract";
    PayloadType[PayloadType["ContractCall"] = 2] = "ContractCall";
    PayloadType[PayloadType["PoisonMicroblock"] = 3] = "PoisonMicroblock";
    PayloadType[PayloadType["Coinbase"] = 4] = "Coinbase";
    PayloadType[PayloadType["CoinbaseToAltRecipient"] = 5] = "CoinbaseToAltRecipient";
})(PayloadType || (PayloadType = {}));
var ClarityVersion;
(function (ClarityVersion) {
    ClarityVersion[ClarityVersion["Clarity1"] = 1] = "Clarity1";
    ClarityVersion[ClarityVersion["Clarity2"] = 2] = "Clarity2";
})(ClarityVersion || (ClarityVersion = {}));
var AnchorMode;
(function (AnchorMode) {
    AnchorMode[AnchorMode["OnChainOnly"] = 1] = "OnChainOnly";
    AnchorMode[AnchorMode["OffChainOnly"] = 2] = "OffChainOnly";
    AnchorMode[AnchorMode["Any"] = 3] = "Any";
})(AnchorMode || (AnchorMode = {}));
const AnchorModeNames = ['onChainOnly', 'offChainOnly', 'any'];
const AnchorModeMap = {
    [AnchorModeNames[0]]: AnchorMode.OnChainOnly,
    [AnchorModeNames[1]]: AnchorMode.OffChainOnly,
    [AnchorModeNames[2]]: AnchorMode.Any,
    [AnchorMode.OnChainOnly]: AnchorMode.OnChainOnly,
    [AnchorMode.OffChainOnly]: AnchorMode.OffChainOnly,
    [AnchorMode.Any]: AnchorMode.Any,
};
function anchorModeFromNameOrValue(mode) {
    if (mode in AnchorModeMap) {
        return AnchorModeMap[mode];
    }
    throw new Error(`Invalid anchor mode "${mode}", must be one of: ${AnchorModeNames.join(', ')}`);
}
var TransactionVersion;
(function (TransactionVersion) {
    TransactionVersion[TransactionVersion["Mainnet"] = 0] = "Mainnet";
    TransactionVersion[TransactionVersion["Testnet"] = 128] = "Testnet";
})(TransactionVersion || (TransactionVersion = {}));
const DEFAULT_TRANSACTION_VERSION = TransactionVersion.Mainnet;
var PostConditionMode;
(function (PostConditionMode) {
    PostConditionMode[PostConditionMode["Allow"] = 1] = "Allow";
    PostConditionMode[PostConditionMode["Deny"] = 2] = "Deny";
})(PostConditionMode || (PostConditionMode = {}));
var PostConditionType;
(function (PostConditionType) {
    PostConditionType[PostConditionType["STX"] = 0] = "STX";
    PostConditionType[PostConditionType["Fungible"] = 1] = "Fungible";
    PostConditionType[PostConditionType["NonFungible"] = 2] = "NonFungible";
})(PostConditionType || (PostConditionType = {}));
var AuthType;
(function (AuthType) {
    AuthType[AuthType["Standard"] = 4] = "Standard";
    AuthType[AuthType["Sponsored"] = 5] = "Sponsored";
})(AuthType || (AuthType = {}));
var AddressHashMode;
(function (AddressHashMode) {
    AddressHashMode[AddressHashMode["SerializeP2PKH"] = 0] = "SerializeP2PKH";
    AddressHashMode[AddressHashMode["SerializeP2SH"] = 1] = "SerializeP2SH";
    AddressHashMode[AddressHashMode["SerializeP2WPKH"] = 2] = "SerializeP2WPKH";
    AddressHashMode[AddressHashMode["SerializeP2WSH"] = 3] = "SerializeP2WSH";
})(AddressHashMode || (AddressHashMode = {}));
var AddressVersion;
(function (AddressVersion) {
    AddressVersion[AddressVersion["MainnetSingleSig"] = 22] = "MainnetSingleSig";
    AddressVersion[AddressVersion["MainnetMultiSig"] = 20] = "MainnetMultiSig";
    AddressVersion[AddressVersion["TestnetSingleSig"] = 26] = "TestnetSingleSig";
    AddressVersion[AddressVersion["TestnetMultiSig"] = 21] = "TestnetMultiSig";
})(AddressVersion || (AddressVersion = {}));
var PubKeyEncoding;
(function (PubKeyEncoding) {
    PubKeyEncoding[PubKeyEncoding["Compressed"] = 0] = "Compressed";
    PubKeyEncoding[PubKeyEncoding["Uncompressed"] = 1] = "Uncompressed";
})(PubKeyEncoding || (PubKeyEncoding = {}));
var FungibleConditionCode;
(function (FungibleConditionCode) {
    FungibleConditionCode[FungibleConditionCode["Equal"] = 1] = "Equal";
    FungibleConditionCode[FungibleConditionCode["Greater"] = 2] = "Greater";
    FungibleConditionCode[FungibleConditionCode["GreaterEqual"] = 3] = "GreaterEqual";
    FungibleConditionCode[FungibleConditionCode["Less"] = 4] = "Less";
    FungibleConditionCode[FungibleConditionCode["LessEqual"] = 5] = "LessEqual";
})(FungibleConditionCode || (FungibleConditionCode = {}));
var NonFungibleConditionCode;
(function (NonFungibleConditionCode) {
    NonFungibleConditionCode[NonFungibleConditionCode["Sends"] = 16] = "Sends";
    NonFungibleConditionCode[NonFungibleConditionCode["DoesNotSend"] = 17] = "DoesNotSend";
})(NonFungibleConditionCode || (NonFungibleConditionCode = {}));
var PostConditionPrincipalID;
(function (PostConditionPrincipalID) {
    PostConditionPrincipalID[PostConditionPrincipalID["Origin"] = 1] = "Origin";
    PostConditionPrincipalID[PostConditionPrincipalID["Standard"] = 2] = "Standard";
    PostConditionPrincipalID[PostConditionPrincipalID["Contract"] = 3] = "Contract";
})(PostConditionPrincipalID || (PostConditionPrincipalID = {}));
var AssetType;
(function (AssetType) {
    AssetType[AssetType["STX"] = 0] = "STX";
    AssetType[AssetType["Fungible"] = 1] = "Fungible";
    AssetType[AssetType["NonFungible"] = 2] = "NonFungible";
})(AssetType || (AssetType = {}));
var TxRejectedReason;
(function (TxRejectedReason) {
    TxRejectedReason["Serialization"] = "Serialization";
    TxRejectedReason["Deserialization"] = "Deserialization";
    TxRejectedReason["SignatureValidation"] = "SignatureValidation";
    TxRejectedReason["FeeTooLow"] = "FeeTooLow";
    TxRejectedReason["BadNonce"] = "BadNonce";
    TxRejectedReason["NotEnoughFunds"] = "NotEnoughFunds";
    TxRejectedReason["NoSuchContract"] = "NoSuchContract";
    TxRejectedReason["NoSuchPublicFunction"] = "NoSuchPublicFunction";
    TxRejectedReason["BadFunctionArgument"] = "BadFunctionArgument";
    TxRejectedReason["ContractAlreadyExists"] = "ContractAlreadyExists";
    TxRejectedReason["PoisonMicroblocksDoNotConflict"] = "PoisonMicroblocksDoNotConflict";
    TxRejectedReason["PoisonMicroblockHasUnknownPubKeyHash"] = "PoisonMicroblockHasUnknownPubKeyHash";
    TxRejectedReason["PoisonMicroblockIsInvalid"] = "PoisonMicroblockIsInvalid";
    TxRejectedReason["BadAddressVersionByte"] = "BadAddressVersionByte";
    TxRejectedReason["NoCoinbaseViaMempool"] = "NoCoinbaseViaMempool";
    TxRejectedReason["ServerFailureNoSuchChainTip"] = "ServerFailureNoSuchChainTip";
    TxRejectedReason["ServerFailureDatabase"] = "ServerFailureDatabase";
    TxRejectedReason["ServerFailureOther"] = "ServerFailureOther";
})(TxRejectedReason || (TxRejectedReason = {}));

function createMessageSignature(signature) {
    const length = hexToBytes(signature).byteLength;
    if (length != RECOVERABLE_ECDSA_SIG_LENGTH_BYTES) {
        throw Error('Invalid signature');
    }
    return {
        type: StacksMessageType.MessageSignature,
        data: signature,
    };
}
function addressHashModeToVersion(hashMode, txVersion) {
    switch (hashMode) {
        case AddressHashMode.SerializeP2PKH:
            switch (txVersion) {
                case TransactionVersion.Mainnet:
                    return AddressVersion.MainnetSingleSig;
                case TransactionVersion.Testnet:
                    return AddressVersion.TestnetSingleSig;
                default:
                    throw new Error(`Unexpected txVersion ${JSON.stringify(txVersion)} for hashMode ${hashMode}`);
            }
        case AddressHashMode.SerializeP2SH:
        case AddressHashMode.SerializeP2WPKH:
        case AddressHashMode.SerializeP2WSH:
            switch (txVersion) {
                case TransactionVersion.Mainnet:
                    return AddressVersion.MainnetMultiSig;
                case TransactionVersion.Testnet:
                    return AddressVersion.TestnetMultiSig;
                default:
                    throw new Error(`Unexpected txVersion ${JSON.stringify(txVersion)} for hashMode ${hashMode}`);
            }
        default:
            throw new Error(`Unexpected hashMode ${JSON.stringify(hashMode)}`);
    }
}
function addressFromVersionHash(version, hash) {
    return { type: StacksMessageType.Address, version, hash160: hash };
}
function addressToString(address) {
    return lib.c32address(address.version, address.hash160);
}

function createLPString(content, lengthPrefixBytes, maxLengthBytes) {
    const prefixLength = lengthPrefixBytes || 1;
    const maxLength = maxLengthBytes || MAX_STRING_LENGTH_BYTES;
    if (exceedsMaxLengthBytes(content, maxLength)) {
        throw new Error(`String length exceeds maximum bytes ${maxLength}`);
    }
    return {
        type: StacksMessageType.LengthPrefixedString,
        content,
        lengthPrefixBytes: prefixLength,
        maxLengthBytes: maxLength,
    };
}
function createAddress(c32AddressString) {
    const addressData = lib.c32addressDecode(c32AddressString);
    return {
        type: StacksMessageType.Address,
        version: addressData[0],
        hash160: addressData[1],
    };
}
function parsePrincipalString(principalString) {
    if (principalString.includes('.')) {
        const [address, contractName] = principalString.split('.');
        return createContractPrincipal(address, contractName);
    }
    else {
        return createStandardPrincipal(principalString);
    }
}
function createContractPrincipal(addressString, contractName) {
    const addr = createAddress(addressString);
    const name = createLPString(contractName);
    return {
        type: StacksMessageType.Principal,
        prefix: PostConditionPrincipalID.Contract,
        address: addr,
        contractName: name,
    };
}
function createStandardPrincipal(addressString) {
    const addr = createAddress(addressString);
    return {
        type: StacksMessageType.Principal,
        prefix: PostConditionPrincipalID.Standard,
        address: addr,
    };
}

var ClarityType;
(function (ClarityType) {
    ClarityType[ClarityType["Int"] = 0] = "Int";
    ClarityType[ClarityType["UInt"] = 1] = "UInt";
    ClarityType[ClarityType["Buffer"] = 2] = "Buffer";
    ClarityType[ClarityType["BoolTrue"] = 3] = "BoolTrue";
    ClarityType[ClarityType["BoolFalse"] = 4] = "BoolFalse";
    ClarityType[ClarityType["PrincipalStandard"] = 5] = "PrincipalStandard";
    ClarityType[ClarityType["PrincipalContract"] = 6] = "PrincipalContract";
    ClarityType[ClarityType["ResponseOk"] = 7] = "ResponseOk";
    ClarityType[ClarityType["ResponseErr"] = 8] = "ResponseErr";
    ClarityType[ClarityType["OptionalNone"] = 9] = "OptionalNone";
    ClarityType[ClarityType["OptionalSome"] = 10] = "OptionalSome";
    ClarityType[ClarityType["List"] = 11] = "List";
    ClarityType[ClarityType["Tuple"] = 12] = "Tuple";
    ClarityType[ClarityType["StringASCII"] = 13] = "StringASCII";
    ClarityType[ClarityType["StringUTF8"] = 14] = "StringUTF8";
})(ClarityType || (ClarityType = {}));

function principalCV(principal) {
    if (principal.includes('.')) {
        const [address, contractName] = principal.split('.');
        return contractPrincipalCV(address, contractName);
    }
    else {
        return standardPrincipalCV(principal);
    }
}
function standardPrincipalCV(addressString) {
    const addr = createAddress(addressString);
    return { type: ClarityType.PrincipalStandard, address: addr };
}
function standardPrincipalCVFromAddress(address) {
    return { type: ClarityType.PrincipalStandard, address };
}
function contractPrincipalCV(addressString, contractName) {
    const addr = createAddress(addressString);
    const lengthPrefixedContractName = createLPString(contractName);
    return contractPrincipalCVFromAddress(addr, lengthPrefixedContractName);
}
function contractPrincipalCVFromAddress(address, contractName) {
    if (utf8ToBytes(contractName.content).byteLength >= 128) {
        throw new Error('Contract name must be less than 128 bytes');
    }
    return { type: ClarityType.PrincipalContract, address, contractName };
}

const trueCV = () => ({ type: ClarityType.BoolTrue });
const falseCV = () => ({ type: ClarityType.BoolFalse });

const MAX_U128 = BigInt('0xffffffffffffffffffffffffffffffff');
const MIN_U128 = BigInt(0);
const MAX_I128 = BigInt('0x7fffffffffffffffffffffffffffffff');
const MIN_I128 = BigInt('-170141183460469231731687303715884105728');
const intCV = (value) => {
    const bigInt = intToBigInt(value, true);
    if (bigInt > MAX_I128) {
        throw new RangeError(`Cannot construct clarity integer from value greater than ${MAX_I128}`);
    }
    else if (bigInt < MIN_I128) {
        throw new RangeError(`Cannot construct clarity integer form value less than ${MIN_I128}`);
    }
    return { type: ClarityType.Int, value: bigInt };
};
const uintCV = (value) => {
    const bigInt = intToBigInt(value, false);
    if (bigInt < MIN_U128) {
        throw new RangeError('Cannot construct unsigned clarity integer from negative value');
    }
    else if (bigInt > MAX_U128) {
        throw new RangeError(`Cannot construct unsigned clarity integer greater than ${MAX_U128}`);
    }
    return { type: ClarityType.UInt, value: bigInt };
};

const bufferCV = (buffer) => {
    if (buffer.length > 1000000) {
        throw new Error('Cannot construct clarity buffer that is greater than 1MB');
    }
    return { type: ClarityType.Buffer, buffer };
};
const bufferCVFromString = (str) => bufferCV(utf8ToBytes(str));

function noneCV() {
    return { type: ClarityType.OptionalNone };
}
function someCV(value) {
    return { type: ClarityType.OptionalSome, value };
}

function responseErrorCV(value) {
    return { type: ClarityType.ResponseErr, value };
}
function responseOkCV(value) {
    return { type: ClarityType.ResponseOk, value };
}

function listCV(values) {
    return { type: ClarityType.List, list: values };
}

function tupleCV(data) {
    for (const key in data) {
        if (!isClarityName(key)) {
            throw new Error(`"${key}" is not a valid Clarity name`);
        }
    }
    return { type: ClarityType.Tuple, data };
}

const stringAsciiCV = (data) => {
    return { type: ClarityType.StringASCII, data };
};
const stringUtf8CV = (data) => {
    return { type: ClarityType.StringUTF8, data };
};

utils.hmacSha256Sync = (key, ...msgs) => {
    const h = hmac.create(sha256, key);
    msgs.forEach(msg => h.update(msg));
    return h.digest();
};
function getAddressFromPublicKey(publicKey, transactionVersion = TransactionVersion.Mainnet) {
    publicKey = typeof publicKey === 'string' ? publicKey : bytesToHex(publicKey);
    const addrVer = addressHashModeToVersion(AddressHashMode.SerializeP2PKH, transactionVersion);
    const addr = addressFromVersionHash(addrVer, hashP2PKH(hexToBytes(publicKey)));
    const addrString = addressToString(addr);
    return addrString;
}
function createStacksPublicKey(key) {
    return {
        type: StacksMessageType.PublicKey,
        data: hexToBytes(key),
    };
}
function publicKeyFromSignatureVrs(messageHash, messageSignature, pubKeyEncoding = PubKeyEncoding.Compressed) {
    const parsedSignature = parseRecoverableSignatureVrs(messageSignature.data);
    const signature = new Signature(hexToBigInt(parsedSignature.r), hexToBigInt(parsedSignature.s));
    const point = Point.fromSignature(messageHash, signature, parsedSignature.recoveryId);
    const compressed = pubKeyEncoding === PubKeyEncoding.Compressed;
    return point.toHex(compressed);
}
function publicKeyFromBytes(data) {
    return { type: StacksMessageType.PublicKey, data };
}
function isCompressed(key) {
    return !bytesToHex(key.data).startsWith('04');
}
function publicKeyToString(key) {
    return bytesToHex(key.data);
}
function serializePublicKey(key) {
    return key.data.slice();
}
function pubKeyfromPrivKey(privateKey) {
    const privKey = createStacksPrivateKey(privateKey);
    const publicKey = getPublicKey$1(privKey.data.slice(0, 32), privKey.compressed);
    return createStacksPublicKey(bytesToHex(publicKey));
}
function compressPublicKey(publicKey) {
    const hex = typeof publicKey === 'string' ? publicKey : bytesToHex(publicKey);
    const compressed = Point.fromHex(hex).toHex(true);
    return createStacksPublicKey(compressed);
}
function deserializePublicKey(bytesReader) {
    const fieldId = bytesReader.readUInt8();
    const keyLength = fieldId !== 4 ? COMPRESSED_PUBKEY_LENGTH_BYTES : UNCOMPRESSED_PUBKEY_LENGTH_BYTES;
    return publicKeyFromBytes(concatArray([fieldId, bytesReader.readBytes(keyLength)]));
}
function createStacksPrivateKey(key) {
    const data = privateKeyToBytes(key);
    const compressed = data.length == PRIVATE_KEY_COMPRESSED_LENGTH;
    return { data, compressed };
}
function signWithKey(privateKey, messageHash) {
    const [rawSignature, recoveryId] = signSync(messageHash, privateKey.data.slice(0, 32), {
        canonical: true,
        recovered: true,
    });
    if (recoveryId == null) {
        throw new Error('No signature recoveryId received');
    }
    const recoveryIdHex = intToHex(recoveryId, 1);
    const recoverableSignatureString = recoveryIdHex + Signature.fromHex(rawSignature).toCompactHex();
    return createMessageSignature(recoverableSignatureString);
}
function getPublicKey(privateKey) {
    return pubKeyfromPrivKey(privateKey.data);
}

function createTokenTransferPayload(recipient, amount, memo) {
    if (typeof recipient === 'string') {
        recipient = principalCV(recipient);
    }
    if (typeof memo === 'string') {
        memo = createMemoString(memo);
    }
    return {
        type: StacksMessageType.Payload,
        payloadType: PayloadType.TokenTransfer,
        recipient,
        amount: intToBigInt(amount, false),
        memo: memo ?? createMemoString(''),
    };
}
function createContractCallPayload(contractAddress, contractName, functionName, functionArgs) {
    if (typeof contractAddress === 'string') {
        contractAddress = createAddress(contractAddress);
    }
    if (typeof contractName === 'string') {
        contractName = createLPString(contractName);
    }
    if (typeof functionName === 'string') {
        functionName = createLPString(functionName);
    }
    return {
        type: StacksMessageType.Payload,
        payloadType: PayloadType.ContractCall,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
    };
}
function createSmartContractPayload(contractName, codeBody, clarityVersion) {
    if (typeof contractName === 'string') {
        contractName = createLPString(contractName);
    }
    if (typeof codeBody === 'string') {
        codeBody = codeBodyString(codeBody);
    }
    if (typeof clarityVersion === 'number') {
        return {
            type: StacksMessageType.Payload,
            payloadType: PayloadType.VersionedSmartContract,
            clarityVersion,
            contractName,
            codeBody,
        };
    }
    return {
        type: StacksMessageType.Payload,
        payloadType: PayloadType.SmartContract,
        contractName,
        codeBody,
    };
}
function createPoisonPayload() {
    return { type: StacksMessageType.Payload, payloadType: PayloadType.PoisonMicroblock };
}
function createCoinbasePayload(coinbaseBytes, altRecipient) {
    if (coinbaseBytes.byteLength != COINBASE_LENGTH_BYTES) {
        throw Error(`Coinbase buffer size must be ${COINBASE_LENGTH_BYTES} bytes`);
    }
    if (altRecipient != undefined) {
        return {
            type: StacksMessageType.Payload,
            payloadType: PayloadType.CoinbaseToAltRecipient,
            coinbaseBytes,
            recipient: altRecipient,
        };
    }
    return {
        type: StacksMessageType.Payload,
        payloadType: PayloadType.Coinbase,
        coinbaseBytes,
    };
}
function serializePayload(payload) {
    const bytesArray = [];
    bytesArray.push(payload.payloadType);
    switch (payload.payloadType) {
        case PayloadType.TokenTransfer:
            bytesArray.push(serializeCV(payload.recipient));
            bytesArray.push(intToBytes(payload.amount, false, 8));
            bytesArray.push(serializeStacksMessage(payload.memo));
            break;
        case PayloadType.ContractCall:
            bytesArray.push(serializeStacksMessage(payload.contractAddress));
            bytesArray.push(serializeStacksMessage(payload.contractName));
            bytesArray.push(serializeStacksMessage(payload.functionName));
            const numArgs = new Uint8Array(4);
            writeUInt32BE(numArgs, payload.functionArgs.length, 0);
            bytesArray.push(numArgs);
            payload.functionArgs.forEach(arg => {
                bytesArray.push(serializeCV(arg));
            });
            break;
        case PayloadType.SmartContract:
            bytesArray.push(serializeStacksMessage(payload.contractName));
            bytesArray.push(serializeStacksMessage(payload.codeBody));
            break;
        case PayloadType.VersionedSmartContract:
            bytesArray.push(payload.clarityVersion);
            bytesArray.push(serializeStacksMessage(payload.contractName));
            bytesArray.push(serializeStacksMessage(payload.codeBody));
            break;
        case PayloadType.PoisonMicroblock:
            break;
        case PayloadType.Coinbase:
            bytesArray.push(payload.coinbaseBytes);
            break;
        case PayloadType.CoinbaseToAltRecipient:
            bytesArray.push(payload.coinbaseBytes);
            bytesArray.push(serializeCV(payload.recipient));
            break;
    }
    return concatArray(bytesArray);
}
function deserializePayload(bytesReader) {
    const payloadType = bytesReader.readUInt8Enum(PayloadType, n => {
        throw new Error(`Cannot recognize PayloadType: ${n}`);
    });
    switch (payloadType) {
        case PayloadType.TokenTransfer:
            const recipient = deserializeCV(bytesReader);
            const amount = intToBigInt(bytesReader.readBytes(8), false);
            const memo = deserializeMemoString(bytesReader);
            return createTokenTransferPayload(recipient, amount, memo);
        case PayloadType.ContractCall:
            const contractAddress = deserializeAddress(bytesReader);
            const contractCallName = deserializeLPString(bytesReader);
            const functionName = deserializeLPString(bytesReader);
            const functionArgs = [];
            const numberOfArgs = bytesReader.readUInt32BE();
            for (let i = 0; i < numberOfArgs; i++) {
                const clarityValue = deserializeCV(bytesReader);
                functionArgs.push(clarityValue);
            }
            return createContractCallPayload(contractAddress, contractCallName, functionName, functionArgs);
        case PayloadType.SmartContract:
            const smartContractName = deserializeLPString(bytesReader);
            const codeBody = deserializeLPString(bytesReader, 4, 100000);
            return createSmartContractPayload(smartContractName, codeBody);
        case PayloadType.VersionedSmartContract: {
            const clarityVersion = bytesReader.readUInt8Enum(ClarityVersion, n => {
                throw new Error(`Cannot recognize ClarityVersion: ${n}`);
            });
            const smartContractName = deserializeLPString(bytesReader);
            const codeBody = deserializeLPString(bytesReader, 4, 100000);
            return createSmartContractPayload(smartContractName, codeBody, clarityVersion);
        }
        case PayloadType.PoisonMicroblock:
            return createPoisonPayload();
        case PayloadType.Coinbase:
            const coinbaseBytes = bytesReader.readBytes(COINBASE_LENGTH_BYTES);
            return createCoinbasePayload(coinbaseBytes);
        case PayloadType.CoinbaseToAltRecipient:
            const coinbaseToAltRecipientBuffer = bytesReader.readBytes(COINBASE_LENGTH_BYTES);
            const altRecipient = deserializeCV(bytesReader);
            return createCoinbasePayload(coinbaseToAltRecipientBuffer, altRecipient);
    }
}

class TransactionError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class SerializationError extends TransactionError {
    constructor(message) {
        super(message);
    }
}
class DeserializationError extends TransactionError {
    constructor(message) {
        super(message);
    }
}
class NoEstimateAvailableError extends TransactionError {
    constructor(message) {
        super(message);
    }
}
class SigningError extends TransactionError {
    constructor(message) {
        super(message);
    }
}
class VerificationError extends TransactionError {
    constructor(message) {
        super(message);
    }
}

var AuthFieldType;
(function (AuthFieldType) {
    AuthFieldType[AuthFieldType["PublicKeyCompressed"] = 0] = "PublicKeyCompressed";
    AuthFieldType[AuthFieldType["PublicKeyUncompressed"] = 1] = "PublicKeyUncompressed";
    AuthFieldType[AuthFieldType["SignatureCompressed"] = 2] = "SignatureCompressed";
    AuthFieldType[AuthFieldType["SignatureUncompressed"] = 3] = "SignatureUncompressed";
})(AuthFieldType || (AuthFieldType = {}));
function deserializeMessageSignature(bytesReader) {
    return createMessageSignature(bytesToHex(bytesReader.readBytes(RECOVERABLE_ECDSA_SIG_LENGTH_BYTES)));
}
function createTransactionAuthField(pubKeyEncoding, contents) {
    return {
        pubKeyEncoding,
        type: StacksMessageType.TransactionAuthField,
        contents,
    };
}
function deserializeTransactionAuthField(bytesReader) {
    const authFieldType = bytesReader.readUInt8Enum(AuthFieldType, n => {
        throw new DeserializationError(`Could not read ${n} as AuthFieldType`);
    });
    switch (authFieldType) {
        case AuthFieldType.PublicKeyCompressed:
            return createTransactionAuthField(PubKeyEncoding.Compressed, deserializePublicKey(bytesReader));
        case AuthFieldType.PublicKeyUncompressed:
            return createTransactionAuthField(PubKeyEncoding.Uncompressed, deserializePublicKey(bytesReader));
        case AuthFieldType.SignatureCompressed:
            return createTransactionAuthField(PubKeyEncoding.Compressed, deserializeMessageSignature(bytesReader));
        case AuthFieldType.SignatureUncompressed:
            return createTransactionAuthField(PubKeyEncoding.Uncompressed, deserializeMessageSignature(bytesReader));
        default:
            throw new Error(`Unknown auth field type: ${JSON.stringify(authFieldType)}`);
    }
}
function serializeMessageSignature(messageSignature) {
    return hexToBytes(messageSignature.data);
}
function serializeTransactionAuthField(field) {
    const bytesArray = [];
    switch (field.contents.type) {
        case StacksMessageType.PublicKey:
            if (field.pubKeyEncoding == PubKeyEncoding.Compressed) {
                bytesArray.push(AuthFieldType.PublicKeyCompressed);
                bytesArray.push(serializePublicKey(field.contents));
            }
            else {
                bytesArray.push(AuthFieldType.PublicKeyUncompressed);
                bytesArray.push(serializePublicKey(compressPublicKey(field.contents.data)));
            }
            break;
        case StacksMessageType.MessageSignature:
            if (field.pubKeyEncoding == PubKeyEncoding.Compressed) {
                bytesArray.push(AuthFieldType.SignatureCompressed);
            }
            else {
                bytesArray.push(AuthFieldType.SignatureUncompressed);
            }
            bytesArray.push(serializeMessageSignature(field.contents));
            break;
    }
    return concatArray(bytesArray);
}

function serializeStacksMessage(message) {
    switch (message.type) {
        case StacksMessageType.Address:
            return serializeAddress(message);
        case StacksMessageType.Principal:
            return serializePrincipal(message);
        case StacksMessageType.LengthPrefixedString:
            return serializeLPString(message);
        case StacksMessageType.MemoString:
            return serializeMemoString(message);
        case StacksMessageType.AssetInfo:
            return serializeAssetInfo(message);
        case StacksMessageType.PostCondition:
            return serializePostCondition(message);
        case StacksMessageType.PublicKey:
            return serializePublicKey(message);
        case StacksMessageType.LengthPrefixedList:
            return serializeLPList(message);
        case StacksMessageType.Payload:
            return serializePayload(message);
        case StacksMessageType.TransactionAuthField:
            return serializeTransactionAuthField(message);
        case StacksMessageType.MessageSignature:
            return serializeMessageSignature(message);
    }
}
function createEmptyAddress() {
    return {
        type: StacksMessageType.Address,
        version: AddressVersion.MainnetSingleSig,
        hash160: '0'.repeat(40),
    };
}
function addressFromPublicKeys(version, hashMode, numSigs, publicKeys) {
    if (publicKeys.length === 0) {
        throw Error('Invalid number of public keys');
    }
    if (hashMode === AddressHashMode.SerializeP2PKH || hashMode === AddressHashMode.SerializeP2WPKH) {
        if (publicKeys.length !== 1 || numSigs !== 1) {
            throw Error('Invalid number of public keys or signatures');
        }
    }
    if (hashMode === AddressHashMode.SerializeP2WPKH || hashMode === AddressHashMode.SerializeP2WSH) {
        for (let i = 0; i < publicKeys.length; i++) {
            if (!isCompressed(publicKeys[i])) {
                throw Error('Public keys must be compressed for segwit');
            }
        }
    }
    switch (hashMode) {
        case AddressHashMode.SerializeP2PKH:
            return addressFromVersionHash(version, hashP2PKH(publicKeys[0].data));
        case AddressHashMode.SerializeP2WPKH:
            return addressFromVersionHash(version, hashP2WPKH(publicKeys[0].data));
        case AddressHashMode.SerializeP2SH:
            return addressFromVersionHash(version, hashP2SH(numSigs, publicKeys.map(serializePublicKey)));
        case AddressHashMode.SerializeP2WSH:
            return addressFromVersionHash(version, hashP2WSH(numSigs, publicKeys.map(serializePublicKey)));
    }
}
function serializeAddress(address) {
    const bytesArray = [];
    bytesArray.push(hexToBytes(intToHex(address.version, 1)));
    bytesArray.push(hexToBytes(address.hash160));
    return concatArray(bytesArray);
}
function deserializeAddress(bytesReader) {
    const version = hexToInt(bytesToHex(bytesReader.readBytes(1)));
    const data = bytesToHex(bytesReader.readBytes(20));
    return { type: StacksMessageType.Address, version, hash160: data };
}
function serializePrincipal(principal) {
    const bytesArray = [];
    bytesArray.push(principal.prefix);
    bytesArray.push(serializeAddress(principal.address));
    if (principal.prefix === PostConditionPrincipalID.Contract) {
        bytesArray.push(serializeLPString(principal.contractName));
    }
    return concatArray(bytesArray);
}
function deserializePrincipal(bytesReader) {
    const prefix = bytesReader.readUInt8Enum(PostConditionPrincipalID, n => {
        throw new DeserializationError(`Unexpected Principal payload type: ${n}`);
    });
    const address = deserializeAddress(bytesReader);
    if (prefix === PostConditionPrincipalID.Standard) {
        return { type: StacksMessageType.Principal, prefix, address };
    }
    const contractName = deserializeLPString(bytesReader);
    return {
        type: StacksMessageType.Principal,
        prefix,
        address,
        contractName,
    };
}
function serializeLPString(lps) {
    const bytesArray = [];
    const contentBytes = utf8ToBytes(lps.content);
    const length = contentBytes.byteLength;
    bytesArray.push(hexToBytes(intToHex(length, lps.lengthPrefixBytes)));
    bytesArray.push(contentBytes);
    return concatArray(bytesArray);
}
function deserializeLPString(bytesReader, prefixBytes, maxLength) {
    prefixBytes = prefixBytes ? prefixBytes : 1;
    const length = hexToInt(bytesToHex(bytesReader.readBytes(prefixBytes)));
    const content = bytesToUtf8(bytesReader.readBytes(length));
    return createLPString(content, prefixBytes, maxLength ?? 128);
}
function codeBodyString(content) {
    return createLPString(content, 4, 100000);
}
function createMemoString(content) {
    if (content && exceedsMaxLengthBytes(content, MEMO_MAX_LENGTH_BYTES)) {
        throw new Error(`Memo exceeds maximum length of ${MEMO_MAX_LENGTH_BYTES} bytes`);
    }
    return { type: StacksMessageType.MemoString, content };
}
function serializeMemoString(memoString) {
    const bytesArray = [];
    const contentBytes = utf8ToBytes(memoString.content);
    const paddedContent = rightPadHexToLength(bytesToHex(contentBytes), MEMO_MAX_LENGTH_BYTES * 2);
    bytesArray.push(hexToBytes(paddedContent));
    return concatArray(bytesArray);
}
function deserializeMemoString(bytesReader) {
    const content = bytesToUtf8(bytesReader.readBytes(MEMO_MAX_LENGTH_BYTES));
    return { type: StacksMessageType.MemoString, content };
}
function serializeAssetInfo(info) {
    const bytesArray = [];
    bytesArray.push(serializeAddress(info.address));
    bytesArray.push(serializeLPString(info.contractName));
    bytesArray.push(serializeLPString(info.assetName));
    return concatArray(bytesArray);
}
function deserializeAssetInfo(bytesReader) {
    return {
        type: StacksMessageType.AssetInfo,
        address: deserializeAddress(bytesReader),
        contractName: deserializeLPString(bytesReader),
        assetName: deserializeLPString(bytesReader),
    };
}
function createLPList(values, lengthPrefixBytes) {
    return {
        type: StacksMessageType.LengthPrefixedList,
        lengthPrefixBytes: lengthPrefixBytes || 4,
        values,
    };
}
function serializeLPList(lpList) {
    const list = lpList.values;
    const bytesArray = [];
    bytesArray.push(hexToBytes(intToHex(list.length, lpList.lengthPrefixBytes)));
    for (const l of list) {
        bytesArray.push(serializeStacksMessage(l));
    }
    return concatArray(bytesArray);
}
function deserializeLPList(bytesReader, type, lengthPrefixBytes) {
    const length = hexToInt(bytesToHex(bytesReader.readBytes(lengthPrefixBytes || 4)));
    const l = [];
    for (let index = 0; index < length; index++) {
        switch (type) {
            case StacksMessageType.Address:
                l.push(deserializeAddress(bytesReader));
                break;
            case StacksMessageType.LengthPrefixedString:
                l.push(deserializeLPString(bytesReader));
                break;
            case StacksMessageType.MemoString:
                l.push(deserializeMemoString(bytesReader));
                break;
            case StacksMessageType.AssetInfo:
                l.push(deserializeAssetInfo(bytesReader));
                break;
            case StacksMessageType.PostCondition:
                l.push(deserializePostCondition(bytesReader));
                break;
            case StacksMessageType.PublicKey:
                l.push(deserializePublicKey(bytesReader));
                break;
            case StacksMessageType.TransactionAuthField:
                l.push(deserializeTransactionAuthField(bytesReader));
                break;
        }
    }
    return createLPList(l, lengthPrefixBytes);
}
function serializePostCondition(postCondition) {
    const bytesArray = [];
    bytesArray.push(postCondition.conditionType);
    bytesArray.push(serializePrincipal(postCondition.principal));
    if (postCondition.conditionType === PostConditionType.Fungible ||
        postCondition.conditionType === PostConditionType.NonFungible) {
        bytesArray.push(serializeAssetInfo(postCondition.assetInfo));
    }
    if (postCondition.conditionType === PostConditionType.NonFungible) {
        bytesArray.push(serializeCV(postCondition.assetName));
    }
    bytesArray.push(postCondition.conditionCode);
    if (postCondition.conditionType === PostConditionType.STX ||
        postCondition.conditionType === PostConditionType.Fungible) {
        bytesArray.push(intToBytes(postCondition.amount, false, 8));
    }
    return concatArray(bytesArray);
}
function deserializePostCondition(bytesReader) {
    const postConditionType = bytesReader.readUInt8Enum(PostConditionType, n => {
        throw new DeserializationError(`Could not read ${n} as PostConditionType`);
    });
    const principal = deserializePrincipal(bytesReader);
    let conditionCode;
    let assetInfo;
    let amount;
    switch (postConditionType) {
        case PostConditionType.STX:
            conditionCode = bytesReader.readUInt8Enum(FungibleConditionCode, n => {
                throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
            });
            amount = BigInt(`0x${bytesToHex(bytesReader.readBytes(8))}`);
            return {
                type: StacksMessageType.PostCondition,
                conditionType: PostConditionType.STX,
                principal,
                conditionCode,
                amount,
            };
        case PostConditionType.Fungible:
            assetInfo = deserializeAssetInfo(bytesReader);
            conditionCode = bytesReader.readUInt8Enum(FungibleConditionCode, n => {
                throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
            });
            amount = BigInt(`0x${bytesToHex(bytesReader.readBytes(8))}`);
            return {
                type: StacksMessageType.PostCondition,
                conditionType: PostConditionType.Fungible,
                principal,
                conditionCode,
                amount,
                assetInfo,
            };
        case PostConditionType.NonFungible:
            assetInfo = deserializeAssetInfo(bytesReader);
            const assetName = deserializeCV(bytesReader);
            conditionCode = bytesReader.readUInt8Enum(NonFungibleConditionCode, n => {
                throw new DeserializationError(`Could not read ${n} as FungibleConditionCode`);
            });
            return {
                type: StacksMessageType.PostCondition,
                conditionType: PostConditionType.NonFungible,
                principal,
                conditionCode,
                assetInfo,
                assetName,
            };
    }
}

function bytesWithTypeID(typeId, bytes) {
    return concatArray([typeId, bytes]);
}
function serializeBoolCV(value) {
    return new Uint8Array([value.type]);
}
function serializeOptionalCV(cv) {
    if (cv.type === ClarityType.OptionalNone) {
        return new Uint8Array([cv.type]);
    }
    else {
        return bytesWithTypeID(cv.type, serializeCV(cv.value));
    }
}
function serializeBufferCV(cv) {
    const length = new Uint8Array(4);
    writeUInt32BE(length, cv.buffer.length, 0);
    return bytesWithTypeID(cv.type, concatBytes(length, cv.buffer));
}
function serializeIntCV(cv) {
    const bytes = bigIntToBytes(toTwos(cv.value, BigInt(CLARITY_INT_SIZE)), CLARITY_INT_BYTE_SIZE);
    return bytesWithTypeID(cv.type, bytes);
}
function serializeUIntCV(cv) {
    const bytes = bigIntToBytes(cv.value, CLARITY_INT_BYTE_SIZE);
    return bytesWithTypeID(cv.type, bytes);
}
function serializeStandardPrincipalCV(cv) {
    return bytesWithTypeID(cv.type, serializeAddress(cv.address));
}
function serializeContractPrincipalCV(cv) {
    return bytesWithTypeID(cv.type, concatBytes(serializeAddress(cv.address), serializeLPString(cv.contractName)));
}
function serializeResponseCV(cv) {
    return bytesWithTypeID(cv.type, serializeCV(cv.value));
}
function serializeListCV(cv) {
    const bytesArray = [];
    const length = new Uint8Array(4);
    writeUInt32BE(length, cv.list.length, 0);
    bytesArray.push(length);
    for (const value of cv.list) {
        const serializedValue = serializeCV(value);
        bytesArray.push(serializedValue);
    }
    return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeTupleCV(cv) {
    const bytesArray = [];
    const length = new Uint8Array(4);
    writeUInt32BE(length, Object.keys(cv.data).length, 0);
    bytesArray.push(length);
    const lexicographicOrder = Object.keys(cv.data).sort((a, b) => a.localeCompare(b));
    for (const key of lexicographicOrder) {
        const nameWithLength = createLPString(key);
        bytesArray.push(serializeLPString(nameWithLength));
        const serializedValue = serializeCV(cv.data[key]);
        bytesArray.push(serializedValue);
    }
    return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeStringCV(cv, encoding) {
    const bytesArray = [];
    const str = encoding == 'ascii' ? asciiToBytes(cv.data) : utf8ToBytes(cv.data);
    const len = new Uint8Array(4);
    writeUInt32BE(len, str.length, 0);
    bytesArray.push(len);
    bytesArray.push(str);
    return bytesWithTypeID(cv.type, concatArray(bytesArray));
}
function serializeStringAsciiCV(cv) {
    return serializeStringCV(cv, 'ascii');
}
function serializeStringUtf8CV(cv) {
    return serializeStringCV(cv, 'utf8');
}
function serializeCV(value) {
    switch (value.type) {
        case ClarityType.BoolTrue:
        case ClarityType.BoolFalse:
            return serializeBoolCV(value);
        case ClarityType.OptionalNone:
        case ClarityType.OptionalSome:
            return serializeOptionalCV(value);
        case ClarityType.Buffer:
            return serializeBufferCV(value);
        case ClarityType.UInt:
            return serializeUIntCV(value);
        case ClarityType.Int:
            return serializeIntCV(value);
        case ClarityType.PrincipalStandard:
            return serializeStandardPrincipalCV(value);
        case ClarityType.PrincipalContract:
            return serializeContractPrincipalCV(value);
        case ClarityType.ResponseOk:
        case ClarityType.ResponseErr:
            return serializeResponseCV(value);
        case ClarityType.List:
            return serializeListCV(value);
        case ClarityType.Tuple:
            return serializeTupleCV(value);
        case ClarityType.StringASCII:
            return serializeStringAsciiCV(value);
        case ClarityType.StringUTF8:
            return serializeStringUtf8CV(value);
        default:
            throw new SerializationError('Unable to serialize. Invalid Clarity Value.');
    }
}

function createEnumChecker(enumVariable) {
    const enumValues = Object.values(enumVariable).filter(v => typeof v === 'number');
    const enumValueSet = new Set(enumValues);
    return (value) => enumValueSet.has(value);
}
const enumCheckFunctions = new Map();
function isEnum(enumVariable, value) {
    const checker = enumCheckFunctions.get(enumVariable);
    if (checker !== undefined) {
        return checker(value);
    }
    const newChecker = createEnumChecker(enumVariable);
    enumCheckFunctions.set(enumVariable, newChecker);
    return isEnum(enumVariable, value);
}
class BytesReader {
    constructor(arr) {
        this.consumed = 0;
        this.source = arr;
    }
    readBytes(length) {
        const view = this.source.subarray(this.consumed, this.consumed + length);
        this.consumed += length;
        return view;
    }
    readUInt32BE() {
        return readUInt32BE(this.readBytes(4), 0);
    }
    readUInt8() {
        return readUInt8(this.readBytes(1), 0);
    }
    readUInt16BE() {
        return readUInt16BE(this.readBytes(2), 0);
    }
    readBigUIntLE(length) {
        const bytes = this.readBytes(length).slice().reverse();
        const hex = bytesToHex(bytes);
        return BigInt(`0x${hex}`);
    }
    readBigUIntBE(length) {
        const bytes = this.readBytes(length);
        const hex = bytesToHex(bytes);
        return BigInt(`0x${hex}`);
    }
    get readOffset() {
        return this.consumed;
    }
    set readOffset(val) {
        this.consumed = val;
    }
    get internalBytes() {
        return this.source;
    }
    readUInt8Enum(enumVariable, invalidEnumErrorFormatter) {
        const num = this.readUInt8();
        if (isEnum(enumVariable, num)) {
            return num;
        }
        throw invalidEnumErrorFormatter(num);
    }
}

function deserializeCV(serializedClarityValue) {
    let bytesReader;
    if (typeof serializedClarityValue === 'string') {
        const hasHexPrefix = serializedClarityValue.slice(0, 2).toLowerCase() === '0x';
        bytesReader = new BytesReader(hexToBytes(hasHexPrefix ? serializedClarityValue.slice(2) : serializedClarityValue));
    }
    else if (serializedClarityValue instanceof Uint8Array) {
        bytesReader = new BytesReader(serializedClarityValue);
    }
    else {
        bytesReader = serializedClarityValue;
    }
    const type = bytesReader.readUInt8Enum(ClarityType, n => {
        throw new DeserializationError(`Cannot recognize Clarity Type: ${n}`);
    });
    switch (type) {
        case ClarityType.Int:
            return intCV(bytesReader.readBytes(16));
        case ClarityType.UInt:
            return uintCV(bytesReader.readBytes(16));
        case ClarityType.Buffer:
            const bufferLength = bytesReader.readUInt32BE();
            return bufferCV(bytesReader.readBytes(bufferLength));
        case ClarityType.BoolTrue:
            return trueCV();
        case ClarityType.BoolFalse:
            return falseCV();
        case ClarityType.PrincipalStandard:
            const sAddress = deserializeAddress(bytesReader);
            return standardPrincipalCVFromAddress(sAddress);
        case ClarityType.PrincipalContract:
            const cAddress = deserializeAddress(bytesReader);
            const contractName = deserializeLPString(bytesReader);
            return contractPrincipalCVFromAddress(cAddress, contractName);
        case ClarityType.ResponseOk:
            return responseOkCV(deserializeCV(bytesReader));
        case ClarityType.ResponseErr:
            return responseErrorCV(deserializeCV(bytesReader));
        case ClarityType.OptionalNone:
            return noneCV();
        case ClarityType.OptionalSome:
            return someCV(deserializeCV(bytesReader));
        case ClarityType.List:
            const listLength = bytesReader.readUInt32BE();
            const listContents = [];
            for (let i = 0; i < listLength; i++) {
                listContents.push(deserializeCV(bytesReader));
            }
            return listCV(listContents);
        case ClarityType.Tuple:
            const tupleLength = bytesReader.readUInt32BE();
            const tupleContents = {};
            for (let i = 0; i < tupleLength; i++) {
                const clarityName = deserializeLPString(bytesReader).content;
                if (clarityName === undefined) {
                    throw new DeserializationError('"content" is undefined');
                }
                tupleContents[clarityName] = deserializeCV(bytesReader);
            }
            return tupleCV(tupleContents);
        case ClarityType.StringASCII:
            const asciiStrLen = bytesReader.readUInt32BE();
            const asciiStr = bytesToAscii(bytesReader.readBytes(asciiStrLen));
            return stringAsciiCV(asciiStr);
        case ClarityType.StringUTF8:
            const utf8StrLen = bytesReader.readUInt32BE();
            const utf8Str = bytesToUtf8(bytesReader.readBytes(utf8StrLen));
            return stringUtf8CV(utf8Str);
        default:
            throw new DeserializationError('Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.');
    }
}

const leftPadHex = (hexString) => hexString.length % 2 == 0 ? hexString : `0${hexString}`;
const rightPadHexToLength = (hexString, length) => hexString.padEnd(length, '0');
const exceedsMaxLengthBytes = (string, maxLengthBytes) => string ? utf8ToBytes(string).length > maxLengthBytes : false;
function cloneDeep(obj) {
    return lodash_clonedeep(obj);
}
function omit(obj, prop) {
    const clone = cloneDeep(obj);
    delete clone[prop];
    return clone;
}
const txidFromData = (data) => {
    return bytesToHex(sha512_256(data));
};
const hash160 = (input) => {
    return ripemd160(sha256(input));
};
const hashP2PKH = (input) => {
    return bytesToHex(hash160(input));
};
const hashP2WPKH = (input) => {
    const keyHash = hash160(input);
    const redeemScript = concatBytes(new Uint8Array([0]), new Uint8Array([keyHash.length]), keyHash);
    const redeemScriptHash = hash160(redeemScript);
    return bytesToHex(redeemScriptHash);
};
const hashP2SH = (numSigs, pubKeys) => {
    if (numSigs > 15 || pubKeys.length > 15) {
        throw Error('P2SH multisig address can only contain up to 15 public keys');
    }
    const bytesArray = [];
    bytesArray.push(80 + numSigs);
    pubKeys.forEach(pubKey => {
        bytesArray.push(pubKey.length);
        bytesArray.push(pubKey);
    });
    bytesArray.push(80 + pubKeys.length);
    bytesArray.push(174);
    const redeemScript = concatArray(bytesArray);
    const redeemScriptHash = hash160(redeemScript);
    return bytesToHex(redeemScriptHash);
};
const hashP2WSH = (numSigs, pubKeys) => {
    if (numSigs > 15 || pubKeys.length > 15) {
        throw Error('P2WSH multisig address can only contain up to 15 public keys');
    }
    const scriptArray = [];
    scriptArray.push(80 + numSigs);
    pubKeys.forEach(pubKey => {
        scriptArray.push(pubKey.length);
        scriptArray.push(pubKey);
    });
    scriptArray.push(80 + pubKeys.length);
    scriptArray.push(174);
    const script = concatArray(scriptArray);
    const digest = sha256(script);
    const bytesArray = [];
    bytesArray.push(0);
    bytesArray.push(digest.length);
    bytesArray.push(digest);
    const redeemScript = concatArray(bytesArray);
    const redeemScriptHash = hash160(redeemScript);
    return bytesToHex(redeemScriptHash);
};
function isClarityName(name) {
    const regex = /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/;
    return regex.test(name) && name.length < 128;
}
function cvToHex(cv) {
    const serialized = serializeCV(cv);
    return `0x${bytesToHex(serialized)}`;
}
function hexToCV(hex) {
    return deserializeCV(hex);
}
const parseReadOnlyResponse = (response) => {
    if (response.okay)
        return hexToCV(response.result);
    throw new Error(response.cause);
};
const validateTxId = (txid) => {
    if (txid === 'success')
        return true;
    const value = with0x(txid).toLowerCase();
    if (value.length !== 66)
        return false;
    return with0x(BigInt(value).toString(16).padStart(64, '0')) === value;
};

export { NoEstimateAvailableError as $, AuthType as A, BytesReader as B, ChainID as C, DeserializationError as D, createTransactionAuthField as E, SerializationError as F, serializePayload as G, ClarityType as H, PostConditionType as I, parsePrincipalString as J, validateTxId as K, publicKeyToString as L, createStacksPrivateKey as M, omit as N, pubKeyfromPrivKey as O, PubKeyEncoding as P, publicKeyFromBytes as Q, RECOVERABLE_ECDSA_SIG_LENGTH_BYTES as R, StacksMessageType as S, TransactionVersion as T, createStandardPrincipal as U, VerificationError as V, createContractPrincipal as W, cvToHex as X, parseReadOnlyResponse as Y, createContractCallPayload as Z, AddressVersion as _, serializePostCondition as a, trueCV as a0, falseCV as a1, noneCV as a2, someCV as a3, intCV as a4, uintCV as a5, standardPrincipalCV as a6, contractPrincipalCV as a7, responseErrorCV as a8, responseOkCV as a9, listCV as aa, tupleCV as ab, bufferCV as ac, stringUtf8CV as ad, stringAsciiCV as ae, bufferCVFromString as af, FungibleConditionCode as ag, AddressHashMode as b, addressFromPublicKeys as c, createStacksPublicKey as d, signWithKey as e, getPublicKey as f, getAddressFromPublicKey as g, SigningError as h, isCompressed as i, cloneDeep as j, deserializeMessageSignature as k, deserializeLPList as l, leftPadHex as m, createEmptyAddress as n, serializeMessageSignature as o, publicKeyFromSignatureVrs as p, createLPList as q, serializeLPList as r, serializeCV as s, txidFromData as t, AnchorMode as u, PostConditionMode as v, deserializePayload as w, DEFAULT_CHAIN_ID as x, anchorModeFromNameOrValue as y, PayloadType as z };
