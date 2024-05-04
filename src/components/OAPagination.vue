<script setup name="OAPagination">
import { defineModel, defineProps } from "vue"

let props = defineProps({
    total: {
        type: Number,
        default: 0
    },
    pageSize: {
        type: Number,
        default: 10
    }
})

let page = defineModel({ required: true })  // 必须要传递参数，之后赋值给v-model:current-page

</script>

<template>
    <el-pagination background layout="prev, pager, next" :total="props.total" :page-size="props.pageSize"
        v-model:current-page="page" />
</template>

<style scoped>
.el-pagination {
    justify-content: center;
    /*修改主线上的对齐方式*/
}
</style>