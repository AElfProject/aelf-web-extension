# SET_CONTRACT_PERMISSION / setContractPermission

```javascript
    aelf.setContractPermission({
        appName: 'test',
        hainId: 'AELF',
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
        console.log('>>>>>>>>>>>>>', result);
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
    //         },
    //         {
    //             chainId: 'AELF',
    //             contractAddress: 'TEST contractAddress',
    //             contractName: 'AAAA',
    //             description: 'contract description',
    //             github: ''
    //         }],
    //         domain: 'Dapp domain'
    //     }]
    // }
```