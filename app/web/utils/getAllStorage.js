import { apis } from "./BrowserApis";

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

export {
    getAllStorageLocalData,
    getAllStorageSyncData
}