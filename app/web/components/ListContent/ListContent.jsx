/**
 * @file ListContent.js
 * @author huangzongzhe
 * 2018.10.19
 */
import React, {
    Component
} from 'react';

import style from './ListContent.scss';
import Svg from '../../components/Svg/Svg';
import './ListContent.css';
import More from '../../assets/images/more2X.png'
export default class ListContent extends Component {

    render() {
        let textStyle = {};
        if (this.props.type === 'small') {
            textStyle.fontSize = '14px';
        }
        let listIconLeftHtml = '';
        if (this.props.icon) {
            listIconLeftHtml
                = <div className={style.listIconLeft}>
                    <Svg
                        icon={this.props.icon}
                        style={{
                            width: 16,
                            height: 16
                        }}
                    ></Svg>
                </div>;
        }

        return (
            <div className={style.listContainer}>
                <div className={style.listLeft}>
                    {listIconLeftHtml}
                    <div style={textStyle}>{this.props.text}</div>
                </div>
                <div className={style.moreIcon} >
                    {/* <Svg
                        style={{width: 16, height: 16}}
                        icon="right12"
                    ></Svg> */}
                </div>
            </div>
        );
    }
}