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
    Flex,
    Button,
    List,
    InputItem,
    PickerView
} from 'antd-mobile';

import copy from 'copy-to-clipboard';

import {historyPush} from '../../../utils/historyChange';
import {
    getPageContainerStyle,
    clipboard,
    addressOmit
} from '../../../utils/utils';
import NavNormal from '../../../components/NavNormal/NavNormal';
import AelfButton from '../../../components/Button/Button';
import ScrollFooter from '../../../components/ScrollFooter/ScrollFooter';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import {FormattedMessage} from 'react-intl';
import style from './Keypairs.scss';
import insert from '../../../utils/insert';
import checkWallet from '../../../utils/checkWallet';
require('./Keypairs.css');

const { Item } = List;
const alert = Modal.alert;

const NUM_ROWS = 9999;
const pageSize = 9999;
function getKeypairs(callback) {
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

function removeKeypairs(address, callback) {
    InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
        const {
            nightElf
        } = result || {};
        if (nightElf) {
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
        else {
            hashHistory.push('/');
        }
    });
}

// React component
// TODO, 这里以后考虑使用ListView
// https://mobile.ant.design/components/list-view-cn/#components-list-view-demo-basic
@insert(checkWallet)
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
            useBodyScroll: false,
            addressCopyModal: false,
            chains: {
                inner: [],
                custom: [],
            },
            addChainModal: false,
            customChainId: '',
            customPrefix: '',
            addressSelected: '',
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
                    {/* <div className={style.txListMask}></div> */}
                    {/* <div className={style.keypairsNickname}>{item.name}</div> */}

                    <div className={style.operationContainer}>
                        <div className={style.operationList}>
                            {item.name}
                        </div>
                        <div className={style.buttonManage}>
                            <div className={style.button}>
                                <div
                                    onClick={() => {
                                        this.setState({
                                            addressSelected: address
                                        });
                                        this.onModalShow('addressCopyModal');
                                        // this.onModalShow('addChainModal');
                                        // let btn = document.getElementById(clipboardID);
                                        // btn.click();
                                    }}
                                >
                                    <FormattedMessage
                                        id='aelf.Copy Address'
                                    />
                                </div>
                                {/*<button id={clipboardID}*/}
                                {/*        data-clipboard-target={`#${keypairAddressText}`}*/}
                                {/*        className={style.textarea}>copy*/}
                                {/*</button>*/}
                                {/*<input id={keypairAddressText}*/}
                                {/*    type="text"*/}
                                {/*    className={style.textarea}*/}
                                {/*    value={address}*/}
                                {/*    readOnly*/}
                                {/*/>*/}
                            </div>
                            <div className={style.button} onClick={() => this.backupKeyPairs(address)}>
                                <FormattedMessage
                                    id = 'aelf.Backup'
                                    defaultMessage = 'Backup'
                                />
                            </div>
                            <div className={style.button} onClick={() =>
                                    alert('Delete Keypair', 'Are you sure?',
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
                                    ])}>
                                    <FormattedMessage
                                        id='aelf.Delete'
                                    />
                            </div>
                        </div>
                    </div>
                    <div className={style.keypairsAddress}>ID: {address}</div>
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
        this.checkWalletInfo();
        getKeypairs(result => {
            this.rData = result;

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                height: hei,
                refreshing: false,
                isLoading: false
            });
        });

        InternalMessage.payload(InternalMessageTypes.GET_CHAIN_INFO).send().then(result => {
            console.log(InternalMessageTypes.GET_CHAIN_INFO, result);
            if (result.error === 0 && result.chainInfo) {
                this.setState({
                    chains: result.chainInfo
                });
            }
        });
    }


    componentWillUnmount() {
        this.WillUnmount = true;
        this.setState = () => { };
    }

    createKeyPairs() {
        hashHistory.push('/createkeypairs');
    }

    importKeyPairs() {
        hashHistory.push('/import');
    }

    backupKeyPairs(address) {
        hashHistory.push(`/backupkeypairs/${address}`);
    }

    onModalClose(key) {
        this.setState({
            [key]: false
        });
    }

    onModalShow(key) {
        this.setState({
            [key]: true
        });
    }

    render() {
        let pageContainerStyle = getPageContainerStyle();
        pageContainerStyle.height -= 200;
        let backgroundStyle = Object.assign({}, pageContainerStyle);
        // backgroundStyle.height -= 14; // remove padding 7px * 2
        let containerStyle = Object.assign({}, backgroundStyle);
        const btnStyle = {
            height: '32px',
            lineHeight: '32px'
        };

        const {chains} = this.state;
        const {inner = [], custom = []} = chains;
        // containerStyle.height -= 2; // remove border 2px
        return (
            <div style={pageContainerStyle} className='asstes-container'>
                <NavNormal
                    onLeftClick={() => historyPush('/home')}
                />
                <div className={style.top}>
                    <div className={style.blank}/>
                    <p className={style.wallet}>
                        <FormattedMessage
                            id='aelf.Key Pairs'
                        />
                    </p>
                </div>
                <div className={style.functionButton}>
                    <div style={{width: '45%'}} >
                        <AelfButton
                            style={btnStyle}
                            text='Create Keypair'
                            onClick={() => this.createKeyPairs()}>
                        </AelfButton>
                    </div>
                    <div style={{width: '45%'}} >
                        <AelfButton
                            type='transparent'
                            style={btnStyle}
                            text='Import Keypair'
                            onClick={() => this.importKeyPairs()}>
                        </AelfButton>
                    </div>
                </div>
                <div className={style.background} style={backgroundStyle}>
                    {/* <div className={style.backgroundMask}></div> */}
                    {/* <div className={style.container} style={containerStyle}> */}
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


            {/*  For copy address start  */}
                <Modal
                  popup
                  visible={this.state.addressCopyModal}
                  onClose={() => this.onModalClose('addressCopyModal')}
                  animationType="slide-up"
                >
                    <div>
                        <div className={style.pannelTitle}>
                            <FormattedMessage
                              id = 'aelf.Select Chain'
                              defaultMessage = 'Select Chain'
                            />
                            <Button
                              size="small"
                              className={style.addCustomChain}
                              onClick={() => {
                                  this.onModalShow('addChainModal')
                              }}
                            >Add Custom</Button>
                        </div>
                        <div>
                            <List className={style.chainList}>
                                {
                                    (() => {
                                        const innerLength = inner.length;
                                        const list = [...inner, ...custom];

                                        const chainSelect = (chainInfo) => {
                                            const { addressSelected } = this.state;
                                            const address = `${chainInfo.head}_${addressSelected}_${chainInfo.tail}`;
                                            const result = copy(address);
                                            if (result) {
                                                Toast.success(addressOmit(address, 15, 56));
                                                this.onModalClose('addressCopyModal');
                                            } else {
                                                Toast.fail('Copy failed')
                                            }
                                        };

                                        return list.map((chain, index) => {
                                            if (index < innerLength) {
                                                return <Item
                                                  className={style.chainItem}
                                                  key={chain.chainId}
                                                  onClick={() => chainSelect(chain)}
                                                >
                                                    <div className={style.chainText}>
                                                        <div className={style.chainDiv}>{chain.chainId}</div>
                                                    </div>
                                                </Item>
                                            }

                                            return <Item
                                              className={style.chainItem}
                                              key={chain.chainId}
                                              onClick={() => chainSelect(chain)}
                                            >
                                                <div className={style.chainText}>
                                                    <div className={style.chainDiv}/>
                                                    <div className={style.chainDiv}>{chain.chainId}</div>
                                                    <div className={style.chainDiv}>
                                                        <Button
                                                          size="small"
                                                          onClick={event => {
                                                              event.stopPropagation();
                                                              // event.nativeEvent.stopImmediatePropagation();
                                                              custom.splice(index - innerLength, 1);
                                                              this.setState({
                                                                  chains: {
                                                                      inner,
                                                                      custom,
                                                                  }
                                                              });
                                                              Toast.success(`Deleted`);
                                                          }}
                                                        >Delete</Button>
                                                    </div>
                                                </div>
                                            </Item>
                                        });
                                    })()
                                }
                            </List>
                        </div>
                    </div>
                </Modal>

                <Modal
                  className="chain-add-modal"
                  transparent
                  title="Add Custom"
                  footer={[
                    {
                        text: 'Cancel',
                        onPress: () => {
                            this.onModalClose('addChainModal');
                        }
                    },
                    {
                        text: 'Add',
                        onPress: () => {
                            const {customChainId, customPrefix, chains} = this.state;
                            if (!customChainId) {
                                Toast.fail('Please input chain id');
                                return;
                            }

                            const newChain = {
                                inner: chains.inner,
                                custom: [...chains.custom,
                                    {
                                        chainId: customChainId,
                                        head: customPrefix || 'ELF',
                                        tail: customChainId,
                                    }
                                ],
                            };

                            InternalMessage.payload(InternalMessageTypes.UPDATE_CHAIN_INFO, newChain).send().then(result => {
                                console.log(InternalMessageTypes.GET_CHAIN_INFO, result);
                                this.setState({
                                    chains: newChain
                                });
                                this.onModalClose('addChainModal');
                            });
                        }
                    }]}
                  maskClosable={false}
                  visible={this.state.addChainModal}
                  onClose={() => this.onModalClose('addChainModal')}
                >
                    <InputItem
                      placeholder="eg.AELF, tDVV"
                      clear
                      onChange={(v) => {
                          this.setState({
                              customChainId: v
                          });
                          console.log('onChange', v);
                      }}
                      onBlur={(v) => { console.log('onBlur', v); }}
                    >Chain ID:</InputItem>
                    <InputItem
                      placeholder="Optional"
                      clear
                      onChange={(v) => {
                          this.setState({
                              customPrefix: v
                          });
                          console.log('onChange', v);
                      }}
                      onBlur={(v) => { console.log('onBlur', v); }}
                    >Custom Prefix: </InputItem>
                </Modal>

            {/*  For copy address end  */}
            </div>
        );
    }
}
