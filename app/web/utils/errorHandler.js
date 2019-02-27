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
    200001: 'payload is false.',
    200002: 'Please set permission at first.',
    200003: 'Please set permission at first.',
    200004: 'No Wallet Info.',
    200005: 'Night Elf is locked!',
    200006: 'Decrypto Failed. Please unlock your wallet.',
    200007: 'No Night Elf in storage.',
    200008: 'Please login first.',
    200009: 'No permission, can not set whitelist.'
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
