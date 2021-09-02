/*
 * huangzongzhe
 * 2018.07.31
 */
import React, {
    Component
} from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { hashHistory } from 'react-router'
import Goback from '../../assets/images/back2X.png'
require('./NavNormal.css');

class NavNormal extends Component {
    constructor(props) {
        super(props);
        if (typeof this.props.onLeftClick === 'function') {
            this.goBack = this.props.onLeftClick;
        }
    }

    goBack() {
        if (history.length === 1) {
            window.location.href = window.location.protocol + '//'+ window.location.host;
            return;
        }
        hashHistory.goBack();
    }
    render() {
        // rightContent={[
        //         <div
        //             onClick={() => this.props.rightContentClick()}
        //         >完成</div>
        //         ]}
        // console.log(this.props.rightContent);
        return (
            <div className='aelf-normal-navbar-container'>
                <NavBar
                    icon={this.props.hideLeft ? '' : <img src={Goback} className='aelf-back-icon'/>}
                    onLeftClick={() => this.goBack()}
                    rightContent={this.props.rightContent}
                    className='aelf-normal-navbar'>
                    {this.props.navTitle}
                </NavBar>
                <div className="nav-normal-whitespace"></div>
            </div>
        );
    }
}

export default NavNormal