/**
 * @file InternalMessageTypes.js
 * @author huangzongzhe
 */

export const SET_SEED = 'setSeed';
export const LOGIN = 'login';


export const CREAT_WALLET = 'createWallet';
export const CHECK_WALLET = 'checkWallet';
export const CLEAR_WALLET = 'clearWallet';
export const UNLOCK_WALLET = 'unlockWallet';
export const LOCK_WALLET = 'lockWallet';
export const UPDATE_WALLET = 'updateWallet';

// backup wallet
export const BACKUP_WALLET = 'backupWallet';
export const IMPORT_WALLET = 'importWallet';

// Timing Lock
export const GET_TIMING_LOCK = 'getTimingLock';
export const CHECK_INACTIVITY_INTERVAL =  'checkInactivityInterval';

export const INSERT_KEYPAIR = 'insertKeypair';
export const REMOVE_KEYPAIR = 'removeKeypair';
export const GET_KEYPAIR = 'getKeypair';

export const SET_PERMISSION = 'setPermission';
export const SET_LOGIN_PERMISSION = 'setLoginPermission';
export const SET_CONTRACT_PERMISSION = 'setContractPermission';
export const CHECK_PERMISSION = 'checkPermission';
export const GET_ALLPERMISSIONS = 'getAllPermissions';
export const REMOVE_PERMISSION = 'removePermission';
export const REMOVE_CONTRACT_PERMISSION = 'removeContractInPermission';

export const SET_WHITELIST = 'setWhitelist';
export const REMOVE_METHODS_WHITELIST = 'removeMethodsOfWhitelist';

export const GET_CHAIN_STATUS = 'getChainStatus';
export const CALL_AELF_CHAIN = 'callAelfChain';
export const RELEASE_AELF_CHAIN = 'releaseAelfContract'; // TODO:

export const INIT_AELF_CONTRACT = 'initAelfContract';
export const CALL_AELF_CONTRACT = 'callAelfContract';
export const CALL_AELF_CONTRACT_READONLY = 'callAelfContractReadonly';
export const CALL_AELF_CONTRACT_WITHOUT_CHECK = 'callAelfContractWithoutCheck';
export const GET_CONTRACT_ABI = 'getExistContractAbi';
export const RELEASE_AELF_CONTRACT = 'releaseAelfContract'; // TODO:

export const INIT_CROSS_INSTANCE = 'initCrossInstance';
export const CROSS_SEND = 'crossSend';
export const CROSS_SEND_WITHOUT_CHECK = 'crossSendWithoutCheck';
export const CROSS_RECEIVE = 'crossReceive';
export const CROSS_RECEIVE_WITHOUT_CHECK = 'crossReceiveWithoutCheck';

export const GET_ADDRESS = 'getAddress';
export const GET_SIGNATURE = 'getSignature';

export const OPEN_PROMPT = 'openPrompt';
// export const SET_PROMPT = 'setPrompt';
// export const GET_PROMPT = 'getPrompt';

export const OPEN_LOGIN_KEYPAIR = 'openLoginKeypairs';

export const GET_CHAIN_INFO = 'getChainInfo';
export const UPDATE_CHAIN_INFO = 'updateChainInfo';



