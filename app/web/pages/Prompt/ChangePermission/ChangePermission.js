/**
 * @file Prompt/Permission.js
 * @author huangzongzhe
 * 2019.01
 */
import React, {
	Component
} from 'react';

import {Toast} from 'antd-mobile';

import {apis} from '../../../utils/BrowserApis';
import errorHandler from '../../../utils/errorHandler';
import ContractInfo from '../../../components/ContractInfo/ContractInfo';
import {FormattedMessage} from 'react-intl';
import AelfButton from '../../../components/Button/Button';
// import {hashHistory} from 'react-router';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

// import {FormattedMessage} from 'react-intl';
import style from './ChangePermission.scss';

export default class ChangePermission extends Component {

    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const message = data.message;
        const {
            appName,
            hostname,
            payload
        } = message;
        this.address = this.props.location.state === undefined ? message.payload.payload.address : this.props.location.state;
        this.permission = {
            appName,
            domain: hostname,
            // Why do we do this?
            // Because two prompt pages cannot be opened at the same time, and route cannot pass values using /:address
            address: this.address,
            contracts: payload.payload.contracts
        };
        this.hasLogin = payload.payload.method === 'LOGIN';
        this.state = {
            address: this.address
        };
    }

    setPermission() {
        const {address} = this.state;
        const detail = JSON.stringify({address});
        // InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, this.permission)
        if (this.hasLogin) {
            InternalMessage.payload(InternalMessageTypes.SET_LOGIN_PERMISSION, this.permission)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.SET_LOGIN_PERMISSION, result);
                if (result.error === 0) {
                    window.data.sendResponse({
                        ...errorHandler(0),
                        detail,
                        message: 'Bind Permisson Success'
                    });
                    window.close();
                }
                else {
                    Toast.fail(result.message, 3, () => {}, false);
                }
            });
        }
        else {
            InternalMessage.payload(InternalMessageTypes.SET_CONTRACT_PERMISSION, this.permission)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.SET_CONTRACT_PERMISSION, result);
                if (result.error === 0) {
                    window.data.sendResponse({
                        ...errorHandler(0),
                        detail,
                        message: 'Bind Permisson Success'
                    });
                    window.close();
                }
                else {
                    Toast.fail(result.message, 3, () => {}, false);
                }
            });
        }
    }

    refuse() {
        window.data.sendResponse({
            ...errorHandler(400001, 'Refuse')
        });
        window.close();
    }

    // <div className={style.top}>
    //     <div className={style.blank}></div>
    //     <p className={style.wallet}>
    //         <FormattedMessage
    //             id='aelf.Authorization details'
    //         />
    //     </p>
    // </div>
    // <div className={style.permissionsTips}>
    //         <FormattedMessage
    //             id='aelf.Authorization description'
    //         />
    // </div>
    render() {
        const permission = this.permission;
        return (
            <div className={style.container}>
                <div className={style.domain}>
                    <FormattedMessage
                        id='aelf.Authorized domain name:'
                    />&nbsp;&nbsp;
                    {permission.domain}
                </div>
                <ContractInfo
                    permission={permission}
                 />
                 <div className={style.buttons}>
                    <div>
                        <AelfButton
                            text='Submit'
                            onClick={() => this.setPermission()}
                        />
                    </div>
                    <div>
                        <AelfButton
                            type='transparent'
                            text='Cancel'
                            onClick={() => this.refuse()}
                        />
                    </div>
                 </div>
            </div>
        );
    }
}
