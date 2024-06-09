
import { ipcMain } from 'electron'
import { BrowserWindow } from 'electron/main'
export function pluginEvent() {
    ipcMain.on('pluginEvent', (e, args) => {
        switch (args.type) {
            case 'openWindow': {
                const nw = new BrowserWindow({
                    width: 800,
                    height: 600,
                    webPreferences: {
                        nodeIntegration: true,
                    },
                })
                nw.setMenu(null)
                nw.loadURL(args.url)
                nw.show()
                let av = setInterval(() => {
                    if (nw.isDestroyed()) {
                        clearInterval(av)
                        return
                    }
                    let cookiesps = nw.webContents.session.cookies.get({})
                    cookiesps.then((cookies) => {
                        let cookiePack = ''
                        for (const cookie of cookies) {
                            cookiePack += `${cookie.name}=${cookie.value}&`
                        }
                        if (cookiePack.includes('&account_id=')) {
                            e.reply('pluginEvent', {
                                type: 'cookies',
                                cookies: cookiePack,
                                url: args.url,
                            })
                            nw.close()
                        }
                    })
                }, 1000)
            }
        }
    })
}