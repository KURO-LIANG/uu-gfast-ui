<template>
    <div style="border: 1px solid #ccc;max-width:920px;">
        <Toolbar
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
            style="border-bottom: 1px solid #ccc"
        />
        <Editor
            :defaultConfig="editorConfig"
            :mode="mode"
            :model-value="valueHtml"
            style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated"
            @onChange="handleChange"
            @onDestroyed="handleDestroyed"
            @onFocus="handleFocus"
            @onBlur="handleBlur"
            @customAlert="customAlert"
            @customPaste="customPaste"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount, ref, shallowRef, defineProps, defineEmits, computed, onMounted, watch} from 'vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';
// import storage from "../utils/storage";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: String,
    destroy: Boolean
})

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 监听 destroy 的变化
watch(() => props.destroy, (newValue, oldValue) => {
  console.log('destroy 变化:', newValue, oldValue);
  // 执行你想要的操作
  if(newValue){
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
  }

});

// 内容 HTML
const valueHtml = computed({
    get() {
        return props.modelValue
    }
});
const mode = 'default'
const toolbarConfig = {};
// const token = storage.getItem('token', '')
const editorConfig = {placeholder: '请输入内容...', MENU_CONF: {}};

editorConfig.MENU_CONF['uploadImage'] = {
    server: `${import.meta.env.VITE_API_URL}api/v1/pub/upload/singleImg`,
    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: 'file',

    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 10 * 1024 * 1024, // 1M

    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 10,

    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['image/*'],

    // 跨域是否传递 cookie ，默认为 false
    withCredentials: false,

    // 超时时间，默认为 10 秒
    timeout: 5 * 1000, // 5 秒

    // 上传之前触发
    onBeforeUpload(file) {
        // file 选中的文件，格式如 { key: file }
        return file

        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
    },
    // 上传进度的回调函数
    onProgress(progress) {
        // progress 是 0-100 的数字
        // console.log('progress', progress)
    },
    // 自定义插入图片
    customInsert(res, insertFn) {
        // res 即服务端的返回结果

        // 从 res 中找到 url alt href ，然后插图图片
        insertFn(res.data.full_path, '', '')
    },
    // 单个文件上传成功之后
    onSuccess(file, res) {
        console.log(`${file.name} 上传成功`, res)
    },
    // 单个文件上传失败
    onFailed(file, res) {
        console.log(`${file.name} 上传失败`, res)
    },
    // 上传错误，或者触发 timeout 超时
    onError(file, err, res) {
        console.log(`${file.name} 上传出错`, err, res)
    },
}

editorConfig.MENU_CONF['uploadVideo'] = {
    server: `${import.meta.env.VITE_API_URL}api/v1/pub/upload/singleFile`,

    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: 'file',

    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 200 * 1024 * 1024, // 80M

    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 1,

    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['video/*'],

    // 跨域是否传递 cookie ，默认为 false
    withCredentials: false,

    // 超时时间，默认为 10 秒
    timeout: 300 * 1000, // 5 秒

    // 上传之前触发
    onBeforeUpload(file) {
        // file 选中的文件，格式如 { key: file }
        return file

        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
    },
    // 上传进度的回调函数
    onProgress(progress) {
        // progress 是 0-100 的数字
        console.log('progress', progress)
    },
    // 自定义插入图片
    customInsert(res, insertFn) {
        // res 即服务端的返回结果

        // 从 res 中找到 url alt href ，然后插图图片
        insertFn(res.data.full_path, '', '')
    },
    // 单个文件上传成功之后
    onSuccess(file, res) {
        console.log(`${file.name} 上传成功`, res)
    },
    // 单个文件上传失败
    onFailed(file, res) {
        console.log(`${file.name} 上传失败`, res)
    },
    // 上传错误，或者触发 timeout 超时
    onError(file, err, res) {
        console.log(`${file.name} 上传出错`, err, res)
    },
}

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  destroyEditor()
});

// 编辑器回调函数
const handleCreated = (editor) => {
    // console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};

const destroyEditor = () => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
};
const handleChange = (editor) => {
    // console.log('change:', editor.getHtml());
    emits('update:modelValue', editor.getHtml())
};
const handleDestroyed = (editor) => {
    // console.log('destroyed', editor);
};
const handleFocus = (editor) => {
    // console.log('focus', editor);
};
const handleBlur = (editor) => {
    // console.log('blur', editor);
};
const customAlert = (info, type) => {
    // alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event);

    // 自定义插入内容
    // editor.insertText('xxx');

    // 返回值（注意，vue 事件的返回值，不能用 return）
    // callback(false); // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
};

const insertText = () => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.insertText('hello world');
};


</script>

<style scoped>

</style>
