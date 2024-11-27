<template>
    <div>
        <n-tabs default-value="add" justify-content="start" type="line">
            <n-tab-pane name="oasis" tab="Oasis">
                Wonderwall
            </n-tab-pane>
            <n-tab-pane name="add" tab="添加文章">
                <n-form-item label="title">
                    <n-input v-model:value="addArtical.title" @keydown.enter.prevent placeholder="please input title"/>
                </n-form-item>
                <n-form-item label="content">
                    <!-- 用下面的双向绑定输出组件的值了 这里可以思考一下 从双向绑定角度理解 -->
                    <RichTextEditor v-model="addArtical.content"></RichTextEditor>
                </n-form-item>
            </n-tab-pane>
            <n-tab-pane name="jay chou" tab="周杰伦">
                七里香
            </n-tab-pane>
        </n-tabs>
        {{ addArtical.content }}
    </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue";

// v-model绑定的
const addArtical = reactive({
    title: "",
    content: "",
    category_id: 0
})

</script>

<style lang="scss" scoped></style>