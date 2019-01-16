// import Meta from './Meta';
import Keychain from './Keychain';
// import Settings from './Settings';
import {wallet} from 'aelf-sdk';
const {
    AESEncrypto,
    AESDecrypto
} = wallet;
// import Hasher from '../util/Hasher'
// import IdGenerator from '../util/IdGenerator'

/* eslint-disable fecs-camelcase */
export default class NightElf {

    constructor() {
        // this.meta = Meta.placeholder();
        this.keychain = Keychain.placeholder();
        // this.settings = Settings.placeholder();
        this.histories = [];
        // this.hash = Hasher.insecureHash(IdGenerator.text(2048));
    }

    static placeholder() {
        return new NightElf();
    }
    static fromJson(json) {
        let p = Object.assign(this.placeholder(), json);
        // if (json.hasOwnProperty('meta')) p.meta = Meta.fromJson(json.meta);
        // if (json.hasOwnProperty('settings')) p.settings = Settings.fromJson(json.settings);
        // if (json.hasOwnProperty('keychain')) {
        //     p.keychain
        //         = (typeof json.keychain === 'string')
        //         ? json.keychain : Keychain.fromJson(json.keychain);
        // }

        return p;
    }

    clone() {
        return NightElf.fromJson(JSON.parse(JSON.stringify(this)));
    }

    isEncrypted() {
        return typeof this.keychain !== 'object';
    }

    /***
     * Encrypts the entire keychain
     * @param seed - The seed to encrypt with
     */
    decrypt(seed) {
        if (this.isEncrypted()) {
            this.keychain = Keychain.fromJson(AESDecrypto(this.keychain, seed));
        }
    }

    /***
     * Decrypts the entire keychain
     * @param seed - The seed to decrypt with
     */
    encrypt(seed) {
        if (!this.isEncrypted()) this.keychain = AESEncrypto(this.keychain, seed);
    }

    forBackup() {
        const clone = this.clone();
        clone.histories = [];
        return clone;
    }
}
