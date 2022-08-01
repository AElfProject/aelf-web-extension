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
import ActionEvent from './messages/ActionEvent';
import InternalMessage from './messages/InternalMessage';

import {
    apis
} from './utils/BrowserApis';
import getHostname from './utils/getHostname';
import errorHandler from './utils/errorHandler';

// The stream that connects between the content script
// and the website
let stream = new WeakMap();

// The filename of the injected communication script.
let INJECTION_SCRIPT_FILENAME = 'js/inject.js';

/***
 * The content script is what gets run on the application.
 * It also injects and instance of Scatterdapp
 */
class Content {

    constructor() {
        this.aesKey = IdGenerator.text(256);
        this.aesKeyOfInject;

        this.setupEncryptedStream();
        this.injectInteractionScript();
        this.extensionWatch();
    }

    extensionWatch() {
        new ActionEvent();
    }

    setupEncryptedStream() {
        // Setting up a new encrypted stream for
        // interaction between the extension and the application
        stream = new EncryptedStream(PageContentTags.CONTENT_NIGHTELF, this.aesKey);

        stream.addEventListener(result => {
            console.log('setupEncryptedStream: ', result);
            this.contentListener(result);
            // this.respond(result);
        });

        stream.setupEestablishEncryptedCommunication(PageContentTags.PAGE_NIGHTELF);
        // stream.sendPublicKey(PageContentTags.PAGE_NIGHTELF);
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
            console.log('inject.js onload!!!');
            script.remove();
        };
    }

    contentListener(input) {
        let message = Object.assign({}, input, {
            hostname: getHostname()
        });
        console.log('contentListener: ', message, location.host || location.hostname);
        // TODO: params check or use TS?
        // sid, method, appName, hostname,
        const {method, sid} = message;
        console.log('message: ', message);

        if (method === 'CHECK_CONTENT') {
            this.respond({
                sid,
                ...errorHandler(0, 'Refuse'),
                message: 'NightElf is ready.'
            });
            return;
        }

        // GET_ADDRESS
        const methodWhiteList = [
            'CALL_AELF_CHAIN', 'INIT_AELF_CONTRACT', 'CALL_AELF_CONTRACT',
            'CHECK_PERMISSION', 'LOGIN', 'REMOVE_PERMISSION',
            'REMOVE_CONTRACT_PERMISSION', 'REMOVE_METHODS_WHITELIST',
            'SET_CONTRACT_PERMISSION', 'GET_CHAIN_STATUS',
            'CALL_AELF_CONTRACT_READONLY', 'GET_SIGNATURE',
            'LOCK_WALLET','CALL_AELF_CONTRACT_SIGNED_TX',
        ];

        if (method === 'OPEN_PROMPT') {
            if (!methodWhiteList.includes(message.payload.method)) {
                this.respond({
                    sid,
                    ...errorHandler(400001, `${message.payload.method} is illegal method. ${methodWhiteList.join(', ')} are legal.`)
                });
                return;
            }
        }
        else if (!methodWhiteList.includes(message.method)) {
            this.respond({
                sid,
                ...errorHandler(400001, `${message.method} is illegal method. ${methodWhiteList.join(', ')} are legal.`)
            });
            return;
        }



        this.internalCommunicate(method, message);
    }

    internalCommunicate(method, message) {
        InternalMessage.payload(InternalMessageTypes[method], message)
            .send()
            .then(result => {
                result.sid = message.sid;
                console.log(InternalMessageTypes[method], result);
                this.respond({
                    ...errorHandler(0),
                    ...result
                });
            });
    }
}

new Content();
