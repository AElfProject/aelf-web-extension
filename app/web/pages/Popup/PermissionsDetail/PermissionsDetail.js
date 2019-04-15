/**
 * @file PermissionsDetail.js
 * @author zhouminghui
*/

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Flex, ListView, Modal, Toast} from 'antd-mobile';
import {hashHistory} from 'react-router';
import {FormattedMessage} from 'react-intl';
import {getPageContainerStyle} from '../../../utils/utils';
import NavNormal from '../../../components/NavNormal/NavNormal';
import {historyPush} from '../../../utils/historyChange';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';
import style from './PermissionsDetail.scss';
import insert from '../../../utils/insert';
import checkWallet from '../../../utils/checkWallet';
import './PermissionsDetail.css';

const alert = Modal.alert;

const NUM_ROWS = 9999;
const pageSize = 9999;

function removePermission(permissionNeedRemove, callback) {
    // const permission = {
    //     domain: 'https://aelf.io',
    //     address: 'ELF_6VcYJiB5Q5JdZiAxYatAGVJ9NLGXETZXsp1zivULyTinKwe' + randomName(),
    //     contracts: ['ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t0']
    // };
    InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
        const {
            nightElf
        } = result || {};
        if (nightElf) {
            InternalMessage.payload(InternalMessageTypes.REMOVE_PERMISSION, permissionNeedRemove).send().then(result => {
                console.log(InternalMessageTypes.REMOVE_PERMISSION, result);
                if (result.error === 0) {
                    callback();
                }
                else {
                    Toast.fail(result.message, 3, () => { }, false);
                }
            });
        }
        else {
            hashHistory.push('/');
        }
    });
}

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

function removeWhitelist(contractAddress, methods, domain, callback) {
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

@insert(checkWallet)
export default class PermissionsDetail extends Component {
    constructor(props) {
        super(props);
        const data = JSON.parse(this.props.params.data);
        this.domain = data.domain;
        this.address = data.address;
        this.appName = data.appName;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.state = {
            permissions: null,
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            openRow: null,
            hasClick: false
        };

        this.renderRow = (rowData, sectionID, rowID) => {
            let item = this.rData[rowID];
            let whiteListHTML = null;
            if (JSON.stringify(item.whitelist) !== '{}' && item.whitelist) {
                whiteListHTML = this.renderWhiteList(item.whitelist, item.contractAddress, rowID);
            }
            let infoHeight = '17px';
            let transformRotate = 'rotate(90deg)';
            if (this.state.openRow === rowID) {
                infoHeight = 'auto';
                transformRotate = 'rotate(270deg)';
                
            }
            return (
                <div key={rowID} className={style.txListBox}>
                    <div
                        className={style.txList}
                        style={{height: infoHeight}}
                    >
                        <div className={style.operationContainer}>
                            <div className={style.operationList}>
                                {item.contractName}
                                <div
                                    className = {style.remove}
                                    onClick={() =>
                                        alert('Delete Contract', 'Are you sure???',
                                        [
                                            {
                                                text: 'Cancel', onPress: () => console.log('cancel')
                                            }, {
                                                text: 'Ok',
                                                onPress: () => removeContract(item.contractAddress, this.domain, () => {
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
                                >
                                    <FormattedMessage
                                        id='aelf.Delete'
                                    />
                                </div>
                            </div>
                            <div className={style.operationList}>
                                <span className={style.infoClass}>Address:</span> {item.contractAddress}
                            </div>
                            <div className={style.operationList}>
                                <span className={style.infoClass}>Description:</span> {item.description}
                            </div>
                            {whiteListHTML}
                        </div>
                    </div>
                    <div className={style.arrow} onClick={() => {
                        if (this.state.openRow === rowID) {
                            this.setState({
                                openRow: null
                            });
                        }
                        else {
                            this.setState({
                                openRow: rowID
                            });
                        }
                    }}>
                        <div style={{transform: transformRotate}}>》</div>
                    </div >
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
                                className = {style.remove}
                                onClick={() =>
                                    alert('Delete the white list', 'Are you sure???',
                                    [
                                        {
                                            text: 'Cancel', onPress: () => console.log('cancel')
                                        }, {
                                            text: 'Ok',
                                            onPress: () => removeWhitelist(contractAddress, item, this.domain, () => {
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
                            >
                                <FormattedMessage
                                    id='aelf.Delete'
                                />
                            </div>
                        </div>
                    </div>;
            });
            return (
                <div>
                    <div className={style.infoClass}>
                        <FormattedMessage
                            id='aelf.Whitelist'
                        />:
                    </div>
                    {whiteListHTML}
                </div>
            );
        };
    }


    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        this.checkWalletInfo();
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
            appname: this.appName,
            hostname: this.domain,
            type: 'domain'
        };
        InternalMessage.payload(InternalMessageTypes.CHECK_PERMISSION, queryInfo).send().then(result => {
            if (result && result.error === 0) {
                const permissions = result.permissions.filter(item => {
                    const address = this.address === item.address;
                    const domain = this.domain === item.domain;
                    return address & domain;
                });
                callback(permissions);
            }
        });
    }


    renderPermissionsInfo() {
        const {permissions} = this.state;
        const appName = this.appName;
        const domain = this.domain;
        const address = this.address;
        const permissionNeedRemove = {
            appName,
            domain,
            address
        };
        return <div>
                    <Flex>
                        <div className={style.headInfoBox}>
                            <div className={style.head}>
                                <div className={style.headPortrait}></div>
                            </div>
                            <div className={style.permissionInfo}>
                                <div className={style.permissionOptions}>
                                    {permissions.appName}
                                    <div
                                        className={style.remove}
                                        onClick={() =>
                                            alert('Delete Permissions', 'You Sure ?',
                                            [
                                                {
                                                    text: 'Cancel', onPress: () => console.log('cancel')
                                                }, {
                                                    text: 'Ok',
                                                    onPress: () => removePermission(permissionNeedRemove, () => {
                                                        hashHistory.push('/permissions');
                                                    })
                                                }
                                            ])
                                        }
                                    >
                                        <FormattedMessage
                                            id='aelf.Delete All'
                                        />
                                    </div>
                                </div>
                                <div>KEYPAIR: {permissions.address}</div>
                            </div>
                        </div>
                    </Flex>
             </div>;
    }

    render() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 220;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2

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
                <div className={style.top}>
                    <div className={style.blank}></div>
                    <p className={style.wallet}>
                        <FormattedMessage
                            id='aelf.Application details'
                        />
                    </p>
                </div>
                {permissionsInfoHTML}
                <div className={style.background} style={backgroundStyle}>
                    {/* <div className={style.backgroundMask}></div>
                    <div className={style.container} style={containerStyle}> */}
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
                {/* </div> */}
            </div>
        );
    }
}
