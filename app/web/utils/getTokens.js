/**
 * @file 获取已绑定token列表
 * @author zhouminghui
*/

import checkStatus from './checkStatus';

export default function getTokens(callback) {
    let params = {
        address: JSON.parse(localStorage.lastuse).address
    };

    let query = '';
    for (let each in params) {
        query += `${each}=${params[each]}&`;
    }

    fetch(`/block/api/address/tokens?${query}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(checkStatus).then(result => {
        result.text().then(result => {
            let output = JSON.parse(result);
            callback(output);
        });
    }).catch(error => {
        console.log('error:', error);
    });

}