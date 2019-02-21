import React, { Component } from 'react'
import { Button, WhiteSpace } from 'antd-mobile'
import style from './Agreement.scss'
import { hashHistory } from 'react-router'

import Service from './Service'
import Privacy from './Privacy'
import { FormattedMessage } from 'react-intl';
import AelfButton from '../../../components/Button/Button';

// React component
class Agreement extends Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        let agreementDisplay = this.props.agreementDisplay;
        let argeementStyle = agreementDisplay ? { display: 'block' } : { display: 'none' };
        argeementStyle.height = document.documentElement.offsetHeight;
        
        console.log('agreementDisplay： ', agreementDisplay);
        return (
            <div>
                <div style={ argeementStyle } className={ style.agreement }>
                    <div className={style.center}>
                        {/*<h3>AELF钱包服务协议与隐私政策</h3>*/}
                        <h3>AElf Privacy Policy</h3>
                    </div>
                    <WhiteSpace />
                    <div className={style.textContainer} style={{
                        height: document.documentElement.clientHeight - 150
                    }}>
                        
                        <Service></Service>
                        <Privacy></Privacy>

                    </div>
                    <WhiteSpace />
                    {/*<Button onClick={() => this.nextPage()}>已阅读并且同意条款</Button>*/}
                    {/*<Button onClick={() => hashHistory.push('/get-wallet/guide')}>已阅读并且同意 / Agree</Button>*/}
                    <Button
                        style={{
                            width: '80%',
                            marginLeft: '10%',
                            borderRadius: '50px',
                            color: '#AC00E6'
                        }}
                        onClick={this.props.toggleAgreement}>
                        <FormattedMessage 
                            id = 'aelf.Agree'
                            defaultMessage = 'Agree'
                        />
                    </Button>
                </div>
            </div>
        );
    }
}

export default Agreement