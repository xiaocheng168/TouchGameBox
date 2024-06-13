export function getKeyConfig(key: string, data = (_value: any) => { }) {
    window.electron.ipcRenderer.on('getKeyConfig', (_e, args) => {
        window.electron.ipcRenderer.removeAllListeners('getKeyConfig')
        data(args)
    })
    window.electron.ipcRenderer.send('getKeyConfig', key)
}


import '../global'
import { configStore } from '@renderer/store/config';
import router from '@renderer/route/route';

export function reloadConfig(): Promise<void> {
    return new Promise((r) => {
        const cs = configStore()
        window.electron.ipcRenderer.on('getConfig', (_e, config) => {
            cs.$state.config = config
            router.push(cs.$state.config.default || 'genshin')
            window.electron.ipcRenderer.removeAllListeners('getConfig')
            r()
        })
        window.electron.ipcRenderer.send('getConfig')
    })
}