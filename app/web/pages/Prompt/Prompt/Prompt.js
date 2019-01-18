/**
 * @file Prompt/Prompt.js
 * @author huangzongzhe
 * 2019.01
 */
import React, {
	Component
} from 'react';

import {apis} from '../../../utils/BrowserApis';

export default class Prompt extends Component {
    constructor() {
        super();
        const data = window.data || apis.extension.getBackgroundPage().notification || null;
        const messageTemp = data.message;
        const {
            payload
        } = messageTemp;
        this.message = payload.message || 'No message';
    }

    render() {
        return (
            <div>
                <div>Prompt</div>
                <p>{this.message}</p>
            </div>
        );
    }
}
