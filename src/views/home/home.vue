<script setup name="home">
import { ref, reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
import timeFormatter from "@/utils/timeFormatter";
import OAMain from "@/components/OAMain.vue"
import homeHttp from "@/api/homeHttp";
import * as echarts from 'echarts';

let informs = ref([])
let absents = ref([])

onMounted(async () => {
    try {
        informs.value = await homeHttp.getLatestInforms()
        absents.value = await homeHttp.getLatestAbsents()

        let rows = await homeHttp.getDepartmentStaffCount()
        console.log(rows);
        let xdatas = []
        let ydatas = []
        for (let row of rows) {
            xdatas.push(row.name)
            ydatas.push(row.staff_count)
        }

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('department-staff-count'));
        // 绘制图表
        myChart.setOption({
            tooltip: {},
            xAxis: {
                data: xdatas
            },
            yAxis: {},
            series: [
                {
                    name: 'Number of Employees',
                    type: 'bar',
                    data: ydatas
                }
            ]
        });
    } catch (detail) {
        ElMessage.error(detail)
    }


})

</script>

<template>
    <OAMain title="Home"><!-- 首页-->
        <el-card>
            <template #header>
                <h2>Number of employees in the department</h2><!-- 部门员工数量-->
            </template>
            <div id="department-staff-count" style="width: 100%;height:300px;"></div>
        </el-card>

        <el-row :gutter="20">
            <el-col :span="12"><!-- 将一行分为12列-->
                <el-card>
                    <template #header>
                        <h2>Latest notification</h2><!-- 最新通知-->
                    </template>
                    <el-table :data="informs">
                        <el-table-column label="Title"><!-- 标题-->
                            <template #default="scope">
                                <router-link :to="{ name: 'inform_detail', params: { pk: scope.row.id } }">{{
                                    scope.row.title
                                }}</router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="Publisher" prop="author.username"></el-table-column><!-- 发布者-->
                        <el-table-column label="Release time"><!-- 发布时间-->
                            <template #default="scope">
                                {{ timeFormatter.stringFromDate(scope.row.create_time) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Read or not"><!-- 是否已读-->
                            <template #default="scope">
                                <el-tag v-if="scope.row.reads.length > 0">Read</el-tag><!--当长度>0时 已读-->
                                <el-tag v-else type="danger">Unread</el-tag><!-- 未读-->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <h2>Latest leave</h2> <!-- 最新请假-->
                    </template>
                    <el-table :data="absents">
                        <el-table-column label="department"
                            prop="requester.department.name"></el-table-column><!-- 部门-->
                        <el-table-column label="Publisher" prop="requester.username"></el-table-column><!-- 发起人-->
                        <el-table-column label="start date" prop="start_date"></el-table-column><!-- 起始日期-->
                        <el-table-column label="end date" prop="end_date"></el-table-column><!-- 结束日期-->
                        <el-table-column label="publish time"><!-- 发起时间-->
                            <template #default="scope">
                                {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </OAMain>
</template>

<style scoped></style>