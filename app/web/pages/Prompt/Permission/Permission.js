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

import diffPermissions from '../../../utils/diffPermissions';

// import {FormattedMessage} from 'react-intl';
import style from './Permission.scss';

export default class Permission extends Component {

    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const message = data.message;
        console.log(message);
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
        console.log(this.permission);
        this.isLogin = payload.payload.method === 'LOGIN';
        this.isSetPermission = payload.payload.method === 'SET_CONTRACT_PERMISSION';
        this.newPermissions = message.payload.payload.contracts;
        this.quryInfo = {
            appName,
            hostname,
            type: 'domain'
        };

        this.state = {
            address: this.address,
            permissionsList: null
        };
    }


    componentDidMount() {
        InternalMessage.payload(InternalMessageTypes.CHECK_PERMISSION, this.quryInfo).send().then(result => {
            if (result && result.error === 0) {
                if (result.permissions.length > 0) {
                    const permissionsList = diffPermissions(result.permissions[0].contracts, this.newPermissions);
                    console.log(permissionsList);
                    this.setState({
                        permissionsList
                    });
                }
            }
        });
    }

    setPermission() {
        const {address} = this.state;
        const detail = JSON.stringify({address});
        // InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, this.permission)
        if (this.isLogin) {
            InternalMessage.payload(InternalMessageTypes.SET_LOGIN_PERMISSION, this.permission)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.SET_LOGIN_PERMISSION, result);
                if (result.error === 0) {
                    Toast.success('Bind Permisson Success, after 3s close the window.');
                    window.data.sendResponse({
                        ...errorHandler(0),
                        detail,
                        message: 'Bind Permisson Success'
                    });
                    setTimeout(() => {
                        window.close();
                    }, 3000);
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
                    Toast.success('Bind Permisson Success, after 3s close the window.');
                    window.data.sendResponse({
                        ...errorHandler(0),
                        detail,
                        message: 'Bind Permisson Success'
                    });
                    setTimeout(() => {
                        window.close();
                    }, 3000);
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

    renderContrast() {
        const {permissionsList} = this.state;
        const contractInfoHeight = {
            height: '150px'
        };
        if (permissionsList) {
            return <div className={style.confirmPermission} style={{width: '50%'}}>
                <div className={style.top}>
                    <div className={style.blank}></div>
                    <p className={style.wallet}>
                        <FormattedMessage
                            id='aelf.Details of contract changes'
                        />
                    </p>
                </div>
                <div className={style.contrastTips}>
                    <FormattedMessage
                        id='aelf.New Contract Method'
                    />
                </div>
                <ContractInfo
                    style={contractInfoHeight}
                    permission={permissionsList.addPermissions}
                />
                <div className={style.contrastTips}>
                    <FormattedMessage
                        id='aelf.Delete Contract Method'
                    />
                </div>
                <ContractInfo
                    style={contractInfoHeight}
                    permission={permissionsList.removePermissions}
                />
            </div>;
        }
        else {
            return <div></div>;
        }
    }

    render() {
        const permission = this.permission;
        const contrast = this.renderContrast();
        return (
            <div className={style.container}>
                <div className={style.confirmPermission}>
                    <div className={style.top}>
                        <div className={style.blank}></div>
                        <p className={style.wallet}>
                            <FormattedMessage
                                id='aelf.Authorization details'
                            />
                        </p>
                    </div>
                    <div className={style.permissionsTips}>
                        The application will use the following contracts, contract id,
                        contract audit address and contract description:
                    </div>
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
                                text='Commit'
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
                {contrast}
            </div>
        );
    }
}
