/**
 * @file ActionEvent.js
 */
import errorHandler from "../utils/errorHandler";
import { apis } from "../utils/BrowserApis";
import * as ActionEventTypes from "./ActionEventTypes";

export default class ActionEvent {
  constructor() {
    this.extensionWatch();
  }

  extensionWatch() {
    apis.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case ActionEventTypes.NIGHTELF_LOCK_WALLET:
          this.lockWallet(message, sender, sendResponse);
          break;
        case ActionEventTypes.NIGHTELF_REMOVE_KEYPAIR:
          this.removeKeyPair(message, sender, sendResponse);
          break;
      }
    });
  }

  lockWallet(message, sender, sendResponse) {
    const info = {
      ...errorHandler(0),
      message: "Night Elf is lock",
    };
    sendResponse(info);
    this.dispatchToUserPage(message.type, {
      message,
    });
  }

  removeKeyPair(message, sender, sendResponse) {
    const info = {
      ...errorHandler(0),
    };
    sendResponse(info);
    this.dispatchToUserPage(message.type, message);
  }

  dispatchToUserPage(eventName, message) {
    const event = new CustomEvent(eventName, message);
    document.dispatchEvent(event);
  }
}
