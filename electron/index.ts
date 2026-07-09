import { app, BrowserWindow } from 'electron';
const createMainWindow = () => {
 const win = new BrowserWindow({
   width: 800,
   height: 600,
   webPreferences: {
     contextIsolation: false,
     nodeIntegration: true,
   },
 });
 win.loadURL('http://localhost:5173'); 
 win.webContents.openDevTools(); 
};
app.whenReady().then(createMainWindow);