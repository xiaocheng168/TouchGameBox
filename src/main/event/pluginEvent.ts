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
                let url = new URL(args.url)
                let domain = url.origin
                // 清除 Cookes
                nw.webContents.session.cookies.get({ url: domain }).then((e) => {
                    e.forEach((cookie) => {
                        let url = ''
                        url += cookie.secure ? 'https://' : 'http://'
                        url += cookie.domain?.charAt(0) === '.' ? 'www' : ''
                        url += cookie.domain
                        url += cookie.path
                        nw.webContents.session.cookies.remove(url, cookie.name)
                    })
                })
                // 清除一些缓存
                nw.webContents.session.clearStorageData({ origin: 'domain' })
                nw.show()
                /**
                 * 调整窗口监听
                 */
                let av = setInterval(() => {
                    if (nw.isDestroyed()) {
                        clearInterval(av)
                        e.reply('pluginEvent', false)
                        return
                    }
                    let cookiesps = nw.webContents.session.cookies.get({ url: domain })
                    cookiesps.then((cookies) => {
                        let cookiePack = ''
                        for (const cookie of cookies) {
                            cookiePack += `${cookie.name}=${cookie.value};`
                        }
                        if (cookiePack.includes(';account_id=') || cookiePack.includes(';user_token=')) {
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