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
import errorHandler from './utils/errorHandler';
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

// let inactivityInterval = 0;
// let timeoutLocker = null;

let prompt = null;

// // TODO: release single contract
// NightElf.action({
//     appName: 'Your app',
//     method: 'RELEASE',
//     payload: {
//     }
// });

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
        console.log('dispenseMessage: ', message, JSON.stringify(nightElf));
        if (message.payload === false) {
            sendResponse({
                ...errorHandler(200001)
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
        this.lockGuard(sendResponse, () => {
            const aelf = new Aelf(new Aelf.providers.HttpProvider(chainInfo.payload.httpProvider));
            aelf.chain.connectChain((error, result) => {
                // console.log(error, result);
                if (error || !result || !result.result || result.error) {
                    sendResponse({
                        ...errorHandler(500001, error || result.error),
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
                }
                else {
                    aelfMeta.push(aelfMetaTemp);
                }
                sendResponse({
                    ...errorHandler(0),
                    result // ,
                    // aelfMeta: JSON.stringify(aelfMeta)
                });
            });
        });

    }

    static callAelfChain(sendResponse, callInfo) {
        if (callInfo.payload.method === 'sendTransaction') {
            sendResponse({
                ...errorHandler(400001, 'Forbidden')
            });
            return;
        }

        this.lockGuard(sendResponse, () => {
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
                try {
                    dappAelfMeta.aelf.chain[method](...params, (error, result) => {
                        if (error || result.error) {
                            sendResponse({
                                ...errorHandler(500001, error || result.error)
                            });
                            return;
                        }
                        sendResponse({
                            ...errorHandler(0),
                            result
                        });
                    });
                }
                catch (error) {
                    sendResponse({
                        ...errorHandler(100001, error)
                    });
                }
            }
            else {
                sendResponse({
                    ...errorHandler(400001, 'Please connect the chain at first. '
                        + `${callInfo.hostname} have not connect the chain named ${callInfo.chainId}. `
                        + ' [Notice]www.aelf.io !== aelf.io ')
                });
            }
        });

    }

    /**
     * 1. hostname: a.aelf.io(page) -> aelf.io is OK;
     * 2. chainId: must be the same;
     * 3. contractAddress: must be the same;
     *
     */

    static checkDappContractStatus(options, callback) {
        const {
            sendResponse,
            contractInfo
        } = options;

        let dappAelfMetaIndex = -1;
        const {
            hostname,
            chainId,
            payload
        } = contractInfo;
        const {
            address,
            contractAddress
        } = payload;
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
                ...errorHandler(400001, `Please connect the chain: ${chainId}.`)
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
                ...errorHandler(200002)
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
                ...errorHandler(400001, `There is no permission of this contract: ${contractAddress}.`)
            });
            return;
        }
        callback({
            dappAelfMetaIndex,
            dappAelfMeta,
            dappPermission,
            dappContractPermission
        });
        return;
    }

    static initAelfContract(sendResponse, contractInfo) {
        // console.log('initAelfContract: ', contractInfo);
        this.checkDappContractStatus({sendResponse, contractInfo}, output => {
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
                    ...errorHandler(400001, 'Missing keypair of' + address)
                });
                return;
            }
            const wallet = Aelf.wallet.getWalletByPrivateKey(keypair.privateKey);
            dappAelfMeta.aelf.chain.contractAtAsync(contractAddress, wallet, (error, contractMethods) => {
                if (error) {
                    sendResponse({
                        ...errorHandler(500001, error)
                    });
                    return;
                }
                const contractNew = {
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
                    dappAelfMeta.contracts[extendContractIndex] = contractNew;
                }
                else {
                    dappAelfMeta.contracts.push(contractNew);
                }

                aelfMeta[dappAelfMetaIndex] = dappAelfMeta;

                sendResponse({
                    ...errorHandler(0),
                    message: JSON.stringify(contractMethods),
                    detail: JSON.stringify(dappAelfMeta)
                });
            });
        });
    }

    static callAelfContract(sendResponse, contractInfo) {
        this.checkSeed({sendResponse}, () => {
            const {payload, chainId, hostname} = contractInfo;
            const {
                contractName,
                method,
                params,
                contractAddress
            } = payload;
            const dappAelfMeta = aelfMeta.find(item => {
                // const checkDomain = hostname.includes(item.hostname);
                const checkDomain = hostname === item.hostname;
                const checkChainId = item.chainId === chainId;
                return checkDomain && checkChainId;
            });
            if (!dappAelfMeta) {
                sendResponse({
                    ...errorHandler(200003)
                });
                return;
            }

            const extendContract = dappAelfMeta.contracts.find(item => {
                return contractAddress === item.contractAddress;
            });
            if (!extendContract) {
                sendResponse({
                    ...errorHandler(400001, `Please init contract ${contractName}: ${contractAddress}.`)
                });
                return;
            }
            if (!extendContract.contractMethods[method]) {
                sendResponse({
                    ...errorHandler(400001, `Mehtod ${method} is not exist in the contract.`)
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
            this.checkDappContractStatus({
                sendResponse,
                contractInfo: contractInfoTemp
            }, () => {
                try {
                    extendContract.contractMethods[method](...params, (error, result) => {
                        if (error || result.error) {
                            sendResponse({
                                ...errorHandler(500001, error || result.error)
                            });
                        }
                        else {
                            sendResponse({
                                ...errorHandler(0, error),
                                result
                            });
                        }
                    });
                }
                catch (error) {
                    sendResponse({
                        ...errorHandler(100001, error)
                    });
                }
            });
        });
    }

    static createWallet(sendResponse, _seed) {
        nightElf = NightElf.fromJson({});
        seed = _seed;
        Background.updateWallet(sendResponse);
    }

    static importWallet(sendResponse, _seed) {
        nightElf = NightElf.fromJson({});
        seed = _seed;
        Background.updateWallet(sendResponse);
    }

    static unlockWallet(sendResponse, _seed) {
        seed = _seed;
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            nightElf = NightElf.fromJson(nightElfObject);
            sendResponse({
                ...errorHandler(0),
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
                    ...errorHandler(0),
                    result
                });
            });
        }
        else {
            sendResponse({
                ...errorHandler(200004)
            });
        }
    }

    static checkWallet(sendResponse) {
        apis.storage.local.get(['nightElfEncrypto'], result => {
            // console.log(result.nightElfEncrypto);
            sendResponse({
                ...errorHandler(0),
                nightElfEncrypto: !!result.nightElfEncrypto,
                nightElf: nightElf
            });
        });
    }

    static clearWallet(sendResponse, _seed) {
        seed = _seed;
        nightElf = null;
        this.checkSeed({sendResponse}, () => {
            apis.storage.local.clear(result => {
                Background.lockWallet(sendResponse);
            });
        });
    }

    static lockWallet(sendResponse) {
        seed = null;
        nightElf = null;
        sendResponse({
            ...errorHandler(0)
        });
    }

    static insertKeypair(sendResponse, keypair) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            nightElfObject.keychain.keypairs.unshift(keypair);
            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    static removeKeypair(sendResponse, address) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            nightElfObject.keychain.keypairs = nightElfObject.keychain.keypairs.filter(item => {
                return address !== item.address;
            });

            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    static getKeypair(sendResponse) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {
                keychain: {
                    keypairs = []
                }
            } = nightElfObject;
            sendResponse({
                ...errorHandler(0),
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
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
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
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
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
                                ...errorHandler(400001, 'missing param address.')
                            });
                            return;
                        }
                        const permissionsTemp = permissions.filter(permission => {
                            const domainCheck = permission.domain === queryInfo.hostname;
                            const addressCheck = permission.address === queryInfo.address;
                            return domainCheck && addressCheck;
                        });

                        sendResponse({
                            ...errorHandler(0),
                            permissions: permissionsTemp
                        });
                    }
                    break;
                // TODO: use database such lick NeDB ?
                case 'contract':
                    {
                        if (!queryInfo.contractAddress) {
                            sendResponse({
                                ...errorHandler(400001, 'missing param contractAddress.')
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
                            ...errorHandler(0),
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
                            ...errorHandler(0),
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
                ...errorHandler(0),
                permissions: permissionsTemp
            });
        });
    }

    static getAllPermissions(sendResponse) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            sendResponse({
                ...errorHandler(0),
                permissions: permissions
            });
        });
    }

    // TODO: remove Single contract permission.
    static removePermission(sendResponse, removeInfo) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
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
    static checkSeed(options, callback) {
        const {
            sendResponse,
            decryptoFailMsg = '',
            noStorageMsg = ''
        } = options;
        // TODO: sendResponse & resolve/reject
        if (!seed) {
            sendResponse({
                ...errorHandler(200005)
            });
            return;
        }
        if (typeof sendResponse === 'function') {
            apis.storage.local.get(['nightElfEncrypto'], result => {
                if (result.nightElfEncrypto) {
                    let nightElfString;
                    try {
                        nightElfString = AESDecrypto(result.nightElfEncrypto, seed);
                    }
                    catch (e) {
                        sendResponse({
                            ...errorHandler(10000, 'Get Night Elf failed!')
                        });
                    }
                    if (nightElfString) {
                        const nightElfObject = JSON.parse(nightElfString);
                        callback({
                            ...errorHandler(0),
                            nightElfObject
                        });
                    }
                    else {
                        sendResponse({
                            ...errorHandler(200006, decryptoFailMsg)
                        });
                    }
                }
                else {
                    sendResponse({
                        ...errorHandler(200007, noStorageMsg)
                    });
                }
            });
        }
        else {
            sendResponse({
                ...errorHandler(400001, 'Missing param sendResponse(function).')
            });
        }
    }

    // Lock the user due to inactivity
    static checkAutoLock() {
        return true;
        // if (inactivityInterval === 0) return false;
        // if (timeoutLocker) clearTimeout(timeoutLocker);
        // if (seed) timeoutLocker = setTimeout(() => seed = '', inactivityInterval);
    }

    // TODO: 是否要限制用户直接获取地址？
    static getAddress(sendResponse) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {
                keychain: {
                    keypairs = []
                }
            } = nightElfObject;
            const addressList = keypairs.map(item => {
                return {
                    name: item.name,
                    address: item.address,
                    publicKey: item.publicKey
                };
            });
            sendResponse({
                ...errorHandler(0),
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
    static lockGuard(sendResponse, callback) {
        if (!(seed && seed.length)) {
            // NotificationService.open(Prompt.scatterIsLocked());
            // NotificationService.open({
            //     sendResponse,
            //     route: '#/prompt',
            //     message: {
            //         appName: 'NightElf',
            //         domain: 'aelf.io',
            //         payload: {
            //             message: 'Night Elf is locked.'
            //         }
            //     }
            // });
            sendResponse({
                ...errorHandler(200005)
            });
        }
        else {
            callback({
                ...errorHandler(0)
            });
        }
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

new Background();
