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
import {
    contractsCompare,
    formatContracts,
    contractWhitelistCheck
} from './utils/contracts/contracts';
import {
    getApplicationPermssions
} from './utils/permission/permission';
import errorHandler from './utils/errorHandler';
import NotificationService from './service/NotificationService';
import FileSaver from 'file-saver';
import SparkMD5 from 'spark-md5';

import AElf from 'aelf-sdk';

const {wallet} = AElf;
const {
    AESEncrypt,
    AESDecrypt
} = wallet;

/* eslint-disable fecs-camelcase */
let seed = '';
let nightElf = null;

let inactivityInterval = 900000;
let timeoutLocker = null;

let prompt = null;

// TODO: release single contract
// NightElf.action({
//     appName: 'Your app',
//     method: 'RELEASE',
//     payload: {
//     }
// });

function getPromptRoute(message) {
    let method = message.payload.method ? message.payload.method : message.payload.payload.method;
    const routMap = {
        SET_PERMISSION: '#/',
        SET_CONTRACT_PERMISSION: '#/',
        LOGIN: '#/loginkeypairs',
        CALL_AELF_CONTRACT: '#/examine-approve'
    };
    return message.router || routMap[method] || '#/confirmation';
}

let aelfMeta = [];
// This is the script that runs in the extension's background ( singleton )
export default class Background {

    constructor() {
        this.setupInternalMessaging();
    }

    // Watches the internal messaging system ( LocalStream )
    setupInternalMessaging() {
        LocalStream.watch((request, sendResponse) => {
            const message = InternalMessage.fromJson(request);
            console.log(sendResponse);
            this.dispenseMessage(sendResponse, message);
        });
    }

