import { ipcMain, app, BrowserWindow } from 'electron'

export function addEvent(win: BrowserWindow) {
    ipcMain.addListener('ctrl-menu-exit', () => app.exit(0))
    ipcMain.addListener('ctrl-menu-hide', () => win.minimize())
}