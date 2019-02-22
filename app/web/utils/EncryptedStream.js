/**
 * @file EncryptoStream.js
 * @author huangzongzhe
 */
// use Asymmetric encryption to transfer the key.
// And use AES to cryto the message.
// For one-to-one
// If you call setupEestablishEncryptedCommunication
// you will get an encrypted communication.

// Demo
// One Side
// stream = new EncryptedStream(PageContentTags.PAGE_NIGHTELF, this.aesKey);
// stream.addEventListener(result => {
//     handlePendingPromise(result);
// });
// stream.setupEestablishEncryptedCommunication(PageContentTags.CONTENT_NIGHTELF).then(ready => {
//     this.initNightElf();
// });
// stream.sendPublicKey(PageContentTags.CONTENT_NIGHTELF);
// The other side
// stream = new EncryptedStream(PageContentTags.CONTENT_NIGHTELF, this.aesKey);
// stream.addEventListener(result => {
//     this.contentListener(result);
// });
// stream.setupEestablishEncryptedCommunication(PageContentTags.PAGE_NIGHTELF);


import AESUtils from './AESUtils';
import logger from './logger';

import eccrypto from 'eccrypto';
import crypto from 'crypto';

export default class EncryptoStream {
    constructor(eventName, aesKey) {
        this._eventName = eventName;
        this._aesKey = aesKey;

        this.privateKey = crypto.randomBytes(32);
        this.publicKey = eccrypto.getPublic(this.privateKey);

        this.publicKeyHasSent;
        this.publicKeyOfTheOtherParty;
        this.aesKeyOfTheOtherParty;
    }

    addEventListener(callback) {
        document.addEventListener(this._eventName, event => {
            let message;

            if (this.aesKeyOfTheOtherParty) {
                message = JSON.parse(AESUtils.decrypt(event.detail, this.aesKeyOfTheOtherParty));
            }
            else {
                message = JSON.parse(event.detail);
            }

            logger.log('in::::', this._eventName, event, message);
            callback(message);
        });
    }

    // EEC: EestablishEncryptedCommunication
    setupEestablishEncryptedCommunication(to) {
        return new Promise((resolve, reject) => {
            document.addEventListener(this._eventName + '_establishEncryptedCommunication', event => {
                const message = JSON.parse(event.detail);
                const {
                    method
                } = message;
                if (method === 'publicKey' && !this.publicKeyOfTheOtherParty) {
                    if (!this.publicKeyHasSent) {
                        this.publicKeyOfTheOtherParty = message.publicKey;
                        this.sendPublicKey(to);
                        logger.log('in addEventListenerOfEEC:: publicKey ::', this._eventName);
                    }
                    this.sendEncryptedAESKey(to);
                    return;
                }

                if (method === 'aesKey') {
                    logger.log('in addEventListenerOfEEC:: aesKey ::', this._eventName, event, message);

                    const aesKeyEncrypted = message.aesKey;
                    let aesKeyEncryptedJSON = JSON.parse(aesKeyEncrypted);
                    let aesKeyEncryptedBuffer = {};
                    for (const each in aesKeyEncryptedJSON) {
                        aesKeyEncryptedBuffer[each] = Buffer.from(aesKeyEncryptedJSON[each], 'hex');
                    }

                    eccrypto.decrypt(this.privateKey, aesKeyEncryptedBuffer).then(decryptAESKey => {
                        logger.log(
                            'in addEventListenerOfEEC:: decryptAESKey ::',
                            this._eventName, decryptAESKey.toString()
                        );
                        this.aesKeyOfTheOtherParty = decryptAESKey.toString();

                        resolve(true);
                    });
                    return;
                }
            });
        });

    }

    sendEncryptedAESKey(to) {
        eccrypto.encrypt(
            Buffer.from(this.publicKeyOfTheOtherParty, 'hex'),
            Buffer.from(this._aesKey)
        ).then(encryptedAESKey => {
            let encryptedAESKeyStringify = {};
            for (const each in encryptedAESKey) {
                encryptedAESKeyStringify[each] = encryptedAESKey[each].toString('hex');
            }
            this.sendOfEEC({
                method: 'aesKey',
                aesKey: JSON.stringify(encryptedAESKeyStringify)
            }, to);
        });
    }

    sendOfEEC(data, to) {
        const event = new CustomEvent(to + '_establishEncryptedCommunication', {
            detail: JSON.stringify(data)
        });
        document.dispatchEvent(event);
    }

    sendPublicKey(to) {
        this.sendOfEEC({
            method: 'publicKey',
            publicKey: this.publicKey.toString('hex')
        }, to);
        this.publicKeyHasSent = true;
    }

    send(data, to) {
        data.from = this._eventName;
        data = JSON.stringify(data);

        if (this.aesKeyOfTheOtherParty) {
            data = AESUtils.encrypt(data, this._aesKey);
        }
        const event = new CustomEvent(to, {
            detail: data
        });

        document.dispatchEvent(event);
    }
}
