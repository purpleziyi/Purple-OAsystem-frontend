<script setup name="subabsent">
import OAPageHeader from "@/components/OAPageHeader.vue"
import absentHttp from "@/api/absentHttp";
import { ref, reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
import timeFormatter from "@/utils/timeFormatter";
import OAMain from "@/components/OAMain.vue"
import OAPagination from "@/components/OAPagination.vue"
import OADialog from "@/components/OADialog.vue";

let absents = ref([])

let pagination = reactive({
    total: 0,
    page: 1
})

let dialogVisible = ref(false)  // 与“处理考勤”绑定

let absentForm = reactive({
    status: 2,    // 默认是“Approved”
    response_content: ""
})

let rules = reactive({
    status: [{ required: true, message: 'Please select the processing result!', trigger: 'change' }],  // 用change事件来触发
    response_content: [{ required: true, message: 'Please enter the reason!', trigger: "blur" }]
})

let absentFormRef = ref()   // 通过这个获取Form表单对象（以便后续做校验）
let handleIndex = null   // 默认时处理的下标值

onMounted(async () => {
    try {
        let data = await absentHttp.getSubAbsents()
        pagination.total = data.count;   // 获取的数据的总数
        absents.value = data.results;   // result是下属发起的考勤信息
    } catch (detail) {
        ElMessage.error(detail)
    }
})

// 通过scope.$index传参
const onShowDialog = (index) => {
    absentForm.status = 2;
    absentForm.response_content = ""
    dialogVisible.value = true;   // 显示对话框
    handleIndex = index     // 此时将传入的index参数赋值给正在处理的下标值handleIndex
}

// 处理考勤的提交按钮
const onSubmitAbsent = () => {
    // 首先校验表单数据是否正确，该回调函数接受两个参数valid和fields
    absentFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            try {
                // 隐藏对话框
                dialogVisible.value = false;
                const absent = absents.value[handleIndex] //获取考勤信息，absents.value是数组，[handleIndex]是对应的考勤数据下标
                const data = await absentHttp.handleSubAbsent(absent.id, absentForm.status, absentForm.response_content)
                // console.log(data);
                absents.value.splice(handleIndex, 1, data) // 用splice方法，将handleIndes这个下标的元素删除，删除数目为1个，并将data元素替换到handleIndes这个下标的元素
                ElMessage.success('Processed successfully!'); // “下属考勤处理成功”
            } catch (detail) {
                ElMessage.error(detail)
            }
        }
    })
}

</script>

<template>
    <OADialog title="Process" v-model="dialogVisible" @submit="onSubmitAbsent"><!--处理考勤-->
        <el-form :model="absentForm" :rules="rules" ref="absentFormRef" label-width="100px">
            <el-form-item label="Result" prop="status"> <!--结果-->
                <el-radio-group v-model="absentForm.status" class="ml-4"><!--radio：单选框-->
                    <el-radio :value="2">Approved</el-radio><!--通过-->
                    <el-radio :value="3">Rejected</el-radio><!--拒绝-->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Reason" prop="response_content"><!--理由-->
                <el-input type="textarea" v-model="absentForm.response_content" autocomplete="off" />
            </el-form-item>
        </el-form>
    </OADialog>


    <OAMain title="Subordinate attendance"> <!--下属考勤-->
        <el-card>
            <el-table :data="absents"><!--absents是数组-->
                <el-table-column prop="title" label="Title" /> <!--标题-->
                <el-table-column prop="requester.username" label="Requester"><!--发起者 利用slot显示部门-->
                    <template #default="scope">
                        {{ '[' + scope.row.requester.department.name + ']' + scope.row.requester.username }}
                    </template>
                </el-table-column>
                <el-table-column prop="absent_type.name" label="Type" /><!--类型-->
                <el-table-column prop="request_content" label="Reason" /><!--原因-->
                <el-table-column label="Create Time"><!--发起时间-->
                    <template #default="scope">
                        {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="start_date" label="Start Date" /><!--开始时间-->
                <el-table-column prop="end_date" label="End Date" /><!--结束时间-->
                <el-table-column prop="responder.username" label="Approver" /> <!--审核人 -->
                <el-table-column prop="response_content" label="Feedback" /><!--反馈意见-->
                <el-table-column label="Status"><!--审核状态  利用slot和if判断，自定义scope来获取每个slot的数据-->
                    <template #default="scope">
                        <el-tag type="info" v-if="scope.row.status == 1">Reviewing</el-tag>
                        <el-tag type="success" v-else-if="scope.row.status == 2">Approved</el-tag>
                        <el-tag type="danger" v-else>Rejected</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Process"><!--处理-->
                    <template #default="scope">
                        <el-button v-if="scope.row.status == 1" @click="onShowDialog(scope.$index)" type="primary"
                            icon="EditPen" /> <!--scope.$index 通过传递用户点击的内容的下标 可以获取考勤的id，然后作为onShowDialog的参数-->
                        <el-button v-else disabled type="default">Processed</el-button><!--已处理-->
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <OAPagination v-model="pagination.page" :total="pagination.total"></OAPagination>
            </template>
        </el-card>
    </OAMain>

</template>

<style scoped></style>