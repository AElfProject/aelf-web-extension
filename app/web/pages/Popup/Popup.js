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
import Lock from './Lock/Lock';
import Home from './Home/Home';
import Backup from './Backup/Backup';
import Keypairs from './Keypairs/Keypairs';
import Permissions from './Permissions/Permissions';
import Contracts from './Contracts/Contracts';

addLocaleData([...zh, ...en]);

ReactDOM.render(
    <IntlProvider locale={navigator.language} messages={chooseLocale()} >
        <LocaleProvider locale={antdChooseLocale()} >
            <Router history={hashHistory}>
                <Route path="/" component={Lock}></Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/backup" component={Backup}></Route>
                <Route path="/keypairs" component={Keypairs}></Route>
                <Route path="/permissions" component={Permissions}></Route>
                {/* TODO: contracts just for test */}
                <Route path="/contracts" component={Contracts}></Route>
            </Router>
        </LocaleProvider>
    </IntlProvider>,
    document.getElementById('root')
);
