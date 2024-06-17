<script setup name="stafflist">
import OAMain from '@/components/OAMain.vue';
import { ref, reactive, onMounted, watch } from "vue";
import timeFormatter from '@/utils/timeFormatter';
import staffHttp from '@/api/staffHttp';
import { ElMessage } from 'element-plus';
import OADialog from '@/components/OADialog.vue';
import { useAuthStore } from '@/stores/auth';


const authStore = useAuthStore()

let staffs = ref([])
let pagination = reactive({
    page: 1,
    total: 0
})
let page_size = ref(3)  //默认情况下显示1条
let dialogVisible = ref(false)  //默认情况下不显示“修改员工状态”的对话框
let staffForm = reactive({  // 员工状态的表单默认时是1，即active
    status: 1
})
let handleIndex = 0  // onEditStaff
let departments = ref([])
let filterForm = reactive({ //为员工列表过滤内容 初始值
    department_id: null,
    username: "",
    date_joined: []
})
let tableRef = ref()
const BASE_URL = import.meta.env.VITE_BASE_URL


async function fetchStaffList(page, page_size) {
    try {
        // 获取员工列表
        let data = await staffHttp.getStaffList(page, page_size, filterForm)
        pagination.total = data.count
        pagination.page = page
        staffs.value = data.results
    } catch (detail) {
        ElMessage.error(detail)
    }
}

onMounted(async () => {
    fetchStaffList(1, page_size.value)

    try {
        let data = await staffHttp.getAllDepartment()
        departments.value = data.results;
    } catch (detail) {
        ElMessage.error(detail)
    }
})

// watch用于监听，通过value参数监听到最新的page  
watch(() => pagination.page, async function (value) {
    fetchStaffList(value, page_size.value)
})

watch(page_size, function (value) {
    if (pagination.page == 1) {
        fetchStaffList(1, value)
    } else {
        pagination.page = 1  // 当pagination.page≠1时，令其为1，这样上一个watch函数就会监听到pagination.page为1了
    }
})

const onEditStaff = (index) => {
    handleIndex = index
    dialogVisible.value = true;
    let staff = staffs.value[index]
    staffForm.status = staff.status
}

const onSubmitEditStaff = async () => {
    let staff = staffs.value[handleIndex]
    try {
        let newstaff = await staffHttp.updateStaffStatus(staff.uid, staffForm.status)
        ElMessage.success("Employee status modified successfully!")
        dialogVisible.value = false;  // 隐藏对话框
        staffs.value.splice(handleIndex, 1, newstaff)  // 修改这个员工的值
    } catch (detail) {
        ElMessage.error(detail)
    }
}

const onSearch = () => {
    fetchStaffList(1, page_size.value)
}

const onDownload = async () => {
    let rows = tableRef.value.getSelectionRows()
    if (!rows || rows.length == 0) {
        ElMessage.info('Please select the employees to be exported first!')  // 请先选中要导出的员工！
        return;
    }
    try {
        let response = await staffHttp.downloadStaffs(rows.map(row => row.uid))
        // 借助a标签，将response数据，放到a标签的href属性上，然后模拟点击行为
        // 将返回的二进制数据，创建成一个url对象
        let href = URL.createObjectURL(response.data)
        // 创建a标签
        const a = document.createElement("a")
        a.href = href
        // 设置a标签的download属性，在点击的时候，就会执行下载操作
        a.setAttribute('download', 'Employee Information.xlsx')
        // 将a标签添加到网页结构中
        document.body.appendChild(a)
        // 模拟点击行为，只要点击了，那么浏览器就会启动下载操作（下载href属性指定的数据）
        a.click()

        // 只要执行了下载，a标签就没用了，就可以从网页中移除了
        document.body.removeChild(a)
        // 移除URL数据
        URL.revokeObjectURL(href)
    } catch (detail) {
        ElMessage.error(detail)
    }
}

const onUploadSuccess = () => {
    ElMessage.success("员工上传成功！")
    // 重新获取第一页的员工数据
    fetchStaffList(1, page_size.value)
}

