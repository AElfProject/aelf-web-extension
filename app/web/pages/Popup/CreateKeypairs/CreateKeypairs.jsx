/**
 * @file Backup.jsx
 * @author huangzongzhe
 */

import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import {
    Toast,
    List,
    InputItem
} from 'antd-mobile';
import Mnemonic from './pages/Mnemonic';

import {historyPush} from '../../../utils/historyChange';
import NavNormal from '../../../components/NavNormal/NavNormal';
import NoticePanel from '../../../components/NoticePanel/NoticePanel';
import AelfButton from '../../../components/Button/Button';

import moneyKeyboardWrapProps from '../../../utils/utils';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import aelf from 'aelf-sdk';
import {FormattedMessage} from 'react-intl';
import style from './CreateKeypairs.scss';
// React component

export default class CreateKeypairs extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            // mnemonic: 'grocery jungle body action shop vast toilet fog prevent banner deliver indicate',
            mnemonic: '',
            mnemonicDisplay: false
        };
    }

    getPrivateKeyAndMnemonic(password = '') {
        this.setState({
            mnemonic: 'frame hold voyage figure bitter lizard better special local tell spot when'
        });
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

    createKeyPair() {
        if (!this.state.name.trim()) {
            Toast.fail('Please input name.', 3, () => { }, false);
            return;
        }

        const walletInfo = aelf.wallet.createNewWallet();
        // console.log('walletInfo: ', walletInfo);
        this.walletInfo = walletInfo;
        this.setState({
            mnemonic: walletInfo.mnemonic,
            mnemonicDisplay: true
        });
    }

    setName(name) {
        this.setState({
            name
        });
    }

    insertWallet() {
        const {address, mnemonic, privateKey, keyPair} = this.walletInfo;
        const name = this.state.name;
        let publicKey = keyPair.getPublic();
        const walletInfo = {
            name, address, mnemonic, privateKey,
            publicKey: {
                x: publicKey.x.toString('hex'),
                y: publicKey.y.toString('hex')
            }
        };
        InternalMessage.payload(InternalMessageTypes.INSERT_KEYPAIR, walletInfo).send().then(result => {
            console.log(InternalMessageTypes.INSERT_KEYPAIR, result);
            this.setState({
                walletStatus: result
            });
            hashHistory.push('/keypairs');
        });

        console.log('Is ready to insert wallet');
    }

    render() {

        let mnemonicHtml = '';
        if (this.state.mnemonic) {
            mnemonicHtml = <Mnemonic
                navTitle="Mnemonic"
                mnemonic={this.state.mnemonic}
                display={this.state.mnemonicDisplay}
                insertWallet={() => this.insertWallet()}
                onLeftClick={() => this.toggleMnemonic()}>
            </Mnemonic>;
        }

        return (
            <div className='aelf-bg-light'>
                {/*<NavNormal navTitle="导入钱包" */}
                <NavNormal
                    onLeftClick={() => historyPush('/keypairs')}
                ></NavNormal>

                {/* <NoticePanel
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
                            defaultMessage = 'Please backup your Mnemonic in a secure environment!'
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
                ></NoticePanel> */}
                <div className="aelf-input-container aelf-dash">
                    <List>
                        <div className="aelf-input-title">
                            <div><FormattedMessage id='aelf.Keypair Name' /></div>
                        </div>
                        <InputItem
                            value={this.state.name}
                            type="text"
                            placeholder=""
                            onChange={name => this.setName(name)}
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                        ></InputItem>
                    </List>
                </div>
                <div className={style.buttonContainer}>
                    <AelfButton
                        text='Create Keypair'
                        aelficon='add_purple20'
                        onClick={() => this.createKeyPair()}>
                    </AelfButton>
                </div>
                {mnemonicHtml}
            </div>
        );
    }
}
