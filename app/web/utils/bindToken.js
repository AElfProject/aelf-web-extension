/**
 * @file
 * @author huangzongzhe,hzz780
 * 2018.07.30
 * init aelf
 */

import checkStatus from './checkStatus';

export default function bindToken(option, callback) {
    let csrf = document.cookie.match(/csrfToken=[^;]*/)[0].replace('csrfToken=', '');
    fetch('/block/api/address/bind-token', {
        credentials: 'include',
        method: 'POST',
        headers: {
            // 使用post的时候，egg需要配套加上这个，从cookie中获取,
            // csrf token方案
            // csrf: https://github.com/pillarjs/understanding-csrf/blob/master/README_zh.md
            // csrf: https://www.ibm.com/developerworks/cn/web/1102_niugang_csrf/index.html
            // let csrf = document.cookie.match(/^csrfToken=[^;]*/)[0].replace('csrfToken=', '')
            'x-csrf-token': csrf,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            address: option.address,
            contract_address: option.contract_address,
            signed_address: option.signed_address,
            public_key: option.public_key
        })
    }).then(checkStatus).then(result => {
        callback(null, result);
        // console.log(result);
    }).catch(error => {
        callback(error);
        // console.log('error:', error)
    });
}