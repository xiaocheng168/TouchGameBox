import { defineStore } from "pinia"
export const configStore = defineStore('config', {
    state() {
        return {
            config: {
                default: 'genshin'
            } as any,
            menuHide: false,
        }
    }
})