import { configStore } from "@renderer/store/config";
import { toRaw } from "vue";
import { reloadConfig } from "./config";

export function startGame(gameName: 'genshin' | 'starrail' | 'wuther') {
    window.loadBar.start();
    const cs = configStore()
    cs.$state.config[gameName].loading = true
    window.electron.ipcRenderer.on('startGame', (_e, args) => {
        // 如果启动是错误的 false!
        if (!args) {
            window.message.error('启动失败', {
                duration: 5000,
            })
            window.loadBar.error();
        } else {
            window.message.success('启动成功', {
                duration: 5000,
            })
            window.loadBar.finish();
            cs.$state.config[gameName].starting = true
        }
        cs.$state.config[gameName].loading = false
        window.electron.ipcRenderer.removeAllListeners('startGame')
    })
    window.electron.ipcRenderer.send('startGame', gameName)
}

export function stopGame(gameName: 'genshin' | 'starrail' | 'wuther') {
    const cs = configStore()
    window.loadBar.start();
    cs.$state.config[gameName].loading = true
    window.electron.ipcRenderer.on('stopGame', (_e, _args) => {
        window.loadBar.finish()
        cs.$state.config[gameName].loading = cs.$state.config[gameName].starting = false
        window.message.warning('游戏已关闭')
        window.electron.ipcRenderer.removeAllListeners('stopGame')
    })
    window.electron.ipcRenderer.send('stopGame', gameName)
}

export function selectGame(gameName: 'genshin' | 'starrail' | 'wuther') {
    const cs = configStore()
    const gameFile = {
        genshin: ['YuanShen.exe', 'GenshinImpact.exe'],
        starrail: ['StarRail.exe'],
        wuther: ['Wuthering Waves.exe']
    }
    let file = document.createElement('input')
    file.type = 'file'
    file.accept = '.exe'
    console.log(gameName);

    file.addEventListener('change', (_e) => {
        // @ts-ignore
        const game = file?.files[0];
        // @ts-ignore
        console.log(game);
        if (!gameFile[gameName].includes(game.name)) {
            window.message.error('请选择正确的游戏文件' + gameFile[gameName].toString())
        } else {
            cs.$state.config[gameName] = {
                path: game.path,
                fps: 144,
                image: '',
                imageBase64: ''
            }
            // 申请保存配置
            window.electron.ipcRenderer.send('setConfig', toRaw(cs.$state.config))
            reloadConfig()
        }
    })
    file.click()
}