# API Reference

## API

Through the API methods, you can quickly and conveniently perform some operations on the chain, such as transfers and queries. We also provide different calling methods. We use GET_ADDRESS as an example:

### aelf.[$MethodName] [Recommend]

```javascript

    aelf.getAddress({
        appName: 'test'
    }, (error, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
    });

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

### window.NightElf.api({appName, $MethodName}).then()

```javascript
    window.NightElf.api({
        appName: param.appName,
        method: 'GET_ADDRESS'
    }).then(result => {
       console.log('>>>>>>>>>>>>>>>>>>>', result);
    });
```

We can get the same result by the two above methods, but we recommend that you use the first method.

## Quick link

[GET_CHAIN_INFORMATION / getChainInformation](Api/getChainInformation.md)

[CALL_AELF_CHAIN](Api/callAElfChain.md)

[LOGIN / login](Api/login.md)

[INIT_AELF_CONTRACT / contractAtAsync](Api/contractAtAsync.md)

[CALL_AELF_CONTRACT](Api/callAElfContract.md)

[CALL_AELF_CONTRACT_READONLY](Api/callAElfContractReadonly.md)

[CHECK_PERMISSION / checkPermission](Api/checkPermission.md) 

[GET_ADDRESS / getAddress](Api/getAddress.md)

[SET_CONTRACT_PERMISSION / setContractPermission](Api/setContractPermission.md)

[REMOVE_CONTRACT_PERMISSION / removeContractPermission](Api/removeContractPermission.md)

[REMOVE_METHODS_WHITELIST / removeMethodsWhitelist](Api/removeMethodsWhitelist.md)
