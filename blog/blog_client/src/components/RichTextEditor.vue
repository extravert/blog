<template>
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, shallowRef, inject, onBeforeUnmount, onMounted } from "vue";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

// 这个应该是用来组件传值的
const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

// 子组件向外传递自己的数据 使用emit 抛出的名称这里定义
const emit = defineEmits(["update:model-value"])


// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys: "uploadVideo" };  // 评比上传视频
// 文档中说明是响应式的
const mode = ref("default")

const editorConfig = { placeholder: '请输入内容...' };

const server_url = inject("server_url")
editorConfig.MENU_CONF = {}  // 必须要这个
editorConfig.MENU_CONF['uploadImage'] = {
    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 10 * 1024, // 10kb
    // 需要完整地址
    server: server_url + '/uploads/rich_editor_upload',
}

// 加载之后会返回一个地址 这个地址是图片的位置 如果不配置下面的内容 返回src="/uploads/634399237886021.png" 是不完整的
// 对src处理 然后返回完整的 返回完整的链接就会在插入的位置预览的效果
// 插入图片
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if (src.indexOf("http") !== 0) {  // 如果不以http这个开头
            return `${server_url}${src}`
        } else {
            return src
        }
    }
}


// v-model双绑定的也要用响应式
const valueHtml = ref("132132")  // 这里设置默认值是没有显示的 文档中提到了是异步获取的方式

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
});

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = 'hello 异步获取默认值';
    }, 100);
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    // 修改内容的时候需要抛出自己的内容 emit的用法 写出来有提示 前面是名称后面是抛出的值
    emit("update:model-value", valueHtml.value)
};

</script>

<style lang="scss" scoped></style>