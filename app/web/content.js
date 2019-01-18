// import {
//     EncryptedStream
//     // LocalStream
// } from 'extension-streams';
import IdGenerator from './utils/IdGenerator';
import EncryptedStream from './utils/EncryptedStream';
import * as PageContentTags from './messages/PageContentTags';
// import * as PairingTags from './messages/PairingTags'
// import NetworkMessage from './messages/NetworkMessage';
// import * as NetworkMessageTypes from './messages/NetworkMessageTypes'
// import InternalMessage from './messages/InternalMessage';
// import * as InternalMessageTypes from './messages/InternalMessageTypes'
import * as InternalMessageTypes from './messages/InternalMessageTypes';
import InternalMessage from './messages/InternalMessage';
// import Error from './models/errors/Error'
import {
    apis
} from './utils/BrowserApis';
// import Hasher from './util/Hasher'
// import {
//     strippedHost
// } from './util/GenericTools'

// The stream that connects between the content script
// and the website
let stream = new WeakMap();

// The filename of the injected communication script.
let INJECTION_SCRIPT_FILENAME = 'js/inject.js';

let isReady = false;

console.log('content window.href: ', window.location.host || window.location.hostname);

/***
 * The content script is what gets run on the application.
 * It also injects and instance of Scatterdapp
 */
class Content {

    constructor() {
        this.setupEncryptedStream();
        this.injectInteractionScript();
    }

    setupEncryptedStream() {
        // Setting up a new encrypted stream for
        // interaction between the extension and the application
        stream = new EncryptedStream(PageContentTags.CONTENT_NIGHTELF, IdGenerator.text(256));

        stream.addEventListener(result => {
            console.log('setupEncryptedStream: ', result);
            this.contentListener(result);
            // this.respond(result);
        });
    }

    respond(payload) {
        // if (!isReady) return;
        stream.send(payload, PageContentTags.PAGE_NIGHTELF);
    }

    getVersion() {
        return 'beta';
        // return InternalMessage.signal(InternalMessageTypes.REQUEST_GET_VERSION)
        //     .send()
    }

    /***
     * Injecting the interaction script into the application.
     * This injects an encrypted stream into the application which will
     * sync up with the one here.
     */
    injectInteractionScript() {
        let script = document.createElement('script');
        script.src = apis.extension.getURL(INJECTION_SCRIPT_FILENAME);
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => {
            console.log('inject.js onload');
            script.remove();
        };
    }

    contentListener(input) {
        let message = Object.assign({}, input, {
            hostname: location.host || location.hostname
        });
        console.log('contentListener: ', message, location.host || location.hostname);
        // TODO: params check
        // sid, method, appName, hostname,
        const {method} = message;
        const methodWhiteList = [
            'CONNECT_AELF_CHAIN', 'CALL_AELF_CHAIN', 'INIT_AELF_CONTRACT', 'CALL_AELF_CONTRACT',
            'OPEN_PROMPT', 'CHECK_PERMISSION', 'GET_ADDRESS'
        ];
        if (!methodWhiteList.includes(method)) {
            this.respond({
                error: 200001,
                message: `${message.method} is illegal method. ${methodWhiteList.join(', ')} are legal.`
            });
            return;
        }
        // if (method === 'OPEN_PROMPT') {
        //     this.openPrompt();
        //     return;
        // }
        this.internalCommunicate(method, message);

        // switch (method) {
        //     case 'CONNECT_AELF_CHAIN':
        //         this.connectChain(message);
        //         break;
        // }
    }

    internalCommunicate(method, message) {
        InternalMessage.payload(InternalMessageTypes[method], message)
            .send()
            .then(result => {
                result.sid = message.sid;
                console.log(InternalMessageTypes[method], result);
                this.respond(result);
            });
    }

    connectChain(message) {
        // CONNECT_AELF_CHAIN
        // {
        //     appName: 'hzzTest',
        //     method: 'CONNECT_AELF_CHAIN',
        //     hostname: 'aelf.io',
        //     payload: {
        //         httpProvider: 'http://localhost:1234/chain'
        //     }
        // }
        InternalMessage.payload(InternalMessageTypes.CONNECT_AELF_CHAIN, message)
            .send()
            .then(result => {
                result.sid = message.sid;
                console.log(InternalMessageTypes.CONNECT_AELF_CHAIN, result);
                this.respond(result);
            });
    }

