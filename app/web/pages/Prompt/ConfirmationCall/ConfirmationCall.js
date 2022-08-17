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

    cancel() {
        window.data.sendResponse({
            ...errorHandler(400001, 'Operation canceled.')
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
            if (result && result.error === 0) {
                window.data.sendResponse(result);
                window.close();
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
                let contract = {
                    contractAddress: this.confirmation.contractAddress,
                    type: '0',
                };
                const permission = result.permissions[0].contracts;
                permission.map(item => {
                    if (item.contractAddress === this.confirmation.contractAddress) {
                        contract = item;
                        // this.setState({
                        //     contract: item
                        // });
                    }
                });
                this.setState({ contract });
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
            if (methodParams.length !== 0) {
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
            const method = this.confirmation.method;
            if (methodParams.length !== 0) {
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
                Toast.success('Success', 3, () => {
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
                    <FormattedMessage
                        id='aelf.Whitelist Description'
                    />
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
        // const { contractName } = this.message.contractInfoWithAppPermissions;
        return <div className={style.appLogin}>
                <div className={style.appName}>
                    {/*<div className={style.loginTip}>*/}
                    {/*    Method: {this.confirmation.method}*/}
                    {/*</div>*/}
                    <div className={style.loginTip}>
                        Wallet Address: {this.keypairAddress}
                    </div>
                </div>
            </div>;
    }

    renderConfirmationInfo() {
        const info = Object.keys(this.confirmation);
        const infoHTMl = info.map(item => {
            if (item === 'contractName') {
                return null;
            }
            if (item !== 'params') {
                return <div key={item}
                                className={style.confirmationInfoItem}
                            >{item}: {JSON.stringify(this.confirmation[item])}
                        </div>;
            }
            return <div key={item}
                        className={style.confirmationInfoItem}
                    >{item}:
                        <textarea
                          rows={8}
                          value={JSON.stringify(this.confirmation[item], null, 2)}
                          className={style.codeLikeContent}
                          disabled>
                        ></textarea>
                    </div>;
        });

        return <div className={style.confirmationInfo}>
                    <div>{infoHTMl}</div>
                </div>;
    }

    renderConfirm() {
        return <div className={style.buttons}>
                    <AelfButton
                        text='Submit'
                        type='createbtn'
                        onClick={() => this.getCallAelfContract()}
                    />
                    <AelfButton
                        text='Cancel'
                        type='createbtn'
                        style={{background: '#fff', color: '#502EA2', border: '1px solid #502EA2'}}
                        onClick={() => this.cancel()}
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
                return <div key={item.key} className={style.paramsInfo}>{item.key}: {JSON.stringify(item.value, null, 2)}</div>;
            });

            const { contractName } = this.message.contractInfoWithAppPermissions;

            // TODO: whitelist matches exact params.
            // <div className={style.title}>contract params</div>
            // <div className={style.content}>{ whitelistHTML }</div>
            return  <React.Fragment>
                <div className={style.title}>wallet address</div>
                <div className={style.content}>{ this.keypairAddress }</div>
                <div className={style.content}>{ contractName }</div>
                <div className={style.title}>contact address</div>
                <div className={style.content}>{ this.confirmation.contractAddress }</div>
                <div className={style.title}>contact method</div>
                <div className={style.content}>{ this.confirmation.method }</div>
            </React.Fragment>;
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
                            text: 'Cancel', onPress: () => {
                                this.onClose();
                            }
                        },
                        {
                            text: 'Add', onPress: () => {
                                this.setWhitelist();
                            }
                        }]
                    }
                    >
                        <div className={style.whitelistContainer}>
                            {whitelistHTML}
                        </div>
                </Modal>
            </div>
        );
    }
}
