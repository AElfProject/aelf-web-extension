/**
 * @file getBalanceAndTokenName
 * @author huangzonghze
 * 10.25
 */
import checkStatus from './checkStatus';
import {
    getParam,
    apisauce
} from '../utils/utils';

export default function getBalanceAndTokenName(walletAddress, contractAddress, successCall, failCall) {
    console.log('getBalanceAndTokenName: ', walletAddress, contractAddress);

    apisauce.get('wallet/api/proxy', {
        token: getParam('token', window.location.href),
        ptype: 'api',
        action: 'address_balance',
        address: walletAddress,
        contract_address: contractAddress
    }).then(result => {
        successCall(result.result);
    }).catch(error => {
        failCall(error);
        console.log('error:', error);
    });
}

