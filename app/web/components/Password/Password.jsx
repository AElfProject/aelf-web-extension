/**
 * @file components/Password.jsx
 * @author huangzongzhe
 * 2018.07.25
 */

import React, {Component} from 'react';
import {WhiteSpace, List, InputItem} from 'antd-mobile';
import style from './Password.scss';
import passwordCheck from '../../utils/passwordCheck';
import moneyKeyboardWrapProps from '../../utils/moneyKeyboardWrapProps';
import {FormattedMessage} from 'react-intl';

// 用于覆盖antd的样式
require('./Password.css');

// class AelfInputItem extends Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         let titleHtml = '';
//         if (this.props.title) {
//             titleHtml = <div className={style.title}>{this.props.title}</div>;
//         }
//
//         return (
//             <div>
//                 {titleHtml}
//                 <InputItem
//                     value={this.props.value}
//                     type={this.props.type}
//                     placeholder="至少9位混合大小写和数字"
//                     onChange={value => {
//                         let fn = this.props.onChange();
//                         console.log(value, fn);
//                         fn(value);
//                         // this.props.onChange(value)
//                     }}
//                     moneyKeyboardWrapProps={moneyKeyboardWrapProps}
//                 ></InputItem>
//             </div>
//         )
//     }
// }

/*
<List>
    <AelfInputItem
        value={this.state.password}
        title='你好呀'
        type='password'
        onChange={() => this.inputPassword}
    ></AelfInputItem>
</List>
*/

function getPasswordLevelInfo(passwordInfo) {
    let level = {
        level1: {
            opacity: 0.5
        },
        level2: {
            opacity: 0.5
        },
        level3: {
            opacity: 0.5
        },
        text: 'At least 9 bits'
    };

    if (passwordInfo && passwordInfo.type) {
        switch (passwordInfo.level) {
            case 0:
                break;
            case 1:
                level.level1.opacity = 1;
                break;
            case 2:
                level.level1.opacity = 1;
                level.level2.opacity = 1;
                break;
            default:
                level.level1.opacity = 1;
                level.level2.opacity = 1;
                level.level3.opacity = 1;
        }

        if (passwordInfo.level > 2) {
            level.text = 'Strong';
        } else {
            level.text = 'Not Enough';
        }
    }
    return level;
}

// 父组件能从password获得 密码。
export default class Password extends Component {
    constructor(props) {
        super(props);
        // console.log('this.props: ', this.props);
        this.state = {
            passwordCheckResult: {
                ready: false,
                message: ''
            },
            password: '',
            passwordReplay: ''
        };
    }

    inputPassword(password) {
        // console.log('password: ', password, this.state.passwordReplay);
        let checkResult = passwordCheck(password);
        this.passwordInfo = checkResult;

        let passwordReplay = this.state.passwordReplay;
        if (passwordReplay) {
            this.state.password = password;
            this.comfirmPassword(passwordReplay);
        }
        else {
            this.state.passwordCheckResult = {
                ready: true,
                message: ''
            };
        }

        this.setState({password});
    }

    comfirmPassword(passwordReplay) {
        if (this.state.password !== passwordReplay) {
            this.state.passwordCheckResult = {
                ready: false,
                message: 'The passwords confirmed error.'
            };
            this.props.setPassword(false);
        }
        else if (this.passwordInfo && this.passwordInfo.level <= 2) {
            this.state.passwordCheckResult = {
                ready: false,
                message: 'The passwords is not strong.'
            };
            this.props.setPassword(false);
        }
        else {
            this.state.passwordCheckResult = {
                ready: true,
                message: ''
            };
            this.props.setPassword(passwordReplay);
        }
        this.setState({passwordReplay});
    }

    renderPassowrdErrorText() {
        let passwordReplayErrorText = '';
        if (!this.state.passwordCheckResult.ready) {
            passwordReplayErrorText
                = <div className={style.error}>
                    <FormattedMessage
                        id={'aelf.' + this.state.passwordCheckResult.message}
                        defaultMessage={this.state.passwordCheckResult.message}
                    />
                </div>;
        }
        return passwordReplayErrorText;
    }

    render() {

        let passwordReplayErrorText = this.renderPassowrdErrorText();
        let levelInfo = getPasswordLevelInfo(this.passwordInfo);

        return (
            <div className="aelf-input-container aelf-dash">
                <List>
                    <div className="aelf-input-title">
                        <div>
                            <FormattedMessage
                                id = 'aelf.Password'
                                defaultMessage = 'Password'
                            />
                        </div>
                        <div className={style.passwordLevel}>
                            <div className={`${style.level1}  ${style.list}`} style={levelInfo.level1}></div>
                            <div className={`${style.level2}  ${style.list}`} style={levelInfo.level2}></div>
                            <div className={`${style.level3}  ${style.list}`} style={levelInfo.level3}></div>
                            <div className={style.levelText}>
                                <FormattedMessage
                                    id = {'aelf.' + levelInfo.text }
                                    defaultMessage = {levelInfo.text}
                                />
                            </div>
                        </div>
                    </div>
                    <InputItem
                        value={this.state.password}
                        type="password"
                        placeholder=""
                        onChange={password => this.inputPassword(password)}
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    ></InputItem>
                </List>

                <List>
                    <div className="aelf-input-title">
                        <div>
                            <FormattedMessage
                                id = 'aelf.Confirm Password'
                                defaultMessage = 'Confirm Password'
                            />
                        </div>
                        {passwordReplayErrorText}
                    </div>
                    <InputItem
                        value={this.state.passwordReplay}
                        type="password"
                        placeholder=""
                        onChange={password => this.comfirmPassword(password)}
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    ></InputItem>
                </List>

                <WhiteSpace />
            </div>
        );
    }
}
