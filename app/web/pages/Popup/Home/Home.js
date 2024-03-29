/**
 * @file Home.js
 * @author huangzongzhe
 * 2019.01
 */
import React, {
	Component
} from 'react';

import {List} from 'antd-mobile';
import {hashHistory} from 'react-router';

import style from './Home.scss';

import ListContent from '../../../components/ListContent/ListContent';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import insert from '../../../utils/insert';
import checkWallet from '../../../utils/checkWallet';
import {FormattedMessage} from 'react-intl';
import './Home.css';
import { historyPush } from '../../../utils/historyChange';

const Item = List.Item;

@insert(checkWallet)
export default class personalCenterHome extends Component {

    lockWallet() {
        InternalMessage.payload(InternalMessageTypes.LOCK_WALLET).send().then(result => {
            console.log(InternalMessageTypes.LOCK_WALLET, result);
            hashHistory.push('/');
        });
    }

    componentDidMount() {
        this.checkWalletInfo();
    }

    render() {
        return (
            <div className={style.container + ' ' + 'aelf-personal-pages aelf-solid'}>
                <div className={style.top}>
                    <div className={style.blank}></div>
                    <div className={style.logo}/>
                    <p className={style.wallet}>NIGHT ELF</p>
                    <p className={style.version}>{process.env.SDK_VERSION}</p>
                </div>
                <List className={style.aelfList}>
                    <Item onClick={() => hashHistory.push('/keypairs')}>
                        <ListContent
                            // icon="wallet16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Key Pairs'
                                    defaultMessage = 'Key Pairs'
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
                <List className={style.aelfList}>
                    <Item onClick={() => hashHistory.push('/permissions')}>
                        <ListContent
                            // icon="tx_history16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Application Management'
                                    defaultMessage = 'Application Management'
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
                <List className={style.aelfList}>
                    <Item onClick={() => hashHistory.push('/extensionmanager')}>
                        <ListContent
                            // icon="about16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Extension Management'
                                    defaultMessage = "Keypairs Management"
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
                <List className={style.aelfList}>
                    <Item onClick={() => this.lockWallet()}>
                        <ListContent
                            // icon="about16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Lock'
                                    defaultMessage = "Lock"
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>

                <List className={style.aelfList}>
                    <Item onClick={() => window.open('https://web-wallet.aelf.io/')}>
                        <ListContent
                            // icon="about16"
                            text={
                                <FormattedMessage
                                    id = 'aelf.Connect Wallet'
                                    defaultMessage = "Connect Wallet"
                                />
                            }
                        ></ListContent>
                    </Item>
                </List>
                <div className={style.bottomSpace}/>
            </div>
        );
    }
}
