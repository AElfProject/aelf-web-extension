# aelf-web-extension

## How to add Extension

### Normal user

https://chrome.google.com/webstore/category/extensions

search: aelf-web-extension or Night Elf

### Developers

download the code.

webpack -w

open development mode, add the directory /public.

## How to use

### 1.GET_CHAIN_INFORMATION

You can see the demo [./devDemos/test.html](https://github.com/hzz780/aelf-web-extension/tree/1.0/devDemos). [demo.js just a draft]

If you want to check Token transfer Demo.
You can [click here](https://github.com/hzz780/aelf-web-extension/tree/1.0/demo/token)

The Methods calls are almost identical to the methods call of the aelf-sdk.js

Note: ``` '...' ``` stands for omitted data.

```javascript
const aelf = new window.NightElf.AElf({
    httpProvider: 'http://192.168.199.210:5000/chain',
    appName: 'Test'
});
aelf.chain.getChainInformation((error, result) => {
    console.log('>>>>>>>>>>>>> connectChain >>>>>>>>>>>>>');
    console.log(error, result);
});

// result = {
//     ChainId: "AELF"
//     GenesisContractAddress: "61W3AF3Voud7cLY2mejzRuZ4WEN8mrDMioA9kZv3H8taKxF"
// }
```

### 2.CALL_AELF_CHAIN

```javascript
const txid = 'c45edfcca86f4f528cd8e30634fa4ac53801aae05365cfefc3bfe9b652fe5768';
aelf.chain.getTxResult(txid, (err, result) => {
    console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
    console.log(err, result);
});

// result = {
//     Status: "NotExisted"
//     TransactionId: "ff5bcd126f9b7f22bbfd0816324390776f10ccb3fe0690efc84c5fcf6bdd3fc6"
// }
//
```

### 3. LOGIN

```javascript
    NightElf.api({
    appName: 'hzzTest',
    // domain: 'aelf.io', // auto
    method: 'LOGIN',
    chainId: 'AELF',
    payload: {
        payload: {
            // appName: message.appName,
            // domain: message.hostname
            method: 'LOGIN',
            contracts: [{
                chainId: 'AELF',
                contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
                contractName: 'token',
                description: 'token contract',
                github: ''
            }]
        }
    }
    }).then(result => {
        console.log('>>>>>>> login >>>>>>>>>>>>', result);
        // write project logic
    });

// keychain = {
//     keypairs: {
//         name: 'your keypairs name',
//         address: 'your keypairs address',
//         mnemonic: 'your keypairs mnemonic',
//         privateKey: 'your keypairs privateKey'，
//         publicKey: {
//             x: 'f79c25eb......',
//             y: '7fa959ed......'
//         }
//     },
//     permissions: [{
//         appName: 'hzzTest',
//         address: 'your keyparis address',
//         contracts: [{
//             chainId: 'AELF',
//             contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
//             contractName: 'token',
//             description: 'token contract',
//             github: ''
//         }],
//         domain: 'Dapp domain'
//     }]
// }
```

### 4.OPEN_PROMPT -> other method (SET_CONTRACT_PERMISSION)

```javascript
// TODO: param check
NightElf.api({
    appName: 'hzzTest',
    method: 'OPEN_PROMPT',
    chainId: 'AELF',
    hostname: 'aelf.io',
    payload: {
        method: 'SET_CONTRACT_PERMISSION',
        // 在中间层会补齐
        // appName: 'hzzTest',
        // method 使用payload的
        // chainId: 'AELF',
        // hostname: 'aelf.io',
        payload: {
            // appName: message.appName,
            // domain: message.hostname
            address: '4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
            contracts: [{
                chainId: 'AELF',
                contractAddress: '4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
                contractName: 'token',
                description: 'token contract',
                github: ''
            }, {
                chainId: 'AELF TEST',
                contractAddress: 'TEST contractAddress',
                contractName: 'TEST contractName',
                description: 'contract description',
                github: ''
            }]
        }
    }
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
});


// keychain = {
//     keypairs: {...},
//     permissions: [{
//         appName: 'hzzTest',
//         address: 'your keyparis address',
//         contracts: [{
//             chainId: 'AELF',
//             contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
//             contractName: 'token',
//             description: 'token contract',
//             github: ''
//         },
//         {
//             chainId: 'AELF TEST',
//             contractAddress: 'TEST contractAddress',
//             contractName: 'TEST contractName',
//             description: 'contract description',
//             github: ''
//         }],
//         domain: 'Dapp domain'
//     }]
// }
```

### 5.OPEN_PROMPT

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
});

// you can open a new extension window.

