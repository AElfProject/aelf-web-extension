/**
 * @file checkSetPermission.js
 * @author zhouminghui
*/

export default function checkSetPermission(method) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>checkSetPermission', method);
    let width = 700;
    switch (method) {
        case 'SET_CONTRACT_PERMISSION':
            width = 1200;
            break;
        default:
            width = 700;
            break;
    }
    return width;
}
