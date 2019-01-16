/**
 * @file utils/getPageContainerStyle.js
 * @author huangzonghze
 * 10.17
 */

export default function getPageContainerStyle() {
    const ua = navigator.userAgent;
    const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    const isAndroid = ua.match(/(Android)\s+([\d.]+)/);
    const isMobile = isIphone || isAndroid;

    let containerStyle = {
        height: document.body.clientHeight - 45
        // overflowY: 'scroll',
        // overflowX: 'hidden',
        // WebkitOverflowScrolling: 'touch'
    };
    // 判断
    if (isMobile) {
        containerStyle.overflowY = 'scroll';
        containerStyle.overflowX = 'hidden';
        containerStyle.WebkitOverflowScrolling = 'touch';
    }

    return containerStyle;
}