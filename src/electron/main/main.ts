import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import fetch from 'node-fetch'; // npm install node-fetch
import { installToaster, ToasterOptions } from 'maz-ui'
const isDev = process.env.npm_lifecycle_event === 'app:dev';
const fs = require('fs')
async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({ title: 'Open File' });
    if (!canceled) {
        return filePaths[0];
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'), // Ensure this path is correct
            nodeIntegration: false,  // Don't allow Node.js integration in the renderer
            contextIsolation: true,  // Ensure context isolation is enabled
        },
    });

    // Handle CORS (optional, since we'll fetch via Node)
    const ses = session.defaultSession;

    ses.webRequest.onBeforeSendHeaders((details, callback) => {
        callback({
            requestHeaders: {
                Origin: '*',
                ...details.requestHeaders,
            },
        });
    });

    ses.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                'Access-Control-Allow-Origin': ['*'],
                ...details.responseHeaders,
            },
        });
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173/');
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../../index.html'));
    }
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen);

    ipcMain.handle('fetch:revenue', async () => {
        try {
            const response = await fetch(
                'https://script.googleusercontent.com/echo?user_content_key=AehSKLgN7KVAM7CPYDuag06AHLtMhYP0p5dC5pMjHXa-p3HSsc-b-bmdAD8Ltc5GvsIy07zdefdPr-_Jgv6rRicSQ6-0PDh0OpSmGkeg76sDNZe6EUSAc-GsZH1Z9DmsO22laN2cnG5Oe2Y3791C-P_JEMhVMeZHD3DXuEgS3adxvoLytKao-hnXr9_X_f7pd0m3pUEh9b6pbWq3YvYoewnTW_kFjmOcBtzOk4t396AGjqnsT5a3ZkpoHQ50XuDtPOcWV5gT9vSFZ2lUE2n1EgupsvEDWVjLZyp77GzkzWzB8p9Gzf2VlPk&lib=Mvas8aIJVy6q6bfztCZqnZSJNsr4x2yAK'
            );
            const data = await response.json();
            console.log('Fetched Data:', data);
            return data;
        } catch (error) {
            console.error('Failed to fetch revenue:', error);
            return { error: 'Failed to fetch' };
        }
    });

    ipcMain.handle('fetch:employees', async () => {
        try {
            // Replace with your API key and URL
            const response = await fetch(
                'https://script.googleusercontent.com/echo?user_content_key=AehSKLiZqjpg1r8nnZCHIp9LX8osYcsilz3Nih0GeHGDI3Nkx_Q9HLVKmOtyNXXcDnEjmOW6ptsRH2oMVpSz5l7AOhYv91l_LrCfvta9MN_JsQMrGYXURjRefQGTNT7M8LE7NMdDoDZ64iln5rmyAiPWRQ98e6yOcyHp-Y4oQY0IdYlefY1thfHv5Ikm7zQYwYoJl6uJEhy8-gZf3S2IyPFGpA3aYVEuLeN2_KubCNnHuIOUAlwJtxy99zR_vRCJeewLFh1rCXsXxAfvRR7yz7wZElBK513GiTrpTC0VDQ-39EbYeKjdDOk&lib=M9OpfRqnK_XpO1nhJZ1oxCiJNsr4x2yAK'
            );
            const data = await response.json();
            console.log('Fetched Data:', data);
            return data; // Return fetched data
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            return { error: 'Failed to fetch employee data' };
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('save-file', async (_event, content, defaultName) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save CSV Report',
      defaultPath: defaultName,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    })
  
    if (canceled || !filePath) return null
  
    fs.writeFileSync(filePath, content)
    return filePath
  })