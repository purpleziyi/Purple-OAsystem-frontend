<script setup name="OAPageHeader">
import { useRouter } from "vue-router"
import { defineProps } from "vue"

const router = useRouter()

const goBack = () => {
    router.go(-1)
}

let props = defineProps({
    content: ""
})


</script>

<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">
                <el-typography :style="{ fontFamily: 'Arial', fontSize: '17px' }">
                    {{ props.content }}
                </el-typography>
            </span>
        </template>
    </el-page-header>
</template>

<style scoped></style>