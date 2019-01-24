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
const errorMap = {
    200001: 'payload is false.',
    200002: 'Please set permission at first.',
    200003: 'Please set permission at first.',
    200004: 'No Wallet Info.',
    200005: 'Night Elf is locked!',
    200006: 'Decrypto Failed. Please unlock your wallet.',
    200007: 'No Night Elf in storage.'
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
