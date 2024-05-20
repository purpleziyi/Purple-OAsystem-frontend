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

}


</script>

<template>
    <OAMain title="Notification list"> <!--通知列表-->
        <el-card>
            <el-table :data="informs"><!--informs是数组-->
                <el-table-column label="Title"> <!--标题-->
                    <template #default="scope">

                        <RouterLink :to="{ name: 'inform_detail', params: { pk: scope.row.id } }">{{ scope.row.title
                            }}</RouterLink>

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