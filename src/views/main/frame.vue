<script setup name="frame">
import {computed, ref} from "vue"
import {
    Expand,
    Fold
} from '@element-plus/icons-vue'

let isCollapse = ref(false)

// 调节侧边栏展开与收缩
let asideWidth = computed(() => {
    if(isCollapse.value){
        return "64px"
    }else{
        return "250px"
    }
})

const onCollapseAside = () =>{
    isCollapse.value = !isCollapse.value
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
                            Home               <!-- 主页 -->
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
                                Attendance                 <!-- 考勤管理 -->
                            </el-typography>
                        </span>  
                    </template>
                    <el-menu-item index="2-1" :route="{name: 'myabsent'}">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>Personal attendance</span>                  <!-- 个人考勤 -->
                    </el-menu-item>
                    <el-menu-item index="2-2" :route="{name: 'subabsent'}">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>Subordinate attendance</span>              <!-- 下属考勤 ？？-->
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon>
                            <BellFilled />
                        </el-icon>
                        <span>
                            <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                                Notification                <!-- 通知管理 -->
                            </el-typography>
                        </span>                         
                    </template>
                    <el-menu-item index="3-1">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>
                        <span>Post a Notice</span>              <!-- 发布通知 -->
                    </el-menu-item>
                    <el-menu-item index="3-2">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>Notification List</span>           <!-- 通知列表 -->
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon>
                            <Avatar />
                        </el-icon>
                        <span>
                            <el-typography :style="{ fontFamily: 'Arial', fontSize: '15px' }">
                                Employee                <!-- 员工管理 -->
                            </el-typography>
                        </span>                          
                    </template>
                    <el-menu-item index="4-1">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>
                        <span>Add Notification</span>              <!-- 新增通知 -->
                    </el-menu-item>
                    <el-menu-item index="4-2">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>Employee List</span>            <!-- 员工列表 -->
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>            
        </el-aside>

        <el-container>
            <el-header class="header">
                <div class="left-header">       <!-- 以下两个button都放在左边 -->
                    <el-button v-show="isCollapse" :icon="Expand" @click="onCollapseAside" />
                    <el-button v-show="!isCollapse" :icon="Fold" @click="onCollapseAside" />
                </div>
                <el-dropdown> 
                    <span class="el-dropdown-link"> 
                        <el-avatar :size="30" icon="UserFilled" />
                        <span style="margin-left: 10px;">PurpleZiyi</span>
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                        <el-dropdown-item>Change Password</el-dropdown-item>
                        <el-dropdown-item>Logout</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main class="main">Main</el-main>
        </el-container>
    </el-container>
</template>



<style scoped> 
.container {
    height: 100vh;
    background-color: #f4f6f9;
}

.aside{
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
    display: flex;                     /* header采用灵活的布局*/
    justify-content: space-between;     /* header中的子元素靠左右两边对齐*/
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