/**
 * @file Lock.js
 * @author huangzongzhe
 */

import React, {
    Component
} from 'react';
import {hashHistory} from 'react-router';
import {createHmac} from 'crypto';
import {
    Toast,
    List,
    InputItem
} from 'antd-mobile';

import style from './Lock.scss';
import AelfButton from '../../../components/Button/Button';
import {getPageContainerStyle, moneyKeyboardWrapProps, getParam} from '../../../utils/utils';
import Password from '../../../components/Password/Password';
import NavNormal from '../../../components/NavNormal/NavNormal';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import {
    FormattedMessage
} from 'react-intl';

function getSeed(password) {
    if (password) {
        const hmac = createHmac('sha512', password);
        const seed = hmac.update(password).digest('hex');
        return seed;
    }
    Toast.fail('Please input password', 3, () => {}, false);
    return false;
}

export default class Lock extends Component {

    constructor() {
        super();
        this.state = {
            password: '',
            walletStatus: false
        };
        const action = getParam('action', location.href);
        const isClear = action === 'clear_wallet';
        this.isClear = isClear;
    }

    setPassword(password) {
        console.log(password);
        this.setState({
            password
        });
    }

    turnToHomePage(walletStatus, callback) {
        const {
            nightElfEncrypto,
            nightElf
        } = walletStatus || {};

        if (nightElfEncrypto && nightElf && !this.isClear) {
            hashHistory.push('/home');
        }
        else {
            callback();
        }
    }

    checkWallet() {
        InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
            console.log(InternalMessageTypes.CHECK_WALLET, result);
            this.turnToHomePage(result, () => {
                this.setState({
                    walletStatus: result
                });
            });
        });
    }

    componentDidMount() {
        this.checkWallet();
    }

    createWallet() {
        const seed = getSeed(this.state.password);
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.CREAT_WALLET, seed).send().then(result => {
                console.log(InternalMessageTypes.SET_SEED, seed, result);
                if (result && result.error === 0) {
                    Toast.success('Create Success', 1, () => {
                        hashHistory.push('/home');
                    });
                }
                else {
                    Toast.fail('Create Wallet Failed.', 3, () => {}, false);
                }
            });
        }
    }

    unlockWallet() {
        const seed = getSeed(this.state.password);
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.UNLOCK_WALLET, seed).send().then(result => {
                console.log(InternalMessageTypes.UNLOCK_WALLET, seed, result);
                if (result && result.error === 0) {
                    hashHistory.push('/home');
                }
                else {
                    console.log(result.error);
                    Toast.fail('Unlock Wallet Failed.', 3, () => {}, false);
                }
            }).catch(error => {
                console.log('unlock error: ', error);
                Toast.fail('Unlock Wallet Failed.', 3, () => {}, false);
            });
        }
    }

    // lockWallet() {
    //     InternalMessage.payload(InternalMessageTypes.LOCK_WALLET).send().then(result => {
    //         console.log(InternalMessageTypes.LOCK_WALLET, result);
    //         location.reload();
    //     });
    // }

    clearWallet() {
        const seed = getSeed(this.state.password);
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.CLEAR_WALLET, seed).send().then(result => {
                console.log(InternalMessageTypes.CLEAR_WALLET, seed, result);
                if (result.error) {
                    Toast.fail('Clear failed!');
                    this.clearFailed = true;
                    return;
                }
                location.href = '/popup.html';
            });
        }
    }

    backClick() {
        if (this.clearFailed) {
            this.checkWallet();
        }
        else {
            hashHistory.push('/extensionManager');
        }
    }

    updateWallet() {
        const seed = getSeed(this.state.password);
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.UPDATE_WALLET, seed).send().then(result => {
                console.log(InternalMessageTypes.UPDATE_WALLET, seed, result);
            });
        }
    }

    // if there is no wallet in browser.storage [chrome.storage]
    // We need create a wallet and insert it into storage.
    renderCreate() {
        return <div>
            <Password
                setPassword={password => this.setPassword(password)}
            ></Password>
            <div className={style.bottom}>
                <div className='aelf-blank12'></div>
                <AelfButton
                    text='Create Wallet'
                    aelficon='add_purple20'
                    onClick={() => this.createWallet()}>
                </AelfButton>
            </div>
        </div>;
    }

    renderClear() {
        return <div>
            <div className="aelf-input-container aelf-dash">
                <List>
                    <div className="aelf-input-title">
                        <div><FormattedMessage id = 'aelf.Password' /></div>
                    </div>
                    <InputItem
                        value={this.state.password}
                        type="password"
                        placeholder=""
                        onChange={password => this.setPassword(password)}
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    ></InputItem>
                </List>
            </div>
            <div className={style.bottom}>
                <div className='aelf-blank12'></div>
                <AelfButton
                    text='Clear Wallet'
                    aelficon='add_purple20'
                    onClick={() => this.clearWallet()}>
                </AelfButton>
            </div>
        </div>;
    }

    renderUnlock() {
        const {
            nightElfEncrypto,
            nightElf
        } = this.state.walletStatus || {};

        if (this.state.walletStatus && nightElfEncrypto && !nightElf) {
            return <div>
                <div className="aelf-input-container aelf-dash">
                    <List>
                        <div className="aelf-input-title">
                            <div><FormattedMessage id = 'aelf.Password' /></div>
                        </div>
                        <InputItem
                            value={this.state.password}
                            type="password"
                            placeholder=""
                            onChange={password => this.setPassword(password)}
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                        ></InputItem>
                    </List>
                </div>
                <div className={style.bottom}>
                    <div className='aelf-blank12'></div>
                    <AelfButton
                        text='Unlock Wallet'
                        aelficon='add_purple20'
                        onClick={() => this.unlockWallet()}>
                    </AelfButton>
                </div>
            </div>;
        }
        return <div></div>;
    }

    renderTestButtons() {
        return <div>
            <button onClick={() => this.checkWallet()}>checkWallet</button>
            {/* <button onClick={() => this.lockWallet()}>lockWallet</button> */}
            <button onClick={() => this.updateWallet()}>updateWallet</button>
            {/* <button onClick={() => this.clearWallet()}>clearWallet</button> */}
        </div>;
    }

    render() {
        let titleText = 'Welcome';
        let buttonHTML = '';
        let navHTML = '';
        const walletStatus = this.state.walletStatus;
        const {
            nightElfEncrypto,
            nightElf
        } = walletStatus || {};

        if (walletStatus) {
            if (!nightElfEncrypto) {
                buttonHTML = this.renderCreate();
            }
            else {
                if (!nightElf) {
                    buttonHTML = this.renderUnlock();
                }
                // else if (!this.isClear) {
                //     hashHistory.push('/home');
                //     return <div></div>;
                // }
                else if (this.isClear) {
                    buttonHTML = this.renderClear();
                    titleText = 'Delete';
                    navHTML = <NavNormal
                            onLeftClick={() => this.backClick()}
                        ></NavNormal>;
                }
            }
        }

        // const testHTML = this.renderTestButtons();
        const containerStyle = getPageContainerStyle();
        return (
            <div className={style.container} style={containerStyle}>
                {navHTML}

                <div className={style.top}>
                    <div className={style.blank}></div>
                    <p className={style.welcome}>{titleText}</p>
                    <p className={style.wallet}>Night ELF</p>
                    {/* <p className={style.description}>offcial</p> */}
                </div>

                {buttonHTML}
                {/* {testHTML} */}
            </div>
        );
    }
}
