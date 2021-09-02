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
        let detail = null;
        // InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, this.permission)
        InternalMessage.payload(InternalMessageTypes.GET_ADDRESS)
        .send().
        then(result => {
            const keypairMessage = result.addressList.filter(item => {
                return item.address === address;
            });

            if (keypairMessage && keypairMessage.length) {
                detail = JSON.stringify(keypairMessage[0]);
            } else {
                Toast.fail(`No matched wallet. ${address}`, 3, () => {}, false);
            }

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
        }).catch(error => {
            Toast.fail(error, 3, () => {}, false);
        });
    }

    cancel() {
        window.data.sendResponse({
            ...errorHandler(400001, 'Authorization operation cancelled.')
        });
        window.close();
    }

    renderContrast() {

        if (this.isLogin) {
            return null;
        }

        const {permissionsList} = this.state;
        const contractInfoHeight = {
            height: '150px'
        };

        // const addPermissions = permissionsList ? permissionsList.addPermissions : [];
        // const removePermissions = permissionsList ? permissionsList.addPermissions : [];
        // <div className={style.blank}>{JSON.stringify(permissionsList)} {typeof permissionsList}</div>
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
        } else {
            return null;
        }
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
    //     The application will use the following contracts, contract id,
    //     contract audit address and contract description:
    // </div>
    render() {
        const permission = this.permission;
        const contrast = this.renderContrast();
        return (
            <div className={style.container}>
                <div className={style.confirmPermission}>
                    <div className={style.top}>
                          <div className={style.blank}/>
                          <p className={style.wallet}>
                              <FormattedMessage
                                  id='aelf.Authorization details'
                              />
                          </p>
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
                                text='Submit'
                                type='createbtn'
                                onClick={() => this.setPermission()}
                            />
                        </div>
                        <div>
                            <AelfButton
                                type='createbtn'
                                style={{background: '#fff', color: '#502EA2', border: '1px solid #502EA2'}}
                                text='Cancel'
                                onClick={() => this.cancel()}
                            />
                        </div>
                    </div>
                </div>
                {contrast}
            </div>
        );
    }
}
