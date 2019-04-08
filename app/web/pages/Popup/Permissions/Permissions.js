/**
 * @file
 * @author huangzongzhe
 * 2018.07.26
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    ListView,
    Toast,
    Modal
} from 'antd-mobile';
import {hashHistory} from 'react-router';
import {historyPush} from '../../../utils/historyChange';
import {
    getPageContainerStyle
} from '../../../utils/utils';
import NavNormal from '../../../components/NavNormal/NavNormal';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import style from './Permissions.scss';
import {FormattedMessage} from 'react-intl';
import insert from '../../../utils/insert';
import checkWallet from '../../../utils/checkWallet';
require('./Permissions.css');

const alert = Modal.alert;

const NUM_ROWS = 9999;
const pageSize = 9999;

// function randomName() {
//     return Math.ceil(Math.random() * 3);
// }

// function setPermission(permission, callback) {
//     // let random = randomName();
//     // let permission = {
//     //     appName: 'aelf' + random,
//     //     domain: 'https://aelf.io',
//     //     address: 'ELF_6VcYJiB5Q5JdZiAxYatAGVJ9NLGXETZXsp1zivULyTinKwe' + random,
//     //     contracts: [
//     //         {
//     //             chainId: 'xxxx',
//     //             contractAddress: 'ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t0',
//     //             contractName: 'xxx',
//     //             description: 'xxxx'
//     //         },
//     //         {
//     //             chainId: 'xxxx',
//     //             contractAddress: 'ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t1',
//     //             contractName: 'xxx',
//     //             description: 'xxxx'
//     //         },
//     //         {
//     //             chainId: 'xxxx',
//     //             contractAddress: 'ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t1',
//     //             contractName: 'contractName' + Math.random(),
//     //             description: 'description' + Math.random()
//     //         }
//     //     ]
//     // };

//     InternalMessage.payload(InternalMessageTypes.SET_PERMISSION, permission).send().then(result => {
//         console.log(InternalMessageTypes.SET_PERMISSION, result);
//         if (result.error === 0) {
//             callback();
//         }
//         else {
//             Toast.fail(result.message, 3, () => {}, false);
//         }
//     });
// }

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

// function checkPermission() {
//     const permission = {
//         hostname: 'https://aelf.io',
//         address: 'ELF_6VcYJiB5Q5JdZiAxYatAGVJ9NLGXETZXsp1zivULyTinKwe' + randomName()
//     };
//     InternalMessage.payload(InternalMessageTypes.CHECK_PERMISSION, permission).send().then(result => {
//         console.log(InternalMessageTypes.CHECK_PERMISSION, result);
//         if (result.error === 0) {
//         }
//         else {
//             Toast.fail(result.message, 3, () => {}, false);
//         }
//     });
// }

function getAllPermissions(callback) {
    InternalMessage.payload(InternalMessageTypes.GET_ALLPERMISSIONS).send().then(result => {
        // console.log(InternalMessageTypes.GET_ALLPERMISSIONS, result);
        if (result.error === 0) {
            callback(result.permissions);
        }
        else {
            Toast.fail(result.message, 3, () => { }, false);
        }
    });
}
@insert(checkWallet)
export default class Permissions extends Component {
    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false
        };

        this.renderRow = (rowData, sectionID, rowID) => {
            let item = this.rData[rowID];
            const {address, contracts, domain, appName} = item;
            const permissionsCount = contracts.length;
            const deleteAlertText = `${permissionsCount} permissions, are you sure?`;
            const permissionNeedRemove = {
                appName,
                domain,
                address,
                contracts
            };
            // setTimeout(() => {
            //     clipboard(`#${clipboardID}`, addressOmit(address, 15, 56));
            // }, 10);
            return (
                <div key={rowID}
                    className={style.txList}
                >
                    <div className={style.txListMask}></div>
                    {/* <div className={style.keypairsNickname}>{item.name}</div> */}

                    <div className={style.operationContainer}>
                        <div className={style.operationList}>
                            {appName}
                        </div>
                        <div className={style.operationList} style={{justifyContent: 'flex-end'}}>
                            <div
                                className={style.button + ' ' + style.details}
                                onClick={() => this.getDetails(domain, address, appName)}
                            >
                                <FormattedMessage
                                    id='aelf.Details'
                                    defaultMessage = 'Details'
                                />
                            </div>
                            <div
                                className={style.button + ' ' + style.remove}
                                onClick={() =>
                                    alert('Delete Permissions', deleteAlertText,
                                    [
                                        {
                                            text: 'Cancel', onPress: () => console.log('cancel')
                                        }, {
                                            text: 'Ok',
                                            onPress: () => removePermission(permissionNeedRemove, () => {
                                                this.rData = this.rData.filter(rItem => {
                                                    const domainCheck = domain === rItem.domain;
                                                    const addressCheck = address === rItem.address;
                                                    return !(domainCheck && addressCheck);
                                                });
                                                this.setState({
                                                    dataSource: this.state.dataSource.cloneWithRows(this.rData)
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
                    </div>
                    <div className={style.permissionOption}>{address}</div>
                    <div className={style.permissionsNum}>PERMISSIONS: {permissionsCount}</div>
                </div>
            );
        };
    }

    getDetails(domain, address, appName) {
        const data = JSON.stringify({
            domain,
            address,
            appName
        });
        // const path = {
        //     pathname: '/permissionsDetail',
        //     state: {
        //     }
        // };
        hashHistory.push(`/permissionsdetail/${data}`);
    }

    // PullToRefresh start
    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        }
        else {
            document.body.style.overflow = 'hidden';
        }
    }

    componentDidMount() {
        this.checkWalletInfo();
        const permissionListHeight = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

        getAllPermissions(result => {
            this.rData = result;
            console.log(this.rData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                height: permissionListHeight,
                refreshing: false,
                isLoading: false
            });
        });
    }

    componentWillUnmount() {
        this.WillUnmount = true;
        this.setState = () => { };
    }

    render() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 140;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        // containerStyle.height -= 2; // remove border 2px
        return (
            <div style={pageContainerStyle} className='asstes-container 23333'>
                <NavNormal
                    onLeftClick={() => historyPush('/home')}
                ></NavNormal>
                <div className={style.top}>
                    <div className={style.blank}></div>
                    <p className={style.wallet}>
                        <FormattedMessage
                            id='aelf.Application Management'
                        />
                    </p>
                </div>
                <div className={style.background + ' ????'} style={backgroundStyle}>
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
        );
    }
}
