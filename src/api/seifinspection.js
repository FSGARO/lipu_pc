

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const seifinspection ={
	//马上自检
	checkNow (){
        return axios.put(`${base.base.seifinspection}`, null)
    },
	//确定定时自检
	tureTimingSelfTest(method, clock) {
		return axios.post(`${base.base.seifinspection}`,{
			method: method,
			clock: clock
		})
	},
	//自检消息列表
	allMessageList(off, cnt) {
		return axios.get(base.base.noticeseifinspece+'?off='+off+'&cnt='+cnt)
	},
	//未读消息列表
	unreadMessageList(off, cnt) {
		return axios.get(base.base.noticeseifinspece+'?unread=true&off='+off+'&cnt='+cnt)
	},
	//全部标为已读
	allRead() {
		return axios.put(base.base.noticeseifinspece+'?method=readed')
	},
	//删除消息
	deleteMessage(id) {
		return axios.delete(base.base.noticeseifinspece+'?id='+id)
	},
	//阅读消息
	readingMessage(id) {
		return axios.get(base.base.noticeseifinspece+'?id='+id)
	},
	//等待更新信息
	waitMessage() {
		return axios.get(base.base.noticeseifinspece+'/wait')
	}
}


export default seifinspection
