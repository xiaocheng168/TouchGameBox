<template>
    <div class="card-list">
        <n-card v-for="(Component, index) in loadPlugins" class="card" :key="index" :title="pluginInfos[index]?.title">
            <component :is="Component" :key="index" :ref="el => pluginInfos[index] = el"></component>
        </n-card>
    </div>
</template>
<script lang="ts" setup>
import { useLoadingBar, useMessage, useNotification } from 'naive-ui';
import { onMounted, ref } from 'vue';
// @ts-ignore
const pluginVues = import.meta.glob('../../components/tools/*.vue')
const loadPlugins = ref<any[]>([]);
const pluginInfos = ref({})
import '../../global'
setTimeout(() => {
    console.log(pluginInfos.value);
}, 1000);
window.loadBar = useLoadingBar()
window.message = useMessage()
window.notific = useNotification()
onMounted(async () => {
    for (const key in pluginVues) {
        const module: any = await pluginVues[key]()
        loadPlugins.value.push(module.default)
    }
})

</script>
<style lang="scss">
.card-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 10px;
    gap: 10px;

    .card {
        animation: loadPluginCard .6s cubic-bezier(0.075, 0.82, 0.165, 1) forwards
    }

    @keyframes loadPluginCard {
        from {
            transform: scale(0);
        }

        to {
            transform: scale(1);
        }
    }
}
</style>