const onUploadFail = (error) => {
    const detail = JSON.parse(error.message).detail  // 将Json字符串转化为detail
    ElMessage.error(detail)
}

</script>

<template>
    <OADialog title="Modify employee status" v-model="dialogVisible" @submit="onSubmitEditStaff"><!-- 修改员工状态 对话框-->
        <el-form :model="staffForm" label-width="100px">
            <el-form-item label="state"><!-- 状态 -->
                <el-radio-group v-model="staffForm.status" class="ml-4">
                    <el-radio :value="1">Active</el-radio><!-- 激活 -->
                    <el-radio :value="3">Locked</el-radio><!-- 锁定 -->
                </el-radio-group>
            </el-form-item>
        </el-form>
    </OADialog>
    <OAMain title="Employee List"><!-- 员工列表 -->
        <el-card>
            <el-form :inline="true" class="my-form-inline"><!-- inline使得内容排列为一行 "my-form-inline"格式见style-->
                <el-form-item label="By Department"><!-- 按部门  下拉框-->
                    <el-select v-model="filterForm.department_id">
                        <el-option v-for="department in departments" :label="department.name" :value="department.id"
                            :key="department.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="By Name"><!-- 按姓名 -->
                    <el-input v-model="filterForm.username" />
                </el-form-item>
                <el-form-item label="By Joining Time"><!-- 按入职时间 -->
                    <el-date-picker v-model="filterForm.date_joined" type="daterange" range-separator="To"
                        start-placeholder="Start date" end-placeholder="End date" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="onSearch"></el-button><!-- 搜索图标 -->
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" icon="Download" @click="onDownload">Download</el-button><!-- 下载 按钮-->
                </el-form-item>

                <el-form-item>
                    <el-upload :action="BASE_URL + '/staff/upload'"
                        :headers="{ Authorization: 'JWT ' + authStore.token }" :on-success="onUploadSuccess"
                        :on-error="onUploadFail" :show-file-list="false" :auto-upload="true" accept=".xlsx, .xls">
                        <el-button type="danger" icon="Upload">Upload</el-button><!-- 上传 按钮-->
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-table :data="staffs" ref="tableRef"><!-- 通过ref获取table对象 -->
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="NO." width="60"><!-- 序号 -->
                    <template #default="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="username" label="Name"></el-table-column><!-- 姓名 -->
                <el-table-column prop="email" label="Email"></el-table-column><!-- 邮箱 -->
                <el-table-column label="Joining Time"><!-- 入职时间 -->
                    <template #default="scope">
                        {{ timeFormatter.stringFromDate(scope.row.date_joined) }}
                    </template>
                </el-table-column>
                <el-table-column prop="department.name" label="Department"></el-table-column><!-- 部门 -->
                <el-table-column label="State"><!-- 状态 -->
                    <template #default="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">Active</el-tag><!-- 正常(激活) -->
                        <el-tag v-else-if="scope.row.status == 2" type="warning">Inactive</el-tag><!-- 未激活 -->
                        <el-tag v-else type="danger">Locked</el-tag><!-- 已锁定 -->
                    </template>
                </el-table-column>
                <el-table-column label="Operation"><!-- 操作 -->
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" circle @click="onEditStaff(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <template #footer> <!-- 分页 -->
                <div style="display: flex; justify-content: space-between;">
                    <el-form-item label="Page："> <!-- 每页 -->
                        <el-select v-model="page_size" size="small" style="width: 100px;">
                            <el-option select label="10 items" :value="1" />
                            <el-option label="20 items" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-pagination background layout="prev, pager, next" :total="pagination.total"
                        v-model:currentPage="pagination.page" :page-size="page_size" />
                </div>
            </template>
        </el-card>
    </OAMain>
</template>

<style scoped>
.my-form-inline .el-input {
    --el-input-width: 140px;
}

.my-form-inline .el-select {
    --el-select-width: 140px;
}

.el-form--inline .el-form-item {
    margin-right: 20px;
}
</style>