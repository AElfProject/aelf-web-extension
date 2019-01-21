/**
 * @file background.js
 * @author huangzongzhe,hzz780; Scatter: Shai James;
 */

import {
    LocalStream
} from 'extension-streams';
import InternalMessage from './messages/InternalMessage';
import * as InternalMessageTypes from './messages/InternalMessageTypes';
import NightElf from './models/NightElf';
import {apis} from './utils/BrowserApis';
import NotificationService from './service/NotificationService';

import Aelf from 'aelf-sdk';
// import { resolve } from 'url';
const {wallet} = Aelf;
const {
    AESEncrypto,
    AESDecrypto
} = wallet;
// import AES from 'aes-oop';
// import * as InternalMessageTypes from './messages/InternalMessageTypes';
// import InternalMessage from './messages/InternalMessage';
// import StorageService from './services/StorageService'
// import SignatureService from './services/SignatureService'
// import Scatter from './models/Scatter'
// import Network from './models/Network'
// import IdentityService from './services/IdentityService'
// import NotificationService from './services/NotificationService'
// import HistoricEvent from './models/histories/HistoricEvent'
// import * as HistoricEventTypes from './models/histories/HistoricEventTypes'
// import Prompt from './models/prompts/Prompt';
// import * as PromptTypes from './models/prompts/PromptTypes'
// import Permission from './models/Permission'
// import TimingHelpers from './util/TimingHelpers';
// import Error from './models/errors/Error'
// import PluginRepository from './plugins/PluginRepository'
// import {
//     Blockchains,
//     BlockchainsArray
// } from './models/Blockchains'
// import {
//     apis
// } from './util/BrowserApis';
// import migrate from './migrations/migrator'
// Gets bound when a user logs into scatter
// and unbound when they log out
// Is not on the Background's scope to keep it private

/* eslint-disable fecs-camelcase */
let seed = '';
let nightElf = null;

let inactivityInterval = 0;
let timeoutLocker = null;

let prompt = null;


// // inject.js
// NightElf.action({
//     appName: 'Your app',
//     method: 'CONNECT_AELF_CHAIN',
//     payload: {
//         httpProvider: 'http://localhost:1234/chain'
//     }
// });
// return JSON.stringify(result);

// NightElf.action({
//     appName: 'Your app',
//     method: 'INIT_AELF_CONTRACT',
//     payload: {
//         contractName: 'cName'
//         contractAddress: 'xxxx'
//     }
// });
// return JSON.stringify(result);

// NightElf.action({
//     appName: 'Your app',
//     method: 'CALL_AELF_CHAIN',
//     payload: {
//         method: 'cName'
//         params: []
//     }
// });

// NightElf.action({
//     appName: 'Your app',
//     method: 'CALL_AELF_CONTRACT',
//     payload: {
//         contractName: 'cName, the same as init',
//         method: 'transfer',
//         params: []
//     }
// });
// return JSON.stringify(result);
// const contractMeta = contractsMeta.filter(item => {
//     return item.domain === actionInput.domain;
// });
// const contract = contractMeta.contracts.filter(item => {
//     return item.contractName === actionInput.contractName;
// });
// contract[actionInput.payload.method](...params);

// // TODO: release single contract
// NightElf.action({
//     appName: 'Your app',
//     method: 'RELEASE',
//     payload: {
//     }
// });

// const aelfMeta = [
//     {
//         appName: 'Dapp Test',
//         domain: 'https://aelf.io',
//         httpProvider: 'http://localhost:1234/chain',
//         chainId: '',
//         aelf: 'new Aelf(new Aelf.providers.HttpProvider("xxxx"));',
//         contracts: [{
//             contractName: 'cName',
//             contractAddress: '',
//             httpProvider: 'http://localhost:1234/chain',
//             contract: 'aelf.chain.contractAt("contract_address", wallet); use keypair to get'
//         }]
//     }
// ];

// let contractsMeta = [{
//     appName: 'Dapp Test',
//     domain: 'https://aelf.io',
//     contracts: [{
//         contractName: 'cName',
//         contractAddress: '',
//         httpProvider: 'http://localhost:1234/chain',
//         contract: 'aelf.chain.contractAt("contract_address", wallet); use keypair to get'
//     }]
// }];
// let contractsMeta = [];
let aelfMeta = [];
// This is the script that runs in the extension's background ( singleton )
export default class Background {

    constructor() {
        this.setupInternalMessaging();
    }
    /********************************************/
    /*               VueInitializer             */
    /********************************************/

    // Watches the internal messaging system ( LocalStream )
    setupInternalMessaging() {
        LocalStream.watch((request, sendResponse) => {
            console.log(request, sendResponse);
            const message = InternalMessage.fromJson(request);
            this.dispenseMessage(sendResponse, message);
        });
    }

