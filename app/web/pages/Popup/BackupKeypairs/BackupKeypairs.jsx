/**
 * @file BackupKeypairs.js
 * @author zhouminghui
*/
import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import {Modal, Toast} from 'antd-mobile';
import style from './BackupKeypairs.scss';
import Mnemonic from './pages/Mnemonic';
import clipboard from '../../../utils/clipboard';
import getPageContainerStyle from '../../../utils/getPageContainerStyle';

import AelfButton from '../../../components/Button/Button';
import NoticePanel from '../../../components/NoticePanel/NoticePanel';

import NavNormal from '../../../components/NavNormal/NavNormal';

import {FormattedMessage} from 'react-intl';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import insert from '../../../utils/insert';
import checkWallet from '../../../utils/checkWallet';
import {createHmac} from 'crypto';

const prompt = Modal.prompt;


function getSeed(password) {
    if (password) {
        const hmac = createHmac('sha512', password);
        const seed = hmac.update(password).digest('hex');
        return seed;
    }
    Toast.fail('Please input password', 3, () => {}, false);
    return false;
}

// React component
@insert(checkWallet)
export default class BackupKeypairs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            privateKey: '',
            // mnemonic: 'grocery jungle body action shop vast toilet fog prevent banner deliver indicate',
            mnemonic: '',
            password: '',
            mnemonicDisplay: false,
            privateKeyModal: false,
            passwordModal: false,
            walletStatus: false,
            containerStyle: null,
            isVerification: true,
            address: this.props.params.address || ''
        };
        clipboard('#clipboard-backup');
    }

    showModal(e, key) {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true
        });
    }

    componentDidMount() {
        this.checkWalletInfo();
        let containerStyle = getPageContainerStyle();
        this.setState({
            containerStyle
        });
    }

    onClose(key) {
        this.setState({
            [key]: false
        });
    }

    // getPrivateKeyAndMnemonic(password = '') {
    //     password = password || this.state.password;

    //     let walletId = JSON.parse(localStorage.getItem('lastuse')).address;
    //     let walletInfoList = JSON.parse(localStorage.getItem('walletInfoList'));
    //     let walletInfo = walletInfoList[walletId];

    //     let privateKey = '';
    //     let mnemonic = '';

    //     try {
    //         privateKey = aelf.wallet.AESDecrypto(walletInfo.AESEncryptoPrivateKey, password);
    //         mnemonic = aelf.wallet.AESDecrypto(walletInfo.AESEncryptoMnemonic, password);
    //     } catch (e) {
    //         // 因为封装了一层，解密错误时，转换成utf-8会抛出异常。
    //         // let string = '[ERROR] Hey guy, your invalid password make the program crash.';
    //         // privateKey = string;
    //         // mnemonic = string;
    //     }

    //     if (privateKey || mnemonic) {
    //         this.setState({'privateKey': privateKey});
    //         this.setState({'mnemonic': mnemonic});
    //         return true
    //     } else {
    //         Toast.fail('Wrong Password', 1, () => {}, false);
    //     }
    //     return false;

    // }

    getPrivateKeyAndMnemonic(password = '', type) {
        console.log(password);
        let seed = getSeed(password);
        const {address} = this.state;
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.UNLOCK_WALLET, seed).send().then(result => {
                console.log(result);
                if (result && result.error === 0) {
                    InternalMessage.payload(InternalMessageTypes.GET_KEYPAIR).send().then(result => {
                        if (result && result.error === 0) {
                            result.keypairs.map(item => {
                                if (item.address === address) {
                                    if (type === 'Mnemonic') {
                                        this.setState({
                                            mnemonic: item.mnemonic,
                                            mnemonicDisplay: !this.state.mnemonicDisplay,
                                            isVerification: true
                                        });
                                    }
                                    else {
                                        this.setState({
                                            privateKey: item.privateKey,
                                            privateKeyModal: !this.state.privateKeyModal,
                                            isVerification: true
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    this.setState({
                        isVerification: false
                    });
                    Toast.fail('Password error', 3, () => {}, false);
                }
            });
        }

    }

    inputPassword(password) {
        this.setState({password});
    }

    // 子组件要用，要么this.toggleMnemonic = this.toggleMnemonic.bind(this);
    // 要么在传递是使用箭头函数，比如: onLeftClick={() => this.toggleMnemonic()}
    toggleMnemonic() {
        this.setState({
            mnemonicDisplay: !this.state.mnemonicDisplay
        });
    }

    componentDidUpdate() {
        if (this.state.mnemonicDisplay && !this.state.mnemonic) {
            this.state.mnemonicDisplay = false;
            // Toast.fail('该钱包是由私钥导入，无助记词', 2, () => {}, false);
            Toast.fail('There is no Mnemonic because the wallet import by Private Key.', 2, () => {}, false);
        }
    }


    goNextPage() {
        const {isVerification} = this.state;
        if (isVerification) {
            hashHistory.push('/keypairs');
        }
        else {
            InternalMessage.payload(InternalMessageTypes.LOCK_WALLET).send().then(result => {
                hashHistory.push('/');
            });
        }
    }

    render() {
        const {containerStyle, jumpPosition} = this.state;
        let mnemonicHtml = '';
        if (this.state.mnemonic) {
            mnemonicHtml = <Mnemonic
                                navTitle="Mnemonic"
                                mnemonic={this.state.mnemonic}
                                display={this.state.mnemonicDisplay}
                                onLeftClick={() => this.toggleMnemonic()}
                                containerStyle={containerStyle}
                            >
                            </Mnemonic>;
        }
        // let containerStyle = getPageContainerStyle();
        console.log(jumpPosition);
        return (
            <div>
                <div className={style.space3}></div>
                {/*<NavNormal navTitle="导入钱包" */}
                <NavNormal
                    onLeftClick={() => this.goNextPage()}
                />
                <div className={style.space3}></div>
                <div className={style.container} style={containerStyle}>
                    <div className={style.textContainer}>
                        <NoticePanel
                            mainTitle={
                                <FormattedMessage
                                    id = 'aelf.Backup Wallet'
                                    defaultMessage = 'Backup Wallet'
                                />
                            }
                            subTitle={[
                                <FormattedMessage
                                    id = 'aelf.AElf Wallet'
                                    defaultMessage = 'AElf Wallet'
                                />,
                                <FormattedMessage
                                    id = 'aelf.Manage your wallet addresses'
                                    defaultMessage = 'Manage your wallet addresses'
                                />
                            ]}
                            content={[
                                // '请在安全的环境下备份助记词！',
                                // '没有妥善备份就无法保障资产安全；',
                                // '删除程序或钱包后，',
                                // '您需要通过备份的助记词来会恢复钱包！'
                                <FormattedMessage
                                    id = 'aelf.Becareful03'
                                    defaultMessage = 'Please backup your Mnemonic and Private Key are in a secure environment!'
                                />,
                                <FormattedMessage
                                    id = 'aelf.Becareful04'
                                    defaultMessage = 'No secure Mnemonic backup means no secure wallet.'
                                />,
                                <FormattedMessage
                                    id = 'aelf.Becareful05'
                                    defaultMessage = 'In the case of wallet or App deletion,'
                                />,
                                <FormattedMessage
                                    id = 'aelf.Becareful06'
                                    defaultMessage = 'you will need your Mnemonic to recover your wallet.'
                                />
                            ]}
                        />
                    </div>

                    <div className={style.bottom}>

                        <AelfButton
                            text='Mnemonic'
                            type='createbtn'
                            onClick={e => prompt(
                                'Password',
                                'Please protect your password from data leaks.',
                                [
                                    {text: 'Cancel'},
                                    {text: 'Submit', onPress: password => {
                                            this.getPrivateKeyAndMnemonic(password, 'Mnemonic');
                                        }
                                    }
                                ],
                                'secure-text',
                            )}
                            // onClick={(e) => prompt(
                            //     '密码',
                            //     '请确保您处于安全的环境中',
                            //     [
                            //         { text: '取消' },
                            //         { text: '提交', onPress: password => {
                            //                 let boolean = this.getPrivateKeyAndMnemonic(password);
                            //                 boolean && this.toggleMnemonic();
                            //             }
                            //         },
                            //     ],
                            //     'secure-text',
                            // )}
                        />

                        <div className='aelf-blank12'/>

                        <AelfButton
                            text='Private Key'
                            type='createbtn'
                            style={{ background: '#fff', color: '#502EA2', border: '1px solid #502EA2'}}
                            onClick={e => {
                                // be nullified after the event callback has been invoked,
                                // if dont e.persist(), we can't get e.preventDefault in this.showModal
                                // https://reactjs.org/docs/events.html#event-pooling
                                e.persist();
                                prompt(
                                    'Password',
                                    'Please protect your password from data leaks.',
                                    [
                                        {text: 'Cancel'},
                                        {text: 'Submit', onPress: password => {
                                                this.getPrivateKeyAndMnemonic(password, 'privateKey');
                                            }
                                        }
                                    ],
                                    'secure-text',
                                );
                            }
                            }
                        />
                        {/*<AelfButton*/}
                            {/*text='备份助记词'*/}
                            {/*onClick={e => {*/}
                                {/*this.showModal(e, 'passwordModal')*/}
                            {/*}}*/}
                        {/*></AelfButton>*/}
                    </div>
                </div>

                {/*<Modal*/}
                    {/*popup*/}
                    {/*visible={this.state.passwordModal}*/}
                    {/*onClose={() => this.onClose('passwordModal')}*/}
                    {/*animationType="slide-up"*/}
                {/*>*/}
                    {/*<div style={{ height: 100, wordWrap: 'break-word' }}>*/}
                        {/*<InputItem*/}
                            {/*value={this.state.password}*/}
                            {/*type="password"*/}
                            {/*placeholder=""*/}
                            {/*onChange={password => this.inputPassword(password)}*/}
                            {/*moneyKeyboardWrapProps={moneyKeyboardWrapProps}*/}
                        {/*></InputItem>*/}
                    {/*</div>*/}
                    {/*<Button onClick={() => this.onClose('passwordModal')}>提交</Button>*/}
                {/*</Modal>*/}

                {/*<Modal*/}
                  {/*visible={this.state.privateKeyModal}*/}
                  {/*transparent*/}
                  {/*maskClosable={false}*/}
                  {/*onClose={() => this.onClose('privateKeyModal')}*/}
                  {/*title="私钥"*/}
                  {/*footer={[*/}
                    {/*{*/}
                        {/*text: '关闭',*/}
                        {/*onPress: () => {*/}
                            {/*this.onClose('privateKeyModal');*/}
                        {/*}*/}
                    {/*}]}*/}
                  {/*wrapProps={{ onTouchStart: this.onWrapTouchStart }}*/}
                {/*>*/}
                  {/*<div style={{ height: 100, wordWrap: 'break-word' }}>*/}
                    {/*{this.state.privateKey}*/}
                    {/*<textarea id="privateKeyBackUp"*/}
                        {/*className={style.textarea}*/}
                        {/*defaultValue={this.state.privateKey}>*/}
                    {/*</textarea>*/}

                    {/*<Button  */}
                    {/*onClick={() => {*/}
                        {/*let btn = document.getElementById('clipboard-backup');*/}
                        {/*btn.click();*/}
                    {/*}}>复制</Button>*/}
                    {/*<button id="clipboard-backup" data-clipboard-target="#privateKeyBackUp" style={{display: 'none'}}>copy</button>*/}
                  {/*</div>*/}
                {/*</Modal>*/}

                <Modal
                    popup
                    visible={this.state.privateKeyModal}
                    onClose={() => this.onClose('privateKeyModal')}
                    animationType="slide-up"
                >
                    <div>
                        <div className={style.pannelTitle}>
                            <FormattedMessage
                                id = 'aelf.Copy Private Key'
                                defaultMessage = 'Copy Private Key'
                            />
                        </div>
                        <div className={style.copyArea}>
                            <div style={{width: '100%'}}>
                                {this.state.privateKey}
                            </div>
                            <textarea
                                id="privateKeyBackUp"
                                className={style.textarea}
                                defaultValue={this.state.privateKey}>
                            </textarea>
                        </div>

                        <div
                            className={style.pannelBtnPurple}
                            onClick={() => {
                                let btn = document.getElementById('clipboard-backup');
                                btn.click();
                            }}
                        >
                            <FormattedMessage
                                id = 'aelf.Copy'
                                defaultMessage = 'Copy'
                            />
                        </div>
                        <div
                            className={style.pannelBtnPurple + ' ' + style.pannerlBtnGrey}
                            onClick={() => this.onClose('privateKeyModal')}
                        >
                            <FormattedMessage
                                id = 'aelf.Close'
                                defaultMessage = 'Close'
                            />
                        </div>
                        <button
                            id="clipboard-backup"
                            data-clipboard-target="#privateKeyBackUp"
                            style={{display: 'none'}}
                        >copy</button>
                    </div>
                </Modal>
               {mnemonicHtml}
            </div>
        );
    }
}
