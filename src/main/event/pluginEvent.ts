import { IncomingMessage, ipcMain, net } from 'electron'
import { BrowserWindow } from 'electron/main'
export function pluginEvent() {
    ipcMain.on('pluginEvent', (e, args) => {
        switch (args.type) {
            case 'openWindow': {
                const nw = new BrowserWindow({
                    width: 450,
                    height: 550,
                    resizable: false,
                    minimizable: false,
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
                        e.reply('pluginEvent', false)
                        return
                    }
                    let cookiesps = nw.webContents.session.cookies.get({})
                    cookiesps.then((cookies) => {
                        let cookiePack = ''
                        for (const cookie of cookies) {
                            cookiePack += `${cookie.name}=${cookie.value};`
                        }

                        if (cookiePack.includes(';account_id=')) {
                            e.reply('pluginEvent', {
                                type: 'cookies',
                                cookies: cookiePack,
                                url: args.url,
                            })
                            clearInterval(av)
                            nw.close()
                        }
                    })
                }, 1000)
                break;
            }
            case 'request': {
                console.log(args)
                net.request({
                    url: args.url,
                    method: args.method ?? 'GET',
                    headers: args.header
                }).on('response', (r: IncomingMessage) => {
                    r.on('data', (res) => {
                        if (r.headers['content-type'] == 'application/json') {
                            e.reply('pluginEvent', {
                                type: 'response',
                                response: JSON.parse(res.toString())
                            })
                        } else {
                            e.reply('pluginEvent', {
                                type: 'response',
                                response: res
                            })
                        }
                    })
                }).end()
            }
        }
    })


}