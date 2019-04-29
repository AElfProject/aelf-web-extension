# INIT_AELF_CONTRACT / contractAtAsync

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