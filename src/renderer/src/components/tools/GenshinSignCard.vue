<template>
    <div class="button-group">
        <n-button type="success" @click="login">登录</n-button>
    </div>
</template>
<script lang="ts" setup>
import '../../global'
function login() {
    window.electron.ipcRenderer.send('pluginEvent', {
        type: 'openWindow',
        url: 'https://www.miyoushe.com/ys/',
    })
}

window.electron.ipcRenderer.on('pluginEvent', (e, args) => {
    window.electron.ipcRenderer.send('setKeyConfig', {
        key: 'mihoyo',
        value: args.cookies
    })
    console.log(args.cookies);
})
</script>
<style lang="scss" scope>
.button-group {
    display: flex;
    gap: 10px;
}
</style>