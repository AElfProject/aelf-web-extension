/**
 * @file NotificationService.js
 * @author huangzongzhe
 */

import errorHandler from '../utils/errorHandler';
import {
    apis
} from '../utils/BrowserApis';
import InternalMessage from '../messages/InternalMessage';
import * as InternalMessageTypes from '../messages/InternalMessageTypes';

import checkSetPermission from '../utils/checkSetPermission';
let openWindow = null;

export default class NotificationService {

    /***
     * Opens a prompt window outside of the extension
     * @param notification
     */
    // static async open(notification) {
    static async open(notification) {
        if (openWindow) {
            // For now we're just going to close the window to get rid of the error
            // that is caused by already open windows swallowing all further requests
            openWindow.close();
            openWindow = null;

            // Alternatively we could focus the old window, but this would cause
            // urgent 1-time messages to be lost, such as after dying in a game and
            // uploading a high-score. That message will be lost.
            // openWindow.focus();
            // return false;

            // A third option would be to add a queue, but this could cause
            // virus-like behavior as apps overflow the queue causing the user
            // to have to quit the browser to regain control.
        }

        const height = 600;
        // let method = notification.message.payload.payload ? notification.message.payload.payload.method : notification.message.payload.method;
        // if (notification.message) {
        //     method = notification.message.payload.method;
        // }
        const width = checkSetPermission(notification.message) || 700;
        let middleX = window.screen.availWidth / 2 - (width / 2);
        let middleY = window.screen.availHeight / 2 - (height / 2);

        const getPopup = async () => {
            try {
                const route = notification.route || '';
                const url = apis.runtime.getURL('/prompt.html' + route);

                // Notifications get bound differently depending on browser
                // as Firefox does not support opening windows from background.
                if (typeof browser !== 'undefined') {
                    const created = await apis.windows.create({
                        url,
                        height,
                        width,
                        type: 'popup'
                    });

                    window.notification = notification;
                    return created;
                }
                const win = window.open(
                    url,
                    'NightElf Prompt',
                    `width=${width},height=${height},resizable=0,top=${middleY},left=${middleX},titlebar=0`);
                win.data = notification;
                openWindow = win;
                return win;
            }
            catch (e) {
                console.log('notification error', e);
                return null;
            }
        };

        // Could not establish connection. Receiving end does not exist.
        // InternalMessage.payload(InternalMessageTypes.SET_PROMPT, JSON.stringify(notification)).send();
        // If we need setPrompt, use callback to complement it.

        // let popup = await getPopup();
        getPopup().then(popup => {
            // Handles the user closing the popup without taking any action
            if (popup) {
                popup.onbeforeunload = () => {
                    // notification.responder(Error.promptClosedWithoutAction());
                    notification.sendResponse({
                        ...errorHandler(200010)
                    });

                    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
                    // Must return undefined to bypass form protection
                    openWindow = null;
                    return undefined;
                };
            }
        });

    }

    /***
     * Always use this method for closing notification popups.
     * Otherwise you will double send responses and one will always be null.
     */
    static async close() {
        if (typeof browser !== 'undefined') {
            const {
                id: windowId
            } = (await apis.windows.getCurrent());
            apis.windows.remove(windowId);
        }
        else {
            window.onbeforeunload = () => {};
            window.close();
        }
    }

}
