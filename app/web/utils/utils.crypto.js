/**
 *  
 * import AElf from 'aelf-sdk';
 * const { AESEncrypt, AESDecrypt } = AElf.wallet;
 */
import AES from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';



/**
 *
 * @alias module:AElf/wallet
 * @param {string} input anything you want to encrypt
 * @param {string} password password
 * @return {string} using base64 encoding way
 */

export const AESEncrypt = (input, password) => AES.encrypt(input, password).toString();

/**
 * Decrypt any encrypted information you want to decrypt
 *
 * @alias module:AElf/wallet
 * @param {string} input anything you want to decrypt
 * @param {string} password password
 * @return {string} decrypted input, using utf8 decoding way
 */
export const AESDecrypt = (input, password) => AES.decrypt(input, password).toString(encUTF8);
