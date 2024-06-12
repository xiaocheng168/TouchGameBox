<template>
    <div class="button-group">
        <n-button :type="isLogin ? 'error' : 'success'" @click="login" :loading="loading">
            <span v-if="isLogin">已登录 (重新授权)</span>
            <span v-else>登录米游社</span>
        </n-button>
        <n-button type="success" @click="showAward">签到</n-button>
        <n-drawer v-model:show="awards.show" width="500">
            <n-drawer-content title="签到">
                <n-spin :show="awards.loading">
                    <n-form label-align="left" label-width="auto">
                        <n-form-item label="游戏">
                            <n-select :options="gameOptions" v-model:value="region"
                                @update:value="showAward()"></n-select>
                        </n-form-item>
                        <n-form-item label="账户">
                            <n-select :options="gameAccountOpt" v-model:value="gameAccount" />
                        </n-form-item>
                    </n-form>
                    <div class="main-award-list-box">
                        <div :style="!isTodau(index + 1) ? { opacity: 0.2 } : { opacity: 1 }"
                            v-for="(award, index) in awards.info.awards" class="award-box"
                            @click="signToday(award, index + 1)" :key="index">
                            <img :src="award.icon" crossorigin="anonymous" />
                            <div>
                                <p>{{ award.name }} x {{ award.cnt }}</p>
                            </div>
                            <p class="day">
                            <p v-if="isTodau(index + 1)" style="color: red;text-shadow: 0 0 10px black;">
                                今
                            </p>
                            <p v-else>{{ index + 1 }}</p>
                            </p>
                        </div>
                    </div>
                </n-spin>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>
<script lang="ts" setup>
import { Ref, onMounted, ref } from 'vue';
import '../../global'
import { useDialog } from 'naive-ui';
import { requestHttp } from '@renderer/utils/plugin';
import { getKeyConfig } from '@renderer/utils/config';
import { configStore } from '@renderer/store/config';
import { md5 } from 'js-md5';
const loading = ref(false)
const isLogin = ref(false)
const title = '米游社工具盒'
const dialog = useDialog()
const cs = configStore()
const region = ref('hk4e')
const gameAccountOpt: Ref<any[]> = ref([])
const gameAccount = ref()
interface Award {
    icon: string;
    name: string,
    cnt: number
}
const awards = ref({
    show: false,
    loading: false,
    info: {
        awards: [] as Award[]
    }
})

function isTodau(day: number) {
    return day == new Date().getDate()
}

/**
 * 发起签到
 */
function signToday(award: Award, day: number) {
    if (day != new Date().getDate()) {
        window.message.error(`此奖励不是今天签到获得的!`)
        return;
    }
    awards.value.loading = true
    let signLoading = window.message.loading('正在签到', { duration: 5555555 })
    sign().then((e: any) => {
        let code = e.response.retcode
        if (code === 0) {
            window.message.success(`${award.name} x ${award.cnt}`)
        } else {
            window.message.success(`${e.response.message} (${code})`)
        }
        awards.value.loading = false
        signLoading.destroy()
        awards.value.show = false
    })
}
/**
 * 登录米游社
 */
function login() {
    dialog.success({
        title: '登录米游社 询问?',
        content: '将打开 米游社 官方交流论坛，登录完后会程序自动处理.',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick() {
            loading.value = true
            window.electron.ipcRenderer.send('pluginEvent', {
                type: 'openWindow',
                url: 'https://user.miyoushe.com/login-platform/index.html?app_id=bll8iq97cem8&theme=&token_type=4&game_biz=bbs_cn&message_origin=https%253A%252F%252Fwww.miyoushe.com&succ_back_type=message%253Alogin-platform%253Alogin-success&fail_back_type=message%253Alogin-platform%253Alogin-fail&ux_mode=popup&iframe_level=1#/login',
            })
            window.electron.ipcRenderer.on('pluginEvent', (_e, args) => {
                window.electron.ipcRenderer.removeAllListeners('pluginEvent')
                if (args.cookies) {
                    window.electron.ipcRenderer.send('setKeyConfig', {
                        key: 'mihoyo',
                        value: args.cookies
                    })
                    window.message.success('登录完成 - 米游社')
                    checkLogin()
                } else {
                    window.message.error('取消登录')
                }
                loading.value = false
            })
        },
    })

}
/**
 * 获取签到奖励
 */
