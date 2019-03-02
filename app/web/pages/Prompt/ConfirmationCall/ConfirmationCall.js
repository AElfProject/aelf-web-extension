/**
 * @file ConfirmationCall
 * @author zhouminghui
*/

import React, {Component} from 'react';
import {Toast, Modal} from 'antd-mobile';
import {apis} from '../../../utils/BrowserApis';
import errorHandler from '../../../utils/errorHandler';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import style from './ConfirmationCall.scss';
import './ConfirmationCall.css';

export default class ConfirmationCall extends Component {
    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const message = data.message;
        this.message = data.message;
        this.keypairAddress = message.keypairAddress;
        this.confirmation = message.payload;
        this.appName = message.appName;
        this.hostname = message.hostname;
        this.state = {
            show: false
        };
    }

    renderConfirmation() {
        return <div>
            <div>APP NAME: {this.appName}</div>
            <div>METHOD: {this.confirmation.method}</div>
            <div>The keypair used: {this.keypairAddress}</div>
        </div>;
    }

    renderConfirmationInfo() {
        const info = Object.keys(this.confirmation);
        const infoHTMl = info.map(item => <div key={item}>{item}: {JSON.stringify(this.confirmation[item])}</div>);

        return <div>
            <div>------------Information display area-------------</div>
            <div>{infoHTMl}</div>
            <div>-------------------------------------------------</div>
        </div>;
    }

    renderConfirm() {
        return <div>
                    <div>-----------------------</div>
                    <button type='button' onClick={() => this.getCallAelfContract()}>OK</button>
                    <button type='button' onClick={() => this.refuse()}>REFUSE</button>
                    <div>-----------------------</div>
                </div>;
    }

    getCallAelfContract() {
        InternalMessage.payload(
            InternalMessageTypes.CALL_AELF_CONTRACT_WITHOUT_CHECK,
            this.message
        ).send()
        .then(result => {
            console.log(InternalMessageTypes.CALL_AELF_CONTRACT_WITHOUT_CHECK, result);
            if (result.error === 0 && result) {
                Toast.success('success, after 3s close the window.');
                window.data.sendResponse({
                    ...errorHandler(0),
                    result
                });
                setTimeout(() => {
                    window.close();
                }, 3000);
            }
        });
    }


    renderWhiteList() {
        return <div>
                <div>------------------------------------------------</div>
                <div>
                    Whitelist this to not have to accept next time
                    You can remove the permission in Extension
                </div>
                <div>
                    <button type='button' onClick={() => this.setState({show: true})}>Enable Whitelist</button>
                </div>
                <div>------------------------------------------------</div>
            </div>;
    }

    componentDidMount() {
        this.getContractAbi();
        this.getPermissions();
    }

    getContractAbi() {
        InternalMessage.payload(InternalMessageTypes.GET_CONTRACT_ABI, this.message)
        .send()
        .then(result => {
            if (result && result.error === 0) {
                const contractAbi = JSON.parse(result.detail).Methods;
                contractAbi.map(item => {
                    if (item.Name === this.confirmation.method) {
                        this.setState({
                            methodParams: item.Params
                        });
                    }
                });
            }
        });
    }

    refuse() {
        window.data.sendResponse({
            ...errorHandler(400001, 'Refuse')
        });
        window.close();
    }

    onClose() {
        this.setState({
            show: false
        });
    }

    renderWhiteListInfo() {
        const {methodParams} = this.state;
        console.log(methodParams);
        const whiteListHTML = methodParams.map((item, index) => {
            console.log(item);
            const params = this.confirmation.params[index];
            return <div key={item.Name} className={style.paramsInfo}>{item.Name}: {params}</div>;
        });
        return whiteListHTML;
    }

    getPermissions() {
        const queryInfo = {
            appName: 'hzzTest',
            type: 'address',
            hostname: this.hostname,
            address: this.keypairAddress
        };
        InternalMessage.payload(InternalMessageTypes.CHECK_PERMISSION, queryInfo)
        .send()
        .then(result => {
            if (result && result.error === 0) {
                const permission = result.permissions[0].contracts;
                permission.map(item => {
                    if (item.contractAddress === this.confirmation.contractAddress) {
                        this.setState({
                            contract: item
                        });
                    }
                });
            }
        });
    }

    setWhiteList() {
        const {contract, methodParams} = this.state;
        let whitelist = {};
        if (contract.whitelist) {
            whitelist = contract.whitelist;
            const method = this.confirmation.method;
            const newWhiteList = methodParams.map((item, index) => {
                const params = this.confirmation.params[index];
                const obj = {};
                obj[item.Name] = params;
                obj.variable = false;
                return obj;
            });
            whitelist[method] = newWhiteList;
        }
        else {
            whitelist = {};
            const method = this.confirmation.method;
            const newWhiteList = methodParams.map((item, index) => {
                const params = this.confirmation.params[index];
                const obj = {};
                obj[item.Name] = params;
                obj.variable = false;
                return obj;
            });
            whitelist[method] = newWhiteList;
        }

        const payload = {
            hostname: this.hostname,
            payload: {
                contractName: this.confirmation.contractName,
                contractAddress: this.confirmation.contractAddress,
                whitelist
            }
        };
        InternalMessage.payload(InternalMessageTypes.SET_WHITELIST, payload).send().then(result => {
            if (result && result.error === 0) {
                Toast.success('Successful addition of whitelist', 3, () => {
                    this.onClose();
                });
            }
            else {
                Toast.fail('Failed to add whitelist', 3, () => {
                    this.onClose();
                });
            }
        });
    }

    render() {
        const confiramtionHTML = this.renderConfirmation();
        const confiramtionInfoHTML = this.renderConfirmationInfo();
        const confirmHTML = this.renderConfirm();
        let getWhiteListHTML = <div></div>;
        let whiteListHTML = <div></div>;
        if (this.state.methodParams) {
            getWhiteListHTML = this.renderWhiteList();
            whiteListHTML = this.renderWhiteListInfo();
        }
        return (
            <div className={style.container}>
                {confiramtionHTML}
                {confiramtionInfoHTML}
                {confirmHTML}
                {getWhiteListHTML}
                <Modal
                    visible={this.state.show}
                    transparent
                    maskClosable={false}
                    title="White List"
                    footer={
                        [{
                            text: 'REFUSE', onPress: () => {
                                this.onClose();
                            }
                        },
                        {
                            text: 'Ok', onPress: () => {
                                this.setWhiteList();
                            }
                        }]
                    }
                    >
                        <div style={{height: 100, overflow: 'scroll'}}>
                            {whiteListHTML}
                        </div>
                </Modal>
            </div>
        );
    }
}
