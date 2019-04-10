/**
 * @file testNew
 * @author huangzongzhe
 */
/* global NightElf */


document.addEventListener('NightElf', result => {
    console.log(Date.now());
    console.log('NightElf test.html: ', result);
    const getChainInformation = document.getElementById('get-chain-information');
    const callAelfChainBtn = document.getElementById('call-aelf-chain');
    const initAelfContract = document.getElementById('init-aelf-contract');
    const callAelfContract = document.getElementById('call-aelf-contract');
    const checkPermissionDefault = document.getElementById('check-permission-default');
    const checkPermissionAddress = document.getElementById('check-permission-address');
    const checkPermissionContractAddress = document.getElementById('check-permission-contract');
    const getAddress = document.getElementById('get-address');
    const setPermission = document.getElementById('set-contract-permission');
    const removeContractPermission = document.getElementById('remove-contract-permission');
    const removeWhitelist = document.getElementById('remove-whitelist');
    // Login at first
    // NightElf.api({
    //     appName: 'hzzTest',
    //     // domain: 'aelf.io', // auto
    //     method: 'LOGIN',
    //     chainId: 'AELF',
    //     payload: {
    //         payload: {
    //             // appName: message.appName,
    //             // domain: message.hostname
    //             method: 'LOGIN',
    //             contracts: [{
    //                 chainId: 'AELF',
    //                 contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
    //                 contractName: 'token',
    //                 description: 'token contract',
    //                 github: ''
    //             }, {
    //                 chainId: 'AELF TEST',
    //                 contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
    //                 contractName: 'TEST contractName',
    //                 description: 'contract description',
    //                 github: ''
    //             }]
    //         }
    //     }
    // }).then(result => {
    //     console.log('>>>>>>> login >>>>>>>>>>>>', result);
    //     // write project logic
    // });

    const aelf = new window.NightElf.AElf({
        // httpProvider: 'http://192.168.199.210:5000/chain',
        httpProvider: 'http://192.168.197.56:8101/chain',
        // httpProvider: 'http://192.168.197.70:8000/chain',
        appName: 'Test'
    });
    console.log('aelf>>>>>>>>>>>', aelf);
    aelf.login({
        appName: 'hzzTest',
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


    // just for fun
    const checkContent = document.getElementById('check-content');
    checkContent.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_CONTENT'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    getChainInformation.onclick = function () {
        aelf.chain.getChainInformation((error, result) => {
            console.log('>>>>>>>>>>>>> getChainInformation >>>>>>>>>>>>>');
            console.log(error, result);
        });
    };

    callAelfChainBtn.onclick = function () {
        const txid = 'ff5bcd126f9b7f22bbfd0816324390776f10ccb3fe0690efc84c5fcf6bdd3fc6';
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

    const getFileDescriptorSet = document.getElementById('get-file-descriptor-set');
    getFileDescriptorSet.onclick = function () {
        aelf.chain.getFileDescriptorSet(
            '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
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

    const openPrompt = document.getElementById('open-prompt');
    openPrompt.onclick = function () {
        // NightElf.api({
        //     appName: 'hzzTest',
        //     method: 'OPEN_PROMPT',
        //     chainId: 'AELF',
        //     payload: {
        //         method: 'LOGIN',
        //         appName: 'hzzTest'
                // 在中间层会补齐
                // appName: 'hzzTest',
                // method 使用payload的
                // chainId: 'AELF',
                // hostname: 'aelf.io',
                // payload: {
                //     contractName: 'token',
                //     contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
                //     method: 'BalanceOf',
                //     params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB'],
                //     whitelist: {
                //         // transfer(a, b, c)
                //         // transfer(a, b, c, d) is not ok
                //         transfer: [{
                //             value: 'a',
                //             variable: true
                //         }, {
                //             value: 'b',
                //             variable: false
                //         }, {
                //             value: 'c',
                //             variable: true
                //         }],
                //         test: [{}],
                //         hzz780: [{}]
                //     }
                // }
            // }
        // }).then(result => {
        //     console.log('>>>>>>>>>>>>>>>>>>>', result);
        // });
    };

    const loginBtn = document.getElementById('login-btn');
    loginBtn.onclick = function () {
        aelf.login({
            appName: 'hzzTest',
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
    };

    removeContractPermission.onclick = function () {
        aelf.removeContractPermission({
            payload: {
                contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb'
            }
        }, (error, result) => {
            console.log('removeContractPermission>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    removeWhitelist.onclick = function () {
        aelf.removeMethodsWhitelist({
            payload: {
                contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
                whitelist: ['Approve']
            }
        }, (error, result) => {
            console.log('removeWhitelist>>>>>>>>>>>>>>>>>', result);
        });
    };

    setPermission.onclick = function () {
        aelf.setContractPermission({
            appName: 'hzzTest',
            hainId: 'AELF',
            payload: {
                address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
                contracts: [{
                    chainId: 'AELF',
                    contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
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
        }, (error, result) => {
            console.log('>>>>>>>>>>>>>', result);
        });
    };

    /* global tokenC */
    window.tokenC = {};
    initAelfContract.onclick = function () {
        const wallet = {
            address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu'
            // address withoud permission
            // address: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
        };
        // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
        // There is only one value named address;
        aelf.chain.contractAtAsync(
            '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
            wallet,
            (error, result) => {
                console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
                console.log(error, result);
                window.tokenC = result;
            }
        );
    };

    callAelfContract.onclick = function () {
        tokenC.GetBalance.call(
            {
                symbol: 'AELF',
                owner: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
            },
            (err, result) => {
                console.log('>>>>>>>>>>>>>>>>>>>', result);
            }
        );
    };

    getAddress.onclick = function () {
        aelf.getAddress({
            appName: 'hzzTest'
        }, (error, result) => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    // 根据hostname, address, contractAddress查询
    // checkPermissionDefault.onclick = function () {
    //     NightElf.api({
    //         appName: 'hzzTest',
    //         method: 'CHECK_PERMISSION',
    //         address: 'ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH'
    //     }).then(result => {
    //         console.log('>>>>>>>>>>>>>>>>>>>', result);
    //     });
    // };

    checkPermissionDefault.onclick = function () {
        aelf.checkPermission({
            appName: 'hzzTest',
            address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu'
        }, (error, result) => {
            console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
        });
    };

    checkPermissionAddress.onclick = function () {
        aelf.checkPermission({
            appName: 'hzzTest',
            address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
            type: 'address' // if you did not set type, it aways get by domain.
        }, (error, result) => {
            console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
        });
    };

    checkPermissionContractAddress.onclick = function () {
        aelf.checkPermission({
            appName: 'hzzTest',
            address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
            contractAddress: '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc',
            type: 'contract' // if you did not set type, it aways get by domain.
        }, (error, result) => {
            console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
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

    // CALL_AELF_CONTRACT_WITHOUT_CHECK
    // NightElf.api({
    //     appName: 'hzzTest',
    //     // method: 'CALL_AELF_CONTRACT',
    //     method: 'CALL_AELF_CONTRACT_WITHOUT_CHECK',
    //     hostname: 'aelf.io',
    //     chainId: 'AELF',
    //     payload: {
    //         contractName: 'token',
    //         contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
    //         method: 'BalanceOf',
    //         params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
    //     }
    // }).then(result => {
    //     console.log('>>>>>>>>>>>>>>>>>>>', result);
    // });
    if (false) {
        NightElf.api({
            appName: 'hzzTest',
            method: 'REMOVE_CONTRACT_PERMISSION',
            chainId: 'AELF',
            payload: {
                contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
                removeList: ['xxx', 'xxx']
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });

        NightElf.api({
            appName: 'hzzTest',
            method: 'SET_WHITELIST',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                contractName: 'token',
                contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
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
                    }],
                    test: [{}],
                    hzz780: [{}]
                }
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });

        NightElf.api({
            appName: 'hzzTest',
            method: 'REMOVE_METHODS_WHITELIST',
            chainId: 'AELF',
            payload: {
                contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
                methods: ['test', 'hzz780']
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });

        // CALL_AELF_CONTRACT_WITHOUT_CHECK
        NightElf.api({
            appName: 'hzzTest',
            // method: 'CALL_AELF_CONTRACT',
            method: 'GET_CONTRACT_ABI',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                contractName: 'token',
                contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
                method: 'BalanceOf',
                params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    }

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








