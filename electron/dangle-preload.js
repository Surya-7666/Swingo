const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dangleBridge', {
  setIgnoreMouseEvents: (ignore) => {
    ipcRenderer.send('dangle:set-ignore-mouse', ignore);
  },

  triggerAction: (actionId) => {
    ipcRenderer.send('dangle:trigger-action', actionId);
  },

  pauseCharm: () => {
    ipcRenderer.send('dangle:pause-charm');
  },

  showCharm: () => {
    ipcRenderer.send('dangle:show-charm');
  },

  onVisibilityChange: (callback) => {
    ipcRenderer.on('dangle:visibility-change', (_event, isVisible) => {
      if (typeof callback === 'function') callback(isVisible);
    });
  },

  onSettingsUpdate: (callback) => {
    ipcRenderer.on('dangle:apply-settings', (_event, config) => {
      if (typeof callback === 'function') callback(config);
    });
  }
});