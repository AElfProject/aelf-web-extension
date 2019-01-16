/**
 * @file clipboard.js
 * @author huangzongzhe
 * 2018.09.19
 */
import {
    Toast
} from 'antd-mobile';
import ClipboardJS from 'clipboard';

// https://clipboardjs.com/
// selector: button
export default function clipboard(selector, msg) {
    msg = msg ? ': ' + msg : '';
    const clipboard = new ClipboardJS(selector);

    clipboard.on('success', function (e) {
        Toast.info('Copied' + msg, 3, () => {}, false);

        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        Toast.fail('Copy Failed. Please manually select the text and copy it.', 6, () => {}, false);
    });
}
