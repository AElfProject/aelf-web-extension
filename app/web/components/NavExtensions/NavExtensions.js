/**
 * @file  NavExtensions.js
 * @author zhouminghui
*/

import React, {Component} from 'react';
import style from './NavExtensions.scss';
import Svg from '../Svg/Svg';

export default class NavExtensions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.navExtensions}>
                <Svg
                    icon='backWhite'
                    style={{
                        width: 16,
                        height: 16
                    }}
                ></Svg>
            </div>
        );
    }
}