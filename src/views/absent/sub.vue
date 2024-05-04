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
</script>

<template>
    <OAMain title="Subordinate attendance"> <!--下属考勤-->

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
                <el-table-column label="Process">
                    <template #default="scope">
                        <el-button v-if="scope.row.status == 1" type="primary" icon="EditPen" />
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