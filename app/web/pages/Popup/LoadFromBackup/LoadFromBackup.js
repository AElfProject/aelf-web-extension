/**
 * @file LoadFromBackup.js
 * @author zhouminghui
*/


import React, {
    Component
} from 'react';

import AelfButton from '../../../components/Button/Button';
import NavNormal from '../../../components/NavNormal/NavNormal';
import {moneyKeyboardWrapProps} from '../../../utils/utils';
import {InputItem, List, Toast} from 'antd-mobile';
import {FormattedMessage} from 'react-intl';
import {hashHistory} from 'react-router';
import {createHmac} from 'crypto';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import style from './LoadFromBackup.scss';

function getSeed(password) {
    if (password) {
        const hmac = createHmac('sha512', password);
        const seed = hmac.update(password).digest('hex');
        return seed;
    }
    Toast.fail('Please input password', 3, () => {}, false);
    return false;
}

export default class LoadFromBackup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            fileName: ''
        };
    }

    getReturn() {
        location.href = '/popup.html';
    }

    setPassword(password) {
        this.setState({
            password
        });
    }

    importBackup() {
        const seed = getSeed(this.state.password);
        const {fileValue} = this.state;
        if (seed) {
            InternalMessage.payload(InternalMessageTypes.IMPORT_WALLET, {seed, fileValue}).send().then(result => {
                if (result && result.error === 0) {
                    hashHistory.push('/home');
                }
                else {
                    console.log(result);
                    Toast.fail(result.errorMessage.message, 3, () => {}, false);
                }
            });
        }
    }

    onChange(event) {
        event.persist();
        const reader = new FileReader();
        reader.readAsText(event.target.files[0], 'utf-8');
        reader.onloadstart = result => {
            Toast.loading('Loading...', 999, () => {});
            this.setState({
                fileName: event.target.files[0].name
            });
        };
        reader.onload = result => {
            Toast.hide();
            this.setState({
                fileValue: result.currentTarget.result
            });
        };
    }

    getFileNameHTML() {
        const {fileName} = this.state;
        return <div className="aelf-file-name">{fileName}</div>;
    }

    renderBackup() {
        const {fileName} = this.state;
        return <div style={{marginTop: '120px'}}>
            <div className="aelf-input-container aelf-dash">
                <List>
                    <div className='aelf-import-file'>
                        <FormattedMessage id = 'aelf.Please select the file' /> :
                        <div className={style.updateFile} >
                            <FormattedMessage id = 'aelf.Click here' />
                            <input
                                className={style.update}
                                type='file'
                                accept='.txt'
                                name='import-file'
                                onChange={this.onChange.bind(this)}
                            ></input>
                        </div>
                    </div>
                    <div className={style.fileName}>{fileName}</div>
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
                    text='Submit Backup'
                    aelficon='in20'
                    onClick={() => this.importBackup()}>
                </AelfButton>
            </div>
        </div>;
    }

    render() {
        let confirmHTML = this.renderBackup();
        let titleText = 'Import';
        return (
            <div className={style.container}>
                <NavNormal
                    onLeftClick={() => this.getReturn()}
                ></NavNormal>
                 <div className={style.top}>
                    <p className={style.welcome} style={{marginTop: '17px'}}>{titleText}</p>
                    <p className={style.wallet}>NIGHT ELF</p>
                    {/* <p className={style.description}>offcial</p> */}
                </div>
                {confirmHTML}
            </div>
        );
    }
}
