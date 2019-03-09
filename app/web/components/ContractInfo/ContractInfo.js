/**
 * @file ContractInfo.js
 * @author zhouminghui
*/

import React, {Component} from 'react';
import style from './ContractInfo.scss';
import { FormattedMessage } from 'react-intl';

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
            </div>
        );
    }

    render() {
        const permission = this.permission;
        const contractsHTML = permission.contracts.map(item => {
            return this.renderPermissions(item);
        });

        return (
            <div className={style.contractList}>
                {contractsHTML}
            </div>
        );
    }
}