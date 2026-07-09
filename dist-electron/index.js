import { BrowserWindow as e, app as t, ipcMain as n, shell as r } from "electron";
import i from "path";
import { fileURLToPath as a } from "url";
import o from "fs";
import s from "os";
//#region electron/index.ts
var c = i.dirname(a(import.meta.url));
n.handle("fs/readDirectory", async (e, t) => {
	try {
		let e = await o.promises.readdir(t, { withFileTypes: !0 }), n = [];
		for (let r of e) {
			let e = i.join(t, r.name), a = await o.promises.stat(e);
			n.push({
				name: r.name,
				path: e,
				type: r.isDirectory() ? "directory" : "file",
				size: a.size,
				mtime: a.mtime.getTime()
			});
		}
		return n;
	} catch (e) {
		return console.error("Error reading directory:", e), [];
	}
}), n.handle("fs/getRootDirectories", async () => {
	try {
		let e = process.platform, t = [];
		if (e === "win32") {
			let e = [];
			for (let t = 65; t <= 90; t++) {
				let n = String.fromCharCode(t) + ":", r = `${n}\\`;
				try {
					await o.promises.access(r), e.push(n);
				} catch {
					continue;
				}
			}
			for (let n of e) {
				let e = `${n}\\`;
				try {
					let n = await o.promises.stat(e);
					t.push({
						name: e,
						path: e,
						type: "directory",
						size: n.size,
						mtime: n.mtime.getTime()
					});
				} catch {
					t.push({
						name: e,
						path: e,
						type: "directory",
						size: 0,
						mtime: Date.now()
					});
				}
			}
		} else if (e === "darwin") {
			let e = s.homedir();
			try {
				let e = await o.promises.stat("/");
				t.push({
					name: "/",
					path: "/",
					type: "directory",
					size: e.size,
					mtime: e.mtime.getTime()
				});
			} catch {
				t.push({
					name: "/",
					path: "/",
					type: "directory",
					size: 0,
					mtime: Date.now()
				});
			}
			try {
				let n = await o.promises.stat(e);
				t.push({
					name: i.basename(e),
					path: e,
					type: "directory",
					size: n.size,
					mtime: n.mtime.getTime()
				});
			} catch {
				t.push({
					name: i.basename(e),
					path: e,
					type: "directory",
					size: 0,
					mtime: Date.now()
				});
			}
		} else {
			let e = s.homedir(), n = await o.promises.stat(e);
			t.push({
				name: i.basename(e),
				path: e,
				type: "directory",
				size: n.size,
				mtime: n.mtime.getTime()
			});
		}
		return t;
	} catch (e) {
		return console.error("Error getting root directories:", e), [];
	}
}), n.handle("fs/getDesktopPath", async () => t.getPath("desktop")), n.handle("fs/getHomePath", async () => s.homedir()), n.handle("fs/getPlatform", async () => process.platform), n.handle("fs/openFile", async (e, t) => {
	try {
		return await r.openPath(t);
	} catch (e) {
		return console.error("Error opening file:", e), "";
	}
}), t.whenReady().then(() => {
	let n = new e({
		width: 1200,
		height: 800,
		webPreferences: {
			contextIsolation: !1,
			nodeIntegration: !0
		}
	});
	t.isPackaged ? n.loadFile(i.join(c, "../dist/index.html")) : n.loadURL("http://localhost:5173");
});
//#endregion
export {};
