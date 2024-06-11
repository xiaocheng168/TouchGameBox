import { configStore } from "@renderer/store/config";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";


const routes: RouteRecordRaw[] = [
    {
        path: '/genshin',
        name: '原神',
        component: () => import('../view/genshin/GenshinPage.vue')
    },
    {
        path: '/starrail',
        name: '星穹铁道',
        component: () => import('../view/starrail/StarRailView.vue')
    },
    {
        path: '/wuther',
        name: '鸣潮',
        component: () => import('../view/wuther/WutherView.vue')
    },
    {
        path: '/tools',
        name: '工具箱',
        component: () => import('../view/tools/ToolView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})




router.beforeEach((e) => {
    const cs = configStore()
    cs.$state.config.default = e.path.replace('/', '');
    // 设置默认属性
    if (!cs.$state.config[cs.$state.config.default]) {
        cs.$state.config[cs.$state.config.default] = {
            starting: false,
            loading: false
        }
    }
})
export default router
