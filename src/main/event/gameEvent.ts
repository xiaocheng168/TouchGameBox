import { ChildProcess, exec, spawn } from "child_process";
import { app, ipcMain } from "electron";
import path from "path";


const fs = require('fs')

let configFile = path.join(app.getPath('userData'), '/config.json')


export default function gameEvent() {
    // 读取配置文件
    ipcMain.on('getConfig', (e) => e.reply('getConfig', readConfig()))
    // 写配置文件
    ipcMain.on('setConfig', (e, args) => {
        Object.keys(args).forEach(game => {
            switch (game) {
                case 'genshin': {
                    const path: string = args[game].path.replace('\\Genshin Impact Game\\YuanShen.exe', '')
                    //随机壁纸
                    const bg: string[] = fs.readdirSync(path + "\\bg\\");
                    args[game].image = path + '\\bg\\' + bg[Math.max((Math.random() * bg.length) - 1, bg.length - 1)]
                    args[game].imageBase64 = 'data:image/png;base64,' + Buffer.from(fs.readFileSync(args[game].image), 'binary').toString('base64')
                    break;
                }
                case 'starrail': {
                    const path: string = args[game].path.replace('\\Game\\StarRail.exe', '')
                    //随机壁纸
                    const bg: string[] = fs.readdirSync(path + "\\bg\\");
                    args[game].image = path + '\\bg\\' + bg[Math.max((Math.random() * bg.length) - 1, bg.length - 1)]
                    args[game].imageBase64 = 'data:image/png;base64,' + Buffer.from(fs.readFileSync(args[game].image), 'binary').toString('base64')
                    break;
                }
                case 'wuther': {
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

    var genshin: ChildProcess;
    var starrail: ChildProcess;
    var wuther: ChildProcess;

    ipcMain.on('startGame', (e, args) => {
        switch (args) {
            case 'genshin': {
                genshin = spawn(`${readConfig().genshin?.path.replace(/\\/g, '/')}`)
                setTimeout(() => e.reply('startGame', true), 3000);
            }
            case 'starrail': {
                starrail = spawn(`${readConfig().starrail?.path.replace(/\\/g, '/')}`)
                setTimeout(() => e.reply('startGame', true), 3000);
            }
            case 'wuther': {
                wuther = spawn(`${readConfig().wuther?.path.replace(/\\/g, '/')}`)
                setTimeout(() => e.reply('startGame', true), 3000);
            }
        }
    })
    ipcMain.on('stopGame', (e, args) => {
        switch (args) {
            case 'genshin': {
                e.reply('stopGame', genshin.kill('SIGTERM'))
            }
            case 'starrail': {
                e.reply('stopGame', starrail.kill('SIGTERM'))
            }
            case 'wuther': {
                // 这里有问题。奇怪的两个东西
                e.reply('stopGame', wuther.kill('SIGTERM'))
            }
        }
    })


    ipcMain.on('setKeyConfig', (e, args) => {
        const config = readConfig()
        config[args.key] = args.value
        writeConfig(config)
    })
}

/**
 * 写配置文件
 */
function writeConfig(config) {
    fs.writeFileSync(configFile, JSON.stringify(config))
}

/**
 * 读入配置文件
 */
function readConfig() {
    // 判断文件是否存在
    if (!fs.existsSync(configFile)) {
        fs.writeFileSync(configFile, JSON.stringify(
            {
                'game': []
            }
        ))
    }
    // 读取文件内容
    let config = fs.readFileSync(configFile, 'utf-8')
    return JSON.parse(config == '' ? '{}' : config)
}