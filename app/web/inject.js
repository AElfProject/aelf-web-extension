/**
 * @file inject.js
 * @author huangzongzhe
 */
import IdGenerator from './utils/IdGenerator';
import EncryptedStream from './utils/EncryptedStream';
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
        else {
            return true;
        }
    });
};

class Inject {

    constructor() {
        // Injecting an encrypted stream into the
        // web application.
        // const key = IdGenerator.text(64);
        const stream = new EncryptedStream(PageContentTags.PAGE_NIGHTELF, IdGenerator.text(64));
        // console.log('inject stream', stream);

        stream.addEventListener(result => {
            // console.log('inject addEventListener: ', result);
            handlePendingPromise(result);
        });

        function promiseSend(input) {
            return new Promise((resolve, reject) => {
                const data = Object.assign({}, input, {sid: IdGenerator.numeric(24)});
                promisePendingList.push({
                    sid: data.sid,
                    resolve,
                    reject
                });
                stream.send(data, PageContentTags.CONTENT_NIGHTELF);
            });
        }

        console.log('inject init ready2333!!!');

        window.NightElf = {
            api: promiseSend
        };

        document.dispatchEvent(new CustomEvent('NightElf'), {
            error: 0,
            message: 'Night Elf is ready.'
        });

        // Waiting for scatter to push itself onto the application
        // stream.listenWith(msg => {
        //     console.log('inject listenWith msg: ', msg);
        //     window.nightElf = {
        //         send: stream.send
        //     };
        //     // if (msg && msg.hasOwnProperty('type') && msg.type === NetworkMessageTypes.PUSH_SCATTER) {
        //         // window.scatter = new Scatterdapp(stream, msg.payload);
        //     // }
        // });

        // Syncing the streams between the
        // extension and the web application
        // stream.sync(PageContentTags.SCATTER, stream.key);
    }
}

new Inject();
