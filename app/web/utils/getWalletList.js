/**
 * @file utils/getParam.js
 * @author huangzongzhe
 * 2019.01
 */

// Mark
export default function getWalletList() {
    const walletList = localStorage.getItem('walletInfoList');
    return walletList;
}
