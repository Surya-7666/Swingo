import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  Tray,
  Menu,
  nativeImage
} from 'electron';

import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// ------------------------------------------------------------
// Chromium Engine Performance & Occlusion Protection
// ------------------------------------------------------------
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

// Clearance reserved at screen bottom so Windows auto-hide taskbars trigger properly
const TASKBAR_MARGIN = 60;

let settingsWindow = null;
let dangleWindow = null;
let tray = null;
let isQuitting = false;

let pauseOnFullscreenEnabled = true;
let isSuppressed = false;
let checkTimer = null;
let isCheckingFullscreen = false;
let isCharmVisible = true;

// Icon resolver helper
function getAppIconPath() {
  return isDev
    ? path.join(__dirname, '../src/assets/swingo-logo.png')
    : path.join(app.getAppPath(), 'dist/assets/swingo-logo.png');
}

// ------------------------------------------------------------
// Single Instance Lock
// ------------------------------------------------------------

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (settingsWindow) {
      if (settingsWindow.isMinimized()) settingsWindow.restore();
      settingsWindow.show();
      settingsWindow.focus();
    } else {
      createSettingsWindow();
    }
  });

  app.whenReady().then(() => {
    setupIPC();
    createSettingsWindow();
    createDangleWindow();
    createSystemTray();
    startFullscreenWatcher();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createSettingsWindow();
        createDangleWindow();
      }
    });
  });
}

// ------------------------------------------------------------
// Settings Window
// ------------------------------------------------------------

function createSettingsWindow() {
  if (settingsWindow) {
    if (settingsWindow.isMinimized()) settingsWindow.restore();
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 1040,
    height: 700,
    minWidth: 840,
    minHeight: 580,
    frame: true,
    autoHideMenuBar: true,
    backgroundColor: '#07090e',
    icon: getAppIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    settingsWindow.loadURL(`${VITE_DEV_SERVER_URL}/index.html`);
  } else {
    settingsWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
  }

  settingsWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      settingsWindow.hide();
    }
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// ------------------------------------------------------------
// Charm Presentation State
// ------------------------------------------------------------

function syncCharmState() {
  if (!dangleWindow || dangleWindow.isDestroyed()) return;

  const shouldBeVisible = isCharmVisible && !isSuppressed;

  if (dangleWindow.webContents) {
    dangleWindow.webContents.send('dangle:visibility-change', shouldBeVisible);
  }

  if (shouldBeVisible) {
    dangleWindow.setAlwaysOnTop(true, 'floating');
    dangleWindow.setIgnoreMouseEvents(true, { forward: true });
  } else {
    dangleWindow.setIgnoreMouseEvents(true, { forward: false });
  }
}

function createDangleWindow() {
  if (dangleWindow) return;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  dangleWindow = new BrowserWindow({
    x,
    y,
    width,
    height: Math.max(300, height - TASKBAR_MARGIN),
    transparent: true,
    frame: false,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'dangle-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  dangleWindow.setAlwaysOnTop(true, 'floating');
  dangleWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });

  dangleWindow.on('focus', () => {
    if (dangleWindow && !dangleWindow.isDestroyed()) {
      dangleWindow.blur();
    }
  });

  if (isDev) {
    dangleWindow.loadURL(`${VITE_DEV_SERVER_URL}/dangle.html`);
  } else {
    dangleWindow.loadFile(path.join(app.getAppPath(), 'dist/dangle.html'));
  }

  dangleWindow.webContents.on('did-finish-load', () => {
    if (!dangleWindow || dangleWindow.isDestroyed()) return;

    dangleWindow.setBounds({
      x,
      y,
      width,
      height: Math.max(300, height - TASKBAR_MARGIN)
    });
    dangleWindow.setAlwaysOnTop(true, 'floating');

    dangleWindow.showInactive();
    dangleWindow.blur();

    syncCharmState();
  });

  dangleWindow.on('closed', () => {
    dangleWindow = null;
  });
}

// ------------------------------------------------------------
// System Tray
// ------------------------------------------------------------

function createSystemTray() {
  if (tray) return;

  const trayIcon = nativeImage
    .createFromPath(getAppIconPath())
    .resize({ width: 16, height: 16 });

  tray = new Tray(trayIcon);
  tray.setToolTip('Swingo - Desktop Companion');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Settings',
      click: () => {
        if (settingsWindow) {
          settingsWindow.show();
          settingsWindow.focus();
        } else {
          createSettingsWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit Swingo',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (settingsWindow) {
      settingsWindow.show();
      settingsWindow.focus();
    } else {
      createSettingsWindow();
    }
  });
}

// ------------------------------------------------------------
// Windows Actions
// ------------------------------------------------------------

function executeWindowsAction(actionId) {
  switch (actionId) {
    case 'win-l':
      exec('rundll32.exe user32.dll,LockWorkStation');
      break;

    case 'win-d':
      exec('powershell.exe -NoProfile -NonInteractive -Command "(New-Object -ComObject Shell.Application).ToggleDesktop()"');
      break;

    case 'win-shift-s':
      exec('start ms-screenclip:', { shell: 'cmd.exe' });
      break;

    case 'mute':
      exec('powershell.exe -NoProfile -NonInteractive -Command "$w=New-Object -ComObject WScript.Shell;$w.SendKeys([char]173)"');
      break;

    default:
      console.warn('[Swingo] Unknown action:', actionId);
      break;
  }
}

