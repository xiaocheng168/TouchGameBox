export function getKeyConfig(key: string, data = (_value: any) => { }) {
    window.electron.ipcRenderer.on('getKeyConfig', (_e, args) => {
        window.electron.ipcRenderer.removeAllListeners('getKeyConfig')
        data(args)
    })
    window.electron.ipcRenderer.send('getKeyConfig', key)
}