    /**
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

        apis.storage.local.get({
            inactivityInterval
        }, result => {
            inactivityInterval = result.inactivityInterval;
        });
        // sendResponse(true);
        Background.checkTimingLock(sendResponse);
        switch (message.type) {
            case InternalMessageTypes.SET_SEED:
                Background.setSeed(sendResponse, message.payload);
                break;
            case InternalMessageTypes.LOGIN:
                Background.login(sendResponse, message.payload);
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
            // update: backup wallet  start
            case InternalMessageTypes.BACKUP_WALLET:
                Background.backupWallet(sendResponse, message.payload);
                break;
            case InternalMessageTypes.IMPORT_WALLET:
                Background.importWallet(sendResponse, message.payload);
                break;
            // update: backup wallet  end

            case InternalMessageTypes.INSERT_KEYPAIR:
                Background.insertKeypair(sendResponse, message.payload);
                break;
            case InternalMessageTypes.GET_KEYPAIR:
                Background.getKeypair(sendResponse);
                break;
            case InternalMessageTypes.REMOVE_KEYPAIR:
                Background.removeKeypair(sendResponse, message.payload);
                break;

            case InternalMessageTypes.SET_LOGIN_PERMISSION:
                Background.setLoginPermission(sendResponse, message.payload);
                break;
            // case InternalMessageTypes.SET_PERMISSION:
            //     Background.setPermission(sendResponse, message.payload);
            //     break;
            case InternalMessageTypes.SET_CONTRACT_PERMISSION:
                Background.setContractPermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.SET_WHITELIST:
                Background.setWhitelist(sendResponse, message.payload);
                break;
            case InternalMessageTypes.REMOVE_METHODS_WHITELIST:
                Background.removeMethodsOfWhitelist(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CHECK_PERMISSION:
                Background.getPermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.REMOVE_PERMISSION:
                Background.removePermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.REMOVE_CONTRACT_PERMISSION:
                Background.removeContractOfPermission(sendResponse, message.payload);
                break;
            case InternalMessageTypes.GET_ALLPERMISSIONS:
                Background.getAllPermissions(sendResponse);
                break;
            case InternalMessageTypes.GET_CHAIN_STATUS:
                Background.getChainStatus(sendResponse, message.payload);
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
            case InternalMessageTypes.CALL_AELF_CONTRACT_READONLY:
                Background.callAelfContractReadonly(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CALL_AELF_CONTRACT_WITHOUT_CHECK:
                Background.callAelfContractWithoutCheck(sendResponse, message.payload);
                break;
            case InternalMessageTypes.GET_CONTRACT_ABI:
                Background.getExistContractAbi(sendResponse, message.payload);
                break;

            case InternalMessageTypes.GET_ADDRESS:
                Background.getAddress(sendResponse);
                break;
            case InternalMessageTypes.GET_SIGNATURE:
                Background.getSignature(sendResponse, message.payload);
                break;

            case InternalMessageTypes.OPEN_PROMPT:
                Background.openPrompt(sendResponse, message.payload);
                break;
            case InternalMessageTypes.CHECK_INACTIVITY_INTERVAL:
                Background.checkInactivityInterval(sendResponse);
                break;
            case InternalMessageTypes.GET_TIMING_LOCK:
                Background.getTimingLock(sendResponse, message.payload);
                break;
            // case InternalMessageTypes.SET_PROMPT:
            //     Background.setPrompt(sendResponse, message.payload);
            //     break;
            // case InternalMessageTypes.GET_PROMPT:
            //     Background.getPrompt(sendResponse);
            //     break;
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
    static getChainStatus(sendResponse, chainInfo) {
        this.lockGuard(sendResponse, () => {
            const aelf = new AElf(new AElf.providers.HttpProvider(...chainInfo.payload.httpProvider));
            aelf.chain.getChainStatus((error, result) => {
                // console.log(error, result);
                if (error || !result || result.error) {
                    sendResponse({
                        ...errorHandler(500001, error || result.error),
                        result
                    });
                    return;
                }
                const chainId = result.ChainId || 'Can not find ChainId:';
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
                    ...errorHandler(0),
                    result // ,
                    // aelfMeta: JSON.stringify(aelfMeta)
                });
            });
        });
    }

    /**
     * login your keypair
     * @param {Function} sendResponse Delegating response handler.
     * @param {Object} loginInfo from content.js
     */
    static login(sendResponse, loginInfo) {
        this.checkSeed({sendResponse}, ({nightElfObject}) => {

            // 如果permissions下有对应的
            const {
                keychain: {
                    keypairs = [],
                    permissions = []
                }
            } = nightElfObject;

            const {appName, chainId, payload} = loginInfo;
            const domain = loginInfo.hostname || loginInfo.domain;
            const appPermissons = getApplicationPermssions(permissions, domain);

            if (appPermissons.permissions.length) {
                const appPermission = appPermissons.permissions[0];

                const appNameBinded = appPermission.appName;
                const domainBinded = appPermission.domain;
                const addressBinded = appPermission.address;
                const contractsBinded = appPermission.contracts;

                const nameChecked = appName === appNameBinded;
                const domainChecked = domain === domainBinded;

                const isLoginAndSetPermission = loginInfo.payload
                    && loginInfo.payload.method === 'SET_PERMISSION'
                    && loginInfo.payload.payload
                    && loginInfo.payload.payload.contracts
                    && appPermissons;

                const keypairLoggedIn
                    = keypairs.find(item => item.address === addressBinded);

                if (isLoginAndSetPermission) {
                    const address = loginInfo.payload.payload.address;
                    const contracts = loginInfo.payload.payload.contracts;

                    const addressChecked = address === addressBinded;

                    const contractChecked = contractsCompare(contracts, contractsBinded);

                    if (nameChecked && domainChecked && addressChecked && contractChecked) {
                        sendResponse({
                            ...errorHandler(0),
                            message: '',
                            detail: JSON.stringify({
                                name: keypairLoggedIn.name,
                                address: addressBinded,
                                publicKey: keypairLoggedIn.publicKey
                            })
                        });
                        return;
                    }
                    // const domainCheck = domain === domainBinded;
                }
                else {
                    if (nameChecked && domainChecked) {
                        sendResponse({
                            ...errorHandler(0),
                            message: '',
                            detail: JSON.stringify({
                                name: keypairLoggedIn.name,
                                address: addressBinded,
                                publicKey: keypairLoggedIn.publicKey
                            })
                        });
                        return;
                    }
                }
            }

            const input = {
                appName,
                method: 'OPEN_PROMPT',
                // router: '#/login',
                chainId,
                hostname: domain,
                payload
            };
            this.openPrompt(sendResponse, input);
        });
    }

