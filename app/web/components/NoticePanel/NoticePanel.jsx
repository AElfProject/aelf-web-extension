/**
 * @file NoticePanel
 * @author huangzongzhe
 * 2018.10.18
 */

import React, {
    Component
} from 'react';
import Svg from '../Svg/Svg';
import style from './NoticePanel.scss';

// Demo
// <NoticePanel
//     mainTitle={'备份钱包'}
//     containerStyle={optional}
//     subTitle={[
//         '去中心化的aelf钱包，支持一套助记词',
//         '管理您的钱包地址'
//     ]}
//     iconHidden={true/false}
//     content={[
//         '请在安全的环境下备份助记词！',
//         '没有妥善备份就无法保障资产安全；',
//         '删除程序或钱包后，',
//         '您需要通过备份的助记词来会恢复钱包！'
//     ]}
// ></NoticePanel>
export default class NoticePanel extends Component {
    constructor(props) {
        super(props);
    }

    getSubTitleHtml() {
        let subTitle = '';
        if (this.props.subTitle && Array.isArray(this.props.subTitle)) {
            subTitle = <div className={style.subTitle} style={this.props.subTitleStyle || {}}>
                {
                    this.props.subTitle.map(item => {
                        return <p key={Math.random()}>{item}</p>;
                    })
                }
            </div>;
        }
        return subTitle;
    }

    getContentHtml() {
        let contentHtml = '';
        if (this.props.content && Array.isArray(this.props.content)) {
            contentHtml = this.props.content.map(item => {
                return <p key={Math.random()}>{item}</p>;
            });
        }
        return contentHtml;
    }

    getNoticeIconHtml() {
        let svgHtml = '';
        if (!this.props.iconHidden) {
            svgHtml
                = <div className={style.noticeIcon}>
                    <Svg icon="notice32" style={{
                        width: 32,
                        height: 32
                    }}></Svg>
                </div>;
        }
        return svgHtml;
    }

    getSubNoticeIconHtml() {
        let subSvgHtml = '';
        if (this.props.subNoticeShow) {
            subSvgHtml
                = <div className={style.subNoticeIcon}>
                    <Svg icon="notice32" style={{
                        width: 16,
                        height: 16
                    }}></Svg>
                    <div style={{
                        margin: '0 0 0 4px'
                    }}>{this.props.subNotice}</div>
                </div>
            ;
        }
        return subSvgHtml;
    }

    render() {
        let mainTitle = this.props.mainTitle;

        let subTitleHtml = this.getSubTitleHtml();
        let contentHtml = this.getContentHtml();
        let svgHtml = this.getNoticeIconHtml();
        let subSvgHtml = this.getSubNoticeIconHtml();

        return (
            <div className={style.note} style={this.props.containerStyle}>
                <p className={style.mainTitle}>
                    {mainTitle}
                </p>
                {subTitleHtml}
                {svgHtml}
                {subSvgHtml}
                {contentHtml}
            </div>
        );
    }
}
