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

import elliptic from 'elliptic';
const EC = elliptic.ec;
const ec = new EC('curve25519');
export default class EncryptoStream {
    constructor(eventName, aesKey) {
        this._eventName = eventName;
        this._aesKey = aesKey;

        this.publicKeyHasSent;
        this.publicKeyOfTheOtherParty;
        this.aesKeyOfTheOtherParty;

        this.keyPair = ec.genKeyPair();
        this.publicKeyHex = this.keyPair.getPublic().encode('hex');
    }

    getDecodePublicKeyFromHex(publicKeyHex) {
        return ec.keyFromPublic(publicKeyHex, 'hex').getPublic();
    }

    getSharedKey(publicKeyHex) {
        const publicKey = this.getDecodePublicKeyFromHex(publicKeyHex);
        return this.keyPair.derive(publicKey).toString();
    }

    addEventListener(callback) {
        document.addEventListener(this._eventName, event => {
            let message;
            // console.log('-------- addEventListener -----------', message);
            if (this.aesKeyOfTheOtherParty) {
                message = JSON.parse(AESUtils.decrypt(event.detail, this.aesKeyOfTheOtherParty));
            }
            else {
                message = JSON.parse(event.detail);
            }
            // console.log('in::::', this._eventName, event, message);
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
                        // console.log('in addEventListenerOfEEC:: publicKey ::', this._eventName);
                    }
                    this.sendEncryptedAESKey(to);
                    return;
                }
                if (method === 'aesKey') {
                    // console.log('in addEventListenerOfEEC:: aesKey ::', this._eventName, event, message);
                    const sharedKey = this.getSharedKey(this.publicKeyOfTheOtherParty);
                    const decryptAESKey = AESUtils.decrypt(message.aesKey, sharedKey);
                    this.aesKeyOfTheOtherParty = decryptAESKey;
                    resolve(true);
                    // console.log('------------------');
                    // console.log('decryptAESKey: ', decryptAESKey);
                    // console.log('aesKey: ', this._aesKey);
                }
            });
        });

    }

    sendEncryptedAESKey(to) {
        const sharedKey = this.getSharedKey(this.publicKeyOfTheOtherParty);
        const encryptedAESKey = AESUtils.encrypt(this._aesKey, sharedKey);
        this.sendOfEEC({
            method: 'aesKey',
            aesKey: encryptedAESKey
        }, to);
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
            // publicKey: this.publicKey.toString('hex')
            publicKey: this.publicKeyHex
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
