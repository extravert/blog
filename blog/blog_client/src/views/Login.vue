<template>
    <div class="login-panel">
        <n-card title="管理后台登录">
            <n-form :model="admin" :rules="rules">
                <n-form-item label="account" path="account">
                    <n-input v-model:value="admin.account" placeholder="Input account" />
                </n-form-item>
                <n-form-item label="password" path="password">
                    <n-input v-model:value="admin.password" type="password" placeholder="Input password" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox v-model:checked="admin.remmber" label="remmber me" />
                <n-button type="info" @click="login"> login </n-button>
            </template>
        </n-card>
    </div>
</template>
<script setup>
import { ref, reactive, inject } from "vue";
import {AdminStore} from '../stores/AdminStore'
const axios = inject("axios")  // 名称和前面provide里面的字符串一致
const message = inject("message")  // 注入message


const adminStore = AdminStore()
const admin = reactive({
    account: "",
    password: "",
    remember: false
})
let rules = {
    account: [
        { required: true, message: "please input account!", trigger: "blur" },
        { min: 3, max: 12, message: "length from 3 to 12", trigger: "blur" }
    ],
    password: [
        { required: true, message: "please input account!", trigger: "blur" },
        { min: 6, max: 18, message: "length from 6 to 18", trigger: "blur" }
    ]
}
const login = async () => {
    let res = await axios.post("/login", {
        account: admin.account,
        password: admin.password
    })
    console.log(res.data)
    const data = res.data
    if (data.code == 200) {
        message.success("login success")
        adminStore.token = data.data.token,
        adminStore.account = data.data.account,
        adminStore.id = data.id
    } else {
        message.error("login fail")
    }
}
</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
}
</style>