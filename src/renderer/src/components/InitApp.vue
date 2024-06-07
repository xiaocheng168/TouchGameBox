<template></template>
<script lang="ts" setup>
// @ts-ignore
import { configStore } from '@renderer/store/config';
import { useLoadingBar } from 'naive-ui';
import '../global'
// @ts-ignore
import router from '@renderer/route/route';
const cs = configStore()

const loadbar = useLoadingBar()
loadbar.start()
window.electron.ipcRenderer.on('getConfig', (_e, config) => {
    cs.$state.config = config
    loadbar.finish()
    router.push(cs.$state.config.default ?? 'genshin')
    window.electron.ipcRenderer.removeAllListeners('getConfig')
})
window.electron.ipcRenderer.send('getConfig')
</script>