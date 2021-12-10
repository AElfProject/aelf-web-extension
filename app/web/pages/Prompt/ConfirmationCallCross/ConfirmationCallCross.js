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
import style from './ConfirmationCallCross.scss';
import './ConfirmationCallCross.css';
import {CROSS_RECEIVE_WITHOUT_CHECK} from "../../../messages/InternalMessageTypes";

export default class ConfirmationCallCross extends Component {
    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        this.message = data.message;
        this.keypairAddress = this.message.payload.address;
        this.confirmation = this.message.payload;
        this.appName = this.message.appName;
        this.hostname = this.message.hostname;
        this.state = {
            show: false
        };
    }

    componentDidMount() {
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

    getCrossAction() {
        const messageType = this.message.payload.method === 'CROSS_RECEIVE'
          ? InternalMessageTypes.CROSS_RECEIVE_WITHOUT_CHECK : InternalMessageTypes.CROSS_SEND_WITHOUT_CHECK

        InternalMessage.payload(
          messageType,
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
            if (item === 'CROSS_INFO') {
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
                        onClick={() => {
                            this.getCrossAction();
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
                {confiramtionHTML}
                {confiramtionInfoHTML}
                {confirmHTML}
            </div>
        );
    }
}
