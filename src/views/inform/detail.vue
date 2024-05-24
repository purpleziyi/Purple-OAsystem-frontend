<script setup name="informdetail">
import informHttp from "@/api/informHttp";
import { ref, reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
import timeFormatter from "@/utils/timeFormatter";
import OAMain from "@/components/OAMain.vue"
import OAPagination from "@/components/OAPagination.vue"
import OADialog from "@/components/OADialog.vue";
import { useRoute } from "vue-router";

const route = useRoute()   // 从路由对象导入通知的pk值

// 初始化inform对象 以备onMounted使用
let inform = reactive({
    title: "",
    content: "",
    create_time: "",
    author: {
        realname: "",
        department: {
            name: ""
        }
    }
})

// 用onMounted生命周期方法来获取notification details
onMounted(async () => {
    const pk = route.params.pk
    try {
        let data = await informHttp.getInformDetail(pk)  // data就是inform对象
        Object.assign(inform, data)  // 由于inform是reactive对象，所以将data中的值赋给inform时需要使用Object.assign
    } catch (detail) {
        ElMessage.error(detail)
    }

    // 发送阅读请求  如果发生异常也只限于浏览器的控制台，用户的界面是看不到，所以不放在try中也可以
    await informHttp.readInform(pk)
})

</script>

<template>
    <OAMain title="Notification details"> <!--通知详情-->
        <el-card>
            <template #header> <!--header slot-->
                <div style="text-align: center;">
                    <h2 style="padding-bottom: 20px;">{{ inform.title }}</h2> <!--h2标题展示title-->
                    <div>
                        <span style="margin-right: 20px;">Author：{{ inform.author.username }}</span> <!--作者-->
                        <span>Publish time：{{
                            timeFormatter.stringFromDateTime(inform.create_time) }}</span><!--发布时间 格式化日期-->
                    </div>
                </div>
            </template>
            <template #default> <!--内容部分 使用slot-->
                <div v-html="inform.content" class="content"></div> <!--由于内容部分是富文本，所以直接写{{inform.content}}是不会被解析出来的-->
            </template>
            <template #footer>Views：{{ inform.read_count }}</template><!--阅读量-->
        </el-card>
    </OAMain>

</template>



<style scoped>
.content :deep(img) {
    max-width: 100%;
}
</style>