    /**
     * callAelfChain
     *
     * @param {Function} sendResponse sendResponse
     * @param {Object} callInfo callInfo
     *
    */
    static callAelfChain(sendResponse, callInfo) {
        console.log('>>>>>>>>>>>>>>>>>', sendResponse, callInfo);
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
     * @param {Object} options Contain sendResponse and contractInfo
     * @param {Function} callback callback function
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
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractInfo);
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
            const wallet = AElf.wallet.getWalletByPrivateKey(keypair.privateKey);
            dappAelfMeta.aelf.chain.contractAt(contractAddress, wallet, (error, contractMethods) => {
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

    // After initContract
    static getExistContractAbi(sendResponse, contractInfo) {
        this.checkSeed({sendResponse}, () => {
            const {payload, chainId, hostname} = contractInfo;
            const {
                contractName,
                method,
                contractAddress
            } = payload;

            const dappAelfMeta = aelfMeta.find(item => {
                const checkDomain = hostname === item.hostname;
                const checkChainId = item.chainId === chainId;
                return checkDomain && checkChainId;
            });

            console.log(dappAelfMeta);
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
                sendResponse({
                    ...errorHandler(0),
                    message: '',
                    detail: JSON.stringify(extendContract.contractMethods)
                });
            });
        });
    }

    static callAelfContractReadonly(sendResponse, contractInfo) {
        Background.callAelfContract(sendResponse, contractInfo, false, true);
    }

    static callAelfContractWithoutCheck(sendResponse, contractInfo) {
        Background.callAelfContract(sendResponse, contractInfo, false);
    }
    // static callAelfContractWithoutCheckReadonly(sendResponse, contractInfo) {
    //     Background.callAelfContract(sendResponse, contractInfo, false, true);
    // }

