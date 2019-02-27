/**
 * @file LoginKeypairs
 * @author zhouminghui
*/

import React, {Component} from 'react';
import {Toast, Flex, SearchBar, PullToRefresh, ListView} from 'antd-mobile';
import {FormattedMessage} from 'react-intl';
import {apis} from '../../../utils/BrowserApis';
import style from './LoginKeypairs.scss';

const NUM_ROWS = 9999;
const pageSize = 9999;
export default class LoginKeypairs extends Component {
    constructor(props) {
        super(props);
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const message = data.message;
        const {
            appName
        } = message;
        this.state = {
            appName,
            searchValue: ''
        };
    }


    renderSearch() {
        return <div className={style.keypairsSearch}>
                    <SearchBar
                        placeholder='Search'
                        cancelText='Cancel'
                        onChange={e => this.setSearch(e)}
                    />
            </div>;
    }

    setSearch(e) {
        this.setState({
            setSearch: e
        });
    }

    renderKeypairs() {
        
    }

    render() {
        const {appName} = this.state;
        const searchHTML = this.renderSearch();
        return (
            <div className={style.container}>
                <Flex>
                    <Flex.Item>
                        <div className={style.appLogin}>
                            <div className={style.appName}>
                                <div>
                                    {appName}
                                </div>
                                <div className={style.loginTip}>
                                    <FormattedMessage
                                        id='aelf.Login'
                                    />
                                </div>
                            </div>
                            {searchHTML}
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        {this.state.appName}
                    </Flex.Item>
                </Flex>
            </div>
        );
    }

}