/**
 * @file LoginKeypairs
 * @author zhouminghui
*/

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Toast, Flex, SearchBar, ListView} from 'antd-mobile';
import {FormattedMessage} from 'react-intl';
import {
    getPageContainerStyle,
    clipboard,
    addressOmit
} from '../../../utils/utils';
import {apis} from '../../../utils/BrowserApis';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import style from './LoginKeypairs.scss';
require('./LoginKeypairs.css');

const NUM_ROWS = 9999;
const pageSize = 9999;
export default class LoginKeypairs extends Component {
    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const message = data.message;
        const {
            appName
        } = message;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.rData = [];
        this.state = {
            appName,
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
            const keypairAddressText = 'keypair-text-' + rowID;
            const address = item.address;
            setTimeout(() => {
                clipboard(`#${clipboardID}`, addressOmit(address, 15, 56));
            }, 10);
            return (
                <div key={rowID}
                    className={style.txList}
                >
                    <div className={style.txListMask}></div>
                    {/* <div className={style.keypairsNickname}>{item.name}</div> */}
    
                    <div className={style.operationContainer}>
                        <div className={style.operationList}>
                            {item.name}
                            <div
                                className = {
                                    style.keypairBtnContainer + ' ' + style.copyBtn
                                }
                                onClick={() => {
                                    let btn = document.getElementById(clipboardID);
                                    btn.click();
                                }}
                            ></div>
                            <button id={clipboardID}
                                    data-clipboard-target={`#${keypairAddressText}`}
                                    className={style.textarea}>copy
                            </button>
                            <input id={keypairAddressText}
                                type="text"
                                className={style.textarea}
                                value={address}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className={style.keypairsAddress}>{address}</div>
                </div>
            );
        };
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
            console.log(result);
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

    

    noKeypairs() {
        return <div className={style.noKeypairsTips}>
                    你还没有可用的 keypair 请到扩展中创建你的 ELF Keypair <br></br>
                    通过刷新页面来重新获取授权页！
                </div>;
    }

    hasKeypairs() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 166;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        let containerStyle = Object.assign({}, backgroundStyle);
        return <div className={style.background} style={backgroundStyle}>
                    <div className={style.backgroundMask}></div>
                    <div className={style.scrollContainer} style={containerStyle}>
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
                    </div>
                </div>;
    }

    render() {
        const {appName, hasKeypairs} = this.state;
        let keypairsHTML = '';
        if (hasKeypairs) {
            keypairsHTML = this.hasKeypairs();
        }
        else {
            keypairsHTML = this.noKeypairs();
        }
        // const searchHTML = this.renderSearch();
        return (
            <div className={style.container}>
                <Flex>
                    <Flex.Item>
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
                    </Flex.Item>
                    <Flex.Item>
                        {this.state.appName}
                    </Flex.Item>
                </Flex>
            </div>
        );
    }

}