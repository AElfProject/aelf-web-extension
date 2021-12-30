/**
 * @file testNew
 * @author huangzongzhe
 */
/* global NightElf */
const tokenContractAddress = 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF';

let testAddress = '2KJdMz5ErfufahhgQ4uYtT8fF7ztZQcRro83KmYhi15J1BpAZ1';

document.addEventListener('NightElf', result => {
    console.log(Date.now());
    console.log('NightElf test.html: ', result);

    const versionBtn = document.getElementById('version-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const lockBtn = document.getElementById('lock-btn');
    const getChainStatus = document.getElementById('get-chain-status');
    const callAelfChainBtn = document.getElementById('call-aelf-chain');
    const initAelfContract = document.getElementById('init-aelf-contract');
    const callAelfContract = document.getElementById('call-aelf-contract');
    const executeAelfContract = document.getElementById('execute-aelf-contract');

    /* 1. Methods for account */
    // Login at first
    const aelf = new window.NightElf.AElf({
        httpProvider: ['https://explorer.aelf.io/chain'],
        appName: 'your own app name',
        pure: true
    });
    console.log('aelf>>>>>>>>>>>', aelf);

    versionBtn.onclick = function () {
        console.log('version:' ,aelf.getVersion());
    };

    loginBtn.onclick = function () {
        aelf.login({
            chainId: 'AELF',
            payload: {
                method: 'LOGIN',
            }
        }).then(result => {
            console.log('promise then', result);
            testAddress = JSON.parse(result.detail).address;
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

    /* 2. Methods for Chain */
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


    callAelfChainBtn.onclick = function () {
        const txid = 'ff5bcd126f9b7f22bbfd0816324390776f10ccb3fe0690efc84c5fcf6bdd3fc6';
        aelf.chain.getTxResult(txid, (err, result) => {
            console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
            console.log(err, result);
        });
    };

    /* 3. Methods for Contract */
    window.tokenC = {};
    initAelfContract.onclick = function () {
        const wallet = {
            address: testAddress
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
              // to: 'ELF_2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6_AELF',
              to: 'ELF_2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX_AELF',
              amount: 1,
              memo: 'have fun'
          },
          (err, result) => {
              console.log('>>>>>>>>>>>>>>>>>>>',err, result);
          }
        );
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

});
