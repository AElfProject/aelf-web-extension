/**
 * @file popup.js
 * @author huangzongzhe(hzz780)
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    Route,
    hashHistory
} from 'react-router';
import {LocaleProvider} from 'antd-mobile';
import {IntlProvider, addLocaleData} from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import {antdChooseLocale, chooseLocale} from '../../utils/utils';
// import TransactionDetail from './pages/Asset/TransactionDetail/TransactionDetail';
// import style from '../style/index.scss';
// import Lock from './Lock/Lock';
// import Home from './Home/Home';
// import Backup from './Backup/Backup';
// import Keypairs from './Keypairs/Keypairs';
// import Permissions from './Permissions/Permissions';
// import Contracts from './Contracts/Contracts';
import Permission from './Permission/Permission';
import Prompt from './Prompt/Prompt';
import LoginKeypairs from './LoginKeypairs/LoginKeypairs';
import ConfirmationCall from './ConfirmationCall/ConfirmationCall';
import ChangePermission from './ChangePermission/ChangePermission';
import Lock from './Unlock/Lock';

addLocaleData([...zh, ...en]);

ReactDOM.render(
    <IntlProvider locale={navigator.language} messages={chooseLocale()} >
        <LocaleProvider locale={antdChooseLocale()} >
            <Router history={hashHistory}>
                <Route path="/" component={Permission}/>
                <Route path="/prompt" component={Prompt}/>
                <Route path="/loginkeypairs" component={LoginKeypairs}/>
                <Route path='/confirmation' component={ConfirmationCall}/>
                <Route path='/changepermission' component={ChangePermission}/>
                <Route path='/unlock' component={Lock}/>
            </Router>
        </LocaleProvider>
    </IntlProvider>,
    document.getElementById('root')
);
