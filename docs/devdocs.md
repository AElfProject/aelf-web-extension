# Dev document

## 1 Download

[release version, please waiting](devdocs.md)

[dev version](https://chrome.google.com/webstore/detail/aelf-explorer-extension-d/mlmlhipeonlflbcclinpbmcjdnpnmkpf)

## 2 Preparation

### 2.1 Interaction Flow

* 1.Make sure the user get the Extension
* 2.Connect the blockchain
* 3.Initialize contract / Call the methods of the blockchain
* 4.Call the methods of contract 

### 2.2 Demo of Checking the Extension

```javascript
let nightElfInstance = null;
class NightElfCheck {
    constructor() {
        const readyMessage = 'NightElf is ready';
        let resovleTemp = null;
        this.check = new Promise((resolve, reject) => {
            if (window.NightElf) {
                resolve(readyMessage);
            }
            setTimeout(() => {
                reject({
                    error: 200001,
                    message: 'timeout / can not find NightElf / please install the extension'
                });
            }, 1000);
            resovleTemp = resolve;
        });
        document.addEventListener('NightElf', result => {
            console.log('test.js check the status of extension named nightElf: ', result);
            resovleTemp(readyMessage);
        });
    }
    static getInstance() {
        if (!nightElfInstance) {
            nightElfInstance = new NightElfCheck();
            return nightElfInstance;
        }
        return nightElfInstance;
    }
}
const nightElfCheck = NightElfCheck.getInstance();
nightElfCheck.check.then(message => {
    // connectChain -> Login -> initContract -> call contract methods
});
```

### 2.3 How Connect the blockchain

```javascript
const aelf = new window.NightElf.AElf({
    httpProvider: [
        'http://127.0.0.1:8101',
    ],
    appName: 'your own app name'
});
```

### 2.4 How to call the API

Callback or promise are both ok.

```javascript
// callback
aelf.chain.getChainStatus((error, result) => {
    console.log('>>>>>>>>>>>>> getChainStatus >>>>>>>>>>>>>');
    console.log(error, result);
});

// promise
aelf.chain.getChainStatus().then(result => {
    console.log('>>>>>>>>>>>>> getChainStatus >>>>>>>>>>>>>');
    console.log('promise then', result);
}).catch(error => {
    console.log('promise catch', error);
});
```

## 3 API Reference

Here you can find examples and in-depth information about NightELF's API.

You can see the demo code. [click here](https://github.com/AElfProject/aelf-web-extension/blob/master/devDemos/test.html)

If you want to check token transfer demo. [click here](https://github.com/AElfProject/aelf-web-extension/blob/master/demo/token/demo.html)

The methods act the same as the methods of the aelf-sdk.js

* [1. LOGIN](devdocs.md#login)
* [2. GET\_CHAIN\_STATUS](devdocs.md#get-chain-status)
* [3. CALL\_AELF\_CHAIN](devdocs.md#call-aelf-chain)
* [4. INIT\_AELF\_CONTRACT](devdocs.md#init-aelf-contract)
* [5. CALL\_AELF\_CONTRACT / CALL\_AELF\_CONTRACT\_READONLY](devdocs.md#call-aelf-contract)
* [6. CHECK\_PERMISSION](devdocs.md#check-permission)
* [7. SET\_CONTRACT\_PERMISSION](devdocs.md#set-contract-permission)
* [8. REMOVE\_CONTRACT\_PERMISSION](devdocs.md#remove-contract-permission)
* [9. REMOVE\_METHODS\_WHITELIST](devdocs.md#remove-methods-whitelist)
* [10. GET\_SIGNATURE](devdocs.md#get-signature)

### 3.1 LOGIN

LOGIN allows your application to request permission to interact with a user's NightELF and be provided with an account of the user's choosing.

```javascript
aelf.login({
    chainId: 'AELF',
    payload: {
        method: 'LOGIN',
        contracts: [{
            chainId: 'AELF',
            contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
            contractName: 'token',
            description: 'token contract',
            github: ''
        }, {
            chainId: 'AELF TEST',
            contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
            contractName: 'TEST contractName',
            description: 'contract description',
            github: ''
        }]
    }
}, (error, result) => {
    console.log('login>>>>>>>>>>>>>>>>>>', result);
});

// result = {
//     "error": 0,
//     "errorMessage": "",
//     "message": "",
//     "detail": {
//         "name": "your name",
//         "address": "2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6",
//         "publicKey": {
//             "x": "4958d5c48f003c771769f4a31413cd18053516615cbde502441af8452fb53441",
//             "y": "a80cc48a7f3b0f2552fd030cacbe9012ba055a3d553b70003f2e637d55fa0f23"
//         }
//     },
//     "sid": "350815427961739930163684",
//     "from": "contentNightElf"
// }

// the data in the extension
// keychain = {
//     keypairs: [{
//         name: 'your keypairs name',
//         address: 'your keypairs address',
//         mnemonic: 'your keypairs mnemonic',
//         privateKey: 'your keypairs privateKey'，
//         publicKey: {
//             x: 'f79c25eb......',
//             y: '7fa959ed......'
//         }
//     }],
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

### 3.2 GET\_CHAIN\_STATUS

```javascript
aelf.chain.getChainStatus((error, result) => {
    console.log('>>>>>>>>>>>>> connectChain >>>>>>>>>>>>>');
    console.log(error, result);
});
```

### 3.3 CALL\_AELF\_CHAIN

```javascript
// this txid is an example.
const txid = 'c45edfcca86f4f528cd8e30634fa4ac53801aae05365cfefc3bfe9b652fe5768';
aelf.chain.getTxResult(txid, (err, result) => {
    console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
    console.log(err, result);
});

// result = {
//     Status: "NotExisted"
//     TransactionId: "c45edfcca86f4f528cd8e30634fa4ac53801aae05365cfefc3bfe9b652fe5768"
//     ....
// }
```

### 3.4 INIT\_AELF\_CONTRACT

```javascript
// In aelf-sdk.js wallet is the realy wallet.
// But in extension sdk, we just need the address of the wallet.
const wallet = {
    address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu'
};
// It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
// There is only one value named address;
aelf.chain.contractAt(
    '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
    wallet,
    (error, result) => {
        console.log('>>>>>>>>>>>>> contractAt >>>>>>>>>>>>>');
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

### 3.5 CALL\_AELF\_CONTRACT / CALL\_AELF\_CONTRACT\_READONLY

```javascript
// tokenContract from the pre step.
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

### 3.6 CHECK\_PERMISSION

CHECK\_PERMISSION returns the contracts your can use with the address.

```javascript
aelf.checkPermission({
    type: 'address', // if you did not set type, it aways get by domain.
    address: '4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK'
}, (error, result) => {
    console.log('>>>>>>>>>>>>>', error, result);
});

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

### 3.7 SET\_CONTRACT\_PERMISSION

SET\_CONTRACT\_PERMISSION applies to the users to allow the Dapp use the contract.

```javascript
aelf.setContractPermission({
    chainId: 'AELF',
    payload: {
        address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
        contracts: [{
            chainId: 'AELF',
            contractAddress: 'TEST contractAddress',
            contractName: 'AAAA',
            description: 'contract description',
            github: ''
        }]
    }
}, (error, result) => {
    console.log('>>>>>>>>>>>>>', error, result);
});
```

### 3.8 REMOVE\_CONTRACT\_PERMISSION

```javascript
aelf.removeContractPermission({
    chainId: 'AELF',
    payload: {
        contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb'
    }
}, (error, result) => {
    console.log('>>>>>>>>>>>>>', error, result);
});
```

### 3.9 REMOVE\_METHODS\_WHITELIST

```javascript
aelf.removeMethodsWhitelist({
    chainId: 'AELF',
    payload: {
        contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
        whitelist: ['Approve']
    }
}, (error, result) => {
    console.log('removeWhitelist>>>>>>>>>>>>>>>>>', result);
});
```

### 3.10 GET\_SIGNATURE

```javascript
aelf.getSignature({
    address: 'address',
    hexToBeSign: 'hexToBeSign'
}).then(result => {
  // ...
}).cathc(error => {
  // ...
});
```

## 4.For Extension Developers

### 4.1. Download the code

```bash
git clone https://github.com/AElfProject/aelf-web-extension.git
```

### 4.2 Install dependent

```bash
    npm install
```

### 4.3 Run webpack

```bash
    npm run none
    npm run none:watch
    npm run dev
    npm run dev:watch
    npm run pro
    npm run pro:watch
```

### 4.4 Add to the browser

```bash
    open development mode, add the webpack output app/public.
```

### 4.5 How to publish to chrome

zip app/public to public.zip, and follow the notes.

### 4.6 Can not use crx

You can not install the extension from an offline crx if Chrome &gt;= 73.

Please import the `.zip file` with developer mode.

## 5 Formatted Data Example

```javascript
    NightElf = {
        histories: [],
        keychain: {
            keypairs: [
                {
                    name: 'your keypairs name',
                    address: 'your keypairs address',
                    mnemonic: 'your keypairs mnemonic',
                    privateKey: 'your keupairs privateKey',
                    publicKey: {
                        x: 'you keupairs publicKey',
                        y: 'you keupairs publicKey'
                    }
                }
            ],
            permissions: [
                {
                    chainId: 'AELF',
                    contractAddress: 'contract address',
                    contractName: 'contract name',
                    description: 'contract description',
                    github: 'contract github',
                    whitelist: {
                        Approve: {
                            parameter1: 'a',
                            parameter2: 'b',
                            parameter3: 'c'
                        }
                    }
                }
            ]
        }
    }
```

