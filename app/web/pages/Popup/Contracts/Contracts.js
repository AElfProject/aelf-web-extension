/**
 * @file Lock.js
 * @author huangzongzhe
 */

import React, {
    Component
} from 'react';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

function setPermission(permission) {
    InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, permission)
        .send()
        .then(result => {
            console.log(InternalMessageTypes.SET_PERMISSION, result);
            if (result.error === 0) {} else {
                // Toast.fail(result.message, 3, () => {}, false);
            }
        });
}

export default class Contracts extends Component {

    callAelfChain() {
        const chainInfo = {
            appName: 'hzzTest',
            method: 'CALL_AELF_CHAIN',
            chainId: 'AELF',
            hostname: 'aelf.io',
            payload: {
                method: 'getTxResult',
                params: ['5feb4d3175b4144e54f5f4d0a12b19559633a2aede0e87dc42322efe1aac12c9']
            }
        };
        InternalMessage.payload(InternalMessageTypes.CALL_AELF_CHAIN, chainInfo)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.CALL_AELF_CHAIN, result);
                if (result.error === 0) {} else {
                    // Toast.fail(result.message, 3, () => { }, false);
                }
            });
    }

    initAelfContract() {
        const contractInfo = {
            appName: 'hzzTest',
            method: 'INIT_AELF_CONTRACT',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
                contractName: 'token',
                contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx'
            }
        };
        InternalMessage.payload(InternalMessageTypes.INIT_AELF_CONTRACT, contractInfo)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.INIT_AELF_CONTRACT, result);
                if (result.error === 0) {} else {
                    // Toast.fail(result.message, 3, () => { }, false);
                }
            });
    }

    initAelfContractFail() {
        const contractInfo = {
            appName: 'hzzTest',
            method: 'INIT_AELF_CONTRACT',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
                contractName: 'token',
                contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx111'
            }
        };
        InternalMessage.payload(InternalMessageTypes.INIT_AELF_CONTRACT, contractInfo)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.INIT_AELF_CONTRACT, result);
                if (result.error === 0) {} else {
                    // Toast.fail(result.message, 3, () => { }, false);
                }
            });
    }

    callAelfContract() {
        const contractInfo = {
            appName: 'hzzTest',
            method: 'CALL_AELF_CONTRACT',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                contractName: 'token',
                method: 'BalanceOf',
                params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
            }
        };
        InternalMessage.payload(InternalMessageTypes.CALL_AELF_CONTRACT, contractInfo)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.CALL_AELF_CONTRACT, result);
                if (result.error === 0) {} else {
                    // Toast.fail(result.message, 3, () => { }, false);
                }
            });
    }
    callAelfContractNoExistMethod() {
        const contractInfo = {
            appName: 'hzzTest',
            method: 'CALL_AELF_CONTRACT',
            hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                contractName: 'token',
                method: 'BalanceOf1111',
                params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
            }
        };
        InternalMessage.payload(InternalMessageTypes.CALL_AELF_CONTRACT, contractInfo)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.CALL_AELF_CONTRACT, result);
                if (result.error === 0) {} else {
                    // Toast.fail(result.message, 3, () => { }, false);
                }
            });
    }

    setPermission() {
        const permission = {
            appName: 'hzz Test',
            domain: 'aelf.io',
            address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
            contracts: [
                {
                    chainId: 'AELF',
                    contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx',
                    contractName: 'token',
                    description: 'token contract'
                }
            ]
        };
        setPermission(permission);
    }

    setPermissionWrongChainId() {
        const permission = {
            appName: 'hzz Test',
            domain: 'aelf.io',
            address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
            contracts: [{
                chainId: 'AELF111',
                contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx111',
                contractName: 'token',
                description: 'token contract'
            }]
        };
        setPermission(permission);
    }

    render() {
        return <div>
                <h1>Hello World</h1>
                <button onClick={() => this.callAelfChain()}>callAelfChain</button>
                <br/>
                <button onClick={() => this.initAelfContract()}>initAelfContract</button>
                <button onClick={() => this.initAelfContractFail()}>initAelfContract-Fail</button>
                <br/>
                <button onClick={() => this.callAelfContract()}>callAelfContract</button>

                <p>设置测试权限</p>
                <button onClick={() => this.callAelfContractNoExistMethod()}>
                    callAelfContractNoExistMethod
                </button>
                <button onClick={() => this.setPermission()}>设置权限</button>
                <button onClick={() => this.setPermissionWrongChainId()}>设置错误的权限</button>
            </div>;
    }
}
