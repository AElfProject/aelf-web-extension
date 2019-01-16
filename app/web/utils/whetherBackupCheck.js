/**
 * @file whetherBackupCheck.js
 * @author huangzongzhe
 * 2018.12.13
 */
function whetherBackupCheck () {
    let walletId = JSON.parse(localStorage.getItem('lastuse')).address;
    let walletInfoList = JSON.parse(localStorage.getItem('walletInfoList'));
    let walletInfo = walletInfoList[walletId];

    // import wallet: walletInfo.hasBackup === undefined;
    // create wallet: default walletInfo.hasBackup === false;
    return walletInfo.hasBackup === undefined
        ? true : walletInfo.hasBackup;
}

export default whetherBackupCheck
