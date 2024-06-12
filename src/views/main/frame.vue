<script setup name="frame">
import { computed, ref, reactive } from "vue"
import {
    Expand,
    Fold
} from '@element-plus/icons-vue'
import { useAuthStore } from "@/stores/auth";    // user-info is stored in auth.js
import { useRouter } from "vue-router";
import authHttp from "@/api/authHttp";
import { ElMessage } from "element-plus";

const authStore = useAuthStore()
const router = useRouter()


let isCollapse = ref(false)
let dialogVisible = ref(false)

let resetPwdForm = reactive({
    oldpwd: '',
    pwd1: '',
    pwd2: ''
})

let formTag = ref()

// 表单校验规则
let rules = reactive({
    oldpwd: [
        { required: true, message: 'Please enter your old password!', trigger: 'blur' },
        { min: 6, max: 20, message: 'The password length needs to be between 6~20!', trigger: 'blur' },
    ],
    pwd1: [
        { required: true, message: 'Please enter a new password!', trigger: 'blur' },
        { min: 6, max: 20, message: 'The password length needs to be between 6~20!', trigger: 'blur' },
    ],
    pwd2: [
        { required: true, message: 'Please confirm your new password!', trigger: 'blur' },
        { min: 6, max: 20, message: 'The password length needs to be between 6~20!', trigger: 'blur' },
    ]
})

// 调节侧边栏展开与收缩
let asideWidth = computed(() => {
    if (isCollapse.value) {
        return "64px"
    } else {
        return "250px"
    }
})

const onCollapseAside = () => {
    isCollapse.value = !isCollapse.value
}

const onExit = () => {
    authStore.clearUserToken();       // 清除token
    router.push({ name: 'login' })     // 跳转到login界面
}

const onControlResetPwdDialog = () => {
    // 先清空之前输入的信息残余
    resetPwdForm.oldpwd = ""
    resetPwdForm.pwd1 = ""
    resetPwdForm.pwd2 = ""
    // 清空之后再让对话框显示出来
    dialogVisible.value = true;
}

const onSubmit = () => {
    // validate接受两个参数，一个是valid（是否可用），还有一个是field（字段）
    formTag.value.validate(async (valid, fields) => {
        if (valid) {   // 如果校验成功
            try {
                await authHttp.resetPwd(resetPwdForm.oldpwd, resetPwdForm.pwd1, resetPwdForm.pwd2)
                ElMessage.success("Password reset complete!")
                dialogVisible.value = false;  // hide the dialog-box after succesful modifying
            } catch (detail) {
                ElMessage.error(detail)
            }
        } else {
            ElMessage.info('Please fill in the password as required！')
        }
    })
}

</script>


<template>
    <el-container class="container">
        <el-aside class="aside" :width="asideWidth">
            <router-link to="/" class="brand">
                <el-typography :style="{ fontFamily: 'Arial', fontSize: '18px' }">
                    Purple <span v-show="!isCollapse">OA System</span>
                </el-typography>
            </router-link>
            <el-menu :router="true" active-text-color="#ffd04b" background-color="#AE6CC2" class="el-menu-vertical-demo"
                default-active="1" text-color="#fff" :collapse="isCollapse" :collapse-transition="false">
                <el-menu-item index="1">
                    <el-icon>
                        <HomeFilled />
                    </el-icon>
                    <span>
                        <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                            Home <!-- 主页 -->
                        </el-typography>
                    </span>
                </el-menu-item>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <Checked />
                        </el-icon>
                        <span>
                            <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                                Attendance <!-- 考勤管理 -->
                            </el-typography>
                        </span>
                    </template>
                    <el-menu-item index="2-1" :route="{ name: 'myabsent' }">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>Personal attendance</span> <!-- 个人考勤 -->
                    </el-menu-item>
                    <el-menu-item index="2-2" :route="{ name: 'subabsent' }">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>Subordinate attendance</span> <!-- 下属考勤 ？？-->
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon>
                            <BellFilled />
                        </el-icon>
                        <span>
                            <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                                Notification <!-- 通知管理 -->
                            </el-typography>
                        </span>
                    </template>
                    <el-menu-item index="3-1" :route="{ name: 'inform_publish' }"> <!-- 发布通知 -->
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>
                        <span>Post a Notice</span> <!-- 发布通知 -->
                    </el-menu-item>
                    <el-menu-item index="3-2" :route="{ name: 'inform_list' }"><!-- 通知列表 -->
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>Notification List</span> <!-- 通知列表 -->
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon>
                            <Avatar />
                        </el-icon>
                        <span>
                            <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                                Employee <!-- 员工管理 -->
                            </el-typography>
                        </span>
                    </template>
                    <el-menu-item index="4-1" :route="{ name: 'staff_add' }">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>
                        <span>Add Employees</span> <!-- 新增员工 -->
                    </el-menu-item>
                    <el-menu-item index="4-2" :route="{ name: 'staff_list' }">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>Employee List</span> <!-- 员工列表 -->
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header class="header">
                <div class="left-header"> <!-- 以下两个button都放在左边 -->
                    <el-button v-show="isCollapse" :icon="Expand" @click="onCollapseAside" />
                    <el-button v-show="!isCollapse" :icon="Fold" @click="onCollapseAside" />
                </div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <el-avatar :size="30" icon="UserFilled" />
                        <span style="margin-left: 10px;">
                            <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                                [{{ authStore.user.department.name }}]{{ authStore.user.username }} <!-- 用户名展示区 -->
                            </el-typography>
                        </span>
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="onControlResetPwdDialog">Change Password</el-dropdown-item>
                            <!-- 改密码 -->
                            <el-dropdown-item divided @click="onExit">Logout</el-dropdown-item> <!-- 退出登录 -->
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main class="main">
                <RouterView>
                </RouterView>
            </el-main>
        </el-container>
    </el-container>

    <el-dialog v-model="dialogVisible" title="Modify Password" width="500"> <!--修改密码-->
        <el-form :model="resetPwdForm" :rules="rules" ref="formTag">
            <el-form-item label="Old Password" :label-width="formLabelWidth" prop="oldpwd"> <!--旧密码-->
                <el-input v-model="resetPwdForm.oldpwd" autocomplete="off" type="password" />
            </el-form-item>

            <el-form-item label="New Password" :label-width="formLabelWidth" prop="pwd1"> <!--新密码-->
                <el-input v-model="resetPwdForm.pwd1" autocomplete="off" type="password" />
            </el-form-item>

            <el-form-item label="Confirm Password" :label-width="formLabelWidth" prop="pwd2"> <!--确认密码-->
                <el-input v-model="resetPwdForm.pwd2" autocomplete="off" type="password" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="onSubmit">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>



<style scoped>
.container {
    height: 100vh;
    background-color: #f4f6f9;
}

.aside {
    background-color: #AE6CC2;
    box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22) !important;
}

.aside .brand {
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid #9D3EB6;
    background-color: #921FB0;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}

.header {
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    /* header采用灵活的布局*/
    justify-content: space-between;
    /* header中的子元素靠左右两边对齐*/
    align-items: center;
}

.el-dropdown-link {
    display: flex;
    align-items: center;
}

.el-menu {
    border-right: none;
}
</style>