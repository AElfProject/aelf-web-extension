/**
 * @file ContractInfo.js
 * @author zhouminghui
*/

import React, {Component} from 'react';
import style from './ContractInfo.scss';

export default class ContractInfo extends Component {
    constructor(props) {
        super(props);
        this.permission = this.props.permission;
    }

    renderPermissions(permission) {
        const {
            chainID,
            contractAddress,
            contractName,
            description
        } = permission;
        return (
            <div key={contractAddress + chainID} className={style.contractInfo}>
                <div>----------------------------------------</div>
                <div>Chain ID: {chainID}</div>
                <div>Contract Address: {contractAddress}</div>
                <div>Contract Name: {contractName}</div>
                <div>Description: {description}</div>
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
                {contractsHTML}
            </div>
        );
    }
}