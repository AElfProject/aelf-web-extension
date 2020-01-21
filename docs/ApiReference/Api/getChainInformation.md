# GET_CHAIN_INFORMATION / getChainInformation

```javascript
    const aelf = new window.NightElf.AElf({
        // Enter your test address in this location
        httpProvider: [
            'https://127.0.0.1:8000/chain', // host
            null, // timeout
            null, // user
            null, // password
            // header
            [{
                name: 'Accept',
                value: 'text/plain;v=1.0'
            }]
        ],
        appName // your Dapp name
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
