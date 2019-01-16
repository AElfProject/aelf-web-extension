/**
 *  @file
 *  @author zhouminghui
 *  2018.12.5
 *  用来对名称进行排序
 */

export default function contactCompare(property) {
    return function (a, b) {
        let t1 = a[property];
        let t2 = b[property];
        return t1.localeCompare(t2);
    };
}
