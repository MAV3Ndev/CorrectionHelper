import { app, BrowserWindow, Menu, ipcMain } from "electron";
import Store from "electron-store";
import path from "node:path";
import { autoUpdater } from "electron-updater"

process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

const store = new Store();

const template = Menu.buildFromTemplate([
]);

Menu.setApplicationMenu(template);

autoUpdater.checkForUpdates()

let win
const createWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(MAIN_DIST, 'preload.js'),
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
    }
};

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    if (process.env.VITE_DEV_SERVER_URL) {
        console.log(store.path)
    }
    createWindow();
});

let isUpdateAvailable = false
let isUpdateReady = false

let progressInfo = {
    bytesPerSecond: 0,
    percent: 0,
    total: 0,
    transferred: 0
}

autoUpdater.on('update-available', (info) => {
    isUpdateAvailable = true
})

autoUpdater.on('download-progress', (progress) => {
    progressInfo = progress
})

autoUpdater.on('update-downloaded', (info) => {
    isUpdateReady = true
})

ipcMain.handle('store:set', (event, key, value) => {
    store.set(key, value);
});

ipcMain.handle('store:get', (event, key) => {
    return store.get(key);
});

ipcMain.handle('store:delete', (event, key) => {
    return store.delete(key);
});

ipcMain.handle('version', () => {
    return app.getVersion();
});

ipcMain.handle('firstrun', () => {
    return store.get('firstrun');
});

ipcMain.handle('update:progress', () => {
    console.log(progressInfo)
    return progressInfo;
});

ipcMain.handle('update:check', async () => {
    const res = await fetch('https:///update.electronjs.org/MAV3Ndev/CorrectionHelper/win32/0.0.1/')
    const data = await res.json()
    console.log(data)
    return data
});

ipcMain.handle('update:download', () => {
    autoUpdater.downloadUpdate()
});
ipcMain.handle('update:install', () => {
    autoUpdater.quitAndInstall()
});

ipcMain.handle('update:available', () => {
    return isUpdateAvailable;
});

ipcMain.handle('update:ready', () => {
    return isUpdateReady;
});
