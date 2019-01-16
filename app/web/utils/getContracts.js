/**
* @file
* @author zhouminghui
* 获取全部token列表
*/
import checkStatus from './checkStatus';

export default function getContracts(callback, pIndex, NUM_ROWS) {
    let params = {
        limit: NUM_ROWS,
        page: pIndex
    };

    let query = '';
    for (let each in params) {
        query += `${each}=${params[each]}&`;
    }

    fetch(`/block/api/contract/contracts?${query}`, {
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
