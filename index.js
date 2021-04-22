const { app, BrowserWindow } = require('electron');

function createWindow () {
    let win = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL("http://localhost:1234");
}

app.on('ready', createWindow);
