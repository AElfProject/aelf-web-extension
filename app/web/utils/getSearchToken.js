/**
* @file
* @author zhouminghui
* 模糊查询的Token数据
*/

import checkStatus from './checkStatus';

export default function getSearchToken(callback, name) {
    let params = {
        name
    };

    let query = '';
    for (let each in params) {
        query += `${each}=${params[each]}&`;
    }

    fetch(`block/api/contract/searchtoken?${query}`, {
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
