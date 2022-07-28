import axios from './http'
import base from './base'

const cardlist = {
	//获取卡列表
	getCardList(off, cnt, id, keyword) {
		let keywords = encodeURIComponent(keyword)
		return axios.get(base.base.cardlist + '?off=' + off + '&cnt=' + cnt + '&id=' + id + '&keyword=' + keywords)
	},
	//缓存列表
	getCache(areaid, off, cnt) {
		areaid = areaid > 0 ? areaid : 0
		return axios.get(base.base.cardlist + '/cache' + '?areaid=' + areaid + '&off=' + off + '&cnt=' + cnt)
	},
	//设备状态
	getEquipmentState(areaid) {
		areaid = areaid > 0 ? areaid : 0
		return axios.get(base.base.cardlist + '/status' + '?areaid=' + areaid)
	},
	//增加卡
	trueAddCard(params) {
		return axios.post(base.base.cardlist, params)
	},
	//修改卡号及异步操作
	operationCard(method, params) {
		if (params.areaid < 0) params.areaid = 0
		return axios.put(base.base.cardlist + '/action' + '?method=' + method, params)
	},
	//停止执行任务
	trueStopCard(areaid) {
		areaid = areaid > 0 ? areaid : 0
		return axios.delete(base.base.cardlist + '/status' + '?areaid=' + areaid)
	},
	//删除卡号
	deleteCard(id) {
		return axios.delete(base.base.cardlist + '?id=' + id)
	}
}

export default cardlist
