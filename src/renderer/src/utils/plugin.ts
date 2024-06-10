export function requestHttp(url: string, method: 'GET' | 'POST' = 'GET', data = {}, callback = (_value: any) => { }) {
    window.electron.ipcRenderer.on('pluginEvent', (_e, args) => {
        window.electron.ipcRenderer.removeAllListeners('pluginEvent')
        callback(args)
    })
    window.electron.ipcRenderer.send('pluginEvent', {
        type: 'request',
        url: url,
        method: method,
        data: data
    })
}