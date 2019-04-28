/**
 * @file inject.js
 * @author huangzongzhe
 * only for browser
 */
import IdGenerator from './utils/IdGenerator';
import EncryptedStream from './utils/EncryptedStream';
import * as PageContentTags from './messages/PageContentTags';
// import * as NetworkMessageTypes from './messages/NetworkMessageTypes'

/**
 * This is the javascript which gets injected into
 * the application and facilitates communication between
 * NightElf and the web application.
 */
/* eslint-disable fecs-camelcase */
let promisePendingList = [];
const handlePendingPromise = function (eventMessage) {
    if (eventMessage) {
        const sid = eventMessage.sid;
        promisePendingList = promisePendingList.filter((item, index) => {
            if (item.sid === sid) {
                item.resolve(eventMessage);
                return false;
            }
            return true;
        });
    }
};

let stream = new WeakMap();

// Just a wrap of the api of the extension for developers.
class NightAElf {
    constructor(options) {
        this.httpProvider = options.httpProvider;
        this.appName = options.appName;
        this.chain = this.chain();
        this.chainId;
    }

    callbackWrap(result, callback) {
        if (result.result) {
            callback(null, result.result);
            return;
        }
        callback(null, result);
    }

    callAElfChain(methodName, params, callback) {
        window.NightElf.api({
            appName: this.appName,
            method: 'CALL_AELF_CHAIN',
            chainId: this.chainId,
            payload: {
                method: methodName,
                params: params // Array
            }
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }

    login(params, callback) {
        window.NightElf.api({
            appName: params.appName,
            chainId: params.chainId,
            method: 'LOGIN',
            payload: {
                payload: params.payload
            }
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }

    checkPermission(params, callback) {
        window.NightElf.api({
            appName: params.appName,
            method: 'CHECK_PERMISSION',
            address: params.address,
            type: params.type || '',
            contractAddress: params.contractAddress || ''
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }

    setContractPermission(params, callback) {
        window.NightElf.api({
            appName: params.appName,
            method: 'OPEN_PROMPT',
            chainId: params.chainId,
            payload: {
                method: 'SET_CONTRACT_PERMISSION',
                payload: params.payload
            }
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }

    removeContractPermission(params, callback) {
        window.NightElf.api({
            appName: params.appName,
            method: 'REMOVE_CONTRACT_PERMISSION',
            payload: params.payload
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }

    removeMethodsWhitelist(params, callback) {
        window.NightElf.api({
            appName: params.appName,
            chainId: params.chainId,
            method: 'REMOVE_METHODS_WHITELIST',
            payload: params.payload
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }



    getAddress(param, callback) {
        window.NightElf.api({
            appName: param.appName,
            method: 'GET_ADDRESS'
        }).then(result => {
            this.callbackWrap(result, callback);
        });
    }

    chain() {
        const getChainStatus = callback => {
            window.NightElf.api({
                appName: this.appName,
                method: 'GET_CHAIN_STATUS',
                payload: {
                    httpProvider: this.httpProvider
                }
            }).then(result => {
                this.callbackWrap(result, callback);
                if (!result.error) {
                    this.chainId = result.result.ChainId;
                }
            });
        };

        const getChainState = (blockHash, callback) => {
            this.callAElfChain('getChainState', [blockHash], callback);
        };

        const getBlockHeight = callback => {
            this.callAElfChain('getBlockHeight', [], callback);
        };

        const getContractFileDescriptorSet = (address, callback) => {
            this.callAElfChain('getContractFileDescriptorSet', [address], callback);
        };

        const getBlock = (blockHash, includeTxs, callback) => {
            this.callAElfChain(
                'getBlock',
                [blockHash, includeTxs],
                callback
            );
        };
        const getBlockByHeight = (blockHeight, includeTxs, callback) => {
            this.callAElfChain(
                'getBlockByHeight',
                [blockHeight, includeTxs],
                callback
            );
        };

        const getTxResult = (txhash, callback) => {
            this.callAElfChain('getTxResult', [txhash], callback);
        };

        const getTxResults = (blockhash, offset, num, callback) => {
            this.callAElfChain(
                'getTxResults',
                [blockhash, offset, num],
                callback
            );
        };

        const getTransactionPoolStatus = callback => {
            this.callAElfChain('getTransactionPoolStatus', [], callback);
        };

        const sendTransaction = (rawtx, callback) => {
            this.callAElfChain('sendTransaction', [rawtx], callback);
        };

        const sendTransactions = (rawtx, callback) => {
            this.callAElfChain('sendTransactions', [rawtx], callback);
        };

        const callReadOnly = (rawtx, callback) => {
            this.callAElfChain('callReadOnly', [rawtx], callback);
        };

        const _callAelfContract = (params, methodName, contractAddress, method) => {
            let paramsTemp = Array.from(params); // [...params];
            const callback = paramsTemp.pop();
            if (typeof callback !== 'function') {
                throw Error('last param must be callback function');
            }
            else {
                window.NightElf.api({
                    appName: this.appName,
                    method: methodName,
                    chainId: this.chainId,
                    payload: {
                        contractName: 'From Extension',
                        contractAddress: contractAddress,
                        method: method,
                        params: paramsTemp
                    }
                }).then(result => {
                    this.callbackWrap(result, callback);
                });
            }
        };

        const contractAtAsync = (contractAddress, wallet, callback) => {
            window.NightElf.api({
                appName: this.appName,
                method: 'INIT_AELF_CONTRACT',
                chainId: this.chainId,
                payload: {
                    address: wallet.address,
                    contractName: 'EXTENSION',
                    contractAddress: contractAddress
                }
            }).then(result => {
                const message = JSON.parse(result.message);

                let contractMethods = {};
                message.services.map(item => {
                    const methods = Object.keys(item.methods);
                    methods.map(item => {
                        contractMethods[item] = (...params) => {
                            _callAelfContract(params, 'CALL_AELF_CONTRACT', contractAddress, item);
                        };
                        contractMethods[item].call = (...params) => {
                            _callAelfContract(params, 'CALL_AELF_CONTRACT_READONLY', contractAddress, item);
                        };
                    });
                });
                callback(null, contractMethods);
            });
        };

        // 对标JS SDK 输出
        return {
            getChainStatus,
            getChainState,
            getContractFileDescriptorSet,
            getBlockHeight,
            getBlock,
            getBlockByHeight,
            sendTransaction,
            sendTransactions,
            callReadOnly,
            getTxResult,
            getTxResults,
            getTransactionPoolStatus,
            contractAtAsync
        };
    }
}

export default class Inject {

    constructor() {
        // Injecting an encrypted stream into the
        // web application.
        this.aesKey = IdGenerator.text(256);
        this.setupEncryptedStream();
    }

    setupEncryptedStream() {
        stream = new EncryptedStream(PageContentTags.PAGE_NIGHTELF, this.aesKey);
        stream.addEventListener(result => {
            handlePendingPromise(result);
        });

        stream.setupEestablishEncryptedCommunication(PageContentTags.CONTENT_NIGHTELF).then(ready => {
            this.initNightElf();
        });
        stream.sendPublicKey(PageContentTags.CONTENT_NIGHTELF);
    }

    promiseSend(input) {
        return new Promise((resolve, reject) => {
            const data = Object.assign({}, input, {
                sid: IdGenerator.numeric(24)
            });
            promisePendingList.push({
                sid: data.sid,
                resolve,
                reject
            });
            stream.send(data, PageContentTags.CONTENT_NIGHTELF);
        });
    }

    initNightElf() {
        window.NightElf = {
            // ...window.NightElf,
            api: this.promiseSend,
            AElf: NightAElf
        };

        document.dispatchEvent(new CustomEvent('NightElf', {
            detail: {
                error: 0,
                message: 'Night Elf is ready.'
            }
        }));
    }
}

new Inject();
// window.NightElf = {
//     Inject
// };
