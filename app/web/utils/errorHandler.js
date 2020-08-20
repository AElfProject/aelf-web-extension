/**
 * @file utils/errorHandler.js
 * @author huangzongzhe
 */

/**
 * 1xxxxx try catch
 * 2xxxxx handle
 * 3xxxxx
 * 4xxxxx input error
 * 5xxxxx rpc error
 */
// About Error Code. 冗余的设计。
// https://www.zhihu.com/question/24091286
// https://open.taobao.com/doc.htm?docId=114&docType=1
// 统一格式：A-BB-CCC
// A: 错误级别，如1代表系统级错误，2代表服务级错误；
// // B: 项目或模块名称，一般公司不会超过99个项目；
// // C: 具体错误编号，自增即可，一个项目999种错误应该够用；
// B xxxx1x, 加密解密相关错误; xxxx0x 参数问题。
// C 0，no Error
const errorMap = {
    // 1xxxx 错误码，是catch到的error
    200001: 'Payload is false.',
    200002: 'Please set permission at first.',
    200003: 'Please set permission at first.',
    200004: 'No Wallet Info.',
    200005: 'Night Elf is locked!',
    200006: 'Decrypt Failed. Please unlock your wallet.',
    200007: 'No Night Elf in storage.',
    200008: 'Please login first.',
    200009: 'No permission, can not set whitelist.',
    200010: 'You closed the prompt without any action.',
    200011: 'Decrypt failed, get Night Elf failed!',
    200012: 'Wallet error or damaged',
    200013: 'Decrypt keystore failed',
    200014: 'Can not find this wallet.',
    // 3xxxxx 暂时仅用于内部重定向
    300000: 'Unlocked your wallet, recall your function please.',
    // [40000, 41000) 是动态错误
    // 400001 都是动态错误
    // [41001, 42000) 是固定错误
    410001: 'Forbidden',
    410002: 'Missing param address.',
    410003: 'Missing param contractAddress.',
    410004: 'Missing param sendResponse(function).',
    // 5xxxxxx 一般和接口请求有关，插件主动抛出来
    // 目前仅有500001，background.js 报错
    // 500002 NotificationService.js failed
};

export default function errorHandler(code, error) {
    const errorMessage = errorMap[code];
    let output = {
        error: code,
        errorMessage: ''
    };
    if (code === 0) {
    }
    else if (error && error.constructor !== String) {
        output.errorMessage = {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }
    else if (errorMessage) {
        output.errorMessage = {
            name: 'errorMap',
            message: error || errorMessage
        };
    }
    else {
        output.errorMessage = {
            name: 'customeError',
            message: error
        };
    }
    return output;
}
