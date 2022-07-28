
//newctask模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const newctask = {
    //修改物联任务
    taskModify(id, method, params) {
        return axios.put(base.base.controltask + '?id=' + id + '&method=' + method, params)
    },
    //新建物联任务或媒体任务
    taskNew(method, params) {
        return axios.post(base.base.controltask + '?method=' + method, params)
    }

}


export default newctask
