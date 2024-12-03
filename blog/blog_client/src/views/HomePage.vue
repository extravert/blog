<template>
    <div class="container">
        <div class="nav">
            <div @click="toHome">首页</div>
            <!-- 这里选中的value是使用id的形式 但是我们希望选中的是名称 -->
            <n-popselect v-model:value="selectedCategory" :options="categoryOptions" trigger="click">
                <!-- 通过计算属性的变量直接写变量就行 不需要重新定义 -->
                <div>分类<span>{{ categoryName }}</span></div>
            </n-popselect>
            <div @click="toDashboard">后台</div>
        </div>
        <n-divider />
        <div class="footer">
            <div>power by extravert</div>
            <div>XICP备XXXXX号-1</div>
        </div>
    </div>
</template>

<script setup>

import { ref, inject, onMounted, computed } from 'vue';
import { router } from '../router/router';
const selectedCategory = ref(0)
const categoryOptions = ref([])
const axios = inject("axios")

onMounted(() => {
    loadCategories();
})

const loadCategories = async () => {
    let res = await axios.get('/category/list')
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    // console.log(categoryOptions)
}

// 选中的值是id 但是我希望是选中的是名称 需要使用computed
const categoryName = computed(() => {
    // 找到符合return后面的条件的那条记录返回 使用的是回调函数 注意了
    let selectedOption = categoryOptions.value.find((option) => {
        return option.value == selectedCategory.value
    })
    return selectedOption ? selectedOption.label : ""
})
const toHome = () => {
    router.push('/')
}
const toDashboard = () => {
    router.push('/login')
}
</script>

<style lang="scss" scoped>
.container {
    width: 90%;
    margin: 0 auto;
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;

    div {
        cursor: pointer;
        margin-left: 15px;

        &:hover {
            color: #f60;
        }
        span {
            font-size: 12px;
        }
    }
}
.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
</style>