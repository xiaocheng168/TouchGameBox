<template>
    <div class="toolbar">
        <p class="title">TouchGameBox</p>
        <div class="ctrl-menu">
            <n-icon class="ctrl-btn-item" @click="hideWindow">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path
                        d="M464 352H48c-26.5 0-48 21.5-48 48v32c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-32c0-26.5-21.5-48-48-48z"
                        fill="currentColor" data-darkreader-inline-fill=""
                        style="--darkreader-inline-fill: currentColor;"></path>
                </svg>
            </n-icon>

            <n-icom class="ctrl-btn-item" @click="closeWindow">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path
                        d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                        fill="currentColor" data-darkreader-inline-fill=""
                        style="--darkreader-inline-fill: currentColor;"></path>
                </svg>
            </n-icom>
        </div>
    </div>
</template>
<script setup lang="ts">
import '../../global'

function hideWindow() {
    window.electron.ipcRenderer.send('ctrl-menu-hide', 1)
}

function closeWindow() {
    window.electron.ipcRenderer.send('ctrl-menu-exit', 1)
}
</script>
<style lang="scss">
.toolbar {
    -webkit-app-region: drag;
    height: 50px;
    width: 100vw;
    background: #23272E;
    display: flex;
    justify-content: space-between;
    color: white;
    font-weight: bold;

    .title {
        margin-left: 10px;
        user-select: none;
        font-weight: bold;
        font-size: 16px;
        line-height: 50px;
    }

    .ctrl-menu {
        -webkit-app-region: no-drag !important;
        width: 100px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;


        .ctrl-btn-item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            transition: background .3s, color .3s;
            font-size: 12px !important;

            svg {
                width: 50%;
            }

            &:hover {
                background: #545454;
                color: #23272E;
            }

            &:nth-last-child(1):hover {
                background: #E06C75;
            }
        }
    }
}
</style>