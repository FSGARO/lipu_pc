
//封装axios
//import 'babel-polyfill' //浏览器兼容
import axios from 'axios' //引入axios
import router from '@/router'

//axios.defaults.timeout = 15000  //请求超时时间15秒

//创建axios实例
var instance = axios.create({timeout: 1000 * 15})


//instance.defaults.baseURL = 'http://192.168.0.87:20080' //开发时用 192.168.0.133 ; 192.168.0.87
//instance.defaults.baseURL = ''  //打包上线时候用
instance.defaults.baseURL = process.env.VUE_APP_BASE_API

// 设置post请求头
//instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
instance.interceptors.request.use(
    config => {
        if (window.localStorage.getItem('token')) {  //添加自带http token请求
            config.headers['S-C-Project-Session'] = window.localStorage.getItem('token')
        }
        return config
    },
    err => {
        return Promise.reject(err)
    })

// 响应拦截器
instance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                console.log('401错误!')
                localStorage.clear() // 返回 401 清除token信息并跳转到登录页面
                router.replace({
                    path: 'login',
                    query: {redirect: router.currentRoute.fullPath}
                })
            }
        }
        return Promise.reject(error.response)   // 返回接口返回的错误信息
    }
)


export default instance