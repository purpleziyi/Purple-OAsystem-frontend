import axios from "axios"
import { useAuthStore } from "@/stores/auth";

class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,  // 引入环境变量替代baseURL
            timeout: 6000
        });

        // 使用了 Axios 的请求拦截器，在发送请求前会检查当前用户的身份，如果存在 token，则在请求头中添加 JWT 认证
        this.instance.interceptors.request.use((config) => {
            const authStore = useAuthStore()
            const token = authStore.token
            if (token) {
                config.headers.Authorization = "JWT " + token
            }
            return config
        })
    }

    post(path, data) {
        // path: /auth/login
        // url: http://127.0.0.1:8000/auth/login
        // return this.instance.post(path, data)
        return new Promise(async (resolve, reject) => {
            // await：网络请求发送出去后，线程会挂起这个等待
            // 等网络数据到达后，线程又会回到当前位置开始往后执行
            // 如果在某个函数中使用了await，那么这个函数就必须要定义成async
            // axios底层也是用的Promise对象，在响应的状态码不是200时，就会调用reject
            // 调用reject的结果是，外层的函数会抛出异常
            try {
                let result = await this.instance.post(path, data)
                // 如果走到下面代码，说明上面await函数没有抛出异常，就肯定说明返回的状态码是200
                resolve(result.data);
            } catch (err) {
                // 走到catch中，就说明状态码肯定不是200
                try {
                    let detail = err.response.data.detail;
                    reject(detail)
                } catch {
                    reject('server error!')
                }

            }
        })
    }

    get(path, params) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.get(path, params)
                resolve(result.data)
            } catch (err) {
                let detail = err.response.data.detail;
                reject(detail)
            }
        })
    }

    put(path, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.put(path, data)
                resolve(result.data);
            } catch (err) {
                let detail = err.response.data.detail;
                reject(detail)
            }
        })
    }

    delete(path) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.delete(path)
                // 因为服务端的delete方法，只是返回一个状态码，并没有数据，所以直接把result返回回去就可以了
                resolve(result);
            } catch (err) {
                let detail = err.response.data.detail;
                reject(detail)
            }
        })
    }
}

export default new Http()