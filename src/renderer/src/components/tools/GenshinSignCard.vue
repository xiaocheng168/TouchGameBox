<template>
    <div class="button-group">
        <n-button :type="isLogin ? 'error' : 'success'" @click="login" :loading="loading">
            <span v-if="isLogin">已登录 (重新登录)</span>
            <span v-else>登录米游社</span>
        </n-button>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import '../../global'
const loading = ref(false)
const isLogin = ref(false)
const title = '原神工具盒子'
function login() {
    loading.value = true
    window.electron.ipcRenderer.send('pluginEvent', {
        type: 'openWindow',
        url: 'https://user.miyoushe.com/login-platform/index.html?app_id=bll8iq97cem8&theme=&token_type=4&game_biz=bbs_cn&message_origin=https%253A%252F%252Fwww.miyoushe.com&succ_back_type=message%253Alogin-platform%253Alogin-success&fail_back_type=message%253Alogin-platform%253Alogin-fail&ux_mode=popup&iframe_level=1#/login',
    })

    window.electron.ipcRenderer.on('pluginEvent', (e, args) => {
        window.electron.ipcRenderer.removeAllListeners('pluginEvent')
        if (args.cookies) {
            window.electron.ipcRenderer.send('setKeyConfig', {
                key: 'mihoyo',
                value: args.cookies
            })
            window.message.success('登录完成 - 米游社')
        } else {
            window.message.error('请重新登录...')
        }
        loading.value = false
    })
}


function getKeyConfig(key, data = (value) => { }) {
    window.electron.ipcRenderer.on('getKeyConfig', (_e, args) => {
        window.electron.ipcRenderer.removeAllListeners('getKeyConfig')
        data(args)
    })
    window.electron.ipcRenderer.send('getKeyConfig', key)
}


getKeyConfig('mihoyo', (value) => {
    if (value) {
        isLogin.value = true
    }
})


defineExpose({
    title
})
</script>
<style lang="scss" scope>
.button-group {
    display: flex;
    gap: 10px;
}
</style>