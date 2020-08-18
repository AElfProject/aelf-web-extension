/**
 * @file inject.js
 * @author huangzongzhe
 * only for browser
 */
import IdGenerator from './utils/IdGenerator';
import EncryptedStream from './utils/EncryptedStream';
import * as PageContentTags from './messages/PageContentTags';
import extractArgumentsIntoObject from './utils/extractArgumentsIntoObject';

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

// TODO: if return unlock, re call the method.
// Just a wrap of the api of the extension for developers.
class NightAElf {
  constructor(options) {
    this.httpProvider = options.httpProvider;
    this.appName = options.appName;
    this.chain = this.chain();
    this.chainId;
    // Todo: resultOnly: true/false for polyfill
  }

  callbackWrap(result, callback = () => {}) {
    if (result.result && result.result.hasOwnProperty('error') && result.result.hasOwnProperty('errorMessage')) {
      callback(null, result.result);
      return result.result;
    }
    callback(null, result);
    return result;
  }

  callAElfChain(methodName, params, callback) {
    return window.NightElf.api({
      appName: this.appName,
      method: 'CALL_AELF_CHAIN',
      chainId: this.chainId,
      payload: {
        method: methodName,
        params: params // Array
      }
    }).then(result => {
      if (result.error === 300000) {
        return this.callAElfChain(methodName, params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  login(params, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      chainId: params.chainId,
      method: 'LOGIN',
      payload: {
        payload: params.payload
      }
    }).then(result => {
      if (result.error === 300000) {
        return this.login(params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  logout(params, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      chainId: params.chainId,
      address: params.address,
      method: 'REMOVE_PERMISSION',
      payload: {
        payload: params.payload
      }
    }).then(result => {
      if (result.error === 300000) {
        return this.logout(params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  lock(params = {}, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      chainId: params.chainId || this.chainId,
      method: 'LOCK_WALLET',
      payload: {}
    }).then(result => {
      return this.callbackWrap(result, callback);
    });
  }

  checkPermission(params, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      method: 'CHECK_PERMISSION',
      address: params.address,
      type: params.type || '',
      contractAddress: params.contractAddress || ''
    }).then(result => {
      if (result.error === 300000) {
        return this.checkPermission(params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  setContractPermission(params, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      method: 'OPEN_PROMPT',
      chainId: params.chainId,
      payload: {
        method: 'SET_CONTRACT_PERMISSION',
        payload: params.payload
      }
    }).then(result => {
      if (result.error === 300000) {
        return this.setContractPermission(params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  removeContractPermission(params, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      method: 'REMOVE_CONTRACT_PERMISSION',
      payload: params.payload
    }).then(result => {
      if (result.error === 300000) {
        return this.removeContractPermission(params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  removeMethodsWhitelist(params, callback) {
    return window.NightElf.api({
      appName: params.appName || this.appName,
      chainId: params.chainId,
      method: 'REMOVE_METHODS_WHITELIST',
      payload: params.payload
    }).then(result => {
      if (result.error === 300000) {
        return this.removeMethodsWhitelist(params, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  getAddress(param, callback) {
    return window.NightElf.api({
      appName: param.appName || this.appName,
      method: 'GET_ADDRESS'
    }).then(result => {
      if (result.error === 300000) {
        return this.getAddress(param, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  getSignature(param, callback) {
    return window.NightElf.api({
      appName: param.appName || this.appName,
      address: param.address,
      hexToBeSign: param.hexToBeSign,
      method: 'GET_SIGNATURE'
    }).then(result => {
      if (result.error === 300000) {
        return this.getSignature(param, callback);
      }
      return this.callbackWrap(result, callback);
    });
  }

  chain() {
    const getChainStatus = callback => {
      return window.NightElf.api({
        appName: this.appName,
        method: 'GET_CHAIN_STATUS',
        payload: {
          httpProvider: this.httpProvider
        }
      }).then(result => {
        if (!result.error) {
          this.chainId = result.result.ChainId;
        }

        if (result.error === 300000) {
          return getChainStatus(callback);
        }

        return this.callbackWrap(result, callback);
      });
    };

    const getChainState = (blockHash, callback) => {
      return this.callAElfChain('getChainState', [blockHash], callback);
    };

    const getBlockHeight = callback => {
      return this.callAElfChain('getBlockHeight', [], callback);
    };

    const getContractFileDescriptorSet = (address, callback) => {
      return this.callAElfChain('getContractFileDescriptorSet', [address], callback);
    };

    const getBlock = (blockHash, includeTxs, callback) => {
      return this.callAElfChain(
        'getBlock',
        [blockHash, includeTxs],
        callback
      );
    };
    const getBlockByHeight = (blockHeight, includeTxs, callback) => {
      return this.callAElfChain(
        'getBlockByHeight',
        [blockHeight, includeTxs],
        callback
      );
    };

    const getTxResult = (txhash, callback) => {
      return this.callAElfChain('getTxResult', [txhash], callback);
    };

    const getTxResults = (blockhash, offset, num, callback) => {
      return this.callAElfChain(
        'getTxResults',
        [blockhash, offset, num],
        callback
      );
    };

    const getTransactionPoolStatus = callback => {
      return this.callAElfChain('getTransactionPoolStatus', [], callback);
    };

    const sendTransaction = (rawtx, callback) => {
      return this.callAElfChain('sendTransaction', [rawtx], callback);
    };

    const sendTransactions = (rawtx, callback) => {
      return this.callAElfChain('sendTransactions', [rawtx], callback);
    };

    const callReadOnly = (rawtx, callback) => {
      return this.callAElfChain('callReadOnly', [rawtx], callback);
    };

    const _callAelfContract = (params, methodName, contractAddress, method) => {
      let paramsTemp = Array.from(params); // [...params];

      const filterParams = paramsTemp.filter(function (arg) {
        return !(typeof arg === 'function') && !(typeof arg === 'boolean')
      });

      const {
        callback
      } = extractArgumentsIntoObject(paramsTemp);

      return window.NightElf.api({
        appName: this.appName,
        method: methodName,
        chainId: this.chainId,
        payload: {
          contractName: contractAddress || 'From Extension',
          contractAddress: contractAddress,
          method: method,
          // params: paramsTemp
          params: filterParams
        }
      }).then(result => {
        if (result.error === 300000) {
          return _callAelfContract(params, methodName, contractAddress, method);
        }

        return this.callbackWrap(result, callback);
      });
    };

    const contractAt = (contractAddress, wallet, ...otherArgsArray) => {
      const {
        callback
        // isSync 在插件中被禁止使用
      } = extractArgumentsIntoObject(otherArgsArray);

      return window.NightElf.api({
        appName: this.appName,
        method: 'INIT_AELF_CONTRACT',
        chainId: this.chainId,
        payload: {
          address: wallet.address,
          // contractName: 'EXTENSION',
          contractName: contractAddress || 'EXTENSION',
          contractAddress: contractAddress
        }
      }).then(result => {
        if (result.error === 300000) {
          return contractAt(contractAddress, wallet, ...otherArgsArray);
        }

        if (result.error) {
          callback(result.error, result);
          if (callback.length) {
            throw result;
          }
        }

        const message = JSON.parse(result.message);

        let contractMethods = {};
        message.services.map(item => {
          const methods = Object.keys(item.methods);
          methods.map(item => {
            contractMethods[item] = (...params) => {
              return _callAelfContract(params, 'CALL_AELF_CONTRACT', contractAddress, item);
            };
            contractMethods[item].call = (...params) => {
              return _callAelfContract(params, 'CALL_AELF_CONTRACT_READONLY', contractAddress, item);
            };
          });
        });
        callback(null, contractMethods);
        return contractMethods;
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
      callReadOnly,
      getTxResult,
      getTxResults,
      getTransactionPoolStatus,
      sendTransaction,
      sendTransactions,
      // contractAtAsync,
      contractAt
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
