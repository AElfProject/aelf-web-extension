/**
 * @file ContractInfo.js
 * @author zhouminghui
*/

import React, {Component} from 'react';
import style from './ContractInfo.scss';
import {FormattedMessage} from 'react-intl';

export default class ContractInfo extends Component {
    constructor(props) {
        super(props);
        this.style = this.props.style;
        this.permission = this.props.permission;
    }

    renderPermissions(permission) {
        const {
            chainID,
            contractAddress,
            contractName,
            description,
            github
        } = permission;
        return (
            <div key={contractAddress + chainID} className={style.contractInfoList}>
                <div className={style.contractTitle}>
                    <div className={style.contractName}>
                        <FormattedMessage
                            id='aelf.Contract Address:'
                        />
                    </div>
                    <div>
                        &nbsp;{contractAddress}
                    </div>
                </div>
                <div className={style.contractTitle}>
                    <div className={style.contractName}>
                        <FormattedMessage
                            id='aelf.Contract Name:'
                        />
                    </div>
                    <div>
                        &nbsp;{contractName}
                    </div>
                </div>
                <div className={style.contractTitle}>
                    <div className={style.contractName}>
                        <FormattedMessage
                            id='aelf.Description:'
                        />
                    </div>
                    <div>
                        &nbsp;{description}
                    </div>
                </div>
                <div className={style.contractTitle}>
                    <div className={style.contractName}>
                        Github:
                    </div>
                    <div>
                        &nbsp;{github}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const permission = this.permission;
        let contractsHTML = null;
        if (permission.contracts) {
            contractsHTML = permission.contracts.map(item => {
                return this.renderPermissions(item);
            });
        }
        else {
            contractsHTML = permission.map(item => {
                return this.renderPermissions(item);
            });
        }

        return (
            <div className={style.contractList} style={this.style}>
                {contractsHTML}
            </div>
        );
    }
}