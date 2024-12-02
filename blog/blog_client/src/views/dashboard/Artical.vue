<template>
    <div>
        <!-- 这里tabValue可以用来修改默认选中 这是固定用法 -->
        <n-tabs v-model:value="tabValue" justify-content="start" type="line">
            <n-tab-pane name="list" tab="文章列表">
                <div v-for="(blog, index) in blogsList" :key="index" style="margin-bottom: 15px;">
                    <n-card :title="blog.title">
                        {{ blog.content }}
                        <template #footer>
                            <!-- 水平方向上居中对齐 -->
                            <n-space align="center">
                                <div>发布时间：{{ blog.create_time }}</div>
                                <n-button @click="toUpdate(blog)">修改</n-button>
                                <n-button>删除</n-button>
                            </n-space>
                        </template>
                    </n-card>
                </div>
                <n-space>
                    <!-- 分页2 将页码数字遍历显示出来 并添加点击数字事件和样式 -->
                    <!-- 这里遍历页码数 选择页码 -->
                    <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
                        <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">
                            {{ pageNum }} / {{ pageInfo.pageCount }}
                            <!-- 当前：<span> {{ pageNum }}</span>
                            <span>{{ pageInfo.pageCount }}</span> -->
                        </div>
                    </div>
                </n-space>
            </n-tab-pane>
            <n-tab-pane name="add" tab="添加文章">
                <n-form-item label="title">
                    <n-input v-model:value="addArtical.title" @keydown.enter.prevent placeholder="please input title" />
                </n-form-item>
                <n-form-item label="category">
                    <n-select v-model:value="addArtical.category_id" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="content">
                    <!-- 用下面的双向绑定输出组件的值了 这里可以思考一下 从双向绑定角度理解 -->
                    <RichTextEditor v-model="addArtical.content"></RichTextEditor>
                </n-form-item>
                <n-form-item>
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-tab-pane>

            <n-tab-pane name="update" tab="修改文章">
                <n-form-item label="update">
                    <n-input v-model:value="updateArtical.title" @keydown.enter.prevent
                        placeholder="please input title" />
                </n-form-item>
                <n-form-item label="category">
                    <n-select v-model:value="updateArtical.category_id" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="content">
                    <rich-text-editor v-model="updateArtical.content"></rich-text-editor>
                </n-form-item>
                <n-form-item>
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue";
import { paginationDark } from "naive-ui";

const axios = inject("axios")
const message = inject("message")
// v-model绑定的
const addArtical = reactive({
    title: "",
    content: "",
    category_id: '请选择'
})

// 分页0 定义页码相关需要的变量
const pageInfo = reactive({
    page: 1,  // 当前页码
    pageSize: 6,  // 每页数
    pageCount: 0,  // 总页数
    count: 0  // 总条数
})

const tabValue = ref('list')
const updateArtical = reactive({
    id: 0,
    title: "",
    content: "",
    category_id: 0
})

const categoryOptions = ref([])
onMounted(() => {
    loadCategories(),
        loadBlogs()
})

const blogsList = ref([])
const loadBlogs = async () => {
    // 模板的形式传值
    let res = await axios.get(`/blogs/_token/search?page=${pageInfo.page}&page_size=${pageInfo.pageSize}`)
    console.log(res)
    let data = res.data.data.rows
    for (let blog of data) {
        blog.content += '...'  // 超过的部分省略号
        // 格式化时间序列的方法
        let d = new Date(blog.create_time)
        blog.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDay()}日`
    }
    blogsList.value = data
    // 分页1.首先拿到所有的数据 计算总页数
    pageInfo.count = res.data.data.count  // 总数据条数
    // pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize)
    // 就是判断整除和有余数的时候需要多一页 其实也可以用向上取整？
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}

// 分页4 点击切换事件 传入参数 重新请求加载数据
const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}
const loadCategories = async () => {
    let res = await axios.get('/category/list')
    // 这里又是一个知识点 rows数组的map 方法 对其中每一个值进行修改后返回
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categoryOptions)
}

// 直接把隔壁添加分类的add方法复制粘贴就行 改一下参数 做程序就是这样
const add = async () => {
    let res = await axios.post('/blogs/_token/add', addArtical)
    console.log(res)
    if (res.data.code == 200) {
        message.success(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    addArtical.title = ''
    addArtical.content = ''
}

const toUpdate = async (blog) => {
    tabValue.value = 'update'
    let res = await axios.get('/blogs/detail?id=' + blog.id)
    console.log(res)
    updateArtical.id = blog.id
    updateArtical.title = res.data.rows[0].title
    updateArtical.content = res.data.rows[0].content
    updateArtical.category_id = res.data.rows[0].category_id
    console.log(updateArtical.content)
}

const update = async () => {
    let res = await axios.put('blogs/_token/update', updateArtical)
    console.log(res)
    if (res.data.code == 200) {
        message.success(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
}
</script>

<style lang="scss" scoped></style>