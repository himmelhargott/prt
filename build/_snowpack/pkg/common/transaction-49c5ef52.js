import { A as AuthType, D as DeserializationError, b as AddressHashMode, S as StacksMessageType, R as RECOVERABLE_ECDSA_SIG_LENGTH_BYTES, c as addressFromPublicKeys, d as createStacksPublicKey, i as isCompressed, P as PubKeyEncoding, t as txidFromData, e as signWithKey, f as getPublicKey, p as publicKeyFromSignatureVrs, h as SigningError, j as cloneDeep, k as deserializeMessageSignature, l as deserializeLPList, V as VerificationError, m as leftPadHex, n as createEmptyAddress, o as serializeMessageSignature, q as createLPList, r as serializeLPList, B as BytesReader, T as TransactionVersion, u as AnchorMode, v as PostConditionMode, w as deserializePayload, x as DEFAULT_CHAIN_ID, y as anchorModeFromNameOrValue, z as PayloadType, E as createTransactionAuthField, F as SerializationError, G as serializePayload } from './utils-a25b7f95.js';
import { j as intToBigInt, a as bytesToHex, k as concatArray, h as hexToBytes, q as intToBytes } from './keys-10ec8e4e.js';
import { j as writeUInt16BE, w as writeUInt32BE } from './buffer-174571f5.js';

