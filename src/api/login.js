
//seifinspection模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const login = {
    // //获取学校等信息
    // getInformation() {
    //     return axios.get(base.base.login)
    // },
    // //获取和更新验证码
    // refreshCode() {
    //     return axios.get(base.base.login + '/captcha')
    // },
    // //验证码路径赋值
    // imgUrl(key) {
    //     return axios.get(base.base.login + '/captcha.png?key=' + key + '&_t=' + new Date().getTime())
    // },
    // //登录
    // inSign(parame) {
    //     return axios.post(base.base.login, parame)
    // }


        //获取学校等信息
        getInformation() {
            return axios({
                url:base.base.login,
                method:'get'
            })
        },
        //获取和更新验证码
        refreshCode() {
            return axios({
                url:base.base.login + '/captcha',
                method:'get'
            })
        },
        //验证码路径赋值
        imgUrl(key) {
            return axios.get(base.base.login + '/captcha.png?key=' + key + '&_t=' + new Date().getTime())
        },
        //登录
        inSign(data) {
            return axios({
                url:base.base.login,
                method:"post",
                data:data
            })
        }
}


export default login
