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
import {historyPush} from '../../../utils/historyChange';
import {
    getPageContainerStyle
} from '../../../utils/utils';
import NavNormal from '../../../components/NavNormal/NavNormal';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';

import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';

import style from './Permissions.scss';
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
                            APP NAME: {appName}
                            <div
                                className = {
                                    style.keypairBtnContainer + ' ' + style.copyBtn
                                }
                                onClick={() => {
                                    Toast.success(JSON.stringify(contracts));
                                }}
                            ></div>
                        </div>
                        <div className={style.operationList}>
                            <div
                                className = {
                                    style.keypairBtnContainer + ' ' + style.removeBtn
                                }
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
                            ></div>
                        </div>
                    </div>
                    <div className={style.permissionOption}>DOMAIN: {domain}</div>
                    <div className={style.permissionOption}>KEYPARI: {address}</div>
                    <div className={style.permissionOption}>PERMISSIONS: {permissionsCount}</div>
                </div>
            );
        };
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
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

        getAllPermissions(result => {
            this.rData = result;

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                height: hei,
                refreshing: false,
                isLoading: false
            });
        });
    }

    componentWillUnmount() {
        this.WillUnmount = true;
        this.setState = () => { };
    }

    // setPerTest() {
    //     let random = randomName();
    //     let permission = {
    //         appName: 'aelf' + random,
    //         domain: 'https://aelf.io',
    //         address: 'ELF_6VcYJiB5Q5JdZiAxYatAGVJ9NLGXETZXsp1zivULyTinKwe' + random,
    //         contracts: [
    //             {
    //                 chainId: 'xxxx',
    //                 contractAddress: 'ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t0',
    //                 contractName: 'xxx',
    //                 description: 'xxxx'
    //             },
    //             {
    //                 chainId: 'xxxx',
    //                 contractAddress: 'ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t1',
    //                 contractName: 'xxx',
    //                 description: 'xxxx'
    //             },
    //             {
    //                 chainId: 'xxxx',
    //                 contractAddress: 'ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t1',
    //                 contractName: 'contractName' + Math.random(),
    //                 description: 'description' + Math.random()
    //             }
    //         ]
    //     };

    //     setPermission(permission, permissionSeted => {
    //         console.log('permission666: ', permission);
    //         // Just for test
    //         const temp = Array.from(this.rData);
    //         const list = this.rData.filter(item => {
    //             const domainCheck = permission.domain === item.domain;
    //             const addressCheck = permission.address === item.address;
    //             return domainCheck && addressCheck;
    //         });
    //         if (list.length === 0) {
    //             temp.unshift(permission);
    //             this.rData = temp;
    //             console.log('this.rData: ', this.rData);
    //             this.setState({
    //                 dataSource: this.state.dataSource.cloneWithRows(this.rData)
    //             });
    //         }
    //     });
    // }

    render() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 45;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        let containerStyle = Object.assign({}, backgroundStyle);
        // containerStyle.height -= 2; // remove border 2px
        return (
            <div style={pageContainerStyle} className='asstes-container 23333'>
                <NavNormal
                    onLeftClick={() => historyPush('/home')}
                ></NavNormal>
                <div className={style.background + ' ????'} style={backgroundStyle}>
                    <div className={style.backgroundMask}></div>
                    <div className={style.container} style={containerStyle}>

                        {/* <button onClick={() => checkPermission()}>checkPermission</button>
                        <button onClick={() => this.setPerTest()}>setPermission</button>
                        <button onClick={() => removePermission()}>removePermission</button>
                        <button onClick={() => getAllPermissions(output => {
                            console.log('click getAllPermissions: ', output);
                        })}>getAllPermissions</button> */}

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