    static callAelfContract(sendResponse, contractInfo, checkWhitelist = true, readonly = false) {

        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {payload, chainId, hostname} = contractInfo;
            const {
                contractName,
                method,
                params,
                contractAddress
            } = payload;

            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            if (checkWhitelist) {
                const appPermissions = getApplicationPermssions(permissions, hostname);
                if (appPermissions.permissions.length && !contractWhitelistCheck({
                        sendResponse,
                        appPermissions,
                        contractAddress,
                        contractInfo,
                        method
                    })) {
                    contractInfo.keypairAddress = appPermissions.permissions[0].address;
                    Background.openPrompt(sendResponse, contractInfo);
                    return;
                }
            }

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
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', dappAelfMeta);
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
                    let contractMethod = readonly
                        ? extendContract.contractMethods[method].call
                        : extendContract.contractMethods[method];
                    contractMethod(...params, (error, result) => {
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

    static unlockWallet(sendResponse, _seed) {
        seed = _seed;
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            nightElf = NightElf.fromJson(nightElfObject);
            Background.checkTimingLock(sendResponse);
            sendResponse({
                ...errorHandler(0),
                nightElf: !!nightElf
            });
        });
    }

    static updateWallet(sendResponse) {
        // TODO: Check seed.
        console.log(sendResponse);
        if (nightElf && seed) {
            const nightElfEncrypto = AESEncrypt(JSON.stringify(nightElf), seed);
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

    // >>>>>>>>>>>>>>>>>>>>>>>>>
    // >  backup wallet start  >
    // >>>>>>>>>>>>>>>>>>>>>>>>>

    static backupWallet(sendResponse, _seed) {
        seed = _seed;
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const nightElfEncrypto = AESEncrypt(JSON.stringify(nightElf), seed);
            let blob = new Blob([nightElfEncrypto], {type: 'text/plain;charset=utf-8'});
            // let file = new File(
            //     [nightElfEncrypto],
            //     'NightELF_backup_file_' + SparkMD5.hash(nightElfEncrypto) + '.txt',
            //     {type: 'text/plain;charset=utf-8'}
            // );
            FileSaver.saveAs(blob, 'NightELF_backup_file_' + SparkMD5.hash(nightElfEncrypto) + '.txt');
            sendResponse({
                ...errorHandler(0)
            });
        });
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>
    // >   backup wallet end   >
    // >>>>>>>>>>>>>>>>>>>>>>>>>


    // >>>>>>>>>>>>>>>>>>>>>>>>>
    // >  import wallet start  >
    // >>>>>>>>>>>>>>>>>>>>>>>>>

    static importWallet(sendResponse, values) {
        const nightElfEncrypto = values.fileValue || null;
        let seed = values.seed || null;
        let noStorageMsg = '';
        let decryptoFailMsg = 'Document error or damaged';
        if (seed) {
            let nightElfString;
            if (nightElfEncrypto) {
                try {
                    nightElfString = JSON.parse(AESDecrypt(nightElfEncrypto, seed));
                }
                catch (e) {
                    sendResponse({
                        ...errorHandler(10000, 'Get Night Elf failed!')
                    });
                }

                if (nightElfString) {
                    apis.storage.local.set({
                        nightElfEncrypto
                    }, result => {
                        Background.unlockWallet(sendResponse, seed);
                        sendResponse({
                            ...errorHandler(0),
                            result
                        });
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
        }
    }


    // >>>>>>>>>>>>>>>>>>>>>>>>>
    // >   import wallet end   >
    // >>>>>>>>>>>>>>>>>>>>>>>>>

    // >>>>>>>>>>>>>>>>>>>>>>>>>
    // >   timing lock start   >
    // >>>>>>>>>>>>>>>>>>>>>>>>>

    static checkTimingLock(sendResponse) {
        if (inactivityInterval === 0) {
            return false;
        }
        if (timeoutLocker) {
            clearTimeout(timeoutLocker);
        }
        if (seed && nightElf) {
            timeoutLocker = setTimeout(() => {
                Background.lockWallet(sendResponse);
            }, inactivityInterval);
        }
    }

    static getTimingLock(sendResponse, time) {
        inactivityInterval = time || 0;
        apis.storage.local.set({
            inactivityInterval
        }, result => {
            sendResponse({
                ...errorHandler(0),
                result
            });
        });
    }

    static checkInactivityInterval(sendResponse) {
        apis.storage.local.get({
            inactivityInterval
        }, result => {
            console.log(result);
            sendResponse({
                ...errorHandler(0),
                result
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
            nightElfObject.keychain.permissions = nightElfObject.keychain.permissions.filter(item => {
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
                keypairs
            });
        });
    }

    // Depend on the hostname of the app and the address of user.
    // One Application - One Keypair
    // when login
    // setLoginPermission(sendResponse, permissionInput);
    // when set contract permissions
    // setContractPermission(sendResponse, permissionInput);
    // data demo
    // {
    //     "appName": {
    //         default: 'hzzTest',
    //         'zh-CN': 'xxx'
    //     },
    //     "domain": "OnlyForTest!!!",
    //     // address对应 登录权限。
    //     // 如果address为空，则无登录权限。
    //     "address": "ELF_5E85xxqccciycENmu4azsX47pyszNm2eZRGpWMQjfASuSZv",
    //     "contracts": []
    // }

    static setLoginPermission(sendResponse, permissionInput) {
        Background.setPermission(sendResponse, permissionInput, true);
    }

    static setContractPermission(sendResponse, permissionInput) {
        Background.setPermission(sendResponse, permissionInput, false);
    }

    static setPermission(sendResponse, permissionInput, bindKeypair = false) {
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
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {
                appName,
                domain,
                hostname,
                address,
                contracts
            } = permissionInput;
            const permissionNeedAdd = {
                appName,
                domain: domain || hostname,
                // address,
                contracts: formatContracts(contracts)
            };
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;
            const appPermissons = getApplicationPermssions(permissions, domain);
            let permissionIndex = appPermissons.indexList;
            const permissionsTemp = appPermissons.permissions;

            // set contract permission
            if (permissionsTemp.length) {
                // fix: permissionsTemp is Array
                permissionNeedAdd.address = permissionsTemp[0].address;
                nightElfObject.keychain.permissions[permissionIndex[0]] = permissionNeedAdd;
            }
            // Login
            else if (bindKeypair) {
                permissionNeedAdd.address = address;
                nightElfObject.keychain.permissions.unshift(permissionNeedAdd);
            }
            else {
                sendResponse({
                    ...errorHandler(200008)
                });
                return;
            }
            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    static setWhitelist(sendResponse, whitelistInput) {
        // setPermission first.
        // {
        //     appName: 'hzzTest',
        //     method: 'SET_WHITELIST',
        //     hostname: 'aelf.io',
        //     chainId: 'AELF',
        //     payload: {
        //         contractName: 'token',
        //         contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
        //         method: 'BalanceOf',
        //         params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB'],
        //         whitelist: {
        //             // transfer(a, b, c)
        //             // transfer(a, b, c, d) is not ok
        //             transfer: [{
        //                 value: 'a',
        //                 variable: true
        //             }, {
        //                 value: 'b',
        //                 variable: false
        //             }, {
        //                 value: 'c',
        //                 variable: true
        //             }]
        //         }
        //     }
        // }
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {domain, hostname, payload} = whitelistInput;
            const {
                contractAddress,
                whitelist
            } = payload;
            const domainTemp = domain || hostname;

            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            const appPermissons = getApplicationPermssions(permissions, domainTemp);

            const appPermissionIndex = appPermissons.indexList;
            const appPermissionsTemp = appPermissons.permissions;

            if (appPermissionsTemp.length && appPermissionIndex.length) {
                const permission = appPermissionsTemp[appPermissionIndex[0]];
                const {contracts} = permission;
                let indexTemp;
                const contract = contracts.filter((item, index) => {
                    if (item.contractAddress === contractAddress) {
                        indexTemp = index;
                        return true;
                    }
                    return false;
                })[0];
                contract.whitelist = {
                    ...contract.whitelist,
                    ...whitelist
                };
                contracts[indexTemp] = contract;
                permission.contracts = contracts;
                nightElfObject.keychain.permissions[appPermissionIndex[0]] = permission;
            }
            else {
                sendResponse({
                    ...errorHandler(200009)
                });
                return;
            }
            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

    static removeMethodsOfWhitelist(sendResponse, removeInfo) {
        // appName: 'hzzTest',
        // method: 'REMOVE_CONTRACT_PERMISSION',
        // chainId: 'AELF',
        // payload: {
        //     contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
        //     methods: ['BalanceOf', 'Transfer']
        // }
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            const {domain, hostname, payload} = removeInfo;
            const {contractAddress, methods} = payload;
            const appPermissions = getApplicationPermssions(permissions, domain || hostname);
            {
                const {permissions, indexList} = appPermissions;

                const contractsNew = permissions[0].contracts.map(contract => {
                    if (contract.contractAddress === contractAddress
                        && !!contract.whitelist) {
                        methods.map(method => {
                            delete contract.whitelist[method];
                        });
                    }
                    return contract;
                });

                nightElfObject.keychain.permissions[indexList[0]].contracts = contractsNew;
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
                        console.log(queryInfo);
                        const permissionsTemp = permissions.filter(permission => {
                            console.log(permission.domain, queryInfo.hostname);
                            const domainCheck = permission.domain === queryInfo.hostname;
                            console.log(domainCheck);
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
                permissions
            });
        });
    }

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

    static removeContractOfPermission(sendResponse, removeInfo, onlyWhitlist = false) {
        // {
        //     "appName": "hzzTest",
        //     "domain": "OnlyForTest!!!",
        //     "address": "ELF_YjPzUqeWxqNzzAJURHPsD1SVQFhG1VFKUG9UKauYFE3cFs",
        //     "contractAddress": "xxxx"
        // }
        this.checkSeed({sendResponse}, ({nightElfObject}) => {
            const {
                keychain: {
                    permissions = []
                }
            } = nightElfObject;

            const {domain, hostname, payload} = removeInfo;
            const {contractAddress} = payload;
            const appPermissions = getApplicationPermssions(permissions, domain || hostname);
            {
                const {permissions, indexList} = appPermissions;
                // permissions[0]
                const contractsNew = permissions[0].contracts.filter(item => {
                    if (item.contractAddress === contractAddress) {
                        return false;
                    }
                    return true;
                });
                nightElfObject.keychain.permissions[indexList[0]].contracts = contractsNew;
            }

            nightElf = NightElf.fromJson(nightElfObject);
            Background.updateWallet(sendResponse);
        });
    }

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
                        nightElfString = AESDecrypt(result.nightElfEncrypto, seed);
                    }
                    catch (e) {
                        sendResponse({
                            ...errorHandler(400001, 'Get Night Elf failed!')
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

    // TODO: need a prompt page. neet week.
    static getSignature(sendResponse, options) {
      this.checkSeed({
        sendResponse
      }, ({
        nightElfObject
      }) => {
        console.log('getSignature: ', nightElfObject, options);
        const {
          keychain: {
            keypairs = []
          }
        } = nightElfObject;

        const {
          address,
          hexToBeSign
        } = options;
        
        const keypair = keypairs.find(item => {
          return item.address === address
        });

        let signedMsgString;
        if (keypair) {
          const keypairAndUtils = AElf.wallet.ellipticEc.keyFromPrivate(keypair.privateKey);
          const signedMsgObject = keypairAndUtils.sign(hexToBeSign);
          signedMsgString = [
            signedMsgObject.r.toString(16, 64),
            signedMsgObject.s.toString(16, 64),
            `0${signedMsgObject.recoveryParam.toString()}`
          ].join('');
        }
        
        sendResponse({
          ...errorHandler(0),
          signature: signedMsgString
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
        console.log(message);
        const route = getPromptRoute(message);
        NotificationService.open({
            sendResponse,
            route,
            message
        });
    }

    // static setPrompt(sendResponse, notification) {
    //     prompt = notification;
    //     sendResponse(true);
    // }

    // static getPrompt(sendResponse) {
    //     sendResponse(prompt);
    // }

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
}

new Background();
