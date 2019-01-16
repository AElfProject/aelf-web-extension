/**
 * @file
 * @author huangzongzhe
 * 2018.10.15
 */

import React, {
    Component
} from 'react';
import {Button} from 'antd-mobile';
import Svg from '../Svg/Svg';
import style from './Button.scss';
import {FormattedMessage} from 'react-intl';

require('./Button.css');

//     demo
//     <AelfButton
//         text='备份助记词'
//         aelficon='xxx'
//         style={Object}
//         onClick={(e) => prompt(
//             '密码',
//             '请确保环境安全下备份助记词',
//             [
//                 { text: '取消' },
//                 { text: '提交', onPress: password => {
//                         let boolean = this.getPrivateKeyAndMnemonic(password);
//                         boolean && this.toggleMnemonic();
//                     }
//                 },
//             ],
//             'secure-text',
//         )}
//     ></AelfButton>
//

export default class AelfButton extends Component {

    renderBlue() {
        return (
            <div {...this.props} className={style.button + ' ' + style.blue + ' ' + this.props.className}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div>
                        <FormattedMessage
                            id={'aelf.' + this.props.text || this.props.children || ''}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.type === 'blue') {
            return this.renderBlue();
        }

        let svgStyle = {
            padding: '3px 12px 0 0',
            display: this.props.aelficon ? 'block' : 'none'
        };
        return (
            <Button {...this.props} className={style.btn}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={svgStyle}>
                        <Svg icon={this.props.aelficon}
                            style={{display: 'inline-block', height: 20, width: 20}}></Svg>
                    </div>
                    <div>
                        <FormattedMessage
                            id={'aelf.' + this.props.text || this.props.children || ''}
                        />
                    </div>
                </div>
            </Button>
        );
    }
}
