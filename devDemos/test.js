/**
 * @file test.js
 * @author huangzongzhe
 */
/* globals NightElf */
console.log(Date.now());
document.addEventListener('NightElf', result => {

    console.log(Date.now());

    console.log('NightElf test.html: ', result);
    const connectChainBtn = document.getElementById('connect-chain');
    const callAelfChainBtn = document.getElementById('call-aelf-chain');
    const openPrompt = document.getElementById('open-prompt');
    const initAelfContract = document.getElementById('init-aelf-contract');
    const callAelfContract = document.getElementById('call-aelf-contract');
    const checkPermission = document.getElementById('check-permission');
    const getAddress = document.getElementById('get-address');
    connectChainBtn.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CONNECT_AELF_CHAIN',
            hostname: 'aelf.io', // TODO: 这个需要content.js 主动获取
            payload: {
                httpProvider: 'http://localhost:1234/chain'
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    callAelfChainBtn.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CALL_AELF_CHAIN',
            chainId: 'AELF',
            hostname: 'aelf.io',
            payload: {
                method: 'getTxResult',
                params: ['5feb4d3175b4144e54f5f4d0a12b19559633a2aede0e87dc42322efe1aac12c9']
            }
        }).then(result => {
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
                    address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
                    contracts: [{
                        chainId: 'AELF',
                        contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
                        contractName: 'token',
                        description: 'token contract'
                    }, {
                        chainId: 'AELF TEST',
                        contractAddress: 'TEST contractAddress',
                        contractName: 'TEST contractName',
                        description: 'contract description'
                    }]
                }
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    initAelfContract.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'INIT_AELF_CONTRACT',
            // hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
                contractName: 'token',
                contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx'
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    callAelfContract.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CALL_AELF_CONTRACT',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                contractName: 'token',
                method: 'BalanceOf',
                params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    checkPermission.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };

    getAddress.onclick = function () {
        NightElf.api({
            appName: 'hzzTest',
            method: 'GET_ADDRESS'
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
        });
    };
});