/**
 * @file LoginKeypairs
 * @author zhouminghui
*/

import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import {Toast, SearchBar, ListView} from 'antd-mobile';
import {FormattedMessage} from 'react-intl';
import {
    getPageContainerStyle,
    clipboard,
    addressOmit
} from '../../../utils/utils';
import Svg from '../../../components/Svg/Svg';
import {apis} from '../../../utils/BrowserApis';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import AelfButton from '../../../components/Button/Button';
import style from './LoginKeypairs.scss';
import errorHandler from "../../../utils/errorHandler";
require('./LoginKeypairs.css');

const NUM_ROWS = 9999;
const pageSize = 9999;
export default class LoginKeypairs extends Component {
    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const message = data.message;

        const {
            appName,
            payload,
            domain,
            chainId,
            hostname
        } = message;

        this.permission = {
            appName,
            domain: hostname,
            address: payload.payload.address,
            contracts: payload.payload.contracts || []
        };

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.rData = [];

        this.state = {
            appName,
            hostname,
            domain,
            chainId,
            payload,
            searchValue: '',
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            hasKeypairs: false
        };

        this.renderRow = (rowData, sectionID, rowID) => {
            let item = this.rData[rowID];
            const clipboardID = 'clipboard-keypair-' + rowID;
            const address = item.address;
            setTimeout(() => {
                clipboard(`#${clipboardID}`, addressOmit(address, 15, 56));
            }, 10);
            return (
                <div key={rowID}
                    className={style.txList}
                >
                    {/* <div className={style.keypairsNickname}>{item.name}</div> */}
                    <div className={style.keypairAddress}>
                        <div className={style.address}>
                          <div>Name: {item.name}</div>
                          <div>ID: {address}</div>
                        </div>
                        <div className={style.login} onClick={() => this.setPermission(address)}>
                            <FormattedMessage
                                id='aelf.Login'
                            />
                        </div>
                    </div>
                </div>
            );
        };
    }


    async setPermission(address) {
        // Why do we do this?
        // Because two prompt pages cannot be opened at the same time, and route cannot pass values using /:address
        if (!address) {
            return;
        }
        try {
            await this.checkWallet(address);
        } catch(error) {
            Toast.fail(`Login failed. ${address} ${error.message}`, 3, () => {}, false);
        }
    }

    // no more turn to permission page.
    async turnToPermissionPage(walletStatus, address) {
        const {
            nightElf
        } = walletStatus || {};
        if (!nightElf) {
            Toast.fail('Night Elf is locked!', 3);
            return;
        }

        const addressInfoInNightElf = await InternalMessage.payload(InternalMessageTypes.GET_ADDRESS).send();
        const keypairMessage = addressInfoInNightElf.addressList.filter(item => {
            return item.address === address;
        });

        let detail = null;
        if (keypairMessage && keypairMessage.length) {
            detail = JSON.stringify(keypairMessage[0]);
        } else {
            Toast.fail(`No matched wallet. ${address}`, 3, () => {}, false);
            return;
        }

        this.permission.address = address;
        const setResult = await InternalMessage.payload(InternalMessageTypes.SET_LOGIN_PERMISSION, this.permission).send();
        if (setResult.error === 0) {
            Toast.success('Login Success, after 3s close the window.');
            window.data.sendResponse({
                ...errorHandler(0),
                detail,
                message: 'Login & Bind information success'
            });
            setTimeout(() => {
                window.close();
            }, 3000);
        }
        else {
            Toast.fail(setResult.message, 3, () => {}, false);
        }
    }

    async checkWallet(address) {
        const checkWalletResult = await InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send();
        await this.turnToPermissionPage(checkWalletResult, address);
    }

    renderSearch() {
        return <div className={style.keypairsSearch}>
                    <SearchBar
                        placeholder='Search'
                        cancelText='Cancel'
                        onChange={e => this.setSearch(e)}
                    />
                </div>;
    }

    setSearch(e) {
        this.setState({
            setSearch: e
        });
    }


    componentDidMount() {
        const hei = this.state.height - 142;
        this.getKeypairs(result => {
            this.rData = result;
            if (result.length > 0) {
                this.setState({
                    hasKeypairs: true
                });
            }
            else {
                this.setState({
                    hasKeypairs: false
                });
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                height: hei,
                refreshing: false,
                isLoading: false
            });
        });
    }

    getKeypairs(callback) {
        InternalMessage.payload(InternalMessageTypes.GET_KEYPAIR).send().then(result => {
            if (result.error === 0 && result.keypairs) {
                callback(result.keypairs);
            }
            else {
                if (result.error === 200005) {
                    Toast.fail(result.errorMessage.message, 3, () => {}, false);
                }
                else {
                    Toast.fail('No Keypair in Wallet.', 3, () => {}, false);
                }
            }
        });
    }

    renderNoKeypairs() {
        return <div>
                    <div className={style.noKeypairs}>
                        <Svg icon='notice32' /> No Keypairs !
                    </div>
                    <div className={style.noKeypairsTips}>
                        You do not have keypairs available yet. Go to the extension and create your ELF Keypair<br></br>
                        Retrieve the authorization page by refreshing the page!
                    </div>
                    <AelfButton
                        type='transparent'
                        style={{width: '50%', margin: '30px auto'}}
                        text='Cancel'
                        onClick={() => window.close()}
                    />
                </div>;
    }

    renderKeypairs() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 166;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        // let containerStyle = Object.assign({}, backgroundStyle);
        return <div className={style.background} style={backgroundStyle}>
                    <div className={style.transactionList}>
                        <ListView
                            initialListSize={NUM_ROWS}
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => ScrollFooter(this.state.isLoading, this.state.hasMore)}
                            renderRow={this.renderRow}
                            useBodyScroll={this.state.useBodyScroll}
                            style={this.state.useBodyScroll ? {} : {
                                // height: this.state.height - 100,
                                height: '100%'
                            }}
                            pageSize={pageSize}
                        />
                    </div>
                </div>;
    }

    render() {
        const {appName, hasKeypairs} = this.state;
        const pageContainerStyle = getPageContainerStyle();
        let keypairsHTML = '';
        if (hasKeypairs) {
            keypairsHTML = this.renderKeypairs();
        }
        else {
            keypairsHTML = this.renderNoKeypairs();
        }
        // const searchHTML = this.renderSearch();
        return (
            <div className={style.container} style={pageContainerStyle}>
                <div className={style.appLogin}>
                    <div className={style.appName}>
                        <div>
                            {appName}
                        </div>
                        <div className={style.loginTip}>
                            <FormattedMessage
                                id='aelf.Login'
                            />
                        </div>
                    </div>
                    {keypairsHTML}
                </div>
            </div>
        );
    }

}
