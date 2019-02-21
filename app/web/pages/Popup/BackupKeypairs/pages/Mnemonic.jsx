/*
 * huangzongzhe
 * 2018.08.28
 */
// Demo
// <Mnemonic 
//    navTitle="备份助记词" 
//    mnemonic={this.state.mnemonic} // [String]
//    display={this.state.mnemonicDisplay} // [Bool]
//    onLeftClick={() => this.toggleMnemonic()}>
// </Mnemonic>;
// toggleMnemonic() {
//     this.setState({
//         mnemonicDisplay: !this.state.mnemonicDisplay
//     });
// }

import React, {
    Component
} from 'react';
import {NavBar, Icon, Button, Toast} from 'antd-mobile';
import {hashHistory} from 'react-router';
import style from './pages.scss';

import AelfButton from '../../../../components/Button/Button';
import NoticePanel from '../../../../components/NoticePanel/NoticePanel';

// import backupStatusChange from '../../../BackupNotice/backupStatusChange'
import {historyPush} from '../../../../utils/historyChange';
import {FormattedMessage} from 'react-intl';

const selectedStyle = '#AC00E6';
const unSelectedStyle = '#FFF';
// const confirmSubTitle = '请按顺序点击助记词，以确认您正确备份。';
// const confirmSubTitle = 'To confirm your backup, please click on the Mnemonic in order.';
const confirmSubTitle = <FormattedMessage id = 'aelf.hint02' defaultMessage = 'To confirm your backup, please click on the Mnemonic in order.' />