// ------------------------------------------------------------
// Fullscreen Poller
// ------------------------------------------------------------

const CHECK_SCRIPT = `
$w = Add-Type -memberDefinition @'
[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
[DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
[DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
[StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
'@ -Name 'Win32' -Namespace 'User32' -PassThru;
$h = $w::GetForegroundWindow();
$r = New-Object User32.Win32+RECT;
$null = $w::GetWindowRect($h, [ref]$r);
$title = New-Object System.Text.StringBuilder 256;
$null = $w::GetWindowText($h, $title, 256);
$width = $r.Right - $r.Left;
$height = $r.Bottom - $r.Top;
Write-Output "$width,$height,$($title.ToString())";
`.replace(/\r?\n/g, ' ');

function pollFullscreen() {
  if (!pauseOnFullscreenEnabled || isCheckingFullscreen || !dangleWindow || dangleWindow.isDestroyed()) {
    return;
  }

  isCheckingFullscreen = true;

  exec(`powershell -NoProfile -NonInteractive -Command "${CHECK_SCRIPT}"`, { timeout: 700 }, (err, stdout) => {
    try {
      if (err || !stdout) return;

      const parts = stdout.trim().split(',');
      if (parts.length < 2) return;

      const fw = parseInt(parts[0], 10);
      const fh = parseInt(parts[1], 10);
      const title = parts.slice(2).join(',').toLowerCase();

      if (title.includes('swingo')) return;

      const primary = screen.getPrimaryDisplay();
      const scale = primary.scaleFactor || 1;
      const isFullscreenApp = fw >= primary.bounds.width * scale && fh >= primary.bounds.height * scale;

      if (isFullscreenApp && !isSuppressed) {
        isSuppressed = true;
        syncCharmState();
      } else if (!isFullscreenApp && isSuppressed) {
        isSuppressed = false;
        syncCharmState();
      }
    } finally {
      isCheckingFullscreen = false;
    }
  });
}

function startFullscreenWatcher() {
  if (checkTimer) clearInterval(checkTimer);
  checkTimer = setInterval(pollFullscreen, 1000);
}

// ------------------------------------------------------------
// IPC Setup
// ------------------------------------------------------------

function setupIPC() {
  ipcMain.on('dangle:set-ignore-mouse', (_event, ignore) => {
    if (dangleWindow && !dangleWindow.isDestroyed() && isCharmVisible && !isSuppressed) {
      dangleWindow.setIgnoreMouseEvents(Boolean(ignore), { forward: true });
    }
  });

  ipcMain.on('settings:preview-update', (_event, config) => {
    if (dangleWindow && !dangleWindow.isDestroyed()) {
      dangleWindow.webContents.send('dangle:apply-settings', config);
      syncCharmState();
    }
  });

  ipcMain.on('dangle:trigger-action', (_event, actionId) => {
    executeWindowsAction(actionId);
  });

  ipcMain.on('dangle:pause-charm', () => {
    isCharmVisible = false;
    syncCharmState();
  });

  ipcMain.on('dangle:show-charm', () => {
    isCharmVisible = true;
    syncCharmState();
  });

  ipcMain.on('dangle:set-visibility', (_event, visible) => {
    isCharmVisible = Boolean(visible);
    syncCharmState();
  });

  ipcMain.on('app:set-pause-fullscreen', (_event, enabled) => {
    pauseOnFullscreenEnabled = Boolean(enabled);
    if (!pauseOnFullscreenEnabled) {
      isSuppressed = false;
    }
    syncCharmState();
  });

  ipcMain.handle('app:get-autostart', () => app.getLoginItemSettings().openAtLogin);

  ipcMain.handle('app:set-autostart', (_event, enable) => {
    app.setLoginItemSettings({
      openAtLogin: Boolean(enable),
      path: app.getPath('exe')
    });
    return app.getLoginItemSettings().openAtLogin;
  });

  ipcMain.handle('app:get-monitors', () => {
    const displays = screen.getAllDisplays();
    const primaryId = screen.getPrimaryDisplay().id;

    return displays.map((display, index) => ({
      id: display.id,
      name: `Display ${index + 1} (${display.bounds.width}x${display.bounds.height})`,
      isPrimary: display.id === primaryId,
      bounds: display.bounds
    }));
  });

  ipcMain.handle('app:set-monitor', (_event, displayId) => {
    const displays = screen.getAllDisplays();
    const target = displays.find(d => d.id === displayId) || screen.getPrimaryDisplay();

    if (dangleWindow && !dangleWindow.isDestroyed()) {
      dangleWindow.setBounds({
        x: target.bounds.x,
        y: target.bounds.y,
        width: target.bounds.width,
        height: Math.max(300, target.bounds.height - TASKBAR_MARGIN)
      });
      dangleWindow.setAlwaysOnTop(true, 'floating');
      syncCharmState();
    }
    return true;
  });
}

app.on('before-quit', () => {
  isQuitting = true;
  if (checkTimer) {
    clearInterval(checkTimer);
    checkTimer = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});