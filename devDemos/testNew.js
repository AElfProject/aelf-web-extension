/**
 * @file testNew
 * @author huangzongzhe
 */
/* global NightElf */

document.addEventListener('NightElf', result => {
    console.log(Date.now());
    console.log('NightElf test.html: ', result);
    const connectChainBtn = document.getElementById('connect-chain');
    const callAelfChainBtn = document.getElementById('call-aelf-chain');
    const openPrompt = document.getElementById('open-prompt');
    const initAelfContract = document.getElementById('init-aelf-contract');
    const callAelfContract = document.getElementById('call-aelf-contract');
    const checkPermissionDefault = document.getElementById('check-permission-default');
    const checkPermissionAddress = document.getElementById('check-permission-address');
    const checkPermissionContractAddress = document.getElementById('check-permission-contract');
    const getAddress = document.getElementById('get-address');


    NightElf.api({
        appName: 'hzzTest',
        method: 'LOGIN',
        payload: {

        }
    }).then(result => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
    });


    const checkContent = document.getElementById('check-content');
    checkContent.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_CONTENT'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    const aelf = new window.NightElf.AElf({
        httpProvider: 'http://192.168.197.70:8000/chain',
        appName: 'Test'
    });

    connectChainBtn.onclick = function () {
        aelf.chain.connectChain((error, result) => {
            console.log('>>>>>>>>>>>>> connectChain >>>>>>>>>>>>>');
            console.log(error, result);
        });
    };

    callAelfChainBtn.onclick = function () {
        const txid = 'c45edfcca86f4f528cd8e30634fa4ac53801aae05365cfefc3bfe9b652fe5768';
        aelf.chain.getTxResult(txid, (err, result) => {
            console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
            console.log(err, result);
        });
    };

    const getBlockInfo = document.getElementById('get-block-info');
    getBlockInfo.onclick = function () {
        aelf.chain.getBlockInfo(66, true, (err, result) => {
            console.log('>>>>>>>>>>>>> getBlockInfo >>>>>>>>>>>>>');
            console.log(err, result);
        });
    };

    const getContractAbi = document.getElementById('get-contract-abi');
    getContractAbi.onclick = function () {
        aelf.chain.getContractAbi(
            'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
            (err, result) => {
                console.log('>>>>>>>>>>>>>>>>>>>', result);
            }
        );
    };

    const sendTransaction = document.getElementById('send-transation');
    sendTransaction.onclick = function () {
        aelf.chain.sendTransaction({}, (err, result) => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    openPrompt.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'OPEN_PROMPT',
            chainId: 'AELF',
            hostname: 'aelf.io',
            payload: {
                method: 'SET_PERMISSION',
                // 在中间层会补齐
                // appName: 'hzzTest',
                // method 使用payload的
                // chainId: 'AELF',
                // hostname: 'aelf.io',
                payload: {
                    // appName: message.appName,
                    // domain: message.hostname
                    address: 'ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH',
                    contracts: [{
                        chainId: 'AELF',
                        contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
                        contractName: 'token',
                        description: 'token contract',
                        github: ''
                    }, {
                        chainId: 'AELF TEST',
                        contractAddress: 'TEST contractAddress',
                        contractName: 'TEST contractName',
                        description: 'contract description',
                        github: ''
                    }]
                }
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    const loginBtn = document.getElementById('login-btn');
    loginBtn.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'LOGIN',
            chainId: 'AELF',
            hostname: 'aelf.io',
            payload: {
                method: 'SET_PERMISSION',
                // 在中间层会补齐
                // appName: 'hzzTest',
                // method 使用payload的
                // chainId: 'AELF',
                // hostname: 'aelf.io',
                payload: {
                    // appName: message.appName,
                    // domain: message.hostname
                    address: 'ELF_YjPzUqeWxqNzzAJURHPsD1SVQFhG1VFKUG9UKauYFE3cFs',
                    contracts: [{
                        chainId: 'AELF',
                        contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
                        contractName: 'token',
                        description: 'token contract',
                        github: ''
                    }, {
                        chainId: 'AELF TEST',
                        contractAddress: 'TEST contractAddress',
                        contractName: 'TEST contractName',
                        description: 'contract description',
                        github: ''
                    }]
                }
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    let tokenC;
    initAelfContract.onclick = function () {
        const wallet = {
            address: 'ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH'
        };
        // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
        // There is only one value named address;
        aelf.chain.contractAtAsync(
            'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
            wallet,
            (error, result) => {
                console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
                console.log(error, result);
                tokenC = result;
            }
        );
    };

    callAelfContract.onclick = function () {
        tokenC.BalanceOf(
            'ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB',
            (err, result) => {
                console.log('>>>>>>>>>>>>>>>>>>>', result);
            }
        );
    };

    getAddress.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'GET_ADDRESS'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    // 根据hostname, address, contractAddress查询
    checkPermissionDefault.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    checkPermissionAddress.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            type: 'address', // if you did not set type, it aways get by domain.
            address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    checkPermissionContractAddress.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            type: 'contract', // if you did not set type, it aways get by domain.
            contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    const illegalMethod = document.getElementById('error-illegal-method');
    illegalMethod.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'GET_ADDRESS233'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    const errorGetTxResult = document.getElementById('error-get-tx-result');
    errorGetTxResult.onclick = function () {
        aelf.chain.getTxResult('');
    };

<<<<<<< HEAD

    const applicationLogin = document.getElementById('application-login');
    applicationLogin.onclick = function () {
        NightElf.api({
            appName: 'AELF-VOTE',
            method: 'OPEN_LOGIN_KEYPAIR',
            chainId: 'AELF',
            hostname: 'aelf.io'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
            console.log('=======================');
            console.log('      虽然很不想承认      ');
            console.log('  但是这个功能怎的没做完   ');
            console.log('=======================');
        });
    };
=======
    // can not use
    const setWhitelist = document.getElementById('set-whitelist');
    setWhitelist.onclick = function () {
        // 必须先登录并且授权合约使用。
        NightElf.api({
            appName: 'hzzTest',
            method: 'SET_WHITELIST',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                contractName: 'token',
                contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
                method: 'BalanceOf',
                params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB'],
                whitelist: {
                    // transfer(a, b, c)
                    // transfer(a, b, c, d) is not ok
                    transfer: [{
                        value: 'a',
                        variable: true
                    }, {
                        value: 'b',
                        variable: false
                    }, {
                        value: 'c',
                        variable: true
                    }]
                }
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };
    // For test
    // const permissionIndex = [0];
    // const permissionsTemp = [{
    //     "appName": "hzzTest",
    //     "domain": "OnlyForTest!!!",
    //     "address": "ELF_4yCJfobjm2YAdxGrwACQihpa3TMz1prDTdYiWTvFTvefQFs",
    //     "contracts": [{
    //             "chainId": "AELF",
    //             "contractAddress": "ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx",
    //             "contractName": "token",
    //             "description": "token contract",
    //             "github": ""
    //         },
    //         {
    //             "chainId": "AELF TEST",
    //             "contractAddress": "TEST contractAddress",
    //             "contractName": "TEST contractName",
    //             "description": "contract description",
    //             "github": ""
    //         }
    //     ]
    // }];
>>>>>>> 5d7898bfc809b235e264ec77e4d644a79f11a48d

});
if (false) {
    const aelf = new window.NightElf.AElf({
        httpProvider: 'http://192.168.199.210:5000/chain',
        appName: 'Test'
    });
    aelf.chain.connectChain((error, result) => {
        console.log('>>>>>>>>>>>>> connectChain >>>>>>>>>>>>>');
        console.log(error, result);
    });
    aelf.chain.getBlockInfo(66, true, (err, result) => {
        console.log('>>>>>>>>>>>>> getBlockInfo >>>>>>>>>>>>>');
        console.log(err, result);
    });

    aelf.chain.getBlockHeight((err, result) => {
        console.log('>>>>>>>>>>>>> getBlockHeight >>>>>>>>>>>>>');
        console.log(err, result);
    });

    const txid = 'c45edfcca86f4f528cd8e30634fa4ac53801aae05365cfefc3bfe9b652fe5768';
    aelf.chain.getTxResult(txid, (err, result) => {
        console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
        console.log(err, result);
    });

    const blockHash = '3b25b2369282a21e37d86020322e11665d3e0dce0ab08399029f5118f2778b5c';
    aelf.chain.getTxsResult(blockHash, 0, 10, (err, result) => {
        console.log('>>>>>>>>>>>>> getTxsResult >>>>>>>>>>>>>');
        console.log(err, result);
    });

    aelf.chain.sendTransaction('rawtx', (err, result) => {
        console.log('>>>>>>>>>>>>> sendTransaction >>>>>>>>>>>>>');
        console.log(err, result);
    });

    const wallet = {
        address: 'ELF_YjPzUqeWxqNzzAJURHPsD1SVQFhG1VFKUG9UKauYFE3cFs'
    };
    // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
    // There is only one value named address;
    let tokenC;
    aelf.chain.contractAtAsync(
        'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
        wallet,
        (error, result) => {
            console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
            console.log(error, result);
            tokenC = result;
        }
    );

}
