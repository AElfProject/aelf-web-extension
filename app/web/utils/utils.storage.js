import { apis } from './BrowserApis';
import storage from './storage';

function getAllStorageSyncData() {
  return new Promise((resolve, reject) => {
    apis.storage.sync.get(null, (items) => {
      if (apis.runtime.lastError) {
        return reject(apis.runtime.lastError);
      }
      resolve(items);
    });
  });
}

function getAllStorageLocalData() {
  return new Promise((resolve, reject) => {
    apis.storage.local.get(null, (items) => {
      if (apis.runtime.lastError) {
        return reject(apis.runtime.lastError);
      }
      resolve(items);
    });
  });
}

function getLocalStorage(str) {
  return new Promise((resolve) => {
    const key = storage[str] ? storage[str] : str;
    apis.storage.local.get([key], (result) => {
      resolve(result);
    });
  });
}

function setLocalStorage(_data) {
  return new Promise((resolve, reject) => {
    let storageData = {};
    for (var key in _data) {
      if (storage[key]) storageData = { ...storageData, [storage[key]]: _data[key] };
      storageData = { ...storageData, [key]: _data[key] };
    }
    apis.storage.local.set(storageData, (result) => {
      resolve(result);
    });
  });
}

export { getAllStorageLocalData, getAllStorageSyncData, setLocalStorage, getLocalStorage };
