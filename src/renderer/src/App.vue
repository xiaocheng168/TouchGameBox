<template>
  <n-config-provider :theme="darkTheme" class="main-window-box">
    <div class="main-box opt">
      <div class="main-header-box">
        <Toolbar />
      </div>
    </div>
    <n-layout has-sider class="opt">
      <n-layout-sider style="user-select: none" bordered collapse-mode="width" :collapsed-width="0" :width="120"
        :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu :collapsed="collapse" :options="menuOptions" :on-update:value="tabClick" />
      </n-layout-sider>
      <n-layout>
        <n-layout-content>
          <Transition name="slide-fade" mod="out-in">
            <router-view />
          </Transition>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import Toolbar from './components/toolbar/index.vue';
import { darkTheme, lightTheme, MenuOption } from 'naive-ui'
import { ref } from 'vue';
import router from './route/route'
const menuOptions: MenuOption[] = [
  {
    label: '原神',
    key: 'GenshinImpadct',
  },
  {
    label: '星穹铁道',
    key: 'StarRail',
  },
  {
    label: '鸣潮',
    key: 'WutheringWaves',
  },
]
const collapsed = ref(false)

function tabClick(e: string) {
  console.log(router.push(e));
}
</script>

<style lang="scss">
.main-window-box {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('./assets/electron.svg') no-repeat center center;
}

.opt {
  opacity: 0.9;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>