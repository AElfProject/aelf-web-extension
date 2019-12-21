# LOGIN / login

```javascript
    aelf.login({
        appName: 'test',
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
    //         appName: 'test',
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