```

### 6.INIT_AELF_CONTRACT

```javascript
// In aelf-sdk.js wallet is the realy wallet.
// But in extension sdk, we just need the address of the wallet.
const tokenContract;
const wallet = {
    address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu'
};
// It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
// There is only one value named address;
aelf.chain.contractAtAsync(
    '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
    wallet,
    (error, result) => {
        console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
        console.log(error, result);
        tokenContract = result;
    }
);

// result = {
//     Approve: ƒ (),
//     Burn: ƒ (),
//     ChargeTransactionFees: ƒ (),
//     ClaimTransactionFees: ƒ (),
//     ....
// }
```

### 7.CALL_AELF_CONTRACT / CALL_AELF_CONTRACT_READONLY

```javascript
// tokenContract from the contractAsync
    tokenContract.GetBalance.call(
        {
            symbol: 'AELF',
            owner: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
        },
        (err, result) => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        }
    );

    tokenContract.Approve(
        {
            symbol: 'AELF',
            spender: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
            amount: '100'
        },
        (err, result) => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        }
    );

// If you use tokenContract.GetBalance.call  this method is only applicable to queries that do not require extended authorization validation.(CALL_AELF_CONTRACT_READONLY)
// If you use tokenContract.Approve this requires extended authorization validation (CALL_AELF_CONTRACT)

// tokenContract.GetBalance.call(payload, (error, result) => {})
// result = {
//     symbol: "AELF",
//     owner: "65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9",
//     balance: 0
// }
```

### 8.CHECK_PERMISSION

```javascript
NightElf.api({
    appName: 'hzzTest',
    method: 'CHECK_PERMISSION',
    // type: 'contract/address/domain(default)'
    type: 'address', // if you did not set type, it aways get by domain.
    address: '4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK'
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
})

// result = {
//     ...,
//     permissions:[
//         {
//             address: '...',
//             appName: 'hzzTest',
//             contracts: [{
//                 chainId: 'AELF',
//                 contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
//                 contractName: 'token',
//                 description: 'token contract',
//                 github: ''
//             },
//             {
//                 chainId: 'AELF TEST',
//                 contractAddress: 'TEST contractAddress',
//                 contractName: 'TEST contractName',
//                 description: 'contract description',
//                 github: ''
//             }],
//             domian: 'Dapp domain'
//         }
//     ]
// }
```

### 9.GET_ADDRESS

```javascript
NightElf.api({
    appName: 'hzzTest',
    method: 'GET_ADDRESS'
}).then(result => {
    console.log('>>>>>>>>>>>>>>>>>>>', result);
})

// result = {
//     ...,
//     addressList: [
//         {
//             address: '...',
//             name: '...',
//             publicKey: {
//                 x: '...',
//                 y: '...'
//             }
//         }
//     ]
// }

```

### 10.REMOVE_CONTRACT_PERMISSION

```javascript
    NightElf.api({
        appName: 'hzzTest',
        method: 'REMOVE_CONTRACT_PERMISSION',
        chainId: 'AELF',
        payload: {
            contractAddress: 'TEST contractAddress'
        }
    });

// keychain = {
//     keypairs: {...},
//     permissions: [{
//         appName: 'hzzTest',
//         address: 'your keyparis address',
//         contracts: [{
//             chainId: 'AELF',
//             contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
//             contractName: 'token',
//             description: 'token contract',
//             github: ''
//         }],
//         domain: 'Dapp domain'
//     }]
// }

```

### 11. SET_WHITELIST

```javascript
    NightElf.api({
        appName: 'hzzTest',
        method: 'SET_WHITELIST',
        chainId: 'AELF',
        payload: {
            contractAddress: '4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
            methods: ['test']
        }
    }).then(result => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
    });

// keychain = {
//     keypairs: {...},
//     permissions: [{
//         appName: 'hzzTest',
//         address: 'your keyparis address',
//         contracts: [{
//             chainId: 'AELF',
//             contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
//             contractName: 'token',
//             description: 'token contract',
//             github: '',
//             whitelist: {
//                 test: {...}
//             }
//         }],
//         domain: 'Dapp domain'
//     }]
// }

```

### 12.REMOVE_METHODS_WHITELIST

```javascript
    NightElf.api({
        appName: 'hzzTest',
        method: 'REMOVE_METHODS_WHITELIST',
        chainId: 'AELF',
        payload: {
            contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
            methods: ['test']
        }
    }).then(result => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
    });

// keychain = {
//     keypairs: {...},
//     permissions: [{
//         appName: 'hzzTest',
//         address: 'your keyparis address',
//         contracts: [{
//             chainId: 'AELF',
//             contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
//             contractName: 'token',
//             description: 'token contract',
//             github: '',
//             whitelist: {}
//         }],
//         domain: 'Dapp domain'
//     }]
// }
```

## Project Information

We use [ECDH](https://github.com/indutny/elliptic) to use public key to  encryt data and private key to decrypt data.