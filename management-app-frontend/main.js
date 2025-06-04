const { app, BrowserWindow } = require('electron');
const path = require('path');

// Allow for using an environment variable for the dev URL
const isDev = !app.isPackaged;
const devURL = process.env.ELECTRON_START_URL || 'http://localhost:3000';

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.loadURL(devURL);
  } else {
    win.loadFile(path.join(__dirname, 'build/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
