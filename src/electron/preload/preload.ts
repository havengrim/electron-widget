const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    fetchRevenue: () => ipcRenderer.invoke('fetch:revenue'),
    fetchEmployees: () => ipcRenderer.invoke('fetch:employees'),
    fetchUnfilled: () => ipcRenderer.invoke('fetch:unfilled'),
    saveFile: (content:any, defaultName:any) =>
        ipcRenderer.invoke('save-file', content, defaultName),
});
