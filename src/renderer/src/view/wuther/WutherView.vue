<template>
    <div class="wuther-content-box">
        <div class="top-box">
            <div class="wuther-image">
                <img src="../../assets/icon/furina.jpg" />
            </div>
        </div>
        <div class="bottom-box">
            <n-button type="success" :loading="loading" v-if="!starting" @click="startGame">启动游戏</n-button>
            <n-button type="error" :loading="loading" v-else @click="stopGame">关闭游戏</n-button>
            <n-button type="success" :loading="loading" @click="selectGame">选择游戏</n-button>
        </div>

        <input type="file" hidden id="file" accept=".exe">
        <p v-if="cs.config?.wuther?.path">
            {{ cs.config?.wuther?.path }}
        </p>
    </div>
</template>
<script setup lang="ts">
// @ts-ignore
import { configStore } from "@renderer/store/config";
import { useLoadingBar, useMessage, useNotification } from "naive-ui";
import { ref, toRaw } from "vue";
import '../../global'
const loading = ref(false)
const loadingBar = ref(useLoadingBar())
const message = ref(useMessage())
const notice = ref(useNotification())
const starting = ref(false)

const cs = configStore()
function startGame() {
    loadingBar.value.start();
    loading.value = true

    window.electron.ipcRenderer.on('startGame', (_e, args) => {
        loading.value = false
        // 如果启动是错误的 false!
        if (!args) {
            message.value.error('启动失败', {
                duration: 5000,
            })
            loading.value = false
            loadingBar.value.error();
        } else {
            message.value.success('启动成功', {
                duration: 5000,
            })
            loading.value = false
            loadingBar.value.finish();
        }
        starting.value = args
        window.electron.ipcRenderer.removeAllListeners('startGame')
    })

    window.electron.ipcRenderer.send('startGame', 'wuther')
}


function stopGame() {
    loadingBar.value.start();
    loading.value = true
    window.electron.ipcRenderer.on('stopGame', (_e, args) => {
        starting.value = !args
        loading.value = false
        loadingBar.value.finish()
    })
    window.electron.ipcRenderer.send('stopGame', 'wuther')
}

function selectGame() {
    const file = document.getElementById('file')
    file?.click()
    file?.addEventListener('change', (_e) => {
        // @ts-ignore
        const game = file?.files[0];
        if (game.name != 'Wuthering Waves.exe') {
            notice.value.error({
                title: '请选择鸣潮游戏程序',
                content: 'Wuthering Waves.exe',
                duration: 5000,
            })
        } else {
            cs.$state.config.wuther = {
                path: game.path,
                fps: 144,
                image: '',
                imageBase64: ''
            }
            // 申请保存配置
            window.electron.ipcRenderer.send('setConfig', toRaw(cs.$state.config))
        }
    })
}

</script>
<style lang="scss">
.wuther-content-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .top-box {
        flex: 10;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            height: 150px;
        }
    }

    .bottom-box {
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
}

img {
    width: 25vmin;
    height: 22vmin;
    box-shadow: 0 0 10px 5px rgba(30, 31, 34, 0.22);
    border-radius: 20px;
    animation: load-paimon 0.5s cubic-bezier(0.93, 0.19, 0.31, 0.61) infinite alternate;
}

@keyframes load-paimon {
    from {
        transform: translateY(20px);
        // border-radius: 25%;
    }

    to {
        transform: rotate3d(0, 1, 0, 180deg);
        // border-radius: 20px;
    }
}
</style>