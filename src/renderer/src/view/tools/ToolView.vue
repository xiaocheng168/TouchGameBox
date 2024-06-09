<template>
    <div class="card-list">
        <n-card v-for="(Component, index) in loadPlugins" class="card" :key="index" :title="index + 1">
            <component :is="Component" :key="index"></component>
        </n-card>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const pluginVues = import.meta.glob('../../components/tools/*.vue')
const loadPlugins = ref<any[]>([]);
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