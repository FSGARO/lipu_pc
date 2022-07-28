
//addcontrol模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const addcontrol = {
    //获取所有指令
    getInstructions(off, cnt) {
        return axios.get(base.base.addcontrol + '?off=' + off + '&cnt=' + cnt)
    },
    //确定增加根指令、子指令
    trueInts(method, parameter) {
        return axios.post(base.base.addcontrol + '?method=' + method, parameter)
    },
    //确认修改子指令
    trueChildModify(cid, parameter) {
        return axios.put(base.base.addcontrol + '?cid=' + cid, parameter)
    },
    //启用、禁用根指令、确认修改根指令
    modifyInstructions(id, parameter) {
        return axios.put(base.base.addcontrol + '?id=' + id, parameter)
    },
    //常规和脚本模式切换
    intsChange() {
        return axios.get(base.base.addcontrol + '/script')
    },
    //删除指令
    deleteInts(id) {
        return axios.delete(base.base.addcontrol + '?id=' + id)
    },
    //删除子指令
    deleteChildInts(id) {
        return axios.delete(base.base.addcontrol + '?cid=' + id)
    },
    //模拟发送
    trueAnalog(id, attr) {
        return axios.post(base.base.addcontrol + '/test?id=' + id + '&attr=' + attr)
    },
    //模拟发送子指令
    postChild(id, parameter = 'null') {
        return axios.post(base.base.addcontrol + '/test?cid=' + id, parameter)
    },
    //查看脚本
    lookScript(id) {
        return axios.get(base.base.addcontrol + '/show_script?id=' + id)
    },
    //查看脚本(列表)
    checkScripts(id) {
        return axios.get(base.base.addcontrol + '/script?id=' + id)
    },
    //脚本列表
    scriptList(off, cnt) {
        return axios.get(base.base.addcontrol + '/script?off=' + off + '&cnt=' + cnt)
    },
    //删除脚本
    deleteJs(id) {
        return axios.delete(base.base.addcontrol + '/script?id=' + id)
    },
    //确认新增脚本
    trueNewjs(name, content, parameter) {
        let names = encodeURIComponent(name);
        return axios.post(base.base.addcontrol + '/script?name=' + names, content, parameter)
    },
    //确认修改脚本名称
    trueDialogModifyName(id, parameter) {
        return axios.put(base.base.addcontrol + '/script?id=' + id, parameter)
    },
    //确认修改脚本内容
    trueDialogModifyContent(id, content, parameter) {
        let contents = encodeURIComponent(content);
        return axios.put(base.base.addcontrol + '/script?id=' + id, contents, parameter)
    },
    //调试
    testSubmitForm(id, method, attr) {
        return axios.post(base.base.addcontrol + '/test?id=' + id + '&method=' + method + '&attr=' + attr)
    }
}


export default addcontrol
