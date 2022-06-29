/**
 * @file EventHandler.js
 */
import { apis } from "./BrowserApis";

let tabsList = [];

chrome.tabs.onRemoved.addListener((tabId, info) => {
  const index = tabsList.indexOf(tabId);
  if (index > -1) tabsList.splice(index, 1);
});

export default class EventHandler {
  constructor() {
    // super();
  }

  static event(type, payload) {
    switch (type) {
      case ActionEventTypes.NIGHTELF_LOCK_WALLET:
        break;
    }
  }

  addTabs() {
    apis.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabsList.includes(tabs[0].id)) return;
      tabsList.push(tabs[0].id);
    });
  }

  dispatch(type, detail) {
    return new Promise((resolve, reject) => {
      try {
        tabsList?.forEach((tabsId) => {
          apis.tabs.sendMessage(tabsId, { type, detail, tabsId }, (res) => {
            resolve(res);
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
