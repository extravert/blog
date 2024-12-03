<template>
    <div class="container">
        <div class="nav">
            <div @click="toHome">首页</div>
            <!-- 这里选中的value是使用id的形式 但是我们希望选中的是名称 -->
            <n-popselect @update:value="searchByCategoryId" v-model:value="selectedCategory" :options="categoryOptions"
                trigger="click">
                <!-- 通过计算属性的变量直接写变量就行 不需要重新定义 -->
                <div>分类</div>
            </n-popselect>
            <div @click="toDashboard">后台</div>
        </div>
        <n-divider />

        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字" />
            <!-- 这里给loadBloads传入0 是为了防止默认会传入一个事件对象e -->
            <n-button type="primary" ghost @click="loadBlogs(0)"> 搜索 </n-button>
        </n-space>

        <div v-for="(blog, index) in blogsList" :key="index" style="margin-bottom: 15px; cursor: pointer;">
            <n-card :title="blog.title" @click="toDetail(blog)">
                {{ blog.content }}
                <template #footer>
                    <!-- 水平方向上居中对齐 -->
                    <n-space align="center">
                        <div>发布时间：{{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
        <n-divider />

        <div class="footer">
            <div>power by extravert</div>
            <div>XICP备XXXXX号-1</div>
        </div>
    </div>
</template>

<script setup>

import { ref, inject, onMounted, computed, reactive } from 'vue';
import { router } from '../router/router';
const selectedCategory = ref(0)
const categoryOptions = ref([])
const axios = inject("axios")
const blogsList = ref([])

const pageInfo = reactive({
    page: 1,
    pageSize: 4,
    pageCount: 0,
    count: 0,
    keyword: "",
    category_id: ""
})

onMounted(() => {
    loadCategories();
    loadBlogs();
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

const loadBlogs = async (page = 0) => {
    // 解决分页的时候会默认传入一个值 但是值是不对应页码的 所以需要手动添加默认值
    if (page != 0) {
        pageInfo.page = page
    }
    let res = await axios.get(
        `/blogs/_token/search?
        keyword=${pageInfo.keyword}
        &page=${pageInfo.page}
        &page_size=${pageInfo.pageSize}
        &category_id=${pageInfo.category_id}`)
    // console.log(res)
    let data = res.data.data.rows
    for (let blog of data) {
        blog.content += '...'
        let d = new Date(blog.create_time)
        blog.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDay()}日`
    }
    blogsList.value = data
    pageInfo.count = res.data.data.count
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}

// 选中的值是id 但是我希望是选中的是名称 需要使用computed
const categoryName = computed(() => {
    // 找到符合return后面的条件的那条记录返回 使用的是回调函数 注意了
    let selectedOption = categoryOptions.value.find((option) => {
        return option.value == selectedCategory.value
    })
    return selectedOption ? selectedOption.label : ""
})

const searchByCategoryId = (category_id) => {
    // console.log(category_id)  // 因为是看的文档的用法 这里打印一下 看看传入的是什么 然后方便后续处理
    pageInfo.category_id = category_id
    loadBlogs()
}
const toHome = () => {
    router.push('/')
}
const toDashboard = () => {
    router.push('/login')
}

const toDetail = (blog) => {
    // 传入路由携带id的方式 对象中要用key：value形式
    router.push({ path: '/detail', query: { id: blog.id } })
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

        // span {
        //     font-size: 12px;
        // }
    }
}

.search {
    margin-bottom: 15px;
}

.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
</style>