
//operation模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const operation = {
    //获取设备状态
    getState() {
        return axios.get(base.base.position)
    },
    //查找id名下的所有位置
    getPositiongid(gid) {
        return axios.get(base.base.position + '?gid=' + gid)
    },
    //解绑、解绑
    fixedDevice(id, method, parameter) {
        return axios.post(base.base.terminal + '?id=' + id + '&method=' + method, parameter)
    }
}


export default operation
