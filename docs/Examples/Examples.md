# Examples

## What happens when I call the API

your Dapp -> Connect -> aelf-sdk.js -> sign

## How to Make Transactions on AELF Via NightELF

```javascript
    //Please make sure your NightELF has been added into your Windows
    const aelf = new window.NightElf.AElf({
        // Enter your test address in this location
        httpProvider: [
            'https://127.0.0.1:8000/chain', // host
            null, // timeout
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

    // Note: wallet.address is your authorized account address
    const wallet = {
        address: '2J...du'
    }

    // multitokenContract is where to save contract methods
    let multitokenContract = null;

    // We also need to confirm that we can connect to the chain normally
    // Note：This step is necessary
    aelf.chain.getChainInformation((error, result) => {
        console.log('>>>>>>>>>>>>> getChainInformation >>>>>>>>>>>>>');
        console.log(error, result);
        if (result && result.error === 0) {

            // When we authorize the Dapp: if we need to use Transfer for transactions, we need to authorize the Token with the MultiToken contract.
            // At this step, NightELF will pop up to prompt login, if there is no keypair in NightELF, it will remind you to add keypair to NightELF
            // If you already have a keypair and pass the authorization, you can go to the application management page in NightELF to view the authorization details

            aelf.login({
                appName: 'test', // Your Dapp name
                chainId: 'AELF',
                payload: {
                    method: 'LOGIN',
                    contracts: [{
                        chainId: 'AELF',
                        contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
                        contractName: 'MultiToken',
                        description: 'MultiToken Contract',
                        github: ''
                    }]
                }
            }, (error, result) => {
                console.log('login>>>>>>>>>>>>>>>>>>', result);
                if (result && result.error === 0) {

                     aelf.chain.contractAtAsync(
                        '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
                        wallet,
                        (error, result) => {
                            console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
                            console.log(error, result);

                            multitokenContract = result;
                            const payload = {
                                to: '6W...FH' // To receiver
                                symbol: 'ELF' // token type
                                amount: 100  // Amount
                            }
                            multitokenContract.Transfer(payload, (error, result) => {
                                console.log('>>>>>>>>>>>>> Transfer >>>>>>>>>>>>>');
                                console.log(result);
                            })
                        }
                    );
                }
            });
        }
    });
```

Then, a transaction will be made on NightELF.

## How to know which account authorized your Dapp

If the current keypair in NightELF authorizes you, you can query which account authorized your Dapp through the return value of ```aelf.login```

```javascript
    aelf.login({
        appName: 'test', // You Dapp name
        chainId: 'AELF',
        payload: {
            method: 'LOGIN', 
            contracts: [{
                chainId: 'AELF',
                contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
                contractName: 'MultiToken',
                description: 'MultiToken Contract',
                github: ''
            }]
        }
    }, (error, result) => {})
    // You can get the currently authorized account address via detail
    //    result = {
    //    detail: "{"address":"6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH"}"
    //    error: 0
    //    errorMessage: ""
    //    from: "contentNightElf"
    //    message: ""
    //    sid: "207752940259029992581493"
    // }
```
