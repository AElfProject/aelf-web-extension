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

export default class GetSignature extends Component {
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

    renderConfirmation() {
        return <div className={style.appLogin}>
                <div className={style.appName}>
                    <div className={style.loginTip}>
                        Wallet Address: {this.keypairAddress}
                    </div>
                </div>
            </div>;
    }

    renderConfirmationInfo() {
        const info = Object.keys(this.confirmation);
        const infoHTMl = info.map(item => {
            if (item !== 'input') {
              return <div key={item}
                              className={style.confirmationInfoItem}
                          >{item}: {JSON.stringify(this.confirmation[item])}
                      </div>;
            }
            return <div key={item} className={style.confirmationInfoItem}>
                        String to be sign: {this.confirmation[item].hexToBeSign}
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
                  window.data.sendResponse(result);
                  setTimeout(() => {
                      window.close();
                  }, 3000);
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
                        // onClick={() => this.getCallAelfContract()}
                        onClick={() => {
                          window.data.sendResponse({
                            ...errorHandler(0),
                            signature: this.confirmation.signature
                          });
                          window.close();
                        }}
                    />
                    <AelfButton
                        text='Cancel'
                        type='transparent'
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
