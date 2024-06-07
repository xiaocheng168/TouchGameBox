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
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router
