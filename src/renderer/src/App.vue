<template>
  <n-config-provider :theme="themeStyle" class="main-window-box">
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-message-provider>
          <div class="main-header-box opt">
            <Toolbar />
            <InitApp />
          </div>
          <n-layout has-sider class="opt main-content-box">
            <n-layout-sider style="user-select: none" bordered collapse-mode="width" :collapsed-width="0" :width="120"
              :collapsed="cs.$state.menuHide" show-trigger @collapse="cs.$state.menuHide = true"
              @expand="cs.$state.menuHide = false">
              <n-menu :collapsed="cs.$state.menuHide" :options="menuOptions" @update:value="tabClick"
                v-model:value="cs.$state.config.default" />
            </n-layout-sider>
            <n-layout style="background: transparent">
              <div :style="bg" class="bg"></div>
              <n-layout-content style="height: 100%;">
                <Transition name="slide-fade" mod="out-in">
                  <router-view />
                </Transition>
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-message-provider>

      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
// @ts-ignore
import Toolbar from './components/Toolbar.vue'
// @ts-ignore
import InitApp from './components/InitApp.vue'
import { darkTheme, lightTheme, MenuOption } from 'naive-ui'
import { ref } from 'vue';
import router from './route/route'
import { configStore } from './store/config';
const menuOptions: MenuOption[] = [
  {
    label: '原神',
    key: 'genshin',
  },
  {
    label: '星穹铁道',
    key: 'starrail',
  },
  {
    label: '鸣潮',
    key: 'wuther',
  },
]
const themeStyle = ref(darkTheme)

const cs = configStore()


const bg = ref({
  backgroundImage: `url(${cs.config.genshin?.imageBase64})`,
  // opacity: 1,
  // filter: 'blur(0)',
  // transform: 'scale(1)'
})


/**
 * 切换界面
 */
function tabClick(e: string) {
  router.push(e);
  window.electron.ipcRenderer.send('setKeyConfig', {
    key: 'default',
    value: e
  })
  switch (e) {
    case 'genshin': {
      bg.value.backgroundImage = `url(${cs.config.genshin?.imageBase64})`
      break;
    }
    case 'starrail': {
      bg.value.backgroundImage = `url(${cs.config.starrail?.imageBase64})`
      break;
    }
    case 'wuther': {
      bg.value.backgroundImage = `url(${cs.config.wuther?.imageBase64})`
      break;
    }
  }
  // bg.value.opacity = 1
  // bg.value.filter = 'blur(3px)'
  // bg.value.transform = 'scale(1.5)'
  // setTimeout(() => {
  //   bg.value.filter = 'blur(0)'
  //   bg.value.transform = 'scale(1)'
  // }, 300);
}

setTimeout(() => {
  tabClick(router.currentRoute.value.path.replace('/', ''))
}, 1000);

// 随主题
const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
themeMedia.addListener(e => themeStyle.value = e.matches ? lightTheme : darkTheme)
</script>

<style lang="scss">
.main-window-box {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.bg {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: -1;
  transition: all .5s linear;
  transform: scale(1);
}



.main-box {
  height: 100vh;

  .main-content-box {
    height: 500px;
  }
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