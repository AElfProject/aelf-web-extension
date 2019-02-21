/**
 * @file
 * @author huangzongzhe
 * 2018.07.26
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {hashHistory} from 'react-router';
import {
    ListView,
    Toast,
    Modal,
    Flex
} from 'antd-mobile';
import {historyPush} from '../../../utils/historyChange';
import {
    getPageContainerStyle,
    clipboard,
    addressOmit
} from '../../../utils/utils';
import NavNormal from '../../../components/NavNormal/NavNormal';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';
import AelfButton from '../../../components/Button/Button';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import {FormattedMessage} from 'react-intl';
import style from './Keypairs.scss';
require('./Keypairs.css');

const alert = Modal.alert;

const NUM_ROWS = 9999;
const pageSize = 9999;

function getKeypairs(callback) {
    InternalMessage.payload(InternalMessageTypes.GET_KEYPAIR).send().then(result => {
        console.log(InternalMessageTypes.GET_KEYPAIR, result);
        if (result.error === 0 && result.keypairs) {
            callback(result.keypairs);
        }
        else {
            Toast.fail('No Keypair in Wallet.', 3, () => {}, false);
        }
    });
}

function removeKeypairs(address, callback) {
    InternalMessage.payload(InternalMessageTypes.REMOVE_KEYPAIR, address).send().then(result => {
        console.log(InternalMessageTypes.REMOVE_KEYPAIR, result);
        if (result.error === 0) {
            callback();
        }
        else {
            Toast.fail(result.message, 3, () => {}, false);
        }
    });
}

// React component
// TODO, 这里以后考虑使用ListView
// https://mobile.ant.design/components/list-view-cn/#components-list-view-demo-basic
export default class Keypairs extends Component {
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
                        <div className={style.operationList}>
                            <div
                                className = {
                                    style.keypairBtnContainer + ' ' + style.removeBtn
                                }
                                onClick={() =>
                                    alert('Delete Keypairs', 'Are you sure???',
                                    [
                                        {
                                            text: 'Cancel', onPress: () => console.log('cancel')
                                        }, {
                                            text: 'Ok',
                                            onPress: () => removeKeypairs(address, () => {
                                                this.rData = this.rData.filter(rItem => {
                                                    return rItem.address !== address;
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
                    <div className={style.keypairsAddress}>{address}</div>
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

        getKeypairs(result => {
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

    createKeyPairs() {
        hashHistory.push('/backup');
    }

    importKeyPairs() {
        hashHistory.push('/import');
    }

    render() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 45;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        let containerStyle = Object.assign({}, backgroundStyle);
        // containerStyle.height -= 2; // remove border 2px
        return (
            <div style={pageContainerStyle} className='asstes-container'>
                <NavNormal
                    onLeftClick={() => historyPush('/home')}
                ></NavNormal>
                {/* <button onClick={() => this.createKeyPairs()}>createKeyPairs</button>
                <button onClick={() => this.createKeyPairs()}>backupKeyPairs</button> */}
                <Flex justify='center' align='center' style={{margin: '0 22px'}} >
                    <Flex.Item align='center'>
                        <div
                            className={style.keypairButton}
                            onClick={() => this.createKeyPairs()}
                        >
                            <FormattedMessage
                                id = 'aelf.Create KeyPairs'
                                defaultMessage = 'Create KeyPairs'
                            />
                        </div>
                    </Flex.Item>
                    <Flex.Item align='center'>
                    <div
                            className={style.keypairButton}
                            onClick={() => this.importKeyPairs()}
                        >
                            <FormattedMessage
                                id = 'aelf.Import Keypairs'
                                defaultMessage = 'Import Keypairs'
                            />
                        </div>
                    </Flex.Item>
                </Flex>
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