    /***
     * Delegates message processing to methods by message type
     * @param sendResponse - Delegating response handler
     * @param message - The message to be dispensed
     */
    dispenseMessage(sendResponse, message) {
        console.log('dispenseMessage: ', message);
        if (message.payload === false) {
            sendResponse({
                error: 200001,
                message: 'payload is false.'
            });
            return;
        }
        // sendResponse(true);
        switch (message.type) {
            case InternalMessageTypes.SET_SEED:
                Background.setSeed(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CREAT_WALLET:
                Background.createWallet(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CLEAR_WALLET:
                Background.clearWallet(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CHECK_WALLET:
                Background.checkWallet(sendResponse);
                break;
            case InternalMessageTypes.UNLOCK_WALLET:
                Background.unlockWallet(sendResponse, message.payload);
                break;
            case InternalMessageTypes.LOCK_WALLET:
                Background.lockWallet(sendResponse);
                break;
            case InternalMessageTypes.UPDATE_WALLET:
                Background.updateWallet(sendResponse, message.payload);
                break;

            case InternalMessageTypes.INSERT_KEYPAIR:
                Background.insertKeypair(sendResponse, message.payload);
                break;
            case InternalMessageTypes.GET_KEYPAIR:
                Background.getKeypair(sendResponse);
                break;
            case InternalMessageTypes.REMOVE_KEYPAIR:
                Background.removeKeypair(sendResponse, message.payload);
                break;

            case InternalMessageTypes.SET_PERMISSION:
                Background.setPermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CHECK_PERMISSION:
                Background.getPermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.REMOVE_PERMISSION:
                Background.removePermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.GET_ALLPERMISSIONS:
                Background.getAllPermissions(sendResponse);
                break;

            case InternalMessageTypes.CONNECT_AELF_CHAIN:
                Background.connectAelfChain(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CALL_AELF_CHAIN:
                Background.callAelfChain(sendResponse, message.payload);
                break;
            case InternalMessageTypes.RELEASE_AELF_CHAIN:
                Background.releaseAelfChain(sendResponse);
                break;

            case InternalMessageTypes.INIT_AELF_CONTRACT:
                Background.initAelfContract(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CALL_AELF_CONTRACT:
                Background.callAelfContract(sendResponse, message.payload);
                break;

            case InternalMessageTypes.GET_ADDRESS:
                Background.getAddress(sendResponse);
                break;

            case InternalMessageTypes.OPEN_PROMPT:
                Background.openPrompt(sendResponse, message.payload);
                break;
            case InternalMessageTypes.SET_PROMPT:
                Background.setPrompt(sendResponse, message.payload);
                break;
            case InternalMessageTypes.GET_PROMPT:
                Background.getPrompt(sendResponse);
                break;
            // TODO:
            // case InternalMessageTypes.RELEASE_AELF_CONTRACT:
            //     Background.releaseAELFContract(sendResponse);
            //     break;
        }
    }

    /**
     * connect chain, init or refresh the instance of Aelf for dapp.
     * hostname & chainId as a union key.[like sql]
     *
     * @param {Function} sendResponse Delegating response handler.
     * @param {Object} chainInfo from content.js
     */
    static connectAelfChain(sendResponse, chainInfo) {
        // content.js
        // chainInfo = {
        //     appName: 'Your app',
        //     method: 'CONNECT_AELF_CHAIN',
        //     hostname: 'aelf.io',
        //     payload: {
        //         httpProvider: 'http://localhost:1234/chain'
        //     }
        // }
        // inject.js
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'CONNECT_AELF_CHAIN',
        //     payload: {
        //         httpProvider: 'http://localhost:1234/chain'
        //     }
        // });
        // return JSON.stringify(result);
        // const aelfMeta = [
        //     {
        //         appName: 'Dapp Test',
        //         domain: 'aelf.io',
        //         httpProvider: 'http://localhost:1234/chain',
        //         chainId: '',
        //         aelf: 'new Aelf(new Aelf.providers.HttpProvider("xxxx"));',
        //         contracts: [{
        //         }]
        //     }
        // ];
        this.lockGuard(sendResponse).then(() => {
            const aelf = new Aelf(new Aelf.providers.HttpProvider(chainInfo.payload.httpProvider));
            aelf.chain.connectChain((error, result) => {
                console.log(error, result);
                if (error || !result || !result.result) {
                    sendResponse({
                        error: 200001,
                        message: error.message || error,
                        result
                    });
                    return;
                }
                const chainId = result.result.chain_id || 'Can not find chain_id';
                let existentMetaIndex = -1;
                const existentMeta = aelfMeta.find((item, index) => {
                    // const checkDomain = chainInfo.hostname.includes(item.hostname);
                    const checkDomain = chainInfo.hostname === item.hostname;
                    const checkChainId = item.chainId === chainId;
                    if (checkDomain && checkChainId) {
                        existentMetaIndex = index;
                        return true;
                    }
                });
                const aelfMetaTemp = {
                    appName: chainInfo.appName,
                    hostname: chainInfo.hostname,
                    httpProvider: chainInfo.payload.httpProvider,
                    chainId,
                    aelf,
                    contracts: []
                };
                if (existentMeta) {
                    aelfMeta[existentMetaIndex] = aelfMetaTemp;
                } else {
                    aelfMeta.push(aelfMetaTemp);
                }
                sendResponse({
                    error: 0,
                    result // ,
                    // aelfMeta: JSON.stringify(aelfMeta)
                });
            });
        });

    }

    static callAelfChain(sendResponse, callInfo) {
        // content.js
        // chainInfo = {
        //     appName: 'Your app',
        //     method: 'CONNECT_AELF_CHAIN',
        //     hostname: 'aelf.io',
        //     payload: {
        //         httpProvider: 'http://localhost:1234/chain'
        //     }
        // }
        // inject.js
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'CALL_AELF_CHAIN',
        //     chainId: 'xxx',
        //     payload: {
        //         method: 'cName'
        //         params: []
        //     }
        // });
        this.lockGuard(sendResponse).then(() => {
            console.log('callAelfChain: ', callInfo);
            const dappAelfMeta = aelfMeta.find(item => {
                // const checkDomain = callInfo.hostname.includes(item.hostname);
                const checkDomain = callInfo.hostname === item.hostname;
                const checkChainId = item.chainId === callInfo.chainId;
                return checkDomain && checkChainId;
            });
            console.log('call AelfChain show dappAelfMeta: ', aelfMeta);
            console.log('call AelfChain show NightElf: ', nightElf);
            if (dappAelfMeta) {
                const {
                    method,
                    params
                } = callInfo.payload;
                dappAelfMeta.aelf.chain[method](...params, (error, result) => {
                    if (error) {
                        sendResponse({
                            error: 200001,
                            result: error
                        });
                        return;
                    }
                    sendResponse({
                        error: 0,
                        result
                    });
                });
            } else {
                sendResponse({
                    error: 200001,
                    message: 'Please connect the chain at first. ' +
                        `${callInfo.hostname} have not connect the chain named ${callInfo.chainId}. ` +
                        ' [Notice]www.aelf.io !== aelf.io '
                });
            }
        });

    }

    /**
     * 1. hostname: a.aelf.io(page) -> aelf.io is OK;
     * 2. chainId: must be the same;
     * 3. contractAddress: must be the same;
     *
     * @param {Function} sendResponse Delegating response handler.
     * @param {Object} contractInfo From content.js
     * @return {Object} dappAelfMetaIndex, dappAelfMeta, dappPermission, dappContractPermission
     */
    static checkDappContractStatus(sendResponse, contractInfo) {
        console.log('checkDappContractStatus: ', contractInfo);
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'INIT_AELF_CONTRACT',
        //     hostname: 'xxxx',
        //     chainId: 'xxx'
        //     payload: {
        //         address: 'keypair 的 address',
        //         contractName: 'cName'
        //         contractAddress: 'xxxx'
        //     }
        // });
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'CALL_AELF_CONTRACT',
        //     hostname: 'xxxx',
        //     chainId: 'xxx',
        //     payload: {
        //         contractName: 'cName, the same as init',
        //         method: 'transfer',
        //         params: []
        //     }
        // });
        return new Promise((resolve, reject) => {
            let dappAelfMetaIndex = -1;
            const {hostname, chainId, payload} = contractInfo;
            const {address, contractAddress} = payload;
            const dappAelfMeta = aelfMeta.find((item, index) => {
                // const checkDomain = contractInfo.hostname.includes(item.hostname);
                const checkDomain = hostname === item.hostname;
                const checkChainId = item.chainId === chainId;
                if (checkDomain && checkChainId) {
                    dappAelfMetaIndex = index;
                    return true;
                }
            });
            if (!dappAelfMeta) {
                sendResponse({
                    error: 200001,
                    message: `Please connect the chain: ${chainId}.`
                });
                return;
            }

            const dappPermission = nightElf.keychain.permissions.find(item => {
                const checkDomain = hostname === item.domain;
                const checkAddress = address === item.address;
                return checkDomain && checkAddress;
            });
            if (!dappPermission) {
                sendResponse({
                    error: 200001,
                    message: 'Please set permission at first.'
                });
                return;
            }

            const dappContractPermission = dappPermission.contracts.find(item => {
                const checkChain = item.chainId === chainId;
                const checkContractAddress = item.contractAddress === contractAddress;
                return checkChain && checkContractAddress;
            });
            if (!dappContractPermission) {
                sendResponse({
                    error: 200001,
                    message: `There is no permission of this contract: ${contractAddress}.`
                });
                return;
            }
            resolve({
                dappAelfMetaIndex,
                dappAelfMeta,
                dappPermission,
                dappContractPermission
            });
        });
    }

    static initAelfContract(sendResponse, contractInfo) {
        // inject
        // {
        //     appName: 'Your app',
        //     method: 'INIT_AELF_CONTRACT',
        //     // hostname: 'xxxx', 在content.js补齐。
        //     chainId: 'xxx'
        //     payload: {
        //         address: 'keypair 的 address',
        //         contractName: 'cName'
        //         contractAddress: 'xxxx'
        //     }
        // }
        // content.js
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'INIT_AELF_CONTRACT',
        //     hostname: 'xxxx',
        //     chainId: 'xxx'
        //     payload: {
        //         address: 'keypair 的 address',
        //         contractName: 'cName'
        //         contractAddress: 'xxxx'
        //     }
        // });
        // return JSON.stringify(result);
        console.log('initAelfContract: ', contractInfo);
        // const aelfMeta = [
        //     {
        //         appName: 'Dapp Test',
        //         hostname: 'aelf.io',
        //         httpProvider: 'http://localhost:1234/chain',
        //         chainId: '',
        //         aelf: 'new Aelf(new Aelf.providers.HttpProvider("xxxx"));',
        //         contracts: [{
        //             contractName: 'cName',
        //             contractAddress: '',
        //             httpProvider: 'http://localhost:1234/chain',
        //             contract: 'aelf.chain.contractAt("contract_address", wallet); use keypair to get'
        //         }]
        //     }
        // ];
        this.checkDappContractStatus(sendResponse, contractInfo).then(output => {
            const {payload} = contractInfo;
            const {address, contractAddress, contractName} = payload;
            const {
                dappAelfMetaIndex,
                dappAelfMeta // ,
                // dappPermission,
                // dappContractPermission
            } = output;

            const keypair = nightElf.keychain.keypairs.find(item => {
                return item.address === address;
            });
            if (!keypair) {
                sendResponse({
                    error: 200001,
                    message: 'Missing keypair of' + address
                });
                return;
            }

            const wallet = Aelf.wallet.getWalletByPrivateKey(keypair.privateKey);
            const contractMethods = dappAelfMeta.aelf.chain.contractAt(contractAddress, wallet);
            const contract = {
                address,
                contractName,
                contractAddress,
                contractMethods
            };

            let extendContractIndex = -1;
            dappAelfMeta.contracts.find((item, index) => {
                if (contractInfo.payload.contractAddress === item.contractAddress) {
                    extendContractIndex = index;
                    return true;
                }
            });
            if (extendContractIndex > -1) {
                dappAelfMeta.contracts[extendContractIndex] = contract;
            }
            else {
                dappAelfMeta.contracts.push(contract);
            }

            aelfMeta[dappAelfMetaIndex] = dappAelfMeta;

            sendResponse({
                error: 0,
                message: JSON.stringify(contractMethods),
                detail: JSON.stringify(dappAelfMeta)
            });
        });
    }

    static callAelfContract(sendResponse, contractInfo) {
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'CALL_AELF_CONTRACT',
        //     chainId: 'xxx',
        //     payload: {
        //         contractName: 'cName, the same as init',
        //         method: 'transfer',
        //         params: []
        //     }
        // });
        // inject
        // {
        //     appName: 'Your app',
        //     method: 'INIT_AELF_CONTRACT',
        //     // hostname: 'xxxx', 在content.js补齐。
        //     chainId: 'xxx'
        //     payload: {
        //         address: 'keypair 的 address',
        //         contractName: 'cName'
        //         contractAddress: 'xxxx'
        //     }
        // }
        // content.js
        // NightElf.action({
        //     appName: 'Your app',
        //     method: 'INIT_AELF_CONTRACT',
        //     hostname: 'xxxx',
        //     chainId: 'xxx'
        //     payload: {
        //         address: 'keypair 的 address',
        //         contractName: 'cName'
        //         contractAddress: 'xxxx'
        //     }
        // });
        this.checkSeed({
            sendResponse
        }).then(() => {
            const {payload, chainId, hostname} = contractInfo;
            const {contractName, method, params} = payload;
            const dappAelfMeta = aelfMeta.find(item => {
                // const checkDomain = hostname.includes(item.hostname);
                const checkDomain = hostname === item.hostname;
                const checkChainId = item.chainId === chainId;
                return checkDomain && checkChainId;
            });
            if (!dappAelfMeta) {
                sendResponse({
                    error: 200001,
                    message: 'Please connect chain.'
                });
                return;
            }

            const extendContract = dappAelfMeta.contracts.find(item => {
                return contractName === item.contractName;
            });
            if (!extendContract) {
                sendResponse({
                    error: 200001,
                    message: `Please init contract ${contractName}.`
                });
                return;
            }
            if (!extendContract.contractMethods[method]) {
                sendResponse({
                    error: 200002,
                    message: `Mehtod ${method} is not exist in the contract.`
                });
                return;
            }

            const contractInfoTemp = Object.assign({}, contractInfo, {
                payload: {
                    address: extendContract.address,
                    contractAddress: extendContract.contractAddress
                }
            });
            // If the user remove the permission after the dapp initialized the contract
            this.checkDappContractStatus(sendResponse, contractInfoTemp).then(() => {
                extendContract.contractMethods[method](...params, (error, result) => {
                    if (error) {
                        sendResponse({
                            error: 200001,
                            result: error
                        });
                    }
                    else {
                        sendResponse({
                            error: 0,
                            result
                        });
                    }
                });
            });
        });
    }

    static createWallet(sendResponse, _seed) {
        nightElf = NightElf.fromJson({});
        seed = _seed;
        Background.updateWallet(sendResponse);
    }

    static unlockWallet(sendResponse, _seed) {
        seed = _seed;
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            nightElf = NightElf.fromJson(nightElfObject);
            sendResponse({
                error: 0,
                nightElf: !!nightElf
            });
        });
    }

    static updateWallet(sendResponse) {
        // TODO: Check seed.
        if (nightElf && seed) {
            const nightElfEncrypto = AESEncrypto(JSON.stringify(nightElf), seed);
            apis.storage.local.set({
                nightElfEncrypto
            }, result => {
                console.log('updateWallet: ', nightElfEncrypto, nightElf);
                sendResponse({
                    error: 0,
                    result
                });
            });
        }
        else {
            sendResponse({
                error: 1,
                message: 'No Wallet Info.'
            });
        }
    }

    static checkWallet(sendResponse) {
        apis.storage.local.get(['nightElfEncrypto'], result => {
            console.log(result.nightElfEncrypto);
            sendResponse({
                nightElfEncrypto: !!result.nightElfEncrypto,
                nightElf: nightElf
            });
        });
    }

    static clearWallet(sendResponse, _seed) {
        this.checkSeed({
            sendResponse
        }).then(() => {
            apis.storage.local.clear(result => {
                Background.lockWallet(sendResponse);
            });
        });
    }

    static lockWallet(sendResponse) {
        seed = null;
        nightElf = null;
        sendResponse({
            error: 0
        });
    }

    static insertKeypair(sendResponse, keypair) {
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            nightElfObject.keychain.keypairs.unshift(keypair);
            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    static removeKeypair(sendResponse, address) {
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            nightElfObject.keychain.keypairs = nightElfObject.keychain.keypairs.filter(item => {
                return address !== item.address;
            });

            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    static getKeypair(sendResponse) {
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            const {
                keychain: {
                    keypairs = []
                }
            } = nightElfObject;
            sendResponse({
                error: 0,
                keypairs: keypairs
            });
        });
    }

    // Depend on the hostname of the app and the address of user.
    // TODO: set permisions
    static setPermission(sendResponse, permissionInput) {
        // permission example
        // {
        //     appName: 'hzz Test',
        //     domain: 'aelf.io',
        //     address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
        //     contracts: [{
        //         chainId: 'AELF',
        //         contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
        //         contractName: 'token',
        //         description: 'token contract',
        //         description_zh: '',
        //         description_en: ''
        //     }]
        // }
        const {appName, domain, hostname, address, contracts} = permissionInput;
        const permissionNeedAdd = {
            appName,
            domain: domain || hostname,
            address,
            contracts
        };
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            let permissionIndex = [];
            const permissionsTemp = permissions.filter((permission, index) => {
                const domainCheck = permission.domain === domain;
                const addressCheck = permission.address === address;
                if (domainCheck && addressCheck) {
                    permissionIndex.push(index);
                    return true;
                }
                return false;
            });

            if (permissionsTemp.length) {
                nightElfObject.keychain.permissions[permissionIndex[0]] = permissionNeedAdd;
            }
            else {
                nightElfObject.keychain.permissions.unshift(permissionNeedAdd);
            }
            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    // 3 Way to get Permisions
    // by address,contranctAddress,domain(default way)
    static getPermission(sendResponse, queryInfo) {
        // this static function call the this,
        // the this is the Class but not the instance of the Class.
        // it means, we need declare static checkSeed.
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            switch (queryInfo.type) {
                case 'address':
                    {
                        if (!queryInfo.address) {
                            sendResponse({
                                error: 200001,
                                message: 'missing param address.'
                            });
                            return;
                        }
                        const permissionsTemp = permissions.filter(permission => {
                            const domainCheck = permission.domain === queryInfo.hostname;
                            const addressCheck = permission.address === queryInfo.address;
                            return domainCheck && addressCheck;
                        });

                        sendResponse({
                            error: 0,
                            permissions: permissionsTemp
                        });
                    }
                    break;
                // TODO: use database such lick NeDB ?
                case 'contract':
                    {
                        if (!queryInfo.contractAddress) {
                            sendResponse({
                                error: 200001,
                                message: 'missing param contractAddress.'
                            });
                            return;
                        }
                        const permissionsByDomain = permissions.filter(permission => {
                            const domainCheck = permission.domain === queryInfo.hostname;
                            return domainCheck;
                        });

                        const permissionsByContract = permissionsByDomain.filter(permission => {
                            const contractMatch = permission.contracts.filter(contract => {
                                return contract.contractAddress === queryInfo.contractAddress;
                            });
                            return contractMatch && contractMatch.length;
                        });

                        sendResponse({
                            error: 0,
                            permissions: permissionsByContract
                        });
                    }
                    break;
                default: // defaut to check domain;
                    {
                        const permissionsTemp = permissions.filter(permission => {
                            const domainCheck = permission.domain === queryInfo.hostname;
                            return domainCheck;
                        });

                        sendResponse({
                            error: 0,
                            permissions: permissionsTemp
                        });
                    }
            }

            const permissionsTemp = permissions.filter(permission => {
                const domainCheck = permission.domain === queryInfo.hostname;
                const addressCheck = permission.address === queryInfo.address;
                return domainCheck && addressCheck;
            });

            sendResponse({
                error: 0,
                permissions: permissionsTemp
            });
        });
    }

    static getAllPermissions(sendResponse) {
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            sendResponse({
                error: 0,
                permissions: permissions
            });
        });
    }

