/**
 * @file Lock.js
 * @author huangzongzhe, zhouminghui
 */

import React, {
  Component
} from 'react';
import {createHmac} from 'crypto';
import {
  Toast,
  List,
  InputItem,
} from 'antd-mobile';

import style from './Lock.scss';
// Replace antd style
import AelfButton from '../../../components/Button/Button';
// import Password from '../../../components/Password/Password'; // Only use style
require('../../../components/Password/Password.css');
import {getPageContainerStyle, moneyKeyboardWrapProps} from '../../../utils/utils';
import * as InternalMessageTypes from '../../../messages/InternalMessageTypes';
import InternalMessage from '../../../messages/InternalMessage';
import {
  FormattedMessage
} from 'react-intl';
import errorHandler from "../../../utils/errorHandler";

function getSeed(password) {
  if (password) {
    const hmac = createHmac('sha512', password);
    return hmac.update(password).digest('hex');
  }
  Toast.fail('Please input password', 3, () => {}, false);
  return false;
}

export default class Lock extends Component {

  constructor() {
    super();
    this.state = {
      password: '',
    };
    this.marginStyle = {marginTop: '100px'};
  }


  setPassword(password) {
    console.log(password);
    this.setState({
      password
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  unlockWallet() {
    const seed = getSeed(this.state.password);
    if (seed) {
      InternalMessage.payload(InternalMessageTypes.UNLOCK_WALLET, seed).send().then(result => {
        console.log(InternalMessageTypes.UNLOCK_WALLET, seed, result);
        if (result && result.error === 0) {
          window.data.sendResponse({
            ...errorHandler(300000),
            detail: null,
            message: 'Unlock wallet success.'
          });
          setTimeout(() => {
            window.close();
          }, 500);
        }
        else {
          console.log(result.error);
          Toast.fail('Unlock wallet failed.', 3, () => {}, false);
        }
      }).catch(error => {
        console.log('unlock error: ', error);
        Toast.fail('Unlock wallet failed.', 3, () => {}, false);
      });
    }
  }

  onKeyup(e) {
    if(e.keyCode === 13) {
        this.unlockWallet();
    }
  }

  //
  renderUnlock() {
    return <div style={this.marginStyle}>
      <div className="aelf-input-container aelf-dash">
        <List>
          <div className="aelf-input-title">
            <div><FormattedMessage id = 'aelf.Password' /></div>
          </div>
          <InputItem
            value={this.state.password}
            type="password"
            placeholder=""
            onChange={password => this.setPassword(password)}
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            onKeyUp={(e)=>this.onKeyup(e)}
          />
        </List>
      </div>
      <div className={style.bottom}>
        <div className={style.blank24}/>
        <AelfButton
          text='Unlock Wallet'
          aelficon='add_purple20'
          type='createbtn'
          onClick={() => this.unlockWallet()}>
        </AelfButton>
      </div>
    </div>;
  }

  render() {
    let titleText = 'Welcome';
    let buttonHTML = '';
    let bodyHTML = '';
    let margin = {
      marginTop: '62px'
    };

    buttonHTML = this.renderUnlock();

    const containerStyle = getPageContainerStyle();

    bodyHTML = <div>
      <div className={style.top}>
        <div className={style.logo}/>
        <p className={style.welcome} style={margin}>{titleText}</p>
        <p className={style.wallet}>NIGHT ELF</p>
        {/* <p className={style.description}>{process.env.SDK_VERSION}</p> */}
      </div>
      {buttonHTML}
    </div>;

    return (
      <div className={style.container} style={containerStyle}>
        {bodyHTML}
      </div>
    );
  }
}
