/**
 * @file
 * @author zhouminghui
 * 2018.12.13
 */

export default function txIdOmit(txId) {
    return txId.replace(txId.slice(10, 54), '...');
}
