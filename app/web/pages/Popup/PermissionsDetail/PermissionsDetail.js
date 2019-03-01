/**
 * @file PermissionsDetail.js
 * @author zhouminghui
*/

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Flex, ListView, Modal, Result} from 'antd-mobile';
import {hashHistory} from 'react-router';
import {FormattedMessage} from 'react-intl';
import {getPageContainerStyle} from '../../../utils/utils';
import NavNormal from '../../../components/NavNormal/NavNormal';
import {historyPush} from '../../../utils/historyChange';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';
import style from './PermissionsDetail.scss';
import './PermissionsDetail.css';

const alert = Modal.alert;

const NUM_ROWS = 9999;
const pageSize = 9999;

function removeContract(contractAddress, domain, callback) {

    InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
        const {
            nightElf
        } = result || {};
        if (nightElf) {
            const payload = {
                domain,
                payload: {
                    contractAddress
                }
            };
            InternalMessage.payload(InternalMessageTypes.REMOVE_CONTRACT_PERMISSION, payload).send().then(result => {
                if (result && result.error === 0) {
                    callback();
                }
            });
        }
        else {
            hashHistory.push('/');
        }
    });
}

function removeWhiteContarct(contractAddress, methods, domain, callback) {
    InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
        const {
            nightElf
        } = result || {};
        if (nightElf) {
            const payload = {
                domain,
                payload: {
                    contractAddress,
                    methods: [methods]
                }
            };
            console.log(payload);
            InternalMessage.payload(InternalMessageTypes.REMOVE_METHODS_WHITELIST, payload).send().then(result => {
                if (result && result.error === 0) {
                    callback();
                }
            });
        }
        else {
            hashHistory.push('/');
        }
    });
}


export default class PermissionsDetail extends Component {
    constructor(props) {
        super(props);
        const data = JSON.parse(this.props.params.data);
        this.domain = data.domain;
        this.address = data.address;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.state = {
            permissions: null,
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false
        };

        this.renderRow = (rowData, sectionID, rowID) => {
            let item = this.rData[rowID];
            let whiteListHTML = null;
            if (item.whitelist) {
                whiteListHTML = this.renderWhiteList(item.whitelist, item.contractAddress, rowID);
            }

            return (
                <div key={rowID}
                    className={style.txList}
                >
                    <div className={style.txListMask}></div>
                    {/* <div className={style.keypairsNickname}>{item.name}</div> */}
                    <div className={style.operationContainer}>
                        <div className={style.operationList}>
                            Jurisdiction: {item.contractName}
                            <div
                                className = {
                                    style.keypairBtnContainer + ' ' + style.removeBtn
                                }
                                onClick={() =>
                                    alert('Delete Contract', 'Are you sure???',
                                    [
                                        {
                                            text: 'Cancel', onPress: () => console.log('cancel')
                                        }, {
                                            text: 'Ok',
                                            onPress: () => removeContract(item.contractAddress, this.domain, () => {
                                                this.rData = this.rData.filter(rItem => {
                                                    return rItem.contractAddress !== item.contractAddress;
                                                });
                                                this.setState({
                                                    dataSource: this.state.dataSource.cloneWithRows(this.rData)
                                                });
                                            })
                                        }
                                    ])
                                }
                            ></div>
                        </div>
                        <div className={style.operationList}>
                            Contract Address: {item.contractAddress}
                        </div>
                        <div className={style.operationList}>
                            Description: {item.description}
                        </div>
                        {whiteListHTML}
                    </div>
                </div>
            );
        };

        this.renderWhiteList = (data, contractAddress, rowID) => {
            let whiteListDate = data;
            const whiteList = Object.keys(whiteListDate);
            const whiteListHTML = whiteList.map(item => {
                return <div key={item}>
                        <div className={style.operationList}>
                            {item}
                            <div
                                className = {
                                    style.keypairBtnContainer + ' ' + style.removeBtn
                                }
                                onClick={() =>
                                    alert('Delete the white list', 'Are you sure???',
                                    [
                                        {
                                            text: 'Cancel', onPress: () => console.log('cancel')
                                        }, {
                                            text: 'Ok',
                                            onPress: () => removeWhiteContarct(contractAddress, item, this.domain, () => {
                                                this.getPermissions(result => {
                                                    this.rData = result[0].contracts;
                                                    this.setState({
                                                        dataSource: this.state.dataSource.cloneWithRows(this.rData)
                                                    });
                                                });
                                            })
                                        }
                                    ])
                                }
                            ></div>
                        </div>
                    </div>;
            });

            return (
                <div>
                    <div>---------------White List----------------</div>
                    {whiteListHTML}
                </div>
            );
        };
    }


    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        this.checkWallet();
        this.getPermissions(result => {
            this.rData = result[0].contracts;
            this.setState({
                permissions: result[0],
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                height: hei,
                refreshing: false,
                isLoading: false
            });
        });
    }

    getPermissions(callback) {
        const queryInfo = {
            appname: 'hzzTest',
            hostname: this.domain,
            type: 'domain'
        };
        InternalMessage.payload(InternalMessageTypes.CHECK_PERMISSION, queryInfo).send().then(result => {
            if (result.error === 0 && result) {
                const permissions = result.permissions.filter(item => {
                    const address = this.address === item.address;
                    const domain = this.domain === item.domain;
                    return address & domain;
                });
                callback(permissions);
            }
        });
    }

    turnToHomePage(walletStatus) {
        const {
            nightElf
        } = walletStatus || {};
        if (!nightElf) {
            hashHistory.push('/');
        }
    }

    checkWallet() {
        InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
            this.turnToHomePage(result);
        });
    }


    renderPermissionsInfo() {
        const {permissions} = this.state;
        return <div>
                    <Flex>
                        <div className={style.head}>
                            <div className={style.headPortrait}>
                                this is 头像
                            </div>
                        </div>
                        <div className={style.permissionInfo}>
                            <div>APP NAME: {permissions.appName}</div>
                            <div>KEYPAIR: {permissions.address}</div>
                        </div>
                    </Flex>
             </div>;
    }

    render() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 145;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        let containerStyle = Object.assign({}, backgroundStyle);

        const {permissions} = this.state;
        let permissionsInfoHTML = <div></div>;
        if (permissions) {
            permissionsInfoHTML = this.renderPermissionsInfo();
        }
        return (
            <div className={style.containerBody}>
                <NavNormal
                    onLeftClick={() => historyPush('/permissions')}
                />
                {permissionsInfoHTML}
                <div className={style.background} style={backgroundStyle}>
                    <div className={style.backgroundMask}></div>
                    <div className={style.container} style={containerStyle}>
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
                </div>
            </div>
        );
    }
}