    // TODO: remove Single contract permission.
    static removePermission(sendResponse, removeInfo) {
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            nightElfObject.keychain.permissions = permissions.filter(item => {
                const domainCheck = removeInfo.domain === item.domain;
                const addressCheck = removeInfo.address === item.address;
                return !(domainCheck && addressCheck);
            });

            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    // About Error Code. 冗余的设计。
    // https://www.zhihu.com/question/24091286
    // https://open.taobao.com/doc.htm?docId=114&docType=1
    // 统一格式：A-BB-CCC
    // A: 错误级别，如1代表系统级错误，2代表服务级错误；
    // // B: 项目或模块名称，一般公司不会超过99个项目；
    // // C: 具体错误编号，自增即可，一个项目999种错误应该够用；
    // B xxxx1x, 加密解密相关错误; xxxx0x 参数问题。
    // C 0，no Error
    static checkSeed(options) {
        return new Promise((resolve, reject) => {
            const {
                sendResponse,
                decryptoFailMsg = '',
                noStorageMsg = ''
            } = options;
            // TODO: sendResponse & resolve/reject
            if (!seed) {
                const error = {
                    error: 200011,
                    message: 'Night Elf is locked!'
                };
                sendResponse(error);
                reject(error);
                return;
            }
            if (typeof sendResponse === 'function') {
                try {
                    apis.storage.local.get(['nightElfEncrypto'], result => {
                        if (result.nightElfEncrypto) {
                            const nightElfString = AESDecrypto(result.nightElfEncrypto, seed);
                            if (nightElfString) {
                                const nightElfObject = JSON.parse(nightElfString);
                                resolve({
                                    error: 0,
                                    nightElfObject
                                });
                            }
                            else {
                                sendResponse({
                                    error: 200011,
                                    message: decryptoFailMsg || 'Decrypto Failed. Please unlock your wallet.'
                                });
                            }
                        }
                        else {
                            sendResponse({
                                error: 200001,
                                message: noStorageMsg || 'No Night Elf in storage.'
                            });
                        }
                    });
                }
                catch (e) {
                    reject({
                        error: 100001,
                        message: 'Get Night Elf failed!'
                    });
                }
            }
            else {
                reject({
                    error: 200001,
                    message: 'Missing param sendResponse(function).'
                });
            }
        });
    }

    //     Background.checkAutoLock();
    //     switch (message.type) {
    //         case InternalMessageTypes.SET_SEED:
    //             Background.setSeed(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.SET_TIMEOUT:
    //             Background.setTimeout(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.IS_UNLOCKED:
    //             Background.isUnlocked(sendResponse);
    //             break;
    //         case InternalMessageTypes.LOAD:
    //             Background.load(sendResponse);
    //             break;
    //         case InternalMessageTypes.UPDATE:
    //             Background.update(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.PUB_TO_PRIV:
    //             Background.publicToPrivate(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.DESTROY:
    //             Background.destroy(sendResponse);
    //             break;
    //         case InternalMessageTypes.IDENTITY_FROM_PERMISSIONS:
    //             Background.identityFromPermissions(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.GET_OR_REQUEST_IDENTITY:
    //             Background.getOrRequestIdentity(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.FORGET_IDENTITY:
    //             Background.forgetIdentity(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.REQUEST_SIGNATURE:
    //             Background.requestSignature(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.REQUEST_ARBITRARY_SIGNATURE:
    //             Background.requestArbitrarySignature(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.REQUEST_ADD_NETWORK:
    //             Background.requestAddNetwork(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.REQUEST_GET_VERSION:
    //             Background.requestGetVersion(sendResponse);
    //             break;
    //         case InternalMessageTypes.REQUEST_VERSION_UPDATE:
    //             Background.requestVersionUpdate(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.AUTHENTICATE:
    //             Background.authenticate(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.ABI_CACHE:
    //             Background.abiCache(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.SET_PROMPT:
    //             Background.setPrompt(sendResponse, message.payload);
    //             break;
    //         case InternalMessageTypes.GET_PROMPT:
    //             Background.getPrompt(sendResponse);
    //             break;
    //     }
    // }

    // Lock the user due to inactivity
    static checkAutoLock() {
        return true;
        // if (inactivityInterval === 0) return false;
        // if (timeoutLocker) clearTimeout(timeoutLocker);
        // if (seed) timeoutLocker = setTimeout(() => seed = '', inactivityInterval);
    }

    // TODO: 是否要限制用户直接获取地址？
    static getAddress(sendResponse) {
        this.checkSeed({
            sendResponse
        }).then(({
            nightElfObject
        }) => {
            const {
                keychain: {
                    keypairs = []
                }
            } = nightElfObject;
            const addressList = keypairs.map(item => {
                return item.address;
            });
            sendResponse({
                error: 0,
                addressList
            });
        });
    }

    /**
     * some action like SET_PERMISSION need through prompt page.
     * TODO: According to the input data,
     * We will render diffenret prompt page.
     * @param {Function} sendResponse Delegating response handler.
     * @param {Object} message input data for prompt page.
     */
    static openPrompt(sendResponse, message) {
        // TODO: NightElf lock notice.
        const route = message.route === '#/prompt' ? '#/prompt' : '';
        NotificationService.open({
            sendResponse,
            route,
            message
        });
    }

    static setPrompt(sendResponse, notification) {
        prompt = notification;
        sendResponse(true);
    }

    static getPrompt(sendResponse) {
        sendResponse(prompt);
    }

    /********************************************/
    /*                 Handlers                 */
    /********************************************/

    /***
     * Sets the seed on scope to use from decryption
     * @param sendResponse - Delegating response handler
     * @param _seed - The seed to set
     */
    static setSeed(sendResponse, _seed) {
        seed = _seed;
        sendResponse(true);
    }

    /***
     * Returns a an error if Scatter is locked,
     * or passes through the callback if Scatter is open
     * @param sendResponse - Delegating response handler
     * @param cb - Callback to perform if open
     */
    static lockGuard(sendResponse) {
        return new Promise((resolve, reject) => {
            if (!(seed && seed.length)) {
                // NotificationService.open(Prompt.scatterIsLocked());
                NotificationService.open({
                    sendResponse,
                    route: '#/prompt',
                    message: {
                        appName: 'NightElf',
                        domain: 'aelf.io',
                        payload: {
                            message: 'Night Elf is locked.'
                        }
                    }
                });
                // sendResponse(Error.locked());
                const error = {
                    error: 200001,
                    message: 'Night Elf is locked'
                };
                sendResponse(error);
                reject(error);
            } else {
                resolve({
                    error: 0
                });
            }

        });
    }


    /***
     * Checks whether Scatter is locked
     * @param sendResponse - Delegating response handler
     * @returns {boolean}
     */
    // static isUnlocked(sendResponse) {
    //     // Even if a seed is set, that doesn't mean that the seed is correct.
    //     if (seed.length) StorageService.get().then(scatter => {
    //         try {
    //             scatter.decrypt(seed);
    //             sendResponse(!scatter.isEncrypted());
    //         } catch (e) {
    //             seed = '';
    //             sendResponse(false);
    //         }
    //     });
    //     // If no seed is set, Scatter is definitely locked
    //     else sendResponse(false);
    // }

    /***
     * Returns the saved instance of Scatter from the storage
     * @param sendResponse - Delegating response handler
     * @returns {Scatter}
     */
    // static load(sendResponse) {
    //     StorageService.get().then(async scatter => {
    //         // sync the timeout inactivity interval
    //         inactivityInterval = scatter.settings.inactivityInterval;

    //         if (!seed.length) return sendResponse(scatter);

    //         scatter.decrypt(seed);
    //         const migrated = await migrate(scatter);
    //         if (migrated) this.update(() => {}, scatter);
    //         sendResponse(scatter)
    //     })
    // }

    /***
     * Updates the Scatter instance inside persistent storage
     * @param sendResponse - Delegating response handler
     * @param scatter - The updated cleartext Scatter instance
     * @returns {boolean}
     */
    // static update(sendResponse, scatter) {
    //     this.lockGuard(sendResponse, () => {
    //         scatter = Scatter.fromJson(scatter);

    //         // Private Keys are always separately encrypted
    //         scatter.keychain.keypairs.map(keypair => keypair.encrypt(seed));
    //         scatter.keychain.identities.map(id => id.encrypt(seed));

    //         // Keychain is always stored encrypted.
    //         scatter.encrypt(seed);

    //         StorageService.save(scatter).then(saved => {
    //             scatter.decrypt(seed);
    //             sendResponse(scatter)
    //         })
    //     })
    // }

    /***
     * Retrieves a Private Key from a Public Key
     * @param sendResponse - Delegating response handler
     * @param publicKey - The Public Key to search for
     * @returns {privateKey:string | null}
     */
    // static publicToPrivate(sendResponse, publicKey) {
    //     this.lockGuard(sendResponse, () => {
    //         StorageService.get().then(scatter => {
    //             scatter.decrypt(seed);
    //             let keypair = scatter.keychain.keypairs.find(keypair => keypair.publicKey === publicKey);
    //             if (!keypair) keypair = scatter.keychain.identities.find(id => id.publicKey === publicKey);
    //             sendResponse((keypair) ? AES.decrypt(keypair.privateKey, seed) : null);
    //         })
    //     })
    // }

    /***
     * Destroys this instance of Scatter
     * @param sendResponse
     */
    // static destroy(sendResponse) {
    //     // TODO: Mock
    //     this.lockGuard(sendResponse, () => {
    //         console.log("Destroying");
    //         seed = '';
    //         apis.storage.local.clear();
    //         sendResponse(true);
    //     })
    // }

    /***
     * Sets the timeout interval on scope to determine the lockout time
     * @param sendResponse - Delegating response handler
     * @param _timeoutMinutes - The timeout minutes to set
     */
    // static setTimeout(sendResponse, _timeoutMinutes) {
    //     this.load(scatter => {
    //         inactivityInterval = TimingHelpers.minutes(_timeoutMinutes);
    //         scatter.settings.inactivityInterval = inactivityInterval;
    //         this.update(() => {}, scatter);
    //     });

    //     sendResponse(true);
    // }













    /********************************************/
    /*              Web Application             */
    /********************************************/

    // static identityFromPermissions(sendResponse, payload) {
    //     if (!seed.length) {
    //         sendResponse(null);
    //         return false;
    //     }

    //     Background.load(scatter => {
    //         const domain = payload.domain;
    //         const permission = IdentityService.identityPermission(domain, scatter);
    //         if (!permission) {
    //             sendResponse(null);
    //             return false;
    //         }
    //         const identity = permission.getIdentity(scatter.keychain);
    //         sendResponse(identity.asOnlyRequiredFields(permission.fields));
    //     });
    // }

    /***
     * Prompts a request for Identity provision
     * @param sendResponse
     * @param payload
     */
    // static getOrRequestIdentity(sendResponse, payload) {
    //     this.lockGuard(sendResponse, () => {
    //         Background.load(scatter => {
    //             const {
    //                 domain,
    //                 fields
    //             } = payload;

    //             IdentityService.getOrRequestIdentity(domain, fields, scatter, (identity, fromPermission) => {
    //                 if (!identity) {
    //                     sendResponse(Error.signatureError("identity_rejected", "User rejected the provision of an Identity"));
    //                     return false;
    //                 }

    //                 if (!fromPermission) {
    //                     this.addHistory(HistoricEventTypes.PROVIDED_IDENTITY, {
    //                         domain,
    //                         provided: !!identity,
    //                         identityName: identity ? identity.name : false,
    //                         publicKey: (identity) ? identity.publicKey : false
    //                     });

    //                     this.addPermissions([Permission.fromJson({
    //                         domain,
    //                         identity: identity.publicKey,
    //                         timestamp: +new Date(),
    //                         fields,
    //                         checksum: domain
    //                     })])
    //                 }

    //                 sendResponse(identity);
    //             });
    //         });
    //     })
    // }

    // static forgetIdentity(sendResponse, payload) {
    //     this.lockGuard(sendResponse, () => {
    //         Background.load(scatter => {
    //             const permission = scatter.keychain.permissions.find(permission => permission.isIdentityOnly() && permission.domain === payload.domain);
    //             if (!permission) {
    //                 sendResponse(true);
    //                 return false;
    //             }

    //             const clone = scatter.clone();
    //             clone.keychain.removePermission(permission);

    //             this.update(() => {
    //                 sendResponse(true);
    //             }, clone);
    //         })
    //     })
    // }

    // /***
    //  * Authenticates the Identity by returning a signed passphrase using the
    //  * private key associated with the Identity
    //  * @param sendResponse
    //  * @param payload
    //  */
    // static authenticate(sendResponse, payload) {
    //     this.lockGuard(sendResponse, () => {
    //         Background.load(scatter => {
    //             const identity = scatter.keychain.findIdentity(payload.publicKey);
    //             if (!identity) return sendResponse(Error.identityMissing());
    //             identity.decrypt(seed);

    //             const plugin = PluginRepository.plugin(Blockchains.EOS);
    //             plugin.signer(this, {
    //                 data: payload.domain
    //             }, identity.publicKey, sendResponse, true);
    //         })
    //     })
    // }

    // static abiCache(sendResponse, payload) {
    //     this.lockGuard(sendResponse, async () => {
    //         sendResponse(payload.abiGet ?
    //             await StorageService.getABI(payload.abiContractName, payload.chainId) :
    //             await StorageService.cacheABI(payload.abiContractName, payload.chainId, payload.abi));
    //     })
    // }

    /***
     * Prompts a request for a transaction signature
     * @param sendResponse
     * @param payload
     */
    // static requestSignature(sendResponse, payload) {
    //     this.lockGuard(sendResponse, () => {
    //         Background.load(scatter => {
    //             SignatureService.requestSignature(payload, scatter, this, sendResponse);
    //         })
    //     })
    // }

    /***
     * Prompts a request for an arbitrary signature
     * @param sendResponse
     * @param payload
     */
    // static requestArbitrarySignature(sendResponse, payload) {
    //     this.lockGuard(sendResponse, () => {
    //         Background.load(scatter => {
    //             SignatureService.requestArbitrarySignature(payload, scatter, this, sendResponse);
    //         })
    //     })
    // }



    /***
     * Adds a historic event to the keychain
     * @param type
     * @param data
     */
    // static addHistory(type, data) {
    //     this.load(scatter => {
    //         // scatter.histories.unshift(new HistoricEvent(type, data));
    //         // this.update(() => {}, scatter);
    //     })
    // }

    /***
     * Adds a permission to the keychain
     * @param permissions
     */
    // static addPermissions(permissions) {
    //     this.load(scatter => {
    //         permissions.map(permission => {
    //             if (!scatter.keychain.hasPermission(permission.checksum, permission.fields))
    //                 scatter.keychain.permissions.unshift(permission);
    //         });
    //         this.update(() => {}, scatter);
    //     })
    // }

}

const background = new Background();
