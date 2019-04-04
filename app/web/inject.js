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
        if (result.error) {
            callback(true, result, result);
            return;
        }
        callback(null, result.result, result);
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

    chain() {
        const getChainInformation = callback => {
            window.NightElf.api({
                appName: this.appName,
                method: 'GET_CHAIN_INFORMATION',
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
        const getBlockHeight = callback => {
            this.callAElfChain('getBlockHeight', [], callback);
        };

        const getFileDescriptorSet = (address, callback) => {
            this.callAElfChain('getFileDescriptorSet', [address], callback);
        };

        const getBlockInfo = (blockHeight, includeTxs, callback) => {
            this.callAElfChain(
                'getBlockInfo',
                [blockHeight, includeTxs],
                callback
            );
        };
        const getTxResult = (txhash, callback) => {
            this.callAElfChain('getTxResult', [txhash], callback);
        };
        const getTxsResult = (blockhash, offset, num, callback) => {
            this.callAElfChain(
                'getTxsResult',
                [blockhash, offset, num],
                callback
            );
        };
        const getMerklePath = (txid, callback) => {
            this.callAElfChain('getMerklePath', [txid], callback);
        };
        const sendTransaction = (rawtx, callback) => {
            this.callAElfChain('sendTransaction', [rawtx], callback);
        };
        const checkProposal = (proposalId, callback) => {
            this.callAElfChain('checkProposal', [proposalId], callback);
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
                // const methods = message.abi.Methods;
                const methods = Object.keys(message.service.methods);
                let contractMethods = {};
                methods.map(item => {
                    contractMethods[item] = (...params) => {
                        _callAelfContract(params, 'CALL_AELF_CONTRACT', contractAddress, item);
                    };
                    contractMethods[item].call = (...params) => {
                        _callAelfContract(params, 'CALL_AELF_CONTRACT_READONLY', contractAddress, item);
                    };
                });
                callback(null, contractMethods);
            });
        };

        return {
            getChainInformation,
            getFileDescriptorSet,
            getBlockHeight,
            getBlockInfo,
            getTxResult,
            getTxsResult,
            getMerklePath,
            sendTransaction,
            checkProposal,
            callReadOnly,
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
