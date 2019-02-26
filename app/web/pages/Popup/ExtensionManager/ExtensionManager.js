/**
 * @file BackupExtension.js
 * @author zhouminghui
 */
import React, {
	Component
} from 'react';

import {List} from 'antd-mobile';
import {hashHistory} from 'react-router';

import style from './ExtensionManager.scss';

import ListContent from '../../../components/ListContent/ListContent';
import NavNormal from '../../../components/NavNormal/NavNormal';
import {historyPush} from '../../../utils/historyChange';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import {FormattedMessage} from 'react-intl';

// import aelf from 'aelf-sdk';

const Item = List.Item;

export default class ExtensionManager extends Component {

    componentDidMount() {
        this.checkWallet();
    }

    turnToHomePage(walletStatus) {
        const {
            nightElf
        } = walletStatus || {};
        if (!nightElf) {
            hashHistory.push('/');
        }
    }

    checkWallet() {
        InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
            this.turnToHomePage(result);
        });
    }

    render() {
        return (
            <div className={style.container + ' ' + 'aelf-personal-pages aelf-solid'}>

                {/* <div className={style.blank}></div>
                <div className={style.blank}></div>
                <div className={style.blank}></div> */}
                <NavNormal
                    onLeftClick={() => historyPush('/home')}
                ></NavNormal>
                <List className={'aelf-list'}>
                    <Item onClick={() => hashHistory.push('/?action=backup_wallet')}>
                        <ListContent
                            icon="wallet16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Backup NightELF'
                                    defaultMessage = 'Backup NightELF'
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
                <List className={'aelf-list'}>
                    <Item onClick={() => hashHistory.push('/?action=clear_wallet')}>
                        <ListContent
                            icon="tx_history16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Delete NightELF'
                                    defaultMessage = 'Delete NightELF'
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
                <List className={'aelf-list'}>
                    <Item onClick={() => hashHistory.push('/?action=timing_lock')}>
                        <ListContent
                            icon="about16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Timer Locks'
                                    defaultMessage = "Timer Locks"
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
            </div>
        );
    }
}
