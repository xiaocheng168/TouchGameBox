<template>
    <div class="button-group">
        <n-button :type="isLogin ? 'error' : 'success'" @click="login" :loading="loading">
            <span v-if="isLogin">已登录 (重新授权)</span>
            <span v-else>登录米游社</span>
        </n-button>
        <n-button type="success">签到</n-button>
        <n-button type="success">312</n-button>
        <n-button type="success">312</n-button>
        <n-button type="success">312</n-button>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import '../../global'
import { useDialog } from 'naive-ui';
import { requestHttp } from '@renderer/utils/plugin';
import { getKeyConfig } from '@renderer/utils/config';
import { configStore } from '@renderer/store/config';
const loading = ref(false)
const isLogin = ref(false)
const title = '原神工具盒子'
const dialog = useDialog()
const cs = configStore()
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

onMounted(() => checkLogin())

requestHttp('https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie', 'GET', {}, {
    'Cookie': cs.$state.config.mihoyo
}, (e) => {
    console.log(e);
})

function checkLogin() {
    getKeyConfig('mihoyo', (value) => isLogin.value = !!value)
}


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