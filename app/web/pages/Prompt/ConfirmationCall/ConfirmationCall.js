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
import AelfButton from '../../../components/Button/Button';
import {FormattedMessage} from 'react-intl';
import style from './ConfirmationCall.scss';
import './ConfirmationCall.css';

export default class ConfirmationCall extends Component {
    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        this.message = data.message;
        this.keypairAddress = this.message.keypairAddress;
        this.confirmation = this.message.payload;
        this.appName = this.message.appName;
        this.hostname = this.message.hostname;
        this.state = {
            show: false
        };
    }


    componentDidMount() {
        this.getContractAbi();
        this.getPermissions();
    }

    getContractAbi() {
        this.setState({
            methodParams: this.message.payload.params || []
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

    getCallAelfContract() {
        InternalMessage.payload(
            InternalMessageTypes.CALL_AELF_CONTRACT_WITHOUT_CHECK,
            this.message
        ).send()
        .then(result => {
            console.log(result);
            if (result && result.error === 0) {
                Toast.success('success, after 3s close the window.');
                window.data.sendResponse({
                    ...errorHandler(0),
                    result
                });
                setTimeout(() => {
                    window.close();
                }, 3000);
            }
            else {
                Toast.fail(result.errorMessage.message, 3);
            }
        });
    }

    getPermissions() {
        const queryInfo = {
            appName: this.appName,
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
            else {
                Toast.fail(result.errorMessage.message, 3);
            }
        });
    }

    setWhitelist() {
        const {contract, methodParams} = this.state;
        let whitelist = {};
        if (contract.whitelist) {
            whitelist = contract.whitelist;
            const method = this.confirmation.method;
            if (methodParams) {
                whitelist[method] = methodParams[0];
            }
            else {
                const obj = {
                    value: '',
                    variable: false
                };
                whitelist[method] = obj;
            }
        }
        else {
            whitelist = {};
            const method = this.confirmation.method;
            if (methodParams) {
                whitelist[method] = methodParams[0];
            }
            else {
                const obj = {
                    value: '',
                    variable: false
                };
                whitelist[method] = obj;
            }
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


    renderWhitelist() {
        return <div className={style.whitelistTip}>
                <div>
                    Whitelist this to not have to accept next time
                    You can remove the permission in Extension
                </div>
                <div
                    className={style.enableWhitelist}
                    onClick={() => this.setState({show: true})}
                >
                    <FormattedMessage
                        id='aelf.Enable Whitelist'
                    />
                </div>
            </div>;
    }

    renderConfirmation() {
        return <div className={style.appLogin}>
                <div className={style.appName}>
                    <div>
                        {this.appName}
                    </div>
                    <div className={style.loginTip}>
                       {this.confirmation.method}
                    </div>
                    <div className={style.loginTip}>
                        {this.keypairAddress}
                    </div>
                </div>
            </div>;
    }

    renderConfirmationInfo() {
        const info = Object.keys(this.confirmation);
        const infoHTMl = info.map(item => {
            if (item !== 'contractName') {
                return <div key={item}
                                className={style.confirmationInfoItem}
                            >{item}: {JSON.stringify(this.confirmation[item])}
                        </div>;
            }
        });

        return <div className={style.confirmationInfo}>
                    <div>{infoHTMl}</div>
                </div>;
    }

    renderConfirm() {
        return <div className={style.buttons}>
                    <AelfButton
                        text='Commit'
                        onClick={() => this.getCallAelfContract()}
                    />
                    <div className={style.blank}></div>
                    <AelfButton
                        text='Cancel'
                        type='transparent'
                        onClick={() => this.refuse()}
                    />
                </div>;
    }

    renderWhitelistInfo() {
        const {methodParams} = this.state;
        if (methodParams) {
            let params = [];
            for (let item in methodParams[0]) {
                const obj = {
                    key: item,
                    value: methodParams[0][item]
                };
                params.push(obj);
            }
            const whitelistHTML = params.map((item, index) => {
                return <div key={item.key} className={style.paramsInfo}>{item.key}: {item.value}</div>;
            });
            
            return whitelistHTML;
        }
        else {
            return <div className={style.paramsInfo}>This method has no parameters.</div>;
        }
    }

    render() {
        const confiramtionHTML = this.renderConfirmation();
        const confiramtionInfoHTML = this.renderConfirmationInfo();
        const confirmHTML = this.renderConfirm();
        // let getWhitelistHTML = <div></div>;
        // let whitelistHTML = <div></div>;
        let getWhitelistHTML = this.renderWhitelist();
        let whitelistHTML = this.renderWhitelistInfo();
        // if (this.state.methodParams) {
        // }
        return (
            <div className={style.container}>
                {confiramtionHTML}
                {confiramtionInfoHTML}
                {confirmHTML}
                {getWhitelistHTML}
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
                                this.setWhitelist();
                            }
                        }]
                    }
                    >
                        <div style={{height: 100, overflow: 'scroll'}}>
                            {whitelistHTML}
                        </div>
                </Modal>
            </div>
        );
    }
}
