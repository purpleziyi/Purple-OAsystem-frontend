<script setup name="myabsent">
import OAPageHeader from "@/components/OAPageHeader.vue"
import absentHttp from "@/api/absentHttp";
import { ref, reactive, onMounted, computed, watch } from "vue"
import { ElMessage } from "element-plus"
// import timeFormatter from "@/utils/timeFormatter";
// import OAMain from "@/components/OAMain.vue"
// import OAPagination from "@/components/OAPagination.vue"
// import OADialog from "@/components/OADialog.vue"


let formLabelWidth = "100px"
let dialogFormVisible = ref(false)
let absentForm = reactive({
    title: '',
    absent_type_id: null,
    date_range: [],
    request_content: ""
})

// 个人考勤信息
let absents = ref([])
let absent_types = ref([])  // 先定义一个空数组，之后从服务器中获取真的数据

let responder = reactive({
    email: '',
    username: ''     // realname?
})

// responder的计算属性
let responder_str = computed(() => {
    if (responder.email) {
        return '[' + responder.email + ']' + responder.username
    } else {
        return "Null"
    }
})

let absentFormRef = ref()
let rules = reactive({
    title: [
        { required: true, message: 'Please enter a title!', trigger: 'blur' }  // 失焦时触发
    ],
    absent_type_id: [
        { required: true, message: 'Please select the absent type!', trigger: 'change' }   // 发生改变事触发
    ],
    date_range: [
        { required: true, message: 'Please select your leave time!', trigger: 'blur' }  // 失焦时触发
    ],
    request_content: [
        { required: true, message: 'Please enter the reason for leave!', trigger: 'blur' }   // 失焦时触发
    ]
})

const onShowDialog = () => {
    // 先清空内容
    absentForm.title = ""
    absentForm.absent_type_id = null
    absentForm.date_range = []
    absentForm.request_content = ""
    // 再将对话框设为显示
    dialogFormVisible.value = true;
}

const onSubmitAbsent = () => {
    console.log(absentForm)
}

// 从API获取数据 引入absentHttp
onMounted(async () => {
    try {
        // 1. 获取请假类型
        let absent_types_data = await absentHttp.getAbsentTypes()
        absent_types.value = absent_types_data

        // 2. 获取审批者
        let responder_data = await absentHttp.getResponder()
        Object.assign(responder, responder_data)

        // 3. 获取个人考勤列表
        requestAbsents(1)
    } catch (detail) {
        ElMessage.error(detail)
    }
})

</script>

<template>
    <el-space direction="vertical" fill :size="20" style="width: 100%">
        <OAPageHeader content="Personal attendance"></OAPageHeader>
        <el-card style="text-align: right;">
            <el-button type="primary" @click="onShowDialog"><el-icon>
                    <Plus />
                </el-icon> Request for Leave</el-button> <!--发起考勤-->
        </el-card>
    </el-space>

    <el-dialog v-model="dialogFormVisible" title="Request for Leave" width="500"> <!--发起请假-->
        <el-form :model="absentForm" :rules="rules" ref="absentFormRef">
            <el-form-item label="Title" :label-width="formLabelWidth" prop="title">
                <el-input v-model="absentForm.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Absent Type" :label-width="formLabelWidth" prop="absent_type_id"> <!--请假类型-->
                <el-select v-model="absentForm.absent_type_id" placeholder="Please select absent type">
                    <el-option v-for="item in absent_types" :label="item.name" :value="item.id" :key="item.name" />
                </el-select>
            </el-form-item>

            <el-form-item label="Leave Time" :label-width="formLabelWidth"> <!--请假时间-->
                <el-date-picker v-model="absentForm.date_ranges" type="daterange" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" :size="size" />
            </el-form-item>

            <el-form-item label="Approver" :label-width="formLabelWidth"><!--审批人 只读 计算属性"responder_str"-->
                <el-input :value="responder_str" readonly disabled autocomplete="off" />
            </el-form-item>

            <el-form-item label="Reason for Leave" :label-width="formLabelWidth" prop="request_content"><!--请假理由-->
                <el-input type="textarea" v-model="absentForm.request_content" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="onSubmitAbsent">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped></style>