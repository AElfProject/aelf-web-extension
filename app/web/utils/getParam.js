/**
 * @file utils/getParam.js
 * @author huangzongzhe
 * 2018.07.27
 */

export default function getParam(name, search) {
    let reg = new RegExp('(|&)' + name + '=([^&]*)(&|$)');
    let r = search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
