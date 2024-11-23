import { defineStore } from 'pinia'

export const AdminStore = defineStore("admin", {
    state: () => {
        // 因为所有页面都可以修改这个值 所以需要返回
        return {
            account: "",
            id: 0,
            token: ""
        }
    },
    actions: {},
    getters: {},
})