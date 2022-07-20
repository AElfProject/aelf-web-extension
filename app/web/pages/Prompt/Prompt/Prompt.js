/**
 * @file Prompt/Prompt.js
 * @author huangzongzhe
 * 2019.01
 */
import React, {
	Component
} from 'react';

import {apis} from '../../../utils/BrowserApis';
import { getMessageFromService } from '../../../utils/promptToService';

export default class Prompt extends Component {
    constructor() {
        super();
        this.state = {
            message: 'No message'
        }
    }

    async getMessage() {
        const result = await getMessageFromService();
        const messageTemp = result.message;
        const {
            payload
        } = messageTemp;
        if(payload.message) {
            this.setState({
                message: payload.message
            })
        }
    }

    componentDidMount() {
        this.getMessage();
    }

    render() {
        return (
            <div>
                <div>Prompt</div>
                <p>{this.state.message}</p>
            </div>
        );
    }
}
