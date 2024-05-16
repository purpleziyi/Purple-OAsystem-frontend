<script setup name="publishinform">
import OAMain from '@/components/OAMain.vue';
import { ref, reactive, onMounted, onBeforeUnmount, shallowRef, defineComponent, toRaw } from "vue"
import staffHttp from '@/api/staffHttp';
import { ElMessage } from "element-plus"
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

// WangEditor
import '@wangeditor/editor/dist/css/style.css' // import css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'





//Quill 自己尝试
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';



// define Form proporties
let informForm = reactive({
    title: '',
    content: '',
    department_ids: []
})

// define Form-validation rules
const rules = reactive({
    title: [
        { required: true, message: 'Please enter a title!', trigger: 'blur' }  // 失焦时触发
    ],
    content: [
        { required: true, message: 'Please select the department!', trigger: 'change' }   // 发生改变时触发
    ],
    department_ids: [
        { required: true, message: 'Please select your leave time!', trigger: 'blur' }  // 失焦时触发
    ]
})

let formRef = ref()  //获取表单对象
let formLabelWidth = "100px"   // 指定Form的宽度

let departments = ref([]) // get data from server

/*** 与WangEditor相关的配置  ***/
// editor instance, use `shallowRef`
i18nChangeLanguage('en')  // 切换语言 - 'en' 或者 'zh-CN'
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
    placeholder: 'Type here...',
    MENU_CONF: {
        uploadImage: {
            // http://localhost:5173/image/upload
            // http://localhost:8000/image/upload
            // 在env.development文件中已经定义过开发环境中的 VITE_BASE_URL，以后打包时只用修改env.production文件下的URL即可
            server: import.meta.env.VITE_BASE_URL + '/image/upload',
            fieldName: 'image',   // 上传给server后用何种字段接收，此处需要与后端代码UploadImageSerializer中的“image”保持一致
            maxFileSize: 0.5 * 1024 * 1024,  // 此处需要与后端UploadImageSerializer中的validate_image函数下的max_size保持一致
            maxNumberOfFiles: 10,    // 最多可以上传10个文件，默认是100
            allowedFileTypes: ['image/*'],
            headers: {
                Authorization: "JWT " + authStore.token   //  必须设置，否则会得到403
            },
            timeout: 6 * 1000, //  超时时间为 6 秒,
            customInsert(res, insertFn) {
                if (res.errno == 0) {
                    // res 即服务端的返回结果
                    let data = res.data;
                    let url = import.meta.env.VITE_BASE_URL + data.url   // 服务器的域名
                    let href = import.meta.env.VITE_BASE_URL + data.href
                    let alt = data.alt;
                    // 从 res 中找到 url alt href ，然后插入图片
                    insertFn(url, alt, href)
                } else {
                    ElMessage.error(res.message)
                }
            },
            // 单个文件上传失败
            onFailed(file, res) {
                console.log(`${file.name} upload failed`, res)
            },

            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
                if (file.size > 0.5 * 1024 * 1024) {
                    ElMessage.error('The maximum image size cannot exceed 0.5MB!')
                } else {
                    ElMessage.error('Upload a valid image!')
                }
            },
        }
    }
}

let mode = "default"
// Timely destroy `editor` before vue component destroy.
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor) => {
    editorRef.value = editor // record editor instance
}
/***  与WangEditor相关的配置  ***/

onMounted(async () => {
    try {
        let data = await staffHttp.getAllDepartment()
        departments.value = data.results
    } catch (detail) {
        ElMessage.error(detail)
    }
})

const onSubmit = () => {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            console.log(informForm);
        }
    }

    )
}

</script>

<template>
    <OAMain title="Publish Notification"><!-- 发布通知 -->
        <el-card>
            <el-form :model="informForm" :rules="rules" ref="formRef">
                <el-form-item label="Title" :label-width="formLabelWidth" prop="title"><!-- 标题 -->
                    <el-input v-model="informForm.title" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Departments" :label-width="formLabelWidth" prop="department_ids">
                    <!--部门可见-->
                    <el-select multiple v-model="informForm.department_ids"><!--multiple可以实现多选-->
                        <el-option :value="0"
                            label="All Departments"></el-option><!-- notification is visible to all departments when value is 0 -->
                        <el-option v-for="department in departments" :label="department.name" :value="department.id"
                            :key="department.name" />
                    </el-select>
                </el-form-item>

                <el-form-item label="Content" :label-width="formLabelWidth" prop="content"> <!--内容 富文本框区-->
                    <!--<div style="border: 1px solid #ccc">
                        <QuillEditor ref="myQuillEditor" theme="snow" toolbar="full"
                            v-model:content="informForm.content" class="ql-editor" style="height: 400px" />
                    </div>-->

                    <div style="border: 1px solid #ccc">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
                            :defaultConfig="toolbarConfig" :mode="mode" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="informForm.content"
                            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div style="text-align: right; flex:1;"><!--提交按钮 置于右下方-->
                        <el-button type="primary" @click="onSubmit">Submit</el-button>
                    </div>
                </el-form-item>
            </el-form>

        </el-card>


    </OAMain>
</template>



<style scoped>
/* .ql-editor {
    height: 300px;
    width: 100px
} */
</style>