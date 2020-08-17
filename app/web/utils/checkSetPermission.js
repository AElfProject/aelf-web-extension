/**
 * @file checkSetPermission.js
 * @author zhouminghui
*/

export default function checkSetPermission(message) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>checkSetPermission', message);
    let method = message.payload ? message.payload.method : message.payload.payload.method;
    let width = 700;
    switch (method) {
        case 'SET_CONTRACT_PERMISSION':
            width = 1200;
            break;
        case 'UNLOCK_NIGHT_ELF':
            width = 320;
            break;
        default:
            width = 700;
            break;
    }
    return width;
}
