# aelf-web-extension

## How to add Extension

download the code.

open development mode, add the directory /public.

webpack -w

[TODO] publish to chrome.

## How to use

### 1.CONNECT_AELF_CHAIN

You can see the demo ./devDemos/test.html. [demo.js just a draft]

The Methods calls are almost identical to the methods call of the aelf-sdk.js

```javascript
const aelf = new window.NightElf.AElf({
    httpProvider: 'http://192.168.199.210:5000/chain',
    appName: 'Test'
});
aelf.chain.connectChain((error, result) => {
    console.log('>>>>>>>>>>>>> connectChain >>>>>>>>>>>>>');
    console.log(error, result);
});
```

### 2.CALL_AELF_CHAIN

```javascript
const txid = 'c45edfcca86f4f528cd8e30634fa4ac53801aae05365cfefc3bfe9b652fe5768';
aelf.chain.getTxResult(txid, (err, result) => {
    console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
    console.log(err, result);
});
```

### 3.OPEN_PROMPT -> other method

```javascript
// TODO: param check
NightElf.api({
    appName: 'hzzTest',
    method: 'OPEN_PROMPT',
    chainId: 'AELF',
    hostname: 'aelf.io',
    payload: {
        method: 'SET_PERMISSION',
        // 在中间层会补齐
        // appName: 'hzzTest',
        // method 使用payload的
        // chainId: 'AELF',
        // hostname: 'aelf.io',
        payload: {
            // appName: message.appName,
            // domain: message.hostname
            address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
            contracts: [{
                chainId: 'AELF',
                contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
                contractName: 'token',
                description: 'token contract'
            }, {
                chainId: 'AELF TEST',
                contractAddress: 'TEST contractAddress',
                contractName: 'TEST contractName',
                description: 'contract description'
            }]
        }
    }
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
})
```

### 4.OPEN_PROMPT

```javascript
NightElf.api({
    appName: 'hzzTest',
    method: 'OPEN_PROMPT',
    chainId: 'AELF',
    hostname: 'aelf.io',
    route: '#/prompt',
    payload: {
        message: 'xxxxxxx'
    }
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
})
```

### 5.INIT_AELF_CONTRACT

```javascript
// In aelf-sdk.js wallet is the realy wallet.
// But in extension sdk, we just need the address of the wallet.
const tokenC;
const wallet = {
    address: 'ELF_YjPzUqeWxqNzzAJURHPsD1SVQFhG1VFKUG9UKauYFE3cFs'
};
// It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
// There is only one value named address;
aelf.chain.contractAtAsync(
    'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
    wallet,
    (error, result) => {
        console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
        console.log(error, result);
        tokenC = result;
    }
);
```

### 6.CALL_AELF_CONTRACT

```javascript
// tokenC from the contractAsync
tokenC.BalanceOf(
    'ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB',
    (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
    }
);
```

### 7.CHECK_PERMISSION

```javascript
NightElf.api({
    appName: 'hzzTest',
    method: 'CHECK_PERMISSION',
    // type: 'contract/address/domain(default)'
    type: 'address', // if you did not set type, it aways get by domain.
    address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK'
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
})
```

### 8.GET_ADDRESS

```javascript
NightElf.api({
    appName: 'hzzTest',
    method: 'GET_ADDRESS'
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
})
```

## Project Information

We use [eccryto](https://github.com/bitchan/eccrypto) to use public key to  encryt data and private key to decrypt data.

The eccryto wrap the elliptic.