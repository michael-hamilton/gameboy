const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    let win = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + '/icons/icon.png'
    });

    win.loadURL("http://localhost:1234");

    win.webContents.openDevTools();
}

app.on('ready', createWindow);
