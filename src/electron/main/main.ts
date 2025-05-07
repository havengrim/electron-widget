import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import fetch from 'node-fetch'; // npm install node-fetch

const isDev = process.env.npm_lifecycle_event === 'app:dev';

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
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../../index.html'));
    }
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen);

    ipcMain.handle('fetch:revenue', async () => {
        try {
            const response = await fetch(
                'https://script.googleusercontent.com/echo?user_content_key=AehSKLj2-a0eDFemz26g7iwCSZrGNaWAhqDrlmZzQphL8vQiBnNB0GpCVeTrRvJG8s6KOpo_6uwU2_YUVor9_dIFsurbuzdT16pCZ6H_oZQOJwcPEj4wP7_FG0jD7-I8a9CgOmMTZmqwhljN3Qr2Hd9kKYhHLZ4o-_xNdhgBODV8yRFrtWbusFo7nJ0bhmvBMoTXhA8vrx1kMh_2AtYl2KUBesl36oTyPOvJ2T5g7rbjgeaf8Z6Jo8S0Bh6UosjA7LUAOTu_x_rV8W7Ii6RIYzQHQbeDvFCKhkLKlLnW8GwTieNkkYZtuLg&lib=Mvas8aIJVy6q6bfztCZqnZSJNsr4x2yAK'
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch revenue:', error);
            return { error: 'Failed to fetch' };
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
