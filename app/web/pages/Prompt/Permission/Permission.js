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
// import {hashHistory} from 'react-router';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

// import {FormattedMessage} from 'react-intl';

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
        this.permission = {
            appName,
            domain: hostname,
            // Why do we do this?
            // Because two prompt pages cannot be opened at the same time, and route cannot pass values using /:address
            address: this.props.location.state,
            contracts: payload.payload.contracts
        };
        this.state = {
            address: this.props.location.state
        };
        console.log(this.props.location);
    }

    setPermission() {
        const {address} = this.state;
        const detail = JSON.stringify({address});
        // InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, this.permission)
        InternalMessage.payload(InternalMessageTypes.SET_LOGIN_PERMISSION, this.permission)
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

    refuse() {
        window.data.sendResponse({
            ...errorHandler(400001, 'Refuse')
        });
        window.close();
    }

    render() {
        const permission = this.permission;
        return (
            <div>
                <p>Hello Permission Prompt!</p>
                <div>APP NAME: {permission.appName}</div>
                <div>DOMAIN: {permission.domain}</div>
                <div>ADDRESS: {permission.address}</div>
                <ContractInfo
                    permission={permission}
                />
                <div>--------</div>
                <button onClick={() => this.setPermission()}>OK</button>
                <button onClick={() => this.refuse()}>REFUSE</button>
                <div>--------</div>
                <div>Raw Data: </div>
                {JSON.stringify(permission)}
            </div>
        );
    }
}
