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

export const CONNECT_AELF_CHAIN = 'connectAelfChain';
export const CALL_AELF_CHAIN = 'callAelfChain';
export const RELEASE_AELF_CHAIN = 'releaseAelfContract'; // TODO:

export const INIT_AELF_CONTRACT = 'initAelfContract';
export const CALL_AELF_CONTRACT = 'callAelfContract';
export const CALL_AELF_CONTRACT_WITHOUT_CHECK = 'callAelfContractWithoutCheck';
export const RELEASE_AELF_CONTRACT = 'releaseAelfContract'; // TODO:

export const GET_ADDRESS = 'getAddress';

export const OPEN_PROMPT = 'openPrompt';
export const SET_PROMPT = 'setPrompt';
export const GET_PROMPT = 'getPrompt';



