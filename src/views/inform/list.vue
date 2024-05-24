<script setup name="informlist">
import { ref, reactive, onMounted } from "vue"
import OAMain from "@/components/OAMain.vue";
import OADialog from "@/components/OADialog.vue";
import OAPagination from "@/components/OAPagination.vue";
import timeFormatter from "@/utils/timeFormatter"
import { useAuthStore } from "@/stores/auth";
import informHttp from "@/api/informHttp";
import { ElMessage } from "element-plus";

let informs = ref([])  // 空数组informs
const authStore = useAuthStore()

let pagination = reactive({
    page: 1,
    total: 0
})

let dialogVisible = ref(false)
let handleIndex = 0

onMounted(async () => {
    try {
        let data = await informHttp.getInformList(1)
        // data = {count: 10, next: , previous: , results: []}
        pagination.total = data.count
        informs.value = data.results
        console.log(data.results);
    } catch (detail) {
        ElMessage.error(detail)
    }
})

const onShowDialog = (index) => {
    handleIndex = index
    dialogVisible.value = true;
}

const onDeleteInform = async () => {
    try {
        let inform = informs.value[handleIndex]
        await informHttp.deleteInform(inform.id)  // 通过id来删除通知
        informs.value.splice(handleIndex, 1)   // 从索引为 handleIndex 的位置开始删除1个元素
        dialogVisible.value = false;   // 删除成功后需要隐藏对话框
        ElMessage.success("Notification deleted successfully!")
    } catch (detail) {
        ElMessage.error(detail)
    }
}



</script>

<template>
    <OADialog v-model="dialogVisible" title="Notice" @submit="onDeleteInform"> <!--提示-->
        <span>Are you sure you want to delete this notification?</span> <!--你确定要删除这个通知？-->
    </OADialog>
    <OAMain title="Notification list"> <!--通知列表-->
        <el-card>
            <el-table :data="informs"><!--informs是数组-->
                <el-table-column label="Title"> <!--标题-->
                    <template #default="scope">

                        <!--Unread notifications have a little red dot -->
                        <el-badge v-if="scope.row.reads.length == 0" is-dot class="item">
                            <RouterLink :to="{ name: 'inform_detail', params: { pk: scope.row.id } }">{{ scope.row.title
                                }}</RouterLink>
                        </el-badge>
                        <RouterLink v-else :to="{ name: 'inform_detail', params: { pk: scope.row.id } }">{{
                            scope.row.title }}</RouterLink> <!--如果通知已读则正常显示链接-->
                    </template>
                </el-table-column>
                <el-table-column label="Publisher"><!--发布者 -->
                    <template #default="scope">
                        {{ '[' + scope.row.author.department.name + ']' + scope.row.author.username }}
                    </template>
                </el-table-column>

                <el-table-column label="Publish Time"><!--发布时间-->
                    <template #default="scope">
                        {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
                    </template>
                </el-table-column>

                <el-table-column label="Department visible"><!--部门可见 -->
                    <template #default="scope"> <!--定义一个默认插槽slot-->
                        <el-tag v-if="scope.row.public" type="success">Public</el-tag> <!--公开-->
                        <el-tag v-else v-for="department in scope.row.departments" :key="department.name" type="info">{{
                            department.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Operation"> <!--操作-->
                    <template #default="scope">
                        <el-button v-if="scope.row.author.uid == authStore.user.uid" @click="onShowDialog(scope.$index)"
                            type="danger" icon="Delete" />
                        <el-button v-else disabled type="default">Null</el-button><!--无-->
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <OAPagination v-model="pagination.page" :total="pagination.total"></OAPagination>
            </template>
        </el-card>

    </OAMain>

</template>


<style scoped>
.el-badge {
    margin-right: 4px;
    margin-top: 4px;
}
</style>