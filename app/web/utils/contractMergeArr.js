/**
 * @file
 * @author zhouminghui
 * 检测是否已经绑定过的token
 */

export default function contractMergeArr(json1, json2) {
    let keyArr = Array(json1.length);
    for (let i = 0; i < json1.length; i++) {
        keyArr[i] = false;
        for (let j = 0; j < json2.length; j++) {
            if (json2[j].contract_address === json1[i].contract_address) {
                keyArr[i] = true;
            }
        }
    }
    return keyArr;
}
