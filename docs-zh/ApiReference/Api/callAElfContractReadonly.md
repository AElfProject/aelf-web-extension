# CALL_AELF_CONTRACT_READONLY

```javascript
    tokenContract.GetBalance.call(
        {
            symbol: 'AELF',
            owner: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
        },
        (err, result) => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        }
    );

    // result = {
    //     symbol: "AELF",
    //     owner: "65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9",
    //     balance: 0
    // }
```