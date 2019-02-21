/**
 * @file inject.js
 * @author huangzongzhe
 */
import IdGenerator from './utils/IdGenerator';
import EncryptedStream from './utils/EncryptedStream';
import logger from './utils/logger';
// import {
//     EncryptedStream
// } from 'extension-streams';
import * as PageContentTags from './messages/PageContentTags';
// import * as NetworkMessageTypes from './messages/NetworkMessageTypes'

/***
 * This is the javascript which gets injected into
 * the application and facilitates communication between
 * NightElf and the web application.
 */

let promisePendingList = [];
const handlePendingPromise = function (eventMessage) {
    const sid = eventMessage.sid;
    promisePendingList = promisePendingList.filter((item, index) => {
        if (item.sid === sid) {
            item.resolve(eventMessage);
            return false;
        }
        return true;
    });
};

let stream = new WeakMap();

class Inject {

    constructor() {
        // Injecting an encrypted stream into the
        // web application.
        this.aesKey = IdGenerator.text(256);
        this.setupEncryptedStream();
    }

    setupEncryptedStream() {
        stream = new EncryptedStream(PageContentTags.PAGE_NIGHTELF, this.aesKey);
        // logger.log('inject stream', stream);
        stream.addEventListener(result => {
            // logger.log('inject addEventListener: ', result);
            handlePendingPromise(result);
        });

        stream.setupEestablishEncryptedCommunication(PageContentTags.CONTENT_NIGHTELF).then(ready => {
            this.initNightElf();
        });
        stream.sendPublicKey(PageContentTags.CONTENT_NIGHTELF);
    }

    promiseSend(input) {
        return new Promise((resolve, reject) => {
            const data = Object.assign({}, input, {
                sid: IdGenerator.numeric(24)
            });
            promisePendingList.push({
                sid: data.sid,
                resolve,
                reject
            });
            stream.send(data, PageContentTags.CONTENT_NIGHTELF);
        });
    }

    initNightElf() {
        window.NightElf = {
            api: this.promiseSend
        };

        document.dispatchEvent(new CustomEvent('NightElf', {
            detail: {
                error: 0,
                message: 'Night Elf is ready.'
            }
        }));
    }

    initNightELFFailed() {
        document.dispatchEvent(new CustomEvent('NightElf', {
            detail: {
                error: 1,
                message: 'init Night ELF failed.'
            }
        }));
    }
}

new Inject();
