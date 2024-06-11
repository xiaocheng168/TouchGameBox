import { exec, spawn } from "child_process";
import { Notification, app, ipcMain } from "electron";
import path from "path";


const fs = require('fs')

let configFile = path.join(app.getPath('userData'), '/config.json')


var gameProcessName = {
    genshin: ['YuanShen.exe', 'GenshinImpact.exe'],
    starrail: ['StarRail.exe'],
    wuther: ['Wuthering Waves.exe', 'Client-Win64-Shipping.exe']
}

export default function gameEvent() {
    // 读取配置文件
    ipcMain.on('getConfig', (e) => e.reply('getConfig', readConfig()))
    // 写配置文件
    ipcMain.on('setConfig', (e, args) => {
        Object.keys(args).forEach(game => {
            switch (game) {
                case 'genshin': {
                    if (!args[game].path) break;
                    const path: string = args[game].path.replace('\\Genshin Impact Game\\YuanShen.exe', '').replace('\\Genshin Impact Game\\GenshinImpact.exe', '')
                    //随机壁纸
                    const bg: string[] = fs.readdirSync(path + "\\bg\\");
                    args[game].image = path + '\\bg\\' + bg[Math.max((Math.random() * bg.length) - 1, bg.length - 1)]
                    args[game].imageBase64 = 'data:image/png;base64,' + Buffer.from(fs.readFileSync(args[game].image), 'binary').toString('base64')
                    break;
                }
                case 'starrail': {
                    if (!args[game].path) break;
                    const path: string = args[game].path.replace('\\Game\\StarRail.exe', '')
                    //随机壁纸
                    const bg: string[] = fs.readdirSync(path + "\\bg\\");
                    args[game].image = path + '\\bg\\' + bg[Math.max((Math.random() * bg.length) - 1, bg.length - 1)]
                    args[game].imageBase64 = 'data:image/png;base64,' + Buffer.from(fs.readFileSync(args[game].image), 'binary').toString('base64')
                    break;
                }
                case 'wuther': {
                    if (!args[game].path) break;
                    const path: string = args[game].path.replace('\\Wuthering Waves Game\\Wuthering Waves.exe', '')
                    //随机壁纸
                    let bg: string[] = fs.readdirSync(path + "\\kr_game_cache\\animate_bg\\");
                    let md5 = '';
                    for (const dir of bg) {
                        if (dir.length === 32) {
                            bg = fs.readdirSync(path + `\\kr_game_cache\\animate_bg\\${dir}\\`);
                            md5 = dir;
                            break
                        }
                    }

                    args[game].image = path + `\\kr_game_cache\\animate_bg\\${md5}\\home_1.jpg`
                    args[game].imageBase64 = 'data:image/png;base64,' + Buffer.from(fs.readFileSync(args[game].image), 'binary').toString('base64')
                    break;
                }
            }
        });
        writeConfig(args)
        e.reply('getConfig', readConfig())
    })

    ipcMain.on('startGame', (e, args) => {
        let gamePath = readConfig()[args]?.path?.replace(/\\/g, '/')
        if (!gamePath) {
            new Notification({
                icon: 'warning',
                title: '错误',
                body: '还没有选择游戏呢',
            }).show()
        }
        let process = spawn(`${gamePath}`)
        process.addListener('error', () => e.reply('startGame', false))
        setTimeout(() => e.reply('startGame', true), 1000);
    })

    ipcMain.on('stopGame', (e, args) => {
        let killGameNames = gameProcessName[args]
        exec('tasklist', (_error, st, _std) => {
            let ns = st.split('\n').filter((e) => {
                for (let kgn of killGameNames) { if (e.includes(kgn)) return true }
                return false
            })
            ns.forEach((line) => {
                let reg = /[0-9]{4,}/g;
                let pid = line.match(reg)
                exec(`taskkill /im ${pid} -f`, (err) => e.reply('stopGame', !err))
            })
        })
    })

    ipcMain.on('setKeyConfig', (_e, args) => {
        const config = readConfig()
        config[args.key] = args.value
        writeConfig(config)
    })

    ipcMain.on('getKeyConfig', (e, args) => {
        const config = readConfig()
        e.reply('getKeyConfig', config[args])
    })
}


export function setKeyConfig(key: string, value: any) {
    const config = readConfig()
    config[key] = value
    writeConfig(config)
}

export function getKeyConfig(key: string, def: any) {
    return readConfig()[key] ?? def
}

/**
 * 写配置文件
 */
export function writeConfig(config) {
    fs.writeFileSync(configFile, JSON.stringify(config))
}

/**
 * 读入配置文件
 */
export function readConfig() {
    // 判断文件是否存在
    if (!fs.existsSync(configFile)) {
        fs.writeFileSync(configFile, JSON.stringify(
            {
                'game': []
            }
        ))
    }
    // 读取文件内容
    let c = fs.readFileSync(configFile, 'utf-8')
    let config = JSON.parse(c == '' ? '{}' : c)
    Object.keys(config ?? {}).forEach((element: any) => {
        if (config[element]?.loading) config[element].loading = false
        if (config[element]?.starting) config[element].starting = false
    });
    return config
}