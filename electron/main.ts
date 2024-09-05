import { app, BrowserWindow, Menu, ipcMain } from "electron";
import Store from "electron-store";
import path from "node:path";
import { updateElectronApp } from 'update-electron-app';

process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

const store = new Store();


if (process.env.VITE_DEV_SERVER_URL) {
    console.log(store.path)
} else {
    updateElectronApp()
}

const template = Menu.buildFromTemplate([
]);

Menu.setApplicationMenu(template);

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
    createWindow();
});

ipcMain.handle('store:set', (event, key, value) => {
    store.set(key, value);
});

ipcMain.handle('store:get', (event, key) => {
    return store.get(key);
});

ipcMain.handle('store:delete', (event, key) => {
    return store.delete(key);
});

ipcMain.handle('version', (event, key) => {
    return app.getVersion();
});
