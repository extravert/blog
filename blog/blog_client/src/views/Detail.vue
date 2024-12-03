<template>
    <div class="container">
        <n-button class="back-button" @click="back">返回</n-button>

        <n-card class="blog-card">
            <n-h1 class="blog-title">{{ blogInfo.title }}</n-h1>
            <div class="blog-content">
                <!-- 防止页面显示出html格式 v-html会自动解析 -->
                <div v-html="blogInfo.content"></div>
            </div>
        </n-card>
    </div>
</template>

<script setup>
import { onMounted, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const axios = inject("axios")

const route = useRoute();
const router = useRouter();

const blogInfo = ref({})
onMounted(() => {
    loadBlogs();
})
const loadBlogs = async () => {
    let id = route.query.id
    let res = await axios.get(`/blogs/detail?id=${id}`)
    blogInfo.value = res.data.rows[0]
}
const back = () => {
    router.push('/')
}
</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
    padding: 20px; /* 添加内边距 */
}

.blog-card {
    padding: 20px; /* 卡片内边距 */
    border-radius: 10px; /* 卡片圆角 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
}

.blog-title {
    margin-bottom: 15px; /* 标题与内容之间的间距 */
    font-size: 24px; /* 标题字体大小 */
    color: #333; /* 标题颜色 */
}

.blog-content {
    line-height: 1.6; /* 行高 */
    color: #555; /* 内容颜色 */
}

.blog-content img {
    max-width: 100% !important; /* 确保图片不超出范围 */
}
</style>