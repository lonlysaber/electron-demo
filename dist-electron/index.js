import { BrowserWindow as e, app as t } from "electron";
import n from "path";
import { fileURLToPath as r } from "url";
//#region electron/index.ts
var i = n.dirname(r(import.meta.url));
t.whenReady().then(() => {
	let r = new e({
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: !1,
			nodeIntegration: !0
		}
	});
	t.isPackaged ? r.loadFile(n.join(i, "../dist/index.html")) : r.loadURL("http://localhost:5173");
});
//#endregion
export {};
