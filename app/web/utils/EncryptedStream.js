/**
 * @file EncryptoStream.js
 * @author huangzongzhe
 */
// TODO: use Asymmetric encryption to transfer the key.
// And use AES to cryto the message.
export default class EncryptoStream {
    constructor(eventName, aesKey) {
        this._eventName = eventName;
        this._aesKey = aesKey;
    }

    addEventListener(callback) {
        // console.log('ount::::', this._eventName);
        document.addEventListener(this._eventName, event => {
            // console.log('in::::', this._eventName, event);
            let message = JSON.parse(event.detail);
            callback(message);
        });
    }

    send(data, to) {
        data.from = this._eventName;
        const event = new CustomEvent(to, {
            detail: JSON.stringify(data)
        });
        document.dispatchEvent(event);
    }
}
