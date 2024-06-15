<template>
    <div style="display: flex; gap: 10px;">
        <n-button type="success" :loading="logining" :disabled="logining" @click="openLogin"
            v-if="!isLogin">登录</n-button>
        <n-button type="error" :loading="logining" :disabled="logining" @click="openLogin" v-else>已登录(重新授权)</n-button>
        <n-button type="success" @click="getRoleDefault" :disabled="!logining">签到</n-button>
    </div>
</template>
<script setup lang="ts">
import { getKeyConfig, setKeyConfig } from '@renderer/utils/config';
import { requestHttp } from '@renderer/utils/plugin';
import { onMounted, ref } from 'vue';
const title = ref('库洛的小箱子')
const logining = ref(false)
const isLogin = ref(false)
const token = ref('')

onMounted(() => checkLogin())

const checkLogin = () => {
    getKeyConfig('kuro', (data) => {
        isLogin.value = data
        token.value = data
        console.log('load ' + data);
    })
}


const openLogin = () => {
    logining.value = true
    window.electron.ipcRenderer.on('pluginEvent', (_e, args) => {
        window.electron.ipcRenderer.removeAllListeners('pluginEvent')
        logining.value = false
        if (!args) {
            window.message.error('取消登录')
            return
        }
        setKeyConfig('kuro', args.cookies)
    })
    window.electron.ipcRenderer.send('pluginEvent', { type: 'openWindow', url: 'https://www.kurobbs.com/mc/home/9' })
}
/**
 * 获取所有角色信息
 */
const getRoleDefault = async () => {
    requestHttp('https://api.kurobbs.com/gamer/role/default', 'POST', {
        'gameId': 0
    }, {
        'Token': token.value,
        'Source': 'h5',
        'Content-Type': 'application/x-www-form-urlencoded'
    }).then((e) => {
        console.log(e);
    })
}
defineExpose({ title })
</script>