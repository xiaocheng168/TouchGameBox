export function requestHttp(url: string, method: 'GET' | 'POST' = 'GET', data = {}, header = {}) {
    return new Promise((acc) => {
        window.electron.ipcRenderer.on('pluginEvent', (_e, args) => {
            window.electron.ipcRenderer.removeAllListeners('pluginEvent')
            acc(args)
        })
        window.electron.ipcRenderer.send('pluginEvent', {
            type: 'request',
            url: url,
            method: method,
            header: header,
            data: data
        })
    })
}