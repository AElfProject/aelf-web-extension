/**
 * @file Keychain.js
 * @author huangzongzhe; Scatter;
 */
// import Identity from './Identity';
// import Permission from './Permission';
// import KeyPair from './KeyPair';
import ObjectHelpers from '../utils/ObjectHelpers';

export default class Keychain {

    constructor() {
        // {name,address,mnemonic, privateKey}
        this.keypairs = [];
        // this.identities = [];
        // {
        //     domain,
        //     address,
        //     contracts: [...contractIDList]
        // }
        this.permissions = [];
    }

    static placeholder() {
        return new Keychain();
    }
    static fromJson(json) {
        let p = Object.assign(this.placeholder(), json);
        if (json.hasOwnProperty('keypairs')) {
            p.keypairs = json.keypairs;
        }
        if (json.hasOwnProperty('permissions')) {
            p.permissions = json.permissions;
        }
        return p;
    }

    clone() {
        return Keychain.fromJson(JSON.parse(JSON.stringify(this)));
    }

    removePermissionsByKeypair(keypair) {
        this.permissions = this.permissions.filter(perm => perm.keypair !== keypair.unique());
    }
    removePermission(permission) {
        this.permissions = this.permissions.filter(perm => perm.checksum !== permission.checksum);
    }
    getPermission(checksum) {
        return this.permissions.find(permission => permission.checksum === checksum);
    }
    hasPermission(checksum, fields = []) {
        const fieldKeys = () => Array.isArray(fields) ? fields : Object.keys(fields);

        const permission = this.getPermission(checksum);
        console.log('checksum', checksum, permission);
        if (!permission) {
            return false;
        }

        // If no fields are supplied but permission exists | valid.
        if (fields === null || !fieldKeys().length) {
            return true;
        }

        let fieldsCloneA = Object.assign({}, fields);
        let fieldsCloneB = Object.assign({}, permission.fields);
        permission.mutableFields.map(field => {
            delete fieldsCloneA[field];
            delete fieldsCloneB[field];
        });

        return ObjectHelpers.deepEqual(fieldsCloneA, fieldsCloneB);

    }

    forBackup() {
        const clone = this.clone();
        clone.keypairs = [];
        clone.permissions = [];
        return clone;

    }

    getKeyPair(keypair) {
        return this.getKeyPairByPublicKey(keypair.publicKey);
        // return this.keypairs.find(key => key.publicKey.toLowerCase() === keypair.publicKey.toLowerCase())
    }

    getKeyPairByName(name) {
        return this.keypairs.find(key => key.name.toLowerCase() === name.toLowerCase());
    }

    getKeyPairByPublicKey(publicKey) {
        return this.keypairs.find(key => key.publicKey.toLowerCase() === publicKey.toLowerCase());
    }

    removeKeyPair(keypair) {
        this.keypairs = this.keypairs.filter(key => key.unique() !== keypair.unique());
    }
}
