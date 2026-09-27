const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('swingoAPI', {
  sendPreviewUpdate: (config) => {
    ipcRenderer.send(
      'settings:preview-update',
      config
    );
  },

  getAutostart: () => {
    return ipcRenderer.invoke(
      'app:get-autostart'
    );
  },

  setAutostart: (enable) => {
    return ipcRenderer.invoke(
      'app:set-autostart',
      enable
    );
  },

  getMonitors: () => {
    return ipcRenderer.invoke(
      'app:get-monitors'
    );
  },

  setMonitor: (displayId) => {
    return ipcRenderer.invoke(
      'app:set-monitor',
      displayId
    );
  },

  setPauseOnFullscreen: (enabled) => {
    ipcRenderer.send(
      'app:set-pause-fullscreen',
      enabled
    );
  },

  setCharmVisibility: (enabled) => {
    ipcRenderer.send(
      'dangle:set-visibility',
      enabled
    );
  },

  closeSettings: () => {
    ipcRenderer.send(
      'window:close-settings'
    );
  },

  minimizeSettings: () => {
    ipcRenderer.send(
      'window:minimize-settings'
    );
  }
});