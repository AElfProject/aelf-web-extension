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
import {hashHistory} from 'react-router';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import {FormattedMessage} from 'react-intl';


export default class Permission extends Component {

    // lockWallet() {
    //     InternalMessage.payload(InternalMessageTypes.LOCK_WALLET).send().then(result => {
    //         console.log(InternalMessageTypes.LOCK_WALLET, result);
    //         hashHistory.push('/');
    //     });
    // }
    constructor() {
        super();
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
            address: payload.payload.address,
            contracts: payload.payload.contracts
        };
    }

    setPermission() {
        InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, this.permission)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.SET_PERMISSION, result);
                if (result.error === 0) {
                    Toast.success('Bind Permisson Success');
                    window.data.sendResponse({
                        error: 0,
                        message: 'Bind Permisson Success'
                    });
                }
                else {
                    Toast.fail(result.message, 3, () => {}, false);
                }
            });
    }

    refuse() {
        window.data.sendResponse({
            error: 400001,
            message: 'Refuse'
        });
        window.close();
    }

    renderPermissions(permission) {
        const {
            chainID,
            contractAddress,
            contractName,
            description
        } = permission;
        return (
            <div key={contractAddress + chainID}>
                <div>--------</div>
                <div>Chain ID: {chainID}</div>
                <div>Contract Address: {contractAddress}</div>
                <div>Contract Name: {contractName}</div>
                <div>Description: {description}</div>
                <div>--------</div>
            </div>
        );
    }

    render() {
        const permission = this.permission;
        const contractsHTML = permission.contracts.map(item => {
            return this.renderPermissions(item);
        });
        return (
            <div>
                <p>Hello Permission Prompt!</p>
                <div>APP NAME: {permission.appName}</div>
                <div>DOMAIN: {permission.domain}</div>
                <div>ADDRESS: {permission.address}</div>
                {contractsHTML}
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
