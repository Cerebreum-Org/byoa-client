const { contextBridge } = require('electron');

// Expose safe APIs to renderer if needed
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
