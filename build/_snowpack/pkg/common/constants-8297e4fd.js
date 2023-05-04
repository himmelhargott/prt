var ChainID;
(function (ChainID) {
    ChainID[ChainID["Testnet"] = 2147483648] = "Testnet";
    ChainID[ChainID["Mainnet"] = 1] = "Mainnet";
})(ChainID || (ChainID = {}));
var TransactionVersion;
(function (TransactionVersion) {
    TransactionVersion[TransactionVersion["Mainnet"] = 0] = "Mainnet";
    TransactionVersion[TransactionVersion["Testnet"] = 128] = "Testnet";
})(TransactionVersion || (TransactionVersion = {}));
const PRIVATE_KEY_COMPRESSED_LENGTH = 33;
const BLOCKSTACK_DEFAULT_GAIA_HUB_URL = 'https://hub.blockstack.org';

export { BLOCKSTACK_DEFAULT_GAIA_HUB_URL as B, ChainID as C, PRIVATE_KEY_COMPRESSED_LENGTH as P, TransactionVersion as T };
