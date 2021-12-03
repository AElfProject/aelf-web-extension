/**
 * @file dora demo
 * @author huangzongzhe
 */
/* global NightElf */

// JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE is Token contract in testnet.
const tokenContractAddress = 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF';
const voteContractAddress = 'GwsSp1MZPmkMvXdbfSCDydHhZtDpvqkFpmPvStYho288fb7QZ';
let testAddress = ''; // Login 后可以拿到地址

document.addEventListener('NightElf', result => {
    console.log(Date.now());
    console.log('NightElf demo.html: ', result);

    const versionBtn = document.getElementById('version-btn');
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
    const removeContractPermission = document.getElementById('remove-contract-permission');
    const removeWhitelist = document.getElementById('remove-whitelist');

    // Login at first
    const aelf = new window.NightElf.AElf({
        httpProvider: ['https://explorer-test.aelf.io/chain'],
        appName: 'Dora Demo',
        pure: true
    });
    console.log('aelf>>>>>>>>>>>', aelf);

    versionBtn.onclick = function () {
        console.log('version:' ,aelf.getVersion());
    };

    // 1. 未解锁，则解锁钱包；2. 选择对用账号登录 并 拿到地址信息，如果已登录，直接拿信息
    loginBtn.onclick = function () {
        aelf.login({
            chainId: 'AELF',
            payload: {
                method: 'LOGIN'
            }
        }).then(result => {
            console.log('promise then', result);
            // 保存一下现在登录的地址信息
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

    // 锁定钱包, 通过login方法可以解锁
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
        // Callback方式
        // aelf.chain.getChainStatus((error, result) => {
        //     console.log('>>>>>>>>>>>>> getChainStatus callback >>>>>>>>>>>>>');
        //     console.log(error, result);
        // });
        // Promise方式
        aelf.chain.getChainStatus().then(result => {
            console.log('>>>>>>>>>>>>> getChainStatus promise >>>>>>>>>>>>>');
            console.log('promise then', result);
        }).catch(error => {
            console.log('promise catch', error);
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

    /* global tokenC */
    /* Token合约调用示例 */
    window.tokenC = {};
    initAelfContract.onclick = async function () {
        const wallet = {
            address: testAddress
        };

        const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
        console.log('>>>>>>>>>>>>> contractAt Async >>>>>>>>>>>>>');
        console.log(tokenContract);
        window.tokenC = tokenContract;
        // Callback方式
        // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
        // There is only one value named address;
        // aelf.chain.contractAt(
        //     tokenContractAddress,
        //     wallet,
        //     (error, result) => {
        //         console.log('>>>>>>>>>>>>> contractAt Async >>>>>>>>>>>>>');
        //         console.log(error, result);
        //         window.tokenC = result;
        //     }
        // );
    };

    callAelfContract.onclick = async function () {
        await tokenC.GetBalance.call(
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

    const tokenApprove = document.getElementById('token-approve');
    tokenApprove.onclick = async function () {
        const result = await tokenC.Approve({
          symbol: 'ELF',
          spender: voteContractAddress,
          amount: 10
        });
        console.log('tokenApprove', result);
    };
    /* TokenC end */

    /* 二次方投票Demo start */
    // 如有修改，合约参数具体见链接
    // https://github.com/AElfProject/aelf-quadratic-funding-contract/blob/master/protobuf/quadratic_funding_contract.proto
    window.voteC = {};
    // const projectId = 3314598857287430700;
    const projectId = '3314598857287430430';
    const roundTemp = 1;
    const initVoteContract = document.getElementById('init-vote-contract');
    initVoteContract.onclick = async function () {
        const wallet = {address: testAddress};
        const voteContract = await aelf.chain.contractAt(voteContractAddress, wallet);
        console.log('>>>>>>>>>>>>> vote contractAt Async >>>>>>>>>>>>>');
        console.log(voteContract);
        window.voteC = voteContract;
    };

    const voteInitialize = document.getElementById('initialize-vote');
    voteInitialize.onclick = async function () {
       const result = await voteC.Initialize(
          {
              // owner: '默认sender',
              // voteSymbol: '默认ELF'
              // basicVotingUnit: 1, // 默认 一票 1_00000000
              // interval: '单位s, 默认60天'
              interval: 60 * 10
          }
        );
       console.log('voteInitialize result', result);
    };

    // 5.1 管理员方法
    const voteChangeOwner = document.getElementById('vote-change-owner');
    voteChangeOwner.onclick = async function () {
        const result = await voteC.ChangeOwner(testAddress);
        console.log('voteChangeOwner result', result);
    };

    const voteBanProject = document.getElementById('vote-ban-project');
    voteBanProject.onclick = async function () {
        const result = await voteC.BanProject({
            projectId: projectId, // 必须是当期项目
            ban: true, // true ban掉，false 捞回来
        });
        console.log('voteBanProject result', result);
    };
    const voteUnBanProject = document.getElementById('vote-un-ban-project');
    voteUnBanProject.onclick = async function () {
        const result = await voteC.BanProject({
            projectId: projectId, // 必须是当期项目
            ban: false, // true ban掉，false 捞回来
        });
        console.log('voteUnBanProject result', result);
    };

    const voteRoundStart = document.getElementById('vote-round-start');
    voteRoundStart.onclick = async function () {
        const result = await voteC.RoundStart();
        console.log('voteRoundStart result', result);
    };

    const voteRoundOver = document.getElementById('vote-round-over');
    voteRoundOver.onclick = async function () {
        const result = await voteC.RoundOver();
        console.log('voteRoundOver result', result);
    };

    // SetTaxPoint/SetInterval/SetVotingUnit 设置参数
    // await voteC.SetTaxPoint(point: number)

    const voteWithdraw = document.getElementById('vote-withdraw');
    voteWithdraw.onclick = async function () {
        const result = await voteC.Withdraw();
        console.log('voteWithdraw result', result);
    };

    // 5.2 普通方法
    const voteDonate = document.getElementById('vote-donate');
    voteDonate.onclick = async function () {
        const result = await voteC.Donate({
            value: 100000000
        });
        console.log('voteDonate result', result);
    };

    const voteUploadProject = document.getElementById('vote-upload-project');
    voteUploadProject.onclick = async function () {
        const result = await voteC.UploadProject();
        console.log('voteUploadProject result', result);
    };

    const voteVote = document.getElementById('vote-vote');
    voteVote.onclick = async function () {
        const result = await voteC.Vote({
            projectId,
            // votes: 10 * 100000000
            votes: 1
        });
        console.log('voteVote result', result);
    };

    const voteTakeOutGrants = document.getElementById('vote-take-out-grants');
    voteTakeOutGrants.onclick = async function () {
        const result = await voteC.TakeOutGrants({
            projectId,
            amount: 100000000 // 1.1 * 100000000 // 需要通过 GetGrantsOf 看看
        });
        console.log('voteTakeOutGrants result', result);
    };

    // 5.3 只读方法
    const voteGetCurrentRound = document.getElementById('vote-get-current-round');
    voteGetCurrentRound.onclick = async function () {
        const result = await voteC.GetCurrentRound.call();
        console.log('voteGetCurrentRound result', result);
    };

    const voteGetAllProjects = document.getElementById('vote-get-all-projects');
    voteGetAllProjects.onclick = async function () {
        const result = await voteC.GetAllProjects.call({
            value: roundTemp
        });
        console.log('voteGetAllProjects result', result);
    };
    const voteGetRankingList = document.getElementById('vote-get-ranking-list');
    voteGetRankingList.onclick = async function () {
        const result = await voteC.GetRankingList.call({
            value: roundTemp
        });
        console.log('voteGetRankingList result', result);
    };
    const voteGetPagedRankingList = document.getElementById('vote-get-paged-ranking-list');
    voteGetPagedRankingList.onclick = async function () {
        const result = await voteC.GetPagedRankingList.call({
            round: roundTemp,
            page: 0,
            size: 3
        });
        console.log('voteGetPagedRankingList result', result);
    };
    const voteGetRoundInfo = document.getElementById('vote-get-round-info');
    voteGetRoundInfo.onclick = async function () {
        const result = await voteC.GetRoundInfo.call({
            value: roundTemp
        });
        console.log('voteGetRoundInfo result', result);
    };

    const voteGetVotingCost = document.getElementById('vote-get-voting-cost');
    voteGetVotingCost.onclick = async function () {
        const result = await voteC.GetVotingCost.call({
            from: testAddress,
            projectId,
            votes: 1
        });
        console.log('voteGetVotingCost result', result, {
            from: testAddress,
            projectId,
            votes: 1
        });
    };

    const voteGetGrandsOf = document.getElementById('vote-get-grands-of');
    voteGetGrandsOf.onclick = async function () {
        const result = await voteC.GetGrandsOf.call({
            value: projectId
        });
        console.log('voteGetGrandsOf result', result);
    };
    const voteGetProjectOf = document.getElementById('vote-get-project-of');
    voteGetProjectOf.onclick = async function () {
        const result = await voteC.GetProjectOf.call({
            value: projectId
        });
        console.log('voteGetProjectOf result', result);
    };
    const voteCalculateProjectId = document.getElementById('vote-calculate-project-id');
    voteCalculateProjectId.onclick = async function () {
        const result = await voteC.CalculateProjectId.call(testAddress);
        console.log('voteCalculateProjectId result', result);
    };

    /* 二次方投票Demo end */


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
});









