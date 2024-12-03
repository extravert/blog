import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/test', component: () => import("../views/Test.vue") },
    { path: '/login', component: () => import("../views/Login.vue") },
    { path: '/', component: () => import("../views/HomePage.vue") },
    { path: '/detail', component: () => import("../views/Detail.vue") },
    {
        path: '/dashboard', component: () => import("../views/dashboard/DashBoard.vue"), children: [
            { path: '/dashboard/artical', component: () => import("../views/dashboard/Artical.vue") },
            { path: '/dashboard/category', component: () => import("../views/dashboard/Category.vue") },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router, routes }