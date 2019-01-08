/** @file
 *  @author zhouminghui
 *  国际化相关配置与语言的判断
 */

import zh_CN from '../langConfig/zh-CN';
import en_US from '../langConfig/en-US';

export default function chooseLocale() {
    let Languge = null;
    if (localStorage.language === undefined) {
        let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
        if (lang.includes('zh')) {
            localStorage.setItem('language', 'zh-CN');
        }
        else {
            localStorage.setItem('language', 'en-US');
        }

        Languge = localStorage.language;
    }
    else {
        Languge = localStorage.language;
    }

    switch (Languge) {
        case 'zh-CN':
            return zh_CN;
        default:
            return en_US;
    }
}