function emptyMessageSignature() {
    return {
        type: StacksMessageType.MessageSignature,
        data: bytesToHex(new Uint8Array(RECOVERABLE_ECDSA_SIG_LENGTH_BYTES)),
    };
}
function createSingleSigSpendingCondition(hashMode, pubKey, nonce, fee) {
    const signer = addressFromPublicKeys(0, hashMode, 1, [createStacksPublicKey(pubKey)]).hash160;
    const keyEncoding = isCompressed(createStacksPublicKey(pubKey))
        ? PubKeyEncoding.Compressed
        : PubKeyEncoding.Uncompressed;
    return {
        hashMode,
        signer,
        nonce: intToBigInt(nonce, false),
        fee: intToBigInt(fee, false),
        keyEncoding,
        signature: emptyMessageSignature(),
    };
}
function createMultiSigSpendingCondition(hashMode, numSigs, pubKeys, nonce, fee) {
    const stacksPublicKeys = pubKeys.map(createStacksPublicKey);
    const signer = addressFromPublicKeys(0, hashMode, numSigs, stacksPublicKeys).hash160;
    return {
        hashMode,
        signer,
        nonce: intToBigInt(nonce, false),
        fee: intToBigInt(fee, false),
        fields: [],
        signaturesRequired: numSigs,
    };
}
function isSingleSig(condition) {
    return 'signature' in condition;
}
function clearCondition(condition) {
    const cloned = cloneDeep(condition);
    cloned.nonce = 0;
    cloned.fee = 0;
    if (isSingleSig(cloned)) {
        cloned.signature = emptyMessageSignature();
    }
    else {
        cloned.fields = [];
    }
    return {
        ...cloned,
        nonce: BigInt(0),
        fee: BigInt(0),
    };
}
function serializeSingleSigSpendingCondition(condition) {
    const bytesArray = [
        condition.hashMode,
        hexToBytes(condition.signer),
        intToBytes(condition.nonce, false, 8),
        intToBytes(condition.fee, false, 8),
        condition.keyEncoding,
        serializeMessageSignature(condition.signature),
    ];
    return concatArray(bytesArray);
}
function serializeMultiSigSpendingCondition(condition) {
    const bytesArray = [
        condition.hashMode,
        hexToBytes(condition.signer),
        intToBytes(condition.nonce, false, 8),
        intToBytes(condition.fee, false, 8),
    ];
    const fields = createLPList(condition.fields);
    bytesArray.push(serializeLPList(fields));
    const numSigs = new Uint8Array(2);
    writeUInt16BE(numSigs, condition.signaturesRequired, 0);
    bytesArray.push(numSigs);
    return concatArray(bytesArray);
}
function deserializeSingleSigSpendingCondition(hashMode, bytesReader) {
    const signer = bytesToHex(bytesReader.readBytes(20));
    const nonce = BigInt(`0x${bytesToHex(bytesReader.readBytes(8))}`);
    const fee = BigInt(`0x${bytesToHex(bytesReader.readBytes(8))}`);
    const keyEncoding = bytesReader.readUInt8Enum(PubKeyEncoding, n => {
        throw new DeserializationError(`Could not parse ${n} as PubKeyEncoding`);
    });
    if (hashMode === AddressHashMode.SerializeP2WPKH && keyEncoding != PubKeyEncoding.Compressed) {
        throw new DeserializationError('Failed to parse singlesig spending condition: incomaptible hash mode and key encoding');
    }
    const signature = deserializeMessageSignature(bytesReader);
    return {
        hashMode,
        signer,
        nonce,
        fee,
        keyEncoding,
        signature,
    };
}
function deserializeMultiSigSpendingCondition(hashMode, bytesReader) {
    const signer = bytesToHex(bytesReader.readBytes(20));
    const nonce = BigInt('0x' + bytesToHex(bytesReader.readBytes(8)));
    const fee = BigInt('0x' + bytesToHex(bytesReader.readBytes(8)));
    const fields = deserializeLPList(bytesReader, StacksMessageType.TransactionAuthField)
        .values;
    let haveUncompressed = false;
    let numSigs = 0;
    for (const field of fields) {
        switch (field.contents.type) {
            case StacksMessageType.PublicKey:
                if (!isCompressed(field.contents))
                    haveUncompressed = true;
                break;
            case StacksMessageType.MessageSignature:
                if (field.pubKeyEncoding === PubKeyEncoding.Uncompressed)
                    haveUncompressed = true;
                numSigs += 1;
                if (numSigs === 65536)
                    throw new VerificationError('Failed to parse multisig spending condition: too many signatures');
                break;
        }
    }
    const signaturesRequired = bytesReader.readUInt16BE();
    if (haveUncompressed && hashMode === AddressHashMode.SerializeP2SH)
        throw new VerificationError('Uncompressed keys are not allowed in this hash mode');
    return {
        hashMode,
        signer,
        nonce,
        fee,
        fields,
        signaturesRequired,
    };
}
function serializeSpendingCondition(condition) {
    if (isSingleSig(condition)) {
        return serializeSingleSigSpendingCondition(condition);
    }
    return serializeMultiSigSpendingCondition(condition);
}
function deserializeSpendingCondition(bytesReader) {
    const hashMode = bytesReader.readUInt8Enum(AddressHashMode, n => {
        throw new DeserializationError(`Could not parse ${n} as AddressHashMode`);
    });
    if (hashMode === AddressHashMode.SerializeP2PKH || hashMode === AddressHashMode.SerializeP2WPKH) {
        return deserializeSingleSigSpendingCondition(hashMode, bytesReader);
    }
    else {
        return deserializeMultiSigSpendingCondition(hashMode, bytesReader);
    }
}
function makeSigHashPreSign(curSigHash, authType, fee, nonce) {
    const hashLength = 32 + 1 + 8 + 8;
    const sigHash = curSigHash +
        bytesToHex(new Uint8Array([authType])) +
        bytesToHex(intToBytes(fee, false, 8)) +
        bytesToHex(intToBytes(nonce, false, 8));
    if (hexToBytes(sigHash).byteLength !== hashLength) {
        throw Error('Invalid signature hash length');
    }
    return txidFromData(hexToBytes(sigHash));
}
function makeSigHashPostSign(curSigHash, pubKey, signature) {
    const hashLength = 32 + 1 + RECOVERABLE_ECDSA_SIG_LENGTH_BYTES;
    const pubKeyEncoding = isCompressed(pubKey)
        ? PubKeyEncoding.Compressed
        : PubKeyEncoding.Uncompressed;
    const sigHash = curSigHash + leftPadHex(pubKeyEncoding.toString(16)) + signature.data;
    const sigHashBytes = hexToBytes(sigHash);
    if (sigHashBytes.byteLength > hashLength) {
        throw Error('Invalid signature hash length');
    }
    return txidFromData(sigHashBytes);
}
function nextSignature(curSigHash, authType, fee, nonce, privateKey) {
    const sigHashPreSign = makeSigHashPreSign(curSigHash, authType, fee, nonce);
    const signature = signWithKey(privateKey, sigHashPreSign);
    const publicKey = getPublicKey(privateKey);
    const nextSigHash = makeSigHashPostSign(sigHashPreSign, publicKey, signature);
    return {
        nextSig: signature,
        nextSigHash,
    };
}
function nextVerification(initialSigHash, authType, fee, nonce, pubKeyEncoding, signature) {
    const sigHashPreSign = makeSigHashPreSign(initialSigHash, authType, fee, nonce);
    const publicKey = createStacksPublicKey(publicKeyFromSignatureVrs(sigHashPreSign, signature, pubKeyEncoding));
    const nextSigHash = makeSigHashPostSign(sigHashPreSign, publicKey, signature);
    return {
        pubKey: publicKey,
        nextSigHash,
    };
}
function newInitialSigHash() {
    const spendingCondition = createSingleSigSpendingCondition(AddressHashMode.SerializeP2PKH, '', 0, 0);
    spendingCondition.signer = createEmptyAddress().hash160;
    spendingCondition.keyEncoding = PubKeyEncoding.Compressed;
    spendingCondition.signature = emptyMessageSignature();
    return spendingCondition;
}
function verify(condition, initialSigHash, authType) {
    if (isSingleSig(condition)) {
        return verifySingleSig(condition, initialSigHash, authType);
    }
    else {
        return verifyMultiSig(condition, initialSigHash, authType);
    }
}
function verifySingleSig(condition, initialSigHash, authType) {
    const { pubKey, nextSigHash } = nextVerification(initialSigHash, authType, condition.fee, condition.nonce, condition.keyEncoding, condition.signature);
    const addrBytes = addressFromPublicKeys(0, condition.hashMode, 1, [pubKey]).hash160;
    if (addrBytes !== condition.signer)
        throw new VerificationError(`Signer hash does not equal hash of public key(s): ${addrBytes} != ${condition.signer}`);
    return nextSigHash;
}
function verifyMultiSig(condition, initialSigHash, authType) {
    const publicKeys = [];
    let curSigHash = initialSigHash;
    let haveUncompressed = false;
    let numSigs = 0;
    for (const field of condition.fields) {
        let foundPubKey;
        switch (field.contents.type) {
            case StacksMessageType.PublicKey:
                if (!isCompressed(field.contents))
                    haveUncompressed = true;
                foundPubKey = field.contents;
                break;
            case StacksMessageType.MessageSignature:
                if (field.pubKeyEncoding === PubKeyEncoding.Uncompressed)
                    haveUncompressed = true;
                const { pubKey, nextSigHash } = nextVerification(curSigHash, authType, condition.fee, condition.nonce, field.pubKeyEncoding, field.contents);
                curSigHash = nextSigHash;
                foundPubKey = pubKey;
                numSigs += 1;
                if (numSigs === 65536)
                    throw new VerificationError('Too many signatures');
                break;
        }
        publicKeys.push(foundPubKey);
    }
    if (numSigs !== condition.signaturesRequired)
        throw new VerificationError('Incorrect number of signatures');
    if (haveUncompressed && condition.hashMode === AddressHashMode.SerializeP2SH)
        throw new VerificationError('Uncompressed keys are not allowed in this hash mode');
    const addrBytes = addressFromPublicKeys(0, condition.hashMode, condition.signaturesRequired, publicKeys).hash160;
    if (addrBytes !== condition.signer)
        throw new VerificationError(`Signer hash does not equal hash of public key(s): ${addrBytes} != ${condition.signer}`);
    return curSigHash;
}
function createStandardAuth(spendingCondition) {
    return {
        authType: AuthType.Standard,
        spendingCondition,
    };
}
function createSponsoredAuth(spendingCondition, sponsorSpendingCondition) {
    return {
        authType: AuthType.Sponsored,
        spendingCondition,
        sponsorSpendingCondition: sponsorSpendingCondition
            ? sponsorSpendingCondition
            : createSingleSigSpendingCondition(AddressHashMode.SerializeP2PKH, '0'.repeat(66), 0, 0),
    };
}
function intoInitialSighashAuth(auth) {
    if (auth.spendingCondition) {
        switch (auth.authType) {
            case AuthType.Standard:
                return createStandardAuth(clearCondition(auth.spendingCondition));
            case AuthType.Sponsored:
                return createSponsoredAuth(clearCondition(auth.spendingCondition), newInitialSigHash());
            default:
                throw new SigningError('Unexpected authorization type for signing');
        }
    }
    throw new Error('Authorization missing SpendingCondition');
}
function verifyOrigin(auth, initialSigHash) {
    switch (auth.authType) {
        case AuthType.Standard:
            return verify(auth.spendingCondition, initialSigHash, AuthType.Standard);
        case AuthType.Sponsored:
            return verify(auth.spendingCondition, initialSigHash, AuthType.Standard);
        default:
            throw new SigningError('Invalid origin auth type');
    }
}
function setFee(auth, amount) {
    switch (auth.authType) {
        case AuthType.Standard:
            const spendingCondition = {
                ...auth.spendingCondition,
                fee: intToBigInt(amount, false),
            };
            return { ...auth, spendingCondition };
        case AuthType.Sponsored:
            const sponsorSpendingCondition = {
                ...auth.sponsorSpendingCondition,
                fee: intToBigInt(amount, false),
            };
            return { ...auth, sponsorSpendingCondition };
    }
}
function setNonce(auth, nonce) {
    const spendingCondition = {
        ...auth.spendingCondition,
        nonce: intToBigInt(nonce, false),
    };
    return {
        ...auth,
        spendingCondition,
    };
}
function setSponsorNonce(auth, nonce) {
    const sponsorSpendingCondition = {
        ...auth.sponsorSpendingCondition,
        nonce: intToBigInt(nonce, false),
    };
    return {
        ...auth,
        sponsorSpendingCondition,
    };
}
function setSponsor(auth, sponsorSpendingCondition) {
    const sc = {
        ...sponsorSpendingCondition,
        nonce: intToBigInt(sponsorSpendingCondition.nonce, false),
        fee: intToBigInt(sponsorSpendingCondition.fee, false),
    };
    return {
        ...auth,
        sponsorSpendingCondition: sc,
    };
}
function serializeAuthorization(auth) {
    const bytesArray = [];
    bytesArray.push(auth.authType);
    switch (auth.authType) {
        case AuthType.Standard:
            bytesArray.push(serializeSpendingCondition(auth.spendingCondition));
            break;
        case AuthType.Sponsored:
            bytesArray.push(serializeSpendingCondition(auth.spendingCondition));
            bytesArray.push(serializeSpendingCondition(auth.sponsorSpendingCondition));
            break;
    }
    return concatArray(bytesArray);
}
function deserializeAuthorization(bytesReader) {
    const authType = bytesReader.readUInt8Enum(AuthType, n => {
        throw new DeserializationError(`Could not parse ${n} as AuthType`);
    });
    let spendingCondition;
    switch (authType) {
        case AuthType.Standard:
            spendingCondition = deserializeSpendingCondition(bytesReader);
            return createStandardAuth(spendingCondition);
        case AuthType.Sponsored:
            spendingCondition = deserializeSpendingCondition(bytesReader);
            const sponsorSpendingCondition = deserializeSpendingCondition(bytesReader);
            return createSponsoredAuth(spendingCondition, sponsorSpendingCondition);
    }
}

