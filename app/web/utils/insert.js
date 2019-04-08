/**
 * @file insert
 * @author zhouminghui
 * 向类中插入某方法
*/

export default function insert(...list) {
    return function (target) {
        Object.assign(target.prototype, ...list);
    };
}