function showAward() {
    awards.value.show = true
    awards.value.loading = true
    let loading = window.message.loading('在跑了....', { duration: 9999999 })
    // 获取游戏账户
    getGameAccount().then((e: any) => {
        gameAccountOpt.value = []
        e.response.data.list.forEach((account: any) => {
            gameAccountOpt.value.push({
                label: `Lv.${account.level} ${account.nickname} (${account.game_uid})`,
                value: JSON.stringify(account)
            })
        });
        gameAccount.value = gameAccountOpt.value[0].value
        getSignAwards(region.value).then((e: any) => {
            awards.value.info = e.response.data
            awards.value.loading = false
            loading.destroy()
        })
    })
}

onMounted(() => checkLogin())

/**
 * 检查登录
 */
function checkLogin() {
    getKeyConfig('mihoyo', (value) => isLogin.value = !!value)
}

/**
 * 获取游戏账户
 */
function getGameAccount() {
    return requestHttp(`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=${region.value}_cn`, 'GET', {}, {
        'Cookie': cs.$state.config.mihoyo
    })
}

/**
 * 签到请求发起
 */
function sign() {
    let header = {
        'Cookie': cs.$state.config.mihoyo,
        'DS': getDS(),
        'x-rpc-app_version': '2.71.1',
        'x-rpc-client_type': 5,
        'x-rpc-device_fp': '38d7faf409f7e',
        'x-rpc-device_id': '239942aa-6785-492d-a8fc-24966545f1a2',
        'x-rpc-signgame': region.value
    }
    let ac = JSON.parse(gameAccount.value)
    return requestHttp(`https://api-takumi.mihoyo.com/event/luna/sign?act_id=${gameType[region.value].id}&region=${ac.region}&uid=${ac.game_uid}`, 'POST', {}, header)
}
function getDS() {
    const s = "1OUn34iIy84ypu9cpXyun2VaQ2zuFeLm";
    const t = Math.floor(Date.now() / 1e3);
    const r = Math.random().toString(36).slice(-6);
    const c = `salt=${s}&t=${t}&r=${r}`;
    const ds = `${t},${r},${md5(c)}`;
    return ds;
}

/**
 * 获取特定月份奖励
 */
function getSignAwards(type: 'hk4e' | 'hkrpg' | any) {
    return requestHttp(`https://api-takumi.mihoyo.com/event/luna/home?lang=zh-cn&act_id=${gameType[type].id}`, 'GET', {}, {
        'x-rpc-signgame': type
    })
}

const gameType = {
    'hk4e': {
        id: 'e202311201442471',
        name: '原神'
    },
    'hkrpg': {
        id: 'e202304121516551',
        name: '星穹铁道'
    }
}
// 初始化游戏选项
const gameOptions: Ref<any[]> = ref([])
Object.keys(gameType).forEach((rangeValue) => {
    gameOptions.value.push({
        label: gameType[rangeValue].name,
        value: rangeValue
    })
})


defineExpose({ title })

</script>
<style lang="scss" scope>
.button-group {
    display: flex;
    gap: 10px;
}

.main-award-list-box {
    display: grid;
    height: 100%;
    width: 100%;
    gap: 15px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    padding: 5px;

    .award-box {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        user-select: none;
        margin: 5px;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
        position: relative;

        .day {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 14px
        }

        img {
            width: 100%;
            height: 100%;

        }

        p {
            font-size: 10px;
            font-weight: bold
        }

        &:hover {
            filter: drop-shadow(0 0 0.5rem #4444dd);
        }
    }
}
</style>