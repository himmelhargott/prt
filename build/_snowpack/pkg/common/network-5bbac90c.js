import { c as createFetchFn } from './fetch-31299d03.js';
import { T as TransactionVersion, C as ChainID } from './constants-8297e4fd.js';

const HIRO_MAINNET_DEFAULT = 'https://stacks-node-api.mainnet.stacks.co';
const HIRO_TESTNET_DEFAULT = 'https://stacks-node-api.testnet.stacks.co';
const HIRO_MOCKNET_DEFAULT = 'http://localhost:3999';
const StacksNetworks = ['mainnet', 'testnet', 'devnet', 'mocknet'];
class StacksNetwork {
    constructor(networkConfig) {
        this.version = TransactionVersion.Mainnet;
        this.chainId = ChainID.Mainnet;
        this.bnsLookupUrl = 'https://stacks-node-api.mainnet.stacks.co';
        this.broadcastEndpoint = '/v2/transactions';
        this.transferFeeEstimateEndpoint = '/v2/fees/transfer';
        this.transactionFeeEstimateEndpoint = '/v2/fees/transaction';
        this.accountEndpoint = '/v2/accounts';
        this.contractAbiEndpoint = '/v2/contracts/interface';
        this.readOnlyFunctionCallEndpoint = '/v2/contracts/call-read';
        this.isMainnet = () => this.version === TransactionVersion.Mainnet;
        this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`;
        this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`;
        this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`;
        this.getAccountApiUrl = (address) => `${this.coreApiUrl}${this.accountEndpoint}/${address}?proof=0`;
        this.getAccountExtendedBalancesApiUrl = (address) => `${this.coreApiUrl}/extended/v1/address/${address}/balances`;
        this.getAbiApiUrl = (address, contract) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${address}/${contract}`;
        this.getReadOnlyFunctionCallApiUrl = (contractAddress, contractName, functionName) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${contractAddress}/${contractName}/${encodeURIComponent(functionName)}`;
        this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`;
        this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`;
        this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`;
        this.getRewardsUrl = (address, options) => {
            let url = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${address}`;
            if (options) {
                url = `${url}?limit=${options.limit}&offset=${options.offset}`;
            }
            return url;
        };
        this.getRewardsTotalUrl = (address) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${address}/total`;
        this.getRewardHoldersUrl = (address, options) => {
            let url = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${address}`;
            if (options) {
                url = `${url}?limit=${options.limit}&offset=${options.offset}`;
            }
            return url;
        };
        this.getStackerInfoUrl = (contractAddress, contractName) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${contractAddress}/${contractName}/get-stacker-info`;
        this.getDataVarUrl = (contractAddress, contractName, dataVarName) => `${this.coreApiUrl}/v2/data_var/${contractAddress}/${contractName}/${dataVarName}?proof=0`;
        this.getMapEntryUrl = (contractAddress, contractName, mapName) => `${this.coreApiUrl}/v2/map_entry/${contractAddress}/${contractName}/${mapName}?proof=0`;
        this.coreApiUrl = networkConfig.url;
        this.fetchFn = networkConfig.fetchFn ?? createFetchFn();
    }
    getNameInfo(fullyQualifiedName) {
        const nameLookupURL = `${this.bnsLookupUrl}/v1/names/${fullyQualifiedName}`;
        return this.fetchFn(nameLookupURL)
            .then(resp => {
            if (resp.status === 404) {
                throw new Error('Name not found');
            }
            else if (resp.status !== 200) {
                throw new Error(`Bad response status: ${resp.status}`);
            }
            else {
                return resp.json();
            }
        })
            .then(nameInfo => {
            if (nameInfo.address) {
                return Object.assign({}, nameInfo, { address: nameInfo.address });
            }
            else {
                return nameInfo;
            }
        });
    }
}
StacksNetwork.fromName = (networkName) => {
    switch (networkName) {
        case 'mainnet':
            return new StacksMainnet();
        case 'testnet':
            return new StacksTestnet();
        case 'devnet':
            return new StacksDevnet();
        case 'mocknet':
            return new StacksMocknet();
        default:
            throw new Error(`Invalid network name provided. Must be one of the following: ${StacksNetworks.join(', ')}`);
    }
};
StacksNetwork.fromNameOrNetwork = (network) => {
    if (typeof network !== 'string' && 'version' in network) {
        return network;
    }
    return StacksNetwork.fromName(network);
};
class StacksMainnet extends StacksNetwork {
    constructor(opts) {
        super({
            url: opts?.url ?? HIRO_MAINNET_DEFAULT,
            fetchFn: opts?.fetchFn,
        });
        this.version = TransactionVersion.Mainnet;
        this.chainId = ChainID.Mainnet;
    }
}
class StacksTestnet extends StacksNetwork {
    constructor(opts) {
        super({
            url: opts?.url ?? HIRO_TESTNET_DEFAULT,
            fetchFn: opts?.fetchFn,
        });
        this.version = TransactionVersion.Testnet;
        this.chainId = ChainID.Testnet;
    }
}
class StacksMocknet extends StacksNetwork {
    constructor(opts) {
        super({
            url: opts?.url ?? HIRO_MOCKNET_DEFAULT,
            fetchFn: opts?.fetchFn,
        });
        this.version = TransactionVersion.Testnet;
        this.chainId = ChainID.Testnet;
    }
}
const StacksDevnet = StacksMocknet;

export { StacksMainnet as S, StacksNetwork as a, StacksTestnet as b, StacksMocknet as c };
