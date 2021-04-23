const { app, BrowserWindow, Menu } = require('electron');

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

const isMac = process.platform === 'darwin'

const menuTemplate = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'quit' }
        ]
    }] : [])
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
