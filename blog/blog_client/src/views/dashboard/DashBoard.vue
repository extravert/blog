<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu, index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div>
        </div>
        <div style="padding: 20px; width: 100%;">
            <router-view></router-view>
        </div>
        <div class="title">后台管理系统</div>
    </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { AdminStore } from '../../stores/AdminStore'
import { router, routes } from '../../router/router'


const adminStore = AdminStore()  // 上面引入只能叫声明了函数 这里要调用才会有里面的对象值
let menus = [
    { name: "artical", herf: "/dashboard/artical" },
    { name: "category", herf: "/dashboard/category" },
    { name: "logout", herf: "logout" },
]

const toPage = (menu) => {
    if (menu.herf == "logout") {
        router.push('/login')
    } else {
        router.push(menu.herf)
    }
}
</script>

<style lang="scss" scoped>
.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;
        &:hover {
            color: #fd7601;
        }
    }
}
.title {
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 20px;
}

</style>