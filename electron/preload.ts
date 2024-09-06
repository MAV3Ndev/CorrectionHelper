const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    storeSet: (key:string, value:object) => ipcRenderer.invoke('store:set', key, value),
    storeGet: (key:string) => ipcRenderer.invoke('store:get', key),
    storeDelete: (key:string) => ipcRenderer.invoke('store:delete', key),
    version: () => ipcRenderer.invoke('version'),
    firstRun: () => ipcRenderer.invoke('firstrun'),
    updateProgress: () => ipcRenderer.invoke('update:progress'),
    updateDownload: () => ipcRenderer.invoke('update:download'),
    updateInstall: () => ipcRenderer.invoke('update:install'),
    updateAvailable: () => ipcRenderer.invoke('update:available'),
    updateReady: () => ipcRenderer.invoke('update:ready'),
});
