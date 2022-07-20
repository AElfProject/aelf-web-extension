import InternalMessage from "../messages/InternalMessage";
import * as InternalMessageTypes from "../messages/InternalMessageTypes";
import { apis } from "./BrowserApis";
// TODO can use in prompt context when prompt.js didMount;
export async function endOfOperation(message, delay = 500) {
    try {
        const {
            id: windowId
        } = (await apis.windows.getCurrent());
        let timer = setTimeout(()=>{
            apis.windows.remove(windowId);
            clearTimeout(timer);
            timer = null;
        }, delay);
        return InternalMessage.payload(InternalMessageTypes.PROMPT_TO_SERVICE, message).send();
    } catch (error) {
        console.error('getMessageFromService error:', error);
        throw error
    }
}

export async function getMessageFromService() {
    try {
        const result = InternalMessage.payload(InternalMessageTypes.GET_MESSAGE_FROM_SERVICE, true).send();
        console.log(InternalMessageTypes.GET_MESSAGE_FROM_SERVICE, result, 'GET_MESSAGE_FROM_SERVICE');
        return result;
    } catch (error) {
        console.error('getMessageFromService error:', error)
    }
}