/**
 * @file Lock.js
 * @author huangzongzhe, zhouminghui
 */

import React, {
    Component
} from 'react';
import {hashHistory} from 'react-router';
import {createHmac} from 'crypto';
import {
    Toast,
    List,
    InputItem,
    Picker
} from 'antd-mobile';

import style from './Lock.scss';
// Replace antd style
import './TimingLock.css';
import AelfButton from '../../../components/Button/Button';
import {getPageContainerStyle, moneyKeyboardWrapProps, getParam} from '../../../utils/utils';
import Password from '../../../components/Password/Password';
import NavNormal from '../../../components/NavNormal/NavNormal';
import AgreementZh from './components/AgreementZh';
import AgreementEn from './components/AgreementEn';
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
            walletStatus: false,
            timingLockTimes: 0,
            agreement: false,
            showOption: false,
            language: navigator.language
        };
        const action = getParam('action', location.href);
        const isClear = action === 'clear_wallet';
        const isBackup = action === 'backup_wallet';
        const isTimingLock = action === 'timing_lock';
        this.marginStyle = {marginTop: '154px'};
        this.isClear = isClear;
        this.isBackup = isBackup;
        this.isTimingLock = isTimingLock;
        this.timingLockData = [
            {
                label: 'never lock',
                value: 0
            },
            {
                label: '1 minute',
                value: 60000
            },
            {
                label: '5 minutes',
                value: 300000
            },
            {
                label: '15 minutes',
                value: 900000
            },
            {
                label: '1 hour',
                value: 3600000
            },
            {
                label: '2 hours',
                value: 7200000
            },
            {
                label: '4 hours',
                value: 14400000
            }
        ];
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

        if (nightElfEncrypto && nightElf && !this.isClear && !this.isBackup && !this.isTimingLock) {
            hashHistory.push('/home');
        }
        else {
            callback();
        }
    }

    checkWallet() {
        InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
            this.turnToHomePage(result, () => {
                this.setState({
                    walletStatus: result
                });
            });
        });
    }

    componentDidMount() {
        this.checkWallet();
        this.checkTime();
    }

    componentWillUnmount() {
        this.setState = () => {};
    }

    createWallet() {
        const seed = getSeed(this.state.password);
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.CREAT_WALLET, seed).send().then(result => {
                console.log(InternalMessageTypes.SET_SEED, seed, result);
                if (result && result.error === 0) {
                    Toast.success('Create Success', 1, () => {
                        this.setState({
                            agreement: false
                        });
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
        const iframe = document.getElementById('sandbox');
        window.addEventListener('message', (event) => { 
            console.log('EVAL output', event.data); 
        });
        console.log(iframe, 'iframe===')
        iframe.contentWindow.postMessage({event: 'sandbox', data:'10 + 20'}, '*');

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
        else if (this.backupFailed) {
            this.checkWallet();
        }
        else {
            hashHistory.push('/extensionmanager');
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

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >         Backup  wallet        >
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    backupWallet() {
        const seed = getSeed(this.state.password);
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.BACKUP_WALLET, seed).send().then(result => {
                if (result && result.error === 0) {
                    hashHistory.push('/extensionmanager');
                }
                else {
                    Toast.fail('Backup failed!');
                    InternalMessage.payload(InternalMessageTypes.LOCK_WALLET).send().then(result => {
                        this.backupFailed = true;
                    });
                    return;
                }
            }).catch(error => {
                Toast.fail('Backup Wallet Failed.', 3, () => {}, false);
            });
        }
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >      Load From Backupt        >
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    loadFromBackup() {
        hashHistory.push('/loadfrombackup');
    }


    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >         Timing  lock          >
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    getLockTime(value) {
        console.log(value);
        this.setState({
            timingLockTimes: value
        });
    }

    getTimingLock() {
        const {timingLockTimes} = this.state;
        let time = timingLockTimes;
        InternalMessage.payload(InternalMessageTypes.GET_TIMING_LOCK, time).send().then(result => {
            console.log(InternalMessageTypes.GET_TIMING_LOCK, time, result);
            if (result.error !== 0) {
                Toast.fail('Timing Lock Setting Failed.', 3, () => {}, false);
            }
            else {
                Toast.success('Timing Lock Setting Success.', 3, () => {}, false);
            }
        });
    }

    checkTime() {
        InternalMessage.payload(InternalMessageTypes.CHECK_INACTIVITY_INTERVAL).send().then(result => {
            if (result) {
                const lockTime = result.result.inactivityInterval;
                const timingLockTimes = this.timingLockData.filter(item => {
                    return item.value === lockTime;
                });
                this.setState({
                    timingLockTimes: timingLockTimes[0].value
                });
            }
        });
    }


    getAgreement() {
        console.log(this.state, 'this.state')
        const {password} = this.state;
        console.log(password, 'passwordpassword')
        if (password) {
            this.setState({
                agreement: true
            });
        }
        else {
            Toast.fail('Please re-enter your password and confirm it.', 3, () => {}, false);
        }
    }

    showOption() {
        const {showOption} = this.state;
        this.setState({
            showOption: !showOption
        });
    }

    // if there is no wallet in browser.storage [chrome.storage]
    // We need create a wallet and insert it into storage.
    renderCreate() {
        return <div>
            <Password
                setPassword={password => this.setPassword(password)}
                onKeyUp={()=>this.getAgreement()}
            />
            <div className={style.createBottom}>
                <div className='aelf-blank12'/>
                <AelfButton
                    text='Create Wallet'
                    type='createbtn'
                    // aelficon='add_purple20'
                    onClick={() => this.getAgreement()}
                    style={{margin: '38px 0 12px'}}
                >
                </AelfButton>
                <AelfButton
                    // type='transparent'
                    text='Load From Backup'
                    type='createbtn'
                    style={{background: '#fff', color: '#502EA2', border: '1px solid #502EA2'}}
                    // aelficon='in20'
                    onClick={() => this.loadFromBackup()}>
                </AelfButton>
            </div>
        </div>;
    }

    renderClear() {
        return <div style={this.marginStyle}>
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
                        onKeyUp={(e)=>this.onKeyup(e,'Clear Wallet')}
                    />
                </List>
            </div>
            <div className={style.bottom}>
                <div className='aelf-blank12'/>
                <div className='aelf-blank12'/>
                <AelfButton
                    text='Clear Wallet'
                    type='createbtn'
                    aelficon='add_purple20'
                    onClick={() => this.clearWallet()}>
                </AelfButton>
            </div>
        </div>;
    }

    onKeyup(e,type) {
        if(e.keyCode === 13) {
            if(type === 'Unlock Wallet') {
                this.unlockWallet()
                return;
            }else if(type === 'Backup NightELF') {
                this.backupWallet();
                return;
            }else if(type === 'Clear Wallet') {
                this.clearWallet();
                return;
            }
        }
    }

    renderUnlock() {
        const {
            nightElfEncrypto,
            nightElf
        } = this.state.walletStatus || {};

        if (this.state.walletStatus && nightElfEncrypto && !nightElf) {
            return <div style={this.marginStyle}>
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
                            onKeyUp={(e)=>this.onKeyup(e,'Unlock Wallet')}
                        />
                    </List>
                </div>
                <div className={style.bottom}>
                    <div className='aelf-blank12'/>
                    <div className='aelf-blank12'/>
                    <AelfButton
                        text='Unlock Wallet'
                        type='createbtn'
                        aelficon='add_purple20'
                        onClick={() => this.unlockWallet()}>
                    </AelfButton>
                </div>
            </div>;
        }
        return <div/>;
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >         Backup  wallet        >
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    renderBackup() {
        return <div style={this.marginStyle}>
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
                        onKeyUp={(e)=>{this.onKeyup(e, 'Backup NightELF')}}
                    />
                </List>
            </div>
            <div className={style.bottom}>
                <div className='aelf-blank12'/>
                <div className='aelf-blank12'/>
                <AelfButton
                    text='Backup NightELF'
                    type='createbtn'
                    aelficon='add_purple20'
                    onClick={() => this.backupWallet()}>
                </AelfButton>
            </div>
        </div>;
    }


    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >      Timing  lock  render     >
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    renderTimingLock() {
        const {showOption} = this.state;
        let renderOption = '';
        if (showOption) {
            renderOption = this.renderOption();
        }
        else {
            renderOption = <div/>;
        }
        const obj = this.timingLockData.filter(item => {
            return this.state.timingLockTimes === item.value;
        });
        return <div>
            <div className="aelf-input-container aelf-dash">
                <div className={style.lockTip}>
                    <FormattedMessage
                        id='aelf.Please select the timing lock-in time:'
                    />
                </div>
                <div className={style.timeLock} onClick={() => this.showOption()}>
                    <div className={style.label}>
                        {obj[0].label}
                    </div>
                    <div className={style.uselessTriangle}>▼</div>
                    {renderOption}
                </div>
            </div>
            <div className={style.bottom} style={{marginTop: '170px'}}>
                <div className='aelf-blank12'/>
                <div className='aelf-blank12'/>
                <AelfButton
                    text='Submit'
                    type='createbtn'
                    aelficon='add_purple20'
                    onClick={() => this.getTimingLock()}>
                </AelfButton>
            </div>
        </div>;
    }

    renderOption() {
        const options = this.timingLockData. map(item => {
            return <div
                key={item.value}
                className={style.option}
                onClick={() => this.getLockTime(item.value)}
            >{item.label}</div>;
        });

        return <div className={style.select}>{options}</div>;
    }

    renderTestButtons() {
        return <div>
            <button onClick={() => this.checkWallet()}>checkWallet</button>
            {/* <button onClick={() => this.lockWallet()}>lockWallet</button> */}
            <button onClick={() => this.updateWallet()}>updateWallet</button>
            {/* <button onClick={() => this.clearWallet()}>clearWallet</button> */}
        </div>;
    }

    renderAgreementContent() {
        let content = <div></div>;
        if (this.state.language === 'zh-CN') {
            content = <AgreementZh />;
        }
        else {
            content = <AgreementEn />;
        }
        return <div className={style.agreementContent}>
                    {content}
                </div>;
    }

    renderAgreement() {
        const btnStyle = {
            height: '47px',
            lineHeight: '47px',
            fontSize: '16px',
            fontWeight: 'nomarl',
            fontFamily: 'HelveticaNeue'
        };
        const agreementContent = this.renderAgreementContent();
        return <div>
                    <div className={style.top}>
                        <p className={style.walletAgree}>NIGHT ELF</p>
                        <div className={style.agreementBox}>
                            <div className={style.agreementHead}/>
                            {agreementContent}
                        </div>
                        <div className={style.bottom}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                margin: '25px 0 24px 0'
                            }}>
                            <div style={{width: '48%'}} >
                                <AelfButton
                                style={btnStyle}
                                    text='Agree'
                                    type='createbtn'
                                    onClick={() => this.createWallet()}>
                                </AelfButton>
                            </div>
                            <div style={{width: '48%'}} >
                                <AelfButton
                                    // type='transparent'
                                    type='createbtn'
                                    style={{
                                        ...btnStyle, background: '#fff', 
                                        color: '#502EA2',
                                        border: '1px solid #502EA2'}}
                                    // style={{...btnStyle}}
                                    text='Refuse'
                                    onClick={() => this.setState({agreement: false})}>
                                </AelfButton>
                            </div>
                        </div>
                        {/* <p className={style.description}>offcial</p> */}
                    </div>
                </div>;
    }

    render() {
        const {agreement} = this.state;
        let titleText = 'Welcome';
        let buttonHTML = '';
        let navHTML = '';
        let bodyHTML = '';
        let margin = {
            marginTop: '14px'
        };
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
                    margin.marginTop = '17px';
                    navHTML = <NavNormal
                            onLeftClick={() => this.backClick()}
                        />;
                }
                else if (this.isBackup) {
                    buttonHTML = this.renderBackup();
                    titleText = 'Backup';
                    margin.marginTop = '17px';
                    navHTML = <NavNormal
                            onLeftClick={() => this.backClick()}
                        />;
                }
                else if (this.isTimingLock) {
                    buttonHTML = this.renderTimingLock();
                    titleText = 'Timing Lock';
                    margin.marginTop = '17px';
                    navHTML = <NavNormal
                            onLeftClick={() => this.backClick()}
                        />;
                }
            }
        }

        const containerStyle = getPageContainerStyle();
        if (agreement) {
            bodyHTML = this.renderAgreement();
        }
        else {
            bodyHTML = <div>
                            {navHTML}
                            <div className={style.top}>
                                {this.isTimingLock ? '' : <div className={style.logo}/>}
                                <p className={style.welcome} style={margin}>{titleText}</p>
                                <p className={style.wallet}>NIGHT ELF</p>
                                <p className={style.version}>{process.env.SDK_VERSION}</p>
                            </div>
                            {buttonHTML}
                            {/* {testHTML} */}
                        </div>;
        }

        // const testHTML = this.renderTestButtons();
        return (
            <div className={style.container} style={containerStyle}>
                {bodyHTML}
            </div>
        );
    }
}
