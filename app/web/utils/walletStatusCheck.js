/*
 * huangzongzhe,hzz780
 * 2018.10.19
 * Beijing IFC
 * 检测不到钱包就跳转到创建钱包页去。
 */
import { hashHistory } from 'react-router'

export default function walletStatusCheck () {
    let walletInfoList = JSON.parse(localStorage.getItem('walletInfoList'));
    for (let each in walletInfoList) {
        return true;
    }
    localStorage.removeItem('walletInfoList');
    localStorage.removeItem('lastuse');
    return false;
    // hashHistory.replace('/get-wallet/guide');
    // return false;
}