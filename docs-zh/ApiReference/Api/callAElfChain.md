# CALL_AELF_CHAIN

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
```