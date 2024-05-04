<script setup name="myabsent">
import OAPageHeader from "@/components/OAPageHeader.vue"
import absentHttp from "@/api/absentHttp";
import { ref, reactive, onMounted, computed, watch } from "vue"
import { ElMessage } from "element-plus"
import timeFormatter from "@/utils/timeFormatter";
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

let absentFormRef = ref()  //获取表单对象

const onSubmitAbsent = () => {
    absentFormRef.value.validate(async (valid, fields) => {
        if (valid) {    // 如果验证成功，则后端需要的一些数据需要体现出来
            let data = {
                title: absentForm.title,
                absent_type_id: absentForm.absent_type_id,
                start_date: absentForm.date_range[0],
                end_date: absentForm.date_range[1],
                request_content: absentForm.request_content
            }
            // console.log(data);
            try {
                let absent = await absentHttp.applyAbsent(data)  // 调用申请请假的API
                dialogFormVisible.value = false;   // 成功后隐藏对话框(细节)
                // console.log(absent);
                absents.value.unshift(absent)
                // 发起考勤成功后，做一个提示
                ElMessage.success('Leave application successfully sent!');
            } catch (detail) {
                ElMessage.error(detail)
            }
        }
    })
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
        // requestAbsents(1)
        let absents_data = await absentHttp.getMyAbsents()
        let total = absents_data.count;
        let results = absents_data.results;
        absents.value = results;
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

        <el-card>
            <el-table :data="absents"><!--absents是数组-->
                <el-table-column prop="title" label="Title" /> <!--标题-->
                <el-table-column prop="absent_type.name" label="Type" /><!--类型-->
                <el-table-column prop="request_content" label="Reason" /><!--原因-->
                <el-table-column label="Create Time"><!--发起时间-->
                    <template #default="scope">
                        {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="start_date" label="Start Date" />
                <el-table-column prop="end_date" label="End Date" />
                <el-table-column label="Approver"> <!--审核领导  利用slot-->
                    {{ responder_str }}
                </el-table-column>
                <el-table-column prop="response_content" label="Feedback" /><!--反馈意见-->
                <el-table-column label="Status"><!--审核状态  利用slot和if判断，自定义scope来获取每个slot的数据-->
                    <template #default="scope">
                        <el-tag type="info" v-if="scope.row.status == 1">Reviewing</el-tag>
                        <el-tag type="success" v-else-if="scope.row.status == 2">Approved</el-tag>
                        <el-tag type="danger" v-else>Rejected</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <template #footer>
                <OAPagination v-model="pagination.page" :total="pagination.total"></OAPagination>
            </template> -->
        </el-card>
    </el-space>

    <el-dialog v-model="dialogFormVisible" title="Request for Leave" width="500"> <!--发起请假-->
        <el-form :model="absentForm" :rules="rules" ref="absentFormRef">
            <el-form-item label="Title" :label-width="formLabelWidth" prop="title">
                <el-input v-model="absentForm.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Absent Type" :label-width="formLabelWidth" prop="absent_type_id">
                <!--请假类型-->
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