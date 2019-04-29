# REMOVE_METHODS_WHITELIST / removeMethodsWhitelist

```javascript
    aelf.removeMethodsWhitelist({
        appName: 'test',
        chainId: 'AELF',
        payload: {
            contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
            whitelist: ['Approve']
        }
    }, (error, result) => {
        console.log('removeWhitelist>>>>>>>>>>>>>>>>>', result);
    });
    // keychain = {
    //     keypairs: {...},
    //     permissions: [{
    //         appName: 'test',
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