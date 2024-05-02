import http from "./http"


const login = (email, password) => {
    const path = '/auth/login'
    return http.post(path, { email, password }) // http中的data是一个object，所以需要把{email, password}包装成对象 
}

const resetPwd = (oldpwd, pwd1, pwd2) => {
    const path = "/auth/resetpwd"
    return http.post(path, { oldpwd, pwd1, pwd2 })
}


export default {
    login,
    resetPwd
}    // export in form of object