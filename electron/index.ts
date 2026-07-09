import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size: number;
  mtime: number;
}
ipcMain.handle("fs/readDirectory", async (_, dirPath: string): Promise<FileItem[]> => {
  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const result: FileItem[] = [];
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      const stat = await fs.promises.stat(itemPath);
      result.push({
        name: item.name,
        path: itemPath,
        type: item.isDirectory() ? "directory" : "file",
        size: stat.size,
        mtime: stat.mtime.getTime(),
      });
    }
    return result;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
});
ipcMain.handle("fs/getRootDirectories", async (): Promise<FileItem[]> => {
  try {
    const platform = process.platform;
    const roots: FileItem[] = [];
    if (platform === "win32") {
      const drives = await fs.promises.readdir("C:\\");
      for (const drive of drives) {
        if (/^[A-Za-z]:$/.test(drive)) {
          const drivePath = `${drive}\\`;
          try {
            const stat = await fs.promises.stat(drivePath);
            roots.push({
              name: drivePath,
              path: drivePath,
              type: "directory",
              size: stat.size,
              mtime: stat.mtime.getTime(),
            });
          } catch {
            roots.push({
              name: drivePath,
              path: drivePath,
              type: "directory",
              size: 0,
              mtime: Date.now(),
            });
          }
        }
      }
    } else {
      const homeDir = os.homedir();
      const stat = await fs.promises.stat(homeDir);
      roots.push({
        name: path.basename(homeDir),
        path: homeDir,
        type: "directory",
        size: stat.size,
        mtime: stat.mtime.getTime(),
      });
    }
    return roots;
  } catch (error) {
    console.error("Error getting root directories:", error);
    return [];
  }
});
ipcMain.handle("fs/getDesktopPath", async (): Promise<string> => {
  return app.getPath("desktop");
});
ipcMain.handle("fs/getHomePath", async (): Promise<string> => {
  return os.homedir();
});
ipcMain.handle("fs/getPlatform", async (): Promise<string> => {
  return process.platform;
});
ipcMain.handle("fs/openFile", async (_, filePath: string): Promise<string> => {
  try {
    const result = await shell.openPath(filePath);
    return result;
  } catch (error) {
    console.error("Error opening file:", error);
    return "";
  }
});
const createMainWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
};
app.whenReady().then(createMainWindow);
