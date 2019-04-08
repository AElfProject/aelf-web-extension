/**
 * @file turnToPage()
 * @author zhouminghui
*/

import {hashHistory} from 'react-router';
export default function turnToPage(walletStatus) {
    const {
        nightElf
    } = walletStatus || {};
    if (!nightElf) {
        hashHistory.push('/');
    }
}
