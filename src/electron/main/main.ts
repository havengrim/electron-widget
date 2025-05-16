import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import fetch from 'node-fetch'; // npm install node-fetch
import { installToaster, ToasterOptions } from 'maz-ui'
import { URL } from 'url';
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
            webSecurity: false, 
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

        ipcMain.handle('fetch:employees', async () => {
        try {
            // Replace with your API key and URL
            const response = await fetch(
                'https://script.googleusercontent.com/echo?user_content_key=AehSKLimMKGeE86shzjtY0Ny9DDjHC_odqm1YpY27mmwmR1Eki_d00Iyf3hbdUYKEiEh68161LzAYL1Da5125c1c2w3_Lbmo6ec0FwgBxK9mIQove1ImykR7mDDd6JN7XxnS9XAxyGnot8sqjtqek_B6YQsOqV0eFevcd4VHLgIJ5IW-ZFYrcmqBlDsH9-Uc4Mb2_9DNQQwbWNncXtUzlmIV-pHliMhT4wODXGIK0fRMnmFcu_qLfy6rU5-lmWm2kqAF5LuVgsOppsf1c7mOjzGZa9-PgPG70zOLkhxVCLLw&lib=M9OpfRqnK_XpO1nhJZ1oxCiJNsr4x2yAK'
            );
            const data = await response.json();
            return data; // Return fetched data
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            return { error: 'Failed to fetch employee data' };
        }
    });

    
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


    ipcMain.handle('fetch:unfilled', async () => {
    try {
        const response = await fetch(
        'https://script.googleusercontent.com/echo?user_content_key=AehSKLgUf1iXXFPVYPPH68KWIpwW-O3GP6GxXdiWw6CS4Wztahu3IJ2aJJPV22hDpFiDLCUaFPFQhwN1TRkyaM28J6ik31EnoF7DSw694mK-iqLzfLiYGX7l6TZQAkdJ7bX8P5sU12EhMDxU9Zvi8VyR0EqdBtKA3OdyXl5rWVIEA4nLpXkslipZsGljYHHmV-IzP0YYtHPh4qu1Rx17jYqUgzWWMY_TZIplsVtHOo2As4JwNqK-QWZ0Q7CFDKISqcvotnDjsDAlCS8g8IfZmWXX4j2lzYltKlC9VkeuhgtS&lib=MHgBdPwj5X6NkCv6suuHfaSJNsr4x2yAK'
        );
        const data = await response.json();
        console.log('Fetched unfilled employees:', data);
        return data; // Return the data to renderer
    } catch (error) {
        console.error('Failed to fetch unfilled employees:', error);
        return { error: 'Failed to fetch unfilled data' }; // Return error message to renderer
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



ipcMain.handle('oauth:login', async () => {
    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.set('client_id', '485462016495-9pq20k1g2lc3aghfo1fkqhi00moeeeu0.apps.googleusercontent.com');
    oauthUrl.searchParams.set('response_type', 'token');
    oauthUrl.searchParams.set('redirect_uri', 'http://localhost');
    oauthUrl.searchParams.set('scope', 'openid profile email');
    oauthUrl.searchParams.set('prompt', 'consent');

    return new Promise((resolve, reject) => {
        const authWindow = new BrowserWindow({
            width: 500,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: false,
            },
        });

        authWindow.loadURL(oauthUrl.toString());

        const { webContents } = authWindow;

        // This function is used to extract the access token from the URL
        const handleUrl = (url: string) => {
            try {
                if (url.startsWith('http://localhost')) {
                    // Extract the access token from the URL fragment
                    const parsed = new URL(url);
                    const hash = parsed.hash.substring(1);
                    const params = new URLSearchParams(hash);
                    const accessToken = params.get('access_token');

                    if (accessToken) {
                        resolve({ accessToken });
                        authWindow.close();
                    }
                }
            } catch (err) {
                reject(err);
                authWindow.close();
            }
        };

        // Listen for redirects and navigation events to capture the access token
        webContents.on('will-redirect', (_, url) => handleUrl(url));
        webContents.on('did-navigate', (_, url) => handleUrl(url));

        // Close the window and reject if the user closes the window
        authWindow.on('closed', () => reject(new Error('User closed window')));
    });
});
