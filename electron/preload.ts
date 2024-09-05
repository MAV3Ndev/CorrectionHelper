const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    storeSet: (key, value) => ipcRenderer.invoke('store:set', key, value),
    storeGet: (key) => ipcRenderer.invoke('store:get', key),
    storeDelete: (key) => ipcRenderer.invoke('store:delete', key),
    version: () => ipcRenderer.invoke('version'),
});