export default class Mnemonic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDisplay: false,
            mnemonicConfirmed: [],
            confirmSubNoticeShow: false,
            confirmSubTitle: confirmSubTitle,
            pageContainerStyle: this.props.containerStyle
        };

        this.setMnemonicDisorderedListStyle();

        // 拿到助记词并打乱顺序。
        this.list = this.props.mnemonic.split(' ').sort(function() {
            return .5 - Math.random();
        });

        this.itemCheck = [];
        this.mnemonicDisordered = [];
    }

    setMnemonicDisorderedListStyle() {
        let mnemonicDisorderedListStyle = [];
        for (let i = 0; i < 12; i++) {
            mnemonicDisorderedListStyle.push({
                background: unSelectedStyle
            });
        }
        this.state.mnemonicDisorderedListStyle = mnemonicDisorderedListStyle;
    }

    toggleConfirm() {
        this.setState({
            confirmDisplay: !this.state.confirmDisplay
        });
    }

    // 选中助记词，并展示在面板中
    disorderedItemClick(e) {
        let text = e.target.innerText;

        let indexDisorderedItem = parseInt(e.target.getAttribute('index'), 10);
        let index = this.state.mnemonicConfirmed.length;

        if (this.itemCheck.indexOf(indexDisorderedItem) < 0) {
            this.itemCheck.push(indexDisorderedItem);
            this.state.mnemonicDisorderedListStyle[indexDisorderedItem] = {
                background: selectedStyle,
                borderColor: selectedStyle,
                color: '#FFF'
            };
            let mnemonicConfirmed = this.state.mnemonicConfirmed;
            mnemonicConfirmed.push(<div
                    className={`${style.listItem} ${style.selectd}`}
                    key={Math.random()}
                    index={index}
                    indexdisordereditem={indexDisorderedItem}
                    onClick={e => this.removeItem(e)}
                    >{text}</div>);

            this.setState({
                mnemonicConfirmed
            });
        }
    }

    confirm() {
        // 确认是否OK
        if (this.itemCheck.length === 12) {
            let text = '';
            this.itemCheck.map(item => {
                text += this.mnemonicDisordered[item] + ' ';
            });

            if (text.trim() === this.props.mnemonic) {
                // backupStatusChange();
                Toast.success('Success', 3, () => {
                    historyPush('/keypairs', false);
                });
                return;
            }
        }
        // Toast.fail('请重新温习助记词。', 2, () => {}, false);
        Toast.fail('Please review the Mnemonic again.', 2, () => {}, false);
        this.setState({
            confirmSubNoticeShow: true,
            confirmSubTitle: ''
        });
    }

    // 从确认框中点击单词并移除
    removeItem(e) {
        let indexDisorderedItem = parseInt(e.target.getAttribute('indexdisordereditem'), 10);
        let index = parseInt(e.target.getAttribute('index'), 10);

        let indexItemCheck = this.itemCheck.indexOf(indexDisorderedItem);
        if (indexItemCheck >= 0) {
            this.state.mnemonicDisorderedListStyle[indexDisorderedItem] = {
                background: unSelectedStyle
            };
            this.itemCheck.splice(indexItemCheck, 1);

            let mnemonicConfirmed = this.state.mnemonicConfirmed;
            mnemonicConfirmed[index] = '';

            this.setState({
                mnemonicConfirmed: mnemonicConfirmed,
                confirmSubNoticeShow: false,
                confirmSubTitle: confirmSubTitle
            });
        }
    }

    getMnemonicDisorderedHtml() {
        let mnemonicDisorderedHtml = [];
        let mnemonicDisordered = [];
        this.list.map((item, index) => {
            mnemonicDisorderedHtml.push(<div 
                className={style.listItem}
                key={Math.random()}
                index={index}
                style={this.state.mnemonicDisorderedListStyle[index]}
                onClick={(e) => this.disorderedItemClick(e)}
                >{item}</div>);
            mnemonicDisordered.push(item);
        });
        this.mnemonicDisordered = mnemonicDisordered;
        return mnemonicDisorderedHtml;
    }

    getContainerStyle() {
        let containerStyle = {
            display: this.props.display ? 'block' : 'none'
        };

        let confirmContainerStyle = {
            display: this.state.confirmDisplay ? 'block' : 'none'
        };
        return {
            containerStyle: containerStyle,
            confirmContainerStyle: confirmContainerStyle
        };
    }

    render() {

        let mnemonicDisorderedHtml = this.getMnemonicDisorderedHtml();
        let {containerStyle, confirmContainerStyle} = this.getContainerStyle();
        const {pageContainerStyle} =  this.state;
        // let pageContainerStyle = getPageContainerStyle();

        return (
            <div>
                <div className={style.page} style={containerStyle}>
                    <div>
                        <NavBar
                            icon={<Icon type="left" />}
                            onLeftClick={() => this.props.onLeftClick()}>
                        </NavBar>

                        <div className={style.container} style={pageContainerStyle}>
                            <div className={style.top}>
                                <NoticePanel
                                    mainTitle={
                                        <FormattedMessage
                                            id = 'aelf.Backup Mnemonic'
                                        />
                                    }
                                    content={[
                                        // '助记词用于恢复钱包或者重置钱包密码，',
                                        // '仔细抄写下助记词并放在安全的地方！',
                                        // '请勿截图!',
                                        // '如果有他人获取你的助记词，他将直接获取你的资产!'
                                        // 'Mnemonic is used to restore your wallet or reset your password',
                                        // 'Please write them down carefully and keep them in a secure location',
                                        // 'Please DO NOT use screen capture!',
                                        // 'If anyone obtains your Mnemonic, they WILL obtain your digital assets!',
                                        <FormattedMessage
                                            id = 'aelf.Becareful07'
                                        />,
                                        <FormattedMessage
                                            id = 'aelf.Becareful08'
                                        />,
                                        <FormattedMessage
                                            id = 'aelf.Becareful09'
                                        />,
                                        <FormattedMessage
                                            id = 'aelf.Becareful010'
                                        />,
                                    ]}
                                ></NoticePanel>
                                <div className={style.privateContainer}>
                                    {this.props.mnemonic}
                                </div>
                            </div>

                            <div className={style.bottom}>
                                <AelfButton
                                    text='Next'
                                    onClick={() => this.toggleConfirm()}
                                ></AelfButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.page} style={confirmContainerStyle}>
                    <div>
                        <NavBar
                            icon={<Icon type="left" />}
                            onLeftClick={() => this.toggleConfirm()}>
                        </NavBar>

                        <div className={style.container} style={pageContainerStyle}>
                            <div className={style.top}>
                                <NoticePanel
                                    mainTitle={
                                        <FormattedMessage
                                            id = 'aelf.ConfirmMnemonic'
                                            defaultMessage = 'Confirm Mnemonic'
                                        />
                                    }
                                    subTitle={this.state.confirmSubTitle ? [this.state.confirmSubTitle] : ''}
                                    subNoticeShow={this.state.confirmSubNoticeShow}
                                    subNotice={
                                        // '顺序不对，请校对！'
                                        <FormattedMessage
                                            id = 'aelf.hint01'
                                            defaultMessage = 'Mnemonic is not in the right sequence, please rearrange!'
                                        />
                                    }
                                    iconHidden={true}
                                ></NoticePanel>
                                <div className={`${style.privateContainer} ${style.purple}`}>
                                    {this.state.mnemonicConfirmed}
                                </div>
                                <div className={style.mnemonicListContainer}>
                                    {mnemonicDisorderedHtml}
                                </div>
                            </div>

                            <div className={style.bottom}>
                                <AelfButton
                                    text='Submit'
                                    onClick={() => this.confirm()}
                                ></AelfButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
