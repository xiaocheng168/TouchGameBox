<template>
    <div class="starrail-content-box">
        <div class="top-box">
            <div class="starrail-image">
                <img src="../../assets/icon/sr.jpg" />
            </div>
        </div>
        <div class="bottom-box">
            <div class="bottom-box">
                <n-button type="success" :loading="cs.$state.config[gameName].loading"
                    v-if="!cs.$state.config[gameName].starting" @click="startGame(gameName)">启动游戏</n-button>
                <n-button type="error" :loading="cs.$state.config[gameName].loading" v-else
                    @click="stopGame(gameName)">关闭游戏</n-button>
                <n-button type="success" :loading="cs.$state.config[gameName].loading"
                    @click="selectGame(gameName)">选择游戏</n-button>
            </div>
        </div>

        <input type="file" hidden id="file" accept=".exe">
        <p v-if="cs.config?.[gameName]?.path">
            {{ cs.config?.[gameName]?.path }}
        </p>
    </div>
</template>
<script setup lang="ts">
// @ts-ignore
import { configStore } from "@renderer/store/config";
import { useLoadingBar, useMessage, useNotification } from "naive-ui";
import '../../global'
// @ts-ignore
import { selectGame, startGame, stopGame } from "@renderer/utils/game";
const gameName = 'starrail'
window.loadBar = useLoadingBar()
window.message = useMessage()
window.notific = useNotification()
const cs = configStore()

</script>
<style lang="scss">
.starrail-content-box {
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
    width: 27vmin;
    height: 22vmin;
    box-shadow: 0 0 10px 5px rgba(30, 31, 34, 0.22);
    border-radius: 20px;
    animation: load-paimon 0.5s cubic-bezier(0.93, 0.19, 0.31, 0.61) forwards;
    object-fit: cover;
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