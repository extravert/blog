<template>
    <n-button @click="showAddModal = true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
        <thead>
            <tr>
                <th>id</th>
                <th>name</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(category, index) in categories">
                <!-- 这里两个花括号 -->
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                    <n-space>
                        <!-- 如果有参数就要想到这里就要传入 当前category就是选中的那项 -->
                        <n-button @click="editCategory(category)">修改</n-button>
                        <n-button @click="deleteCategory(category)">删除</n-button>
                    </n-space>
                </td>
            </tr>

        </tbody>
    </n-table>
    <n-modal v-model:show="showAddModal" preset="dialog" title="dialog">
        <template #header>
            <div>添加分类</div>
        </template>
        <div>
            <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
        </div>
        <template #action>
            <div>
                <n-button @click="add">提交</n-button>
            </div>
        </template>
    </n-modal>

    <n-modal v-model:show="showEditModal" preset="dialog" title="dialog">
        <template #header>
            <div>修改分类</div>
        </template>
        <div>
            <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
        </div>
        <template #action>
            <div>
                <n-button @click="update">提交</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
const message = inject("message")  // 注入message
const dialog = inject("dialog")
import { AdminStore } from '../../stores/AdminStore'
const adminStore = AdminStore()

const axios = inject("axios")

let categories = ref([])
let showAddModal = ref(false)
let showEditModal = ref(false)

let addCategory = reactive({  // 为什么这用ref就不能获取到name 因为使用ref要用value 但是这里是需要name
    name: ""
})

// 这是页面展示的值
let updateCategory = reactive({
    id: 0,
    name: ""
})
onMounted(() => {
    loadDatas()
})
const loadDatas = async () => {
    let res = await axios.get('/category/list')
    // console.log(res)
    categories.value = res.data.rows  // 需要使用value
}

const add = async () => {
    let res = await axios.post('/category/_token/add', { name: addCategory.name })
    console.log(res)
    if (res.data.code == 200) {
        message.success(res.data.msg)
        loadDatas()
    } else {
        message.error(res.data.msg)
    }
    showAddModal.value = false
}

const editCategory = (category) => {
    showEditModal.value = true
    updateCategory.id = category.id;
    updateCategory.name = category.name;
}

const update = async () => {
    let res = await axios.put('/category/_token/update', { id: updateCategory.id, name: updateCategory.name })
    console.log(res)
    if (res.data.code == 200) {
        loadDatas();
        message.success(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showEditModal.value = false;
}

const deleteCategory = async (category) => {
    dialog.warning({
        title: '警告',
        content: '是否删除？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            // 下面是传body的形式删除
            // let res = await axios.delete('/category/_token/delete', { id: category.id })
            // 下面是传query的方式 注意反引号 问号就是拼接url的意思
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            console.log(res)
            if (res.data.code == 200) {
                loadDatas()
                message.success(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => {
            message.success('取消成功！')
        }
    })
}
</script>

<style lang="scss" scoped></style>