import AElf from 'aelf-sdk';
import * as InternalMessageTypes from './messages/InternalMessageTypes';
class ExtensionSDK {
  constructor() {
    this.listener();
  }
  listener() {
    window.addEventListener('message', async function (event) {
      // if(event.data.event !== 'sandbox') return;
      if(event.data.event === InternalMessageTypes.CALL_AELF_CONTRACT) {
        const aelf = new AElf(
          new AElf.providers.HttpProvider("https://explorer-test.aelf.io/chain")
        );
        const wallet = AElf.wallet.getWalletByPrivateKey(
          "00000000000"
        );
        const WHITELIST_CONTRACT = "2ZUgaDqWSh4aJ5s5Ker2tRczhJSNep4bVVfrRBRJTRQdMTbA5W";
        const whitelist = await aelf.chain.contractAt(WHITELIST_CONTRACT, wallet);
        console.log(whitelist, 'whitelist===backg');
        event.source.window.postMessage(eval('1+40'), event.origin);
      }
    });
  }
}

new ExtensionSDK();
