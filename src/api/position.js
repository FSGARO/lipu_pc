
//position模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const position = {
    //位置列表
    listLocation() {
        return axios.get(base.base.position)
    },
    //保存学校名称、确定修改教室
    preservationSchoolName(id, params) {
        return axios.put(base.base.position + '?id=' + id, params)
    },
    //确认新增区域名称、确认修改区域名称
    trueRegion(name) {
        let names = encodeURIComponent(name);
        return axios.post(base.base.position + '?name=' + names)
    },
    //删除区域
    deleteRegion(id) {
        return axios.delete(base.base.position + '?id=' + id)
    },
    //确认增加楼栋
    trueBuildingModify(name, pid) {
        let names = encodeURIComponent(name);
        return axios.post(base.base.position + '?name=' + names + '&pid=' + pid)
    },
    //添加位置/教室
    addLocation(name, pid, classroom, comment) {
        let names = encodeURIComponent(name);
        let classrooms = encodeURIComponent(classroom);
        let comments = encodeURIComponent(comment);
        return axios.post(base.base.position + '?name=' + names + '&pid=' + pid + '&classroom=' + classrooms +'&comment=' + comments)
    },
    //修改备注、区域
    putComment(id, param) {
        return axios.put(base.base.position+'?id=' + id, param)
    }

}


export default position
