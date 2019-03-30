/**
 * @file tokenDemo.js
 * @author zhouminghui
 * @description How to use the plugin for token transfer
*/

const tokenAddress = '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc';
const wallet1 = {
    address: '28kDK2xgK3qkMeTzxTpRYmHi4PqMRKRgRjsUnEy8J1AE5wz'
};
const wallet2 = {
    address: '21zGCU6gcDRnsB4z31nKQ4k1K6soJJGecoCYcN7DzLNq5RQ'
};
const appName = 'tokenTest';

window.tokenContract = {};

document.addEventListener('NightElf', result => {
    console.log(Date.now());
    console.log('NightElf test.html: ', result);
    const getChainInformation = document.getElementById('get-chain-information');
    // const balanceNum = document.getElementById('balance-num');
    const account1 = document.getElementById('account-1');
    const account2 = document.getElementById('account-2');
    const address1 = document.getElementById('address1');
    const address2 = document.getElementById('address2');
    const confirm = document.getElementById('confirm');
    window.NightElf.api({
        appName,
        method: 'LOGIN',
        chainId: 'AELF',
        payload: {
            payload: {
                method: 'LOGIN',
                contracts: [{
                    chainId: 'AELF',
                    contractAddress: tokenAddress,
                    contractName: 'token',
                    description: 'token contract',
                    github: ''
                }]
            }
        }
    }).then(result => {
        console.log('>>>>>>> login >>>>>>>>>>>>', result);
        // write project logic
    });

    const aelf = new window.NightElf.AElf({
        // Enter your test address in this location
        httpProvider: 'http://192.168.197.56:8101/chain',
        appName
    });

    getChainInformation.onclick = function () {
        aelf.chain.getChainInformation((error, result) => {
            console.log('>>>>>>>>>>>>> getChainInformation >>>>>>>>>>>>>');
            console.log(error, result);
        });
    };

    // getBalance.onclick = function () {
    //     aelf.chain.contractAtAsync(
    //         tokenAddress,
    //         wallet,
    //         (error, result) => {
    //             console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
    //             console.log(error, result);
    //             window.tokenContract = result;
    //         }
    //     );
    // };

    const getYourBalance = () => {
        const payload1 = {
            symbol: 'ELF',
            owner: wallet1.address
        };

        const payload2 = {
            symbol: 'ELF',
            owner: wallet2.address
        };

        window.tokenContract.GetBalance.call(payload1, (error, result) => {
            // If you use a framework like react, this process will become easier
            if (result) {
                const balance = document.createTextNode(result.balance);
                const address = document.createTextNode(wallet1.address);
                account1.appendChild(balance);
                address1.appendChild(address);
            }
        });

        window.tokenContract.GetBalance.call(payload2, (error, result) => {
            // If you use a framework like react, this process will become easier
            if (result) {
                const balance = document.createTextNode(result.balance);
                const address = document.createTextNode(wallet2.address);
                account2.appendChild(balance);
                address2.appendChild(address);
            }
        });
    };

    // First make sure you are connected to the chain
    aelf.chain.getChainInformation((error, result) => {
        console.log('>>>>>>>>>>>>> getChainInformation >>>>>>>>>>>>>');
        console.log(error, result);
        if (result) {
            // TODO: Browser extensions need to be optimized
            setTimeout(() => {
                aelf.chain.contractAtAsync(
                    tokenAddress,
                    wallet1,
                    (error, result) => {
                        console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
                        console.log(error, result);
                        window.tokenContract = result;
                        if (result) {
                            getYourBalance();
                        }
                    }
                );
            });
        }
    });

    const number = document.getElementById('number');
    const address = document.getElementById('address');
    confirm.onclick = () => {
        const amount = number.value;
        const to = address.value;
        const payload = {
            to,
            amount,
            symbol: 'ELF',
            memo: ''
        };
        window.tokenContract.Transfer(payload, (error, result) => {
            console.log(result);
            if (result) {
                setTimeout(() => {
                    getYourBalance();
                }, 4000);
            }
        });
    };


});