    callChain(message) {
        // 'CALL_AELF_CHAIN',
        // {
        //     appName: 'hzzTest',
        //     method: 'CALL_AELF_CHAIN',
        //     chainId: 'AELF',
        //     hostname: 'aelf.io',
        //     payload: {
        //         method: 'getTxResult',
        //         params: ['5feb4d3175b4144e54f5f4d0a12b19559633a2aede0e87dc42322efe1aac12c9']
        //     }
        // }
        InternalMessage.payload(InternalMessageTypes.CALL_AELF_CHAIN, message)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.CALL_AELF_CHAIN, result);
                this.respond(result);
            });
    }

    initContract(message) {
        // INIT_AELF_CONTRACT
        // {
        //     appName: 'hzzTest',
        //     method: 'INIT_AELF_CONTRACT',
        //     hostname: 'aelf.io',
        //     chainId: 'AELF',
        //     payload: {
        //         address: 'ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK',
        //         contractName: 'token',
        //         contractAddress: 'ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx'
        //     }
        // }
        InternalMessage.payload(InternalMessageTypes.INIT_AELF_CONTRACT, message)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.INIT_AELF_CONTRACT, result);
                this.respond(result);
            });
    }

    callContract(message) {
        // CALL_AELF_CONTRACT
        // {
        //     appName: 'hzzTest',
        //     method: 'CALL_AELF_CONTRACT',
        //     hostname: 'aelf.io',
        //     chainId: 'AELF',
        //     payload: {
        //         contractName: 'token',
        //         method: 'BalanceOf',
        //         params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
        //     }
        // }
        InternalMessage.payload(InternalMessageTypes.CALL_AELF_CONTRACT, message)
            .send()
            .then(result => {
                console.log(InternalMessageTypes.CALL_AELF_CONTRACT, result);
                this.respond(result);
            });
    }



    // contentListener(msg) {
    //     if (!isReady) return;
    //     if (!msg) return;
    //     if (!stream.synced && (!msg.hasOwnProperty('type') || msg.type !== 'sync')) {
    //         stream.send(nonSyncMessage.error(Error.maliciousEvent()), PairingTags.INJECTED);
    //         return;
    //     }

    //     // Always including the domain for every request.
    //     msg.domain = strippedHost();
    //     if (msg.hasOwnProperty('payload'))
    //         msg.payload.domain = strippedHost();

    //     let nonSyncMessage = NetworkMessage.fromJson(msg);
    //     switch (msg.type) {
    //         case 'sync':
    //             this.sync(msg);
    //             break;
    //         case NetworkMessageTypes.GET_OR_REQUEST_IDENTITY:
    //             this.getOrRequestIdentity(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.FORGET_IDENTITY:
    //             this.forgetIdentity(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.REQUEST_SIGNATURE:
    //             this.requestSignature(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.REQUEST_ARBITRARY_SIGNATURE:
    //             this.requestArbitrarySignature(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.REQUEST_ADD_NETWORK:
    //             this.requestAddNetwork(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.REQUEST_VERSION_UPDATE:
    //             this.requestVersionUpdate(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.AUTHENTICATE:
    //             this.authenticate(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.IDENTITY_FROM_PERMISSIONS:
    //             this.identityFromPermissions(nonSyncMessage);
    //             break;
    //         case NetworkMessageTypes.ABI_CACHE:
    //             this.abiCache(nonSyncMessage);
    //             break;
    //         default:
    //             stream.send(nonSyncMessage.error(Error.maliciousEvent()), PairingTags.INJECTED)
    //     }
    // }

    // respond(message, payload) {
    //     if (!isReady) return;
    //     const response = (!payload || payload.hasOwnProperty('isError')) ?
    //         message.error(payload) :
    //         message.respond(payload);
    //     stream.send(response, PageContentTags.PAGE_NIGHTELF);
    // }

    // sync(message) {
    //     stream.key = message.handshake.length ? message.handshake : null;
    //     stream.send({
    //         type: 'sync'
    //     }, PageContentTags.PAGE_NIGHTELF);
    //     stream.synced = true;
    // }

    identityFromPermissions(message = null) {
        return 'beta identity';
        // const promise = InternalMessage.payload(InternalMessageTypes.IDENTITY_FROM_PERMISSIONS, {
        //     domain: strippedHost()
        // }).send();
        // if (!message) return promise;
        // else promise.then(res => {
        //     if (message) this.respond(message, res);
        // });
    }

    // abiCache(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.ABI_CACHE, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // getOrRequestIdentity(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.GET_OR_REQUEST_IDENTITY, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // forgetIdentity(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.FORGET_IDENTITY, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // requestSignature(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.REQUEST_SIGNATURE, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // requestArbitrarySignature(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.REQUEST_ARBITRARY_SIGNATURE, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // requestAddNetwork(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.REQUEST_ADD_NETWORK, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // requestVersionUpdate(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.REQUEST_VERSION_UPDATE, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

    // authenticate(message) {
    //     if (!isReady) return;
    //     InternalMessage.payload(InternalMessageTypes.AUTHENTICATE, message.payload)
    //         .send().then(res => this.respond(message, res))
    // }

}

new Content();
