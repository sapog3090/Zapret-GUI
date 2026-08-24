const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('zapretAPI', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),
  moveWindow: (pos) => ipcRenderer.send('move-window', pos),
  runScript: (scriptName) => ipcRenderer.invoke('run-script', scriptName),
  onTrayToggle: (callback) => ipcRenderer.on('toggle-from-tray', () => callback())
});