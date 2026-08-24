const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 620,
    resizable: false,
    frame: false,
    show: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

// Убиваем процессы winws при закрытии GUI
function killWinws() {
  exec('taskkill /IM winws.exe /F /T', (err) => {
    if (err) console.log('winws.exe не запущен или уже остановлен.');
  });
}

app.whenReady().then(() => {
  createWindow();
  
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Открыть Zapret GUI', click: () => mainWindow.show() },
    { type: 'separator' },
    { 
      label: 'Выйти', 
      click: () => {
        killWinws();
        app.quit();
      } 
    }
  ]);
  tray.setToolTip('Zapret GUI Launcher');
  tray.setContextMenu(contextMenu);
});

// Завершаем winws.exe при окончательном выходе из программы
app.on('before-quit', () => {
  killWinws();
});

ipcMain.on('window-min', () => mainWindow.minimize());
ipcMain.on('window-hide', () => mainWindow.hide());

ipcMain.on('run-cmd', (event, cmd) => {
  exec(cmd, (err) => {
    if (err) console.error(err);
  });
});

ipcMain.on('stop-winws', () => {
  killWinws();
});

ipcMain.on('open-link', (event, url) => {
  shell.openExternal(url);
});

// Сохранение нового пресета (.txt)
ipcMain.on('save-preset', (event, { filename, content }) => {
  const dirPath = path.join(__dirname, 'zapret-core', 'lists');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, `${filename}.txt`);
  fs.writeFileSync(filePath, content, 'utf-8');
});

// Дозапись адресов в конец файла list-general.txt
ipcMain.on('append-hosts', (event, hosts) => {
  const filePath = path.join(__dirname, 'zapret-core', 'lists', 'list-general.txt');
  const formattedData = '\n' + hosts.trim();
  fs.appendFile(filePath, formattedData, 'utf-8', (err) => {
    if (err) console.error('Ошибка записи:', err);
  });
});