class StacksTransaction {
    constructor(version, auth, payload, postConditions, postConditionMode, anchorMode, chainId) {
        this.version = version;
        this.auth = auth;
        if ('amount' in payload) {
            this.payload = {
                ...payload,
                amount: intToBigInt(payload.amount, false),
            };
        }
        else {
            this.payload = payload;
        }
        this.chainId = chainId ?? DEFAULT_CHAIN_ID;
        this.postConditionMode = postConditionMode ?? PostConditionMode.Deny;
        this.postConditions = postConditions ?? createLPList([]);
        if (anchorMode) {
            this.anchorMode = anchorModeFromNameOrValue(anchorMode);
        }
        else {
            switch (payload.payloadType) {
                case PayloadType.Coinbase:
                case PayloadType.CoinbaseToAltRecipient:
                case PayloadType.PoisonMicroblock: {
                    this.anchorMode = AnchorMode.OnChainOnly;
                    break;
                }
                case PayloadType.ContractCall:
                case PayloadType.SmartContract:
                case PayloadType.VersionedSmartContract:
                case PayloadType.TokenTransfer: {
                    this.anchorMode = AnchorMode.Any;
                    break;
                }
            }
        }
    }
    signBegin() {
        const tx = cloneDeep(this);
        tx.auth = intoInitialSighashAuth(tx.auth);
        return tx.txid();
    }
    verifyBegin() {
        const tx = cloneDeep(this);
        tx.auth = intoInitialSighashAuth(tx.auth);
        return tx.txid();
    }
    verifyOrigin() {
        return verifyOrigin(this.auth, this.verifyBegin());
    }
    signNextOrigin(sigHash, privateKey) {
        if (this.auth.spendingCondition === undefined) {
            throw new Error('"auth.spendingCondition" is undefined');
        }
        if (this.auth.authType === undefined) {
            throw new Error('"auth.authType" is undefined');
        }
        return this.signAndAppend(this.auth.spendingCondition, sigHash, AuthType.Standard, privateKey);
    }
    signNextSponsor(sigHash, privateKey) {
        if (this.auth.authType === AuthType.Sponsored) {
            return this.signAndAppend(this.auth.sponsorSpendingCondition, sigHash, AuthType.Sponsored, privateKey);
        }
        else {
            throw new Error('"auth.sponsorSpendingCondition" is undefined');
        }
    }
    appendPubkey(publicKey) {
        const cond = this.auth.spendingCondition;
        if (cond && !isSingleSig(cond)) {
            const compressed = isCompressed(publicKey);
            cond.fields.push(createTransactionAuthField(compressed ? PubKeyEncoding.Compressed : PubKeyEncoding.Uncompressed, publicKey));
        }
        else {
            throw new Error(`Can't append public key to a singlesig condition`);
        }
    }
    signAndAppend(condition, curSigHash, authType, privateKey) {
        const { nextSig, nextSigHash } = nextSignature(curSigHash, authType, condition.fee, condition.nonce, privateKey);
        if (isSingleSig(condition)) {
            condition.signature = nextSig;
        }
        else {
            const compressed = bytesToHex(privateKey.data).endsWith('01');
            condition.fields.push(createTransactionAuthField(compressed ? PubKeyEncoding.Compressed : PubKeyEncoding.Uncompressed, nextSig));
        }
        return nextSigHash;
    }
    txid() {
        const serialized = this.serialize();
        return txidFromData(serialized);
    }
    setSponsor(sponsorSpendingCondition) {
        if (this.auth.authType != AuthType.Sponsored) {
            throw new SigningError('Cannot sponsor sign a non-sponsored transaction');
        }
        this.auth = setSponsor(this.auth, sponsorSpendingCondition);
    }
    setFee(amount) {
        this.auth = setFee(this.auth, amount);
    }
    setNonce(nonce) {
        this.auth = setNonce(this.auth, nonce);
    }
    setSponsorNonce(nonce) {
        if (this.auth.authType != AuthType.Sponsored) {
            throw new SigningError('Cannot sponsor sign a non-sponsored transaction');
        }
        this.auth = setSponsorNonce(this.auth, nonce);
    }
    serialize() {
        if (this.version === undefined) {
            throw new SerializationError('"version" is undefined');
        }
        if (this.chainId === undefined) {
            throw new SerializationError('"chainId" is undefined');
        }
        if (this.auth === undefined) {
            throw new SerializationError('"auth" is undefined');
        }
        if (this.anchorMode === undefined) {
            throw new SerializationError('"anchorMode" is undefined');
        }
        if (this.payload === undefined) {
            throw new SerializationError('"payload" is undefined');
        }
        const bytesArray = [];
        bytesArray.push(this.version);
        const chainIdBytes = new Uint8Array(4);
        writeUInt32BE(chainIdBytes, this.chainId, 0);
        bytesArray.push(chainIdBytes);
        bytesArray.push(serializeAuthorization(this.auth));
        bytesArray.push(this.anchorMode);
        bytesArray.push(this.postConditionMode);
        bytesArray.push(serializeLPList(this.postConditions));
        bytesArray.push(serializePayload(this.payload));
        return concatArray(bytesArray);
    }
}
function deserializeTransaction(data) {
    let bytesReader;
    if (typeof data === 'string') {
        if (data.slice(0, 2).toLowerCase() === '0x') {
            bytesReader = new BytesReader(hexToBytes(data.slice(2)));
        }
        else {
            bytesReader = new BytesReader(hexToBytes(data));
        }
    }
    else if (data instanceof Uint8Array) {
        bytesReader = new BytesReader(data);
    }
    else {
        bytesReader = data;
    }
    const version = bytesReader.readUInt8Enum(TransactionVersion, n => {
        throw new Error(`Could not parse ${n} as TransactionVersion`);
    });
    const chainId = bytesReader.readUInt32BE();
    const auth = deserializeAuthorization(bytesReader);
    const anchorMode = bytesReader.readUInt8Enum(AnchorMode, n => {
        throw new Error(`Could not parse ${n} as AnchorMode`);
    });
    const postConditionMode = bytesReader.readUInt8Enum(PostConditionMode, n => {
        throw new Error(`Could not parse ${n} as PostConditionMode`);
    });
    const postConditions = deserializeLPList(bytesReader, StacksMessageType.PostCondition);
    const payload = deserializePayload(bytesReader);
    return new StacksTransaction(version, auth, payload, postConditions, postConditionMode, anchorMode, chainId);
}

export { StacksTransaction as S, createMultiSigSpendingCondition as a, createSponsoredAuth as b, createSingleSigSpendingCondition as c, deserializeTransaction as d, createStandardAuth as e, isSingleSig as i, nextVerification as n };
