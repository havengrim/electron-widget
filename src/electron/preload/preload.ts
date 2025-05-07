import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    fetchRevenue: () => ipcRenderer.invoke('fetch:revenue'),
});
