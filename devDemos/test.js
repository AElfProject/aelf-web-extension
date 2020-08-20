/**
 * @file testNew
 * @author huangzongzhe
 */
/* global NightElf */

// century renew blade meadow faith evil uniform work discover poet ripple drill

const tokenContractAddress = 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF';
// const testAddress = '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX';
const testAddress = '2QCkN89q5XdsGJXoiobuVGJQ5NHdFsUQVbY88rLKQb3S4hQHC2';

document.addEventListener('NightElf', result => {
    console.log(Date.now());
    console.log('NightElf test.html: ', result);

    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const lockBtn = document.getElementById('lock-btn');
    const getChainStatus = document.getElementById('get-chain-status');
    const callAelfChainBtn = document.getElementById('call-aelf-chain');
    const initAelfContract = document.getElementById('init-aelf-contract');
    const callAelfContract = document.getElementById('call-aelf-contract');
    const executeAelfContract = document.getElementById('execute-aelf-contract');
    const executeAelfContractDiffrentParam = document.getElementById('execute-aelf-contract-diff');
    const checkPermissionDefault = document.getElementById('check-permission-default');
    const checkPermissionAddress = document.getElementById('check-permission-address');
    const checkPermissionContractAddress = document.getElementById('check-permission-contract');
    const setPermission = document.getElementById('set-contract-permission');
    const removeContractPermission = document.getElementById('remove-contract-permission');
    const removeWhitelist = document.getElementById('remove-whitelist');
    // Login at first
    const aelf = new window.NightElf.AElf({
        // httpProvider: 'http://192.168.199.210:5000/chain',
        httpProvider: ['http://3.25.10.185:8000'],
        // httpProvider: ['http://1.119.195.50:11105/chain'],
        // httpProvider: ['http://1.119.195.50:11105/chain'],
        appName: 'your own app name',
        pure: true
    });
    console.log('aelf>>>>>>>>>>>', aelf);

    loginBtn.onclick = function () {
        // aelf.login({
        //     chainId: 'AELF',
        //     payload: {
        //         method: 'LOGIN',
        //         contracts: [{
        //             chainId: 'AELF',
        //             contractAddress: tokenContractAddress,
        //             contractName: 'token',
        //             description: 'token contract',
        //             github: ''
        //         }, {
        //             chainId: 'AELF TEST',
        //             contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
        //             contractName: 'TEST contractName',
        //             description: 'contract description',
        //             github: ''
        //         }]
        //     }
        // }, (error, result) => {
        //     console.log('login>>>>>>>>>>>>>>>>>>', result, JSON.stringify(result));
        // });

        aelf.login({
            chainId: 'AELF',
            payload: {
                method: 'LOGIN',
                // Please avoid add these in your new code
                // contracts: [{
                //     chainId: 'AELF',
                //     contractAddress: tokenContractAddress,
                //     contractName: 'token',
                //     description: 'token contract',
                //     github: ''
                // }, {
                //     chainId: 'AELF TEST',
                //     contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
                //     contractName: 'TEST contractName',
                //     description: 'contract description',
                //     github: ''
                // }]
            }
        }).then(result => {
            console.log('promise then', result);
        }).catch(error => {
            console.log('promise catch', error);
        });
    };

    logoutBtn.onclick = function () {
        aelf.logout({
            chainId: 'AELF',
            address: testAddress
        }, (error, result) => {
            console.log('logout>>>>>>>>>>>>>>>>>>', result);
        });
    };

    lockBtn.onclick = function () {
        aelf.lock({}, (error, result) => {
            console.log('lock>>>>>>>>>>>>>>>>>>', result);
        });
    };

    getChainStatus.onclick = function () {
        // If you unlock you night ELF
        // When you get the unlock prompt page, callback way will be influence.
        // You can not get callback in this demo.[Use callback && promise in the same time]
        // But if you use callback way only. It's ok.
        aelf.chain.getChainStatus((error, result) => {
            console.log('>>>>>>>>>>>>> getChainStatus callback >>>>>>>>>>>>>');
            console.log(error, result);
        });

        aelf.chain.getChainStatus().then(result => {
            console.log('>>>>>>>>>>>>> getChainStatus promise >>>>>>>>>>>>>');
            console.log('promise then', result);
        }).catch(error => {
            console.log('promise catch', error);
        });
    };

    setPermission.onclick = function () {
        aelf.setContractPermission({
            hainId: 'AELF',
            payload: {
                address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
                contracts: [{
                    chainId: 'AELF',
                    contractAddress: tokenContractAddress,
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

    callAelfChainBtn.onclick = function () {
        const txid = 'ff5bcd126f9b7f22bbfd0816324390776f10ccb3fe0690efc84c5fcf6bdd3fc6';
        aelf.chain.getTxResult(txid, (err, result) => {
            console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
            console.log(err, result);
        });
    };

    const getBlockByHeight = document.getElementById('get-block-by-height');
    getBlockByHeight.onclick = function () {
        aelf.chain.getBlockByHeight(66, true, (err, result) => {
            console.log('>>>>>>>>>>>>> getBlockInfo >>>>>>>>>>>>>');
            console.log(err, result);
        });
    };

    const getContractFileDescriptorSet = document.getElementById('get-contract-descriptor-set');
    getContractFileDescriptorSet.onclick = function () {
        aelf.chain.getContractFileDescriptorSet(
            'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM',
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

    removeContractPermission.onclick = function () {
        aelf.removeContractPermission({
            payload: {
                // contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb'
                contractAddress: tokenContractAddress
            }
        }, (error, result) => {
            console.log('removeContractPermission>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    removeWhitelist.onclick = function () {
        aelf.removeMethodsWhitelist({
            payload: {
                // contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
                // whitelist: ['Approve']
                contractAddress: tokenContractAddress,
                whitelist: ['Transfer']
            }
        }, (error, result) => {
            console.log('removeWhitelist>>>>>>>>>>>>>>>>>', result);
        });
    };

    /* global tokenC */
    window.tokenC = {};
    initAelfContract.onclick = function () {
        const wallet = {
            address: testAddress
            // address withoud permission
            // address: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
        };
        // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
        // There is only one value named address;
        aelf.chain.contractAt(
            tokenContractAddress,
            wallet,
            (error, result) => {
                console.log('>>>>>>>>>>>>> contractAt Async >>>>>>>>>>>>>');
                console.log(error, result);
                window.tokenC = result;
            }
        );
    };

    callAelfContract.onclick = function () {
        tokenC.GetBalance.call(
            {
                symbol: 'ELF',
                owner: testAddress
            },
            (err, result) => {
                console.log('>>>>>>>>>>>>>>>>>>>', err, result);
            }
        );
    };

    executeAelfContract.onclick = function () {
        tokenC.Transfer(
          {
              symbol: 'ELF',
              to: 'ELF_2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6_AELF',
              // to: 'ELF_2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX_AELF',
              amount: 1,
              memo: 'have fun'
          },
          (err, result) => {
              console.log('>>>>>>>>>>>>>>>>>>>',err, result);
          }
        );
    };

    executeAelfContractDiffrentParam.onclick = function () {
        tokenC.Transfer(
          {
              symbol: 'ELF',
              to: 'ELF_2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6_AELF',
              // to: 'ELF_2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX_AELF',
              amount: 2,
              memo: 'have fun'
          },
          (err, result) => {
              console.log('>>>>>>>>>>>>>>>>>>>', result);
          }
        );
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
            address: testAddress,
            type: 'address' // if you did not set type, it aways get by domain.
        }, (error, result) => {
            console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
        });
    };

    checkPermissionContractAddress.onclick = function () {
        aelf.checkPermission({
            appName: 'hzzTest',
            address: testAddress,
            contractAddress: tokenContractAddress,
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

    const getSignature = document.getElementById('get-signature');
    getSignature.onclick = function () {
      aelf.getSignature({
        appName: 'hzzTest',
        address: testAddress,
        // address: 'ELF_28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK_AELF',
        hexToBeSign: '2333'
      }).then(result => {
          console.log('result: ', result);
      });
    };

    const getAddressBtn = document.getElementById('get-address-btn');
    getAddressBtn.onclick = function () {
        aelf.getAddress({}, (error, result) => {
            console.log('getAddress>>>>>>>>>>>>>>>>>>', result);
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
});









