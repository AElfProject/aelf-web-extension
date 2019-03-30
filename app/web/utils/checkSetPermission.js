/**
 * @file checkSetPermission.js
 * @author zhouminghui
*/

export default function checkSetPermission(message) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>checkSetPermission', message);
    let method = message.payload.payload ? message.payload.payload.method : message.payload.method;
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
