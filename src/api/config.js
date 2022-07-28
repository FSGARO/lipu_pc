
//config模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const config = {
    //获取url信息列表
    getLink(off, cnt) {
        return axios.get(base.base.config + '/link' + '?off=' + off + '&cnt=' + cnt)
    },
    //增加url
    newLink(name, url, icon, color) {
        let names = encodeURIComponent(name);//中文转码
        // let urls = btoa(url);
        let urls = encodeURIComponent(url);
        let icons = encodeURIComponent(icon);
        let colors = encodeURIComponent(color);
        return axios.post(base.base.config + '/link' + '?name=' + names + '&url=' + urls + '&icon=' + icons + '&bgcolor=' + colors)
    },
    //删除url
    deleteUrl(id) {
        return axios.delete(base.base.config + '/link' + '?id=' + id)
    }
}


export default config
