<script setup name="staffadd">
import { ref, reactive } from 'vue';
import staffHttp from '@/api/staffHttp';
import { useRouter } from 'vue-router';
import OAMain from "@/components/OAMain.vue"
import { useAuthStore } from "@/stores/auth"
import { ElMessage } from 'element-plus';


const router = useRouter();
const authStore = useAuthStore()

// Only the leader of the department can add employees to the department 只有部门的leader可以给本部门新增员工
let staffForm = reactive({
    email: "",
    password: "",
    username: "",
});
const formRef = ref()   //获取表单对象
let rules = reactive({   // 表单验证
    email: [{ required: true, message: "please enter your email!", trigger: 'blur' }],
    password: [{ required: true, message: "Please enter your password!", trigger: 'blur' }],
    username: [{ required: true, message: "please enter username!", trigger: 'blur' }],
})

const onSubmit = () => {
    formRef.value.validate(async (valid, fields) => {
        if (valid) {
            try {
                await staffHttp.addStaff(staffForm.username, staffForm.email, staffForm.password)
                ElMessage.success('Employee added successfully!')  // 员工添加成功
                router.push({ name: 'staff_list' })
            } catch (detail) {
                ElMessage.error(detail)
            }
        }
    })
}

</script>

<template>
    <OAMain title="Add Employees"> <!-- 新增员工 -->
        <el-card shadow="always">
            <el-form :rules="rules" :model="staffForm" ref="formRef" label-width="80px">
                <el-form-item label="Username" prop="username"><!-- 姓名（此处我改为用户名），prop用于获取校验规则-->
                    <el-input v-model="staffForm.username" placeholder="Please type in your username"><!-- 请输入姓名 -->
                    </el-input>
                </el-form-item>

                <el-form-item label="Email" prop="email"><!-- 邮箱 -->
                    <el-input v-model="staffForm.email" placeholder="please input your email"> </el-input>
                </el-form-item>

                <el-form-item label="Password" prop="password"><!-- 密码 -->
                    <el-input v-model="staffForm.password" placeholder="Please enter password" type="password">
                    </el-input>
                </el-form-item>

                <el-form-item label="Department"><!-- 部门 -->
                    <el-input readonly disabled placeholder="Please enter department"
                        :value="authStore.user.department.name">
                    </el-input>
                </el-form-item>

                <el-form-item label="Leader"><!-- 领导 只有leader才能来到这个“Add Employees”页面-->
                    <el-input readonly disabled
                        :placeholder="'[' + authStore.user.email + ']' + authStore.user.username">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit"> Submit </el-button><!-- 提交 -->
                </el-form-item>
            </el-form>
        </el-card>
    </OAMain>
</template>

<style scoped></style>