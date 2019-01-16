/**
 * @file historyChange.js
 * @author huangzongzhe
 * 跳转到需要请求接口再渲染的页面。
 */
import {hashHistory} from 'react-router';
// import {Toast} from 'antd-mobile';

import getParam from './getParam';

export function historyPush(dir, showTost = true) {

    let hash_redirect = getParam('hash_redirect', window.location.href);
    if (hash_redirect) {
        hashHistory.push(decodeURIComponent(hash_redirect));
        return;
    }

	// showTost && Toast.loading('Loading...', 30);
    setTimeout(function () {
        hashHistory.push(dir);
    }, 50);
}

export function historyReplace(dir) {
	// Toast.loading('Loading...', 30);
    setTimeout(function () {
        hashHistory.replace(dir);
    }, 300);
}

export function historyGoBack() {
	// Toast.loading('Loading...', 30);
    setTimeout(function () {
        hashHistory.goBack();
    }, 50);
}
