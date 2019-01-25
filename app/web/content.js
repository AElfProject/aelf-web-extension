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
import getHostname from './utils/getHostname';
import errorHandler from './utils/errorHandler';
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
            // console.log('setupEncryptedStream: ', result);
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
            console.log('inject.js onload!!!');
            script.remove();
        };
    }

    contentListener(input) {
        let message = Object.assign({}, input, {
            hostname: getHostname()
        });
        // console.log('contentListener: ', message, location.host || location.hostname);
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

        const methodWhiteList = [
            'CONNECT_AELF_CHAIN', 'CALL_AELF_CHAIN', 'INIT_AELF_CONTRACT', 'CALL_AELF_CONTRACT',
            'OPEN_PROMPT', 'CHECK_PERMISSION', 'GET_ADDRESS'
        ];
        if (!methodWhiteList.includes(method)) {
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
                // console.log(InternalMessageTypes[method], result);
                this.respond({
                    ...errorHandler(0),
                    ...result
                });
            });
    }
}

new Content();
