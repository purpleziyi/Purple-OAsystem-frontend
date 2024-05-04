<script setup>
import { ref, defineModel, defineProps, defineEmits } from "vue"

// 定义model：v-model  控制对话框是否显示
let dialogVisible = defineModel({ required: true });

// 定义属性 需要使用defineProps函数  属性是由外面传入的
let props = defineProps({
    title: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '500'
    }
})
// 定义事件 需要使用defineEmits
const emits = defineEmits(['cancel', 'submit'])


const onCancel = () => {
    dialogVisible.value = false;
    emits('cancel')   // 触发cancel事件
}
const onSubmit = () => {
    emits('submit');   // 触发submit事件
}

</script>

<template>
    <el-dialog v-model="dialogVisible" :title="props.title" :width="props.width">
        <slot></slot><!--留个插槽，以便定制化-->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onCancel">Cancel</el-button>
                <el-button type="primary" @click="onSubmit">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped></style>