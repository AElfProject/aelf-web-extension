/**
 * @file addressOmit.js
 * @author huangzongzhe
 * 2018.08.24
 */

export default function addressOmit(address, start = 10, end = 36) {
    return address.replace(address.slice(start, end), '...');
}
