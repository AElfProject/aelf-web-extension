# API Reference

## TODO

在之后的版本中我们会进行一些优化，请你时刻关注此文档。或移步到 [Feature & TODO](../Feature/Feature.md) 查看我们做了哪些改变。

## API

通过提供的API方法，你可以快速便捷的进行链上的一些操作，如转账，查询等操作。
而且我们提供了不同的调用方式，我们通过 GET_ADDRESS 为例：

1. aelf.< method name > 

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

2. window.NightElf.api({appName, < method name >}).then()

```javascript
    window.NightElf.api({
        appName: param.appName,
        method: 'GET_ADDRESS'
    }).then(result => {
       console.log('>>>>>>>>>>>>>>>>>>>', result);
    });
```

两种方法获取的值是相同的，但是我们更推荐你使用第一种方式。

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
