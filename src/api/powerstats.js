
//powerstats模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const powerstats = {
    //设备信息列表
    energyList(areaid, month) {
        return axios.get(base.base.powerstats + '?areaid=' + areaid + '&month=' + month)
    },
    //设备统计
    energyChart(id, mode, month) {
        return axios.get(base.base.powerstats + '?id=' + id + '&mode=' + mode + '&month=' + month)
    }

}


export default powerstats
