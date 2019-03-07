/**
 * @file checkWallet.js
 * @author zhouminghui
*/
import * as InternalMessageTypes from '../messages/InternalMessageTypes';
import InternalMessage from '../messages/InternalMessage';
import turnToPage from './turnToPage';

const checkWallet = {
    checkWalletInfo() {
        InternalMessage.payload(InternalMessageTypes.CHECK_WALLET).send().then(result => {
            turnToPage(result);
        });
    }
};

export default checkWallet;

