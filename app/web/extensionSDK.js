import AElf from 'aelf-sdk';
class ExtensionSDK {
  constructor() {
    this.listener();
  }
  listener() {
    console.log('ExtensionSDK====listener');
    window.addEventListener('message', async function (event) {
      console.log(event, 'ExtensionSDK')
      if(event.data.event !== 'sandbox') return;
      event.source.window.postMessage(eval(event.data.data), event.origin);
    });
  }
}

new ExtensionSDK();
