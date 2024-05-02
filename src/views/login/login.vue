<script setup name="login">
import login_img from "@/assets/image/login.png"
import {reactive} from "vue"
import {useAuthStore} from "@/stores/auth"
import {useRouter} from "vue-router"
import authHttp from "@/api/authHttp"
import {ElMessage} from "element-plus"

const authStore = useAuthStore()
const router = useRouter()  // 用于路由跳转，不是route是router

let form = reactive({
    email: '',
    password: ''
})

const onSubmit = async () => {
    let pwdRgx = /^[0-9a-zA-Z_-]{6,20}/
    let emailRgx = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9])+/
    if(!(emailRgx.test(form.email))){
        // alert('E-mail format is incorrect!')
        ElMessage.info('E-mail format is incorrect!！')
        return;
    }
    if(!(pwdRgx.test(form.password))){
        // alert('The password format is incorrect!')
        ElMessage.info("The password format is incorrect!")
        return;
    }

    // axios
    // 1. 第一版：直接使用axios
    // axios.post("http://127.0.0.1:8000/auth/login", {
    //     email: form.email,
    //     password: form.password
    // }).then((res) => {
    //     // then：代表是成功的情况（在这里，代表返回的状态码是200）
    //     let data = res.data;
    //     let token = data.token;
    //     let user = data.user;
    //     authStore.setUserToken(user, token);
    //     // 跳转到OA系统的首页
    //     router.push({name: "frame"})
    // }).catch((err) => {
    //     // catch：代表失败的情况（在这里，代表返回的状态码是非200）
    //     let detail = err.response.data.detail;
    //     alert(detail);
    // })
        // 2. 第二个版本：对axios进行了一层封装
    // authHttp.login(form.email, form.password).then(res => {
    //     let data = res.data;
    //     let token = data.token;
    //     let user = data.user;
    //     authStore.setUserToken(user, token);
    //     // 跳转到OA系统的首页
    //     router.push({name: "frame"})
    // }).catch((err) => {
    //     // catch：代表失败的情况（在这里，代表返回的状态码是非200）
    //     let detail = err.response.data.detail;
    //     alert(detail);
    // })

        // 3. 第三个版本：改成了异步调用的方式
    try{
        let data = await authHttp.login(form.email, form.password)
        console.log('data:', data);
        let token = data.token;
        let user = data.user;
        authStore.setUserToken(user, token);
        // 跳转到OA系统的首页
        router.push({name: "frame"})
    }catch(detail){
        // alert(detail)
        ElMessage.error(detail)
    }

}
 
</script>


<template>
    <div class="dowebok">
        <div class="container-login100">
            <div class="wrap-login100">
                <div class="login100-pic js-tilt" data-tilt>
                    <img :src="login_img" alt="IMG" />
                </div>

                <div class="login100-form validate-form">
                    <span class="login100-form-title">
                        <el-typography :style="{ fontFamily: 'Arial', fontSize: '25px' }">
                                <strong>Staff Login</strong>              
                        </el-typography> 
                    </span>

                    <div class="wrap-input100 validate-input">
                        <input class="input100" type="text" name="email" placeholder="email" v-model="form.email" /> 
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
                            <i class="iconfont icon-fa-envelope" aria-hidden="true"></i>
                        </span>
                    </div>

                    <div class="wrap-input100 validate-input">
                        <input class="input100" type="password" name="password" placeholder="password"  v-model="form.password" />
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
                            <i class="iconfont icon-fa-lock" aria-hidden="true"></i>
                        </span>
                    </div>

                    <div class="container-login100-form-btn">
                        <button class="login100-form-btn" @click="onSubmit">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  
</template>



<style scoped src="@/assets/css/login.css"></style>
<style scoped src="@/assets/iconfont/iconfont.css"></style>