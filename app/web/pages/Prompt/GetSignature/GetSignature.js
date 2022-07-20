/**
 * @file GetSignature
 * @author hzz780
*/

import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import {apis} from '../../../utils/BrowserApis';
import errorHandler from '../../../utils/errorHandler';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import AelfButton from '../../../components/Button/Button';
import style from './GetSignature.scss';
import { endOfOperation, getMessageFromService } from '../../../utils/promptToService';

export default class GetSignature extends Component {
    constructor(props) {
        super(props);
        this.message = {};
        this.appName = '';
        this.hostname ='';
        this.state = {
            show: false,
            keypairAddress: '',
            confirmation: {}
        };
    }

    async getMessage() {
        const result = await getMessageFromService();
        this.message = result.message;
        this.appName = this.message.appName;
        this.hostname = this.message.hostname;
        this.setState({
            keypairAddress: this.message.keypairAddress,
            confirmation: this.message.payload
        })
    }

    componentDidMount() {
        this.getMessage();
    }

    cancel() {
        endOfOperation({
            ...errorHandler(400001, 'Operation canceled.')
        }, 10);
    }

    onClose() {
        this.setState({
            show: false
        });
    }

    renderConfirmation() {
        return <div className={style.appLogin}>
                <div className={style.appName}>
                    <div className={style.loginTip}>
                        Wallet Address: {this.state.keypairAddress}
                    </div>
                </div>
            </div>;
    }

    renderConfirmationInfo() {
        const info = Object.keys(this.state.confirmation);
        const infoHTMl = info.map(item => {
            if (item !== 'input') {
                return <div key={item}
                        className={style.confirmationInfoItem}
                        >{item}: {JSON.stringify(this.state.confirmation[item])}
                    </div>;
            }
            return <div key={item} className={style.confirmationInfoItem}>
                        String to be sign: {this.state.confirmation[item].hexToBeSign}
                    </div>;
        });
        return <div className={style.confirmationInfo}>
                    <div>{infoHTMl}</div>
                </div>;
    }

    getCallAelfContract() {
        InternalMessage.payload(
            InternalMessageTypes.CALL_AELF_CONTRACT_WITHOUT_CHECK,
            this.message
        ).send()
        .then(result => {
            if (result && result.error === 0) {
                Toast.success('Success, after 3s close the window.');
                endOfOperation(result, 3000)
            }
            else {
                Toast.fail(result.errorMessage.message, 3);
            }
        });
    }

    renderConfirm() {
        return <div className={style.buttons}>
                    <AelfButton
                        text='Submit'
                        type='createbtn'
                        // onClick={() => this.getCallAelfContract()}
                        onClick={() => {
                            endOfOperation({
                                ...errorHandler(0),
                                signature: this.state.confirmation.signature
                            }, 10)
                        }}
                    />
                    <AelfButton
                        text='Cancel'
                        type='createbtn'
                        style={{background: '#fff', color: '#502EA2', border: '1px solid #502EA2'}}
                        onClick={() => this.cancel()}
                    />
                </div>;
    }

    render() {
        const confiramtionHTML = this.renderConfirmation();
        const confiramtionInfoHTML = this.renderConfirmationInfo();
        const confirmHTML = this.renderConfirm();

        return (
            <div className={style.container}>
                <div className={style.title}>This application wants to get your information signed by you private key.</div>
                {confiramtionHTML}
                {confiramtionInfoHTML}
                {confirmHTML}
            </div>
        );
    }
}
