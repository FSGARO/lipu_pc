/*
 * @Description:
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-11-23 14:12:35
 * @FilePath: \fang_lipt\src\api\terminal.js
 * El Psy Congroo
 */

//terminal模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const terminal = {
	//设备信息列表
	getDeviceList(off, cnt, keyword = '', id = '') {
		let keywords = encodeURIComponent(keyword) //中文转码
		return axios.get(
			base.base.terminal +
				'?off=' +
				off +
				'&cnt=' +
				cnt +
				'&keyword=' +
				keywords +
				'&gid=' +
				id
		)
	},
	//删除设备
	deleteEquipment(id) {
		return axios.delete(base.base.terminal + '?id=' + id)
	},
	// 修改设备信息
	changeState(id, method, param = {}) {
		return axios.post(
			base.base.terminal + '?id=' + id + '&method=' + method,
			param
		)
	},
	//获取设备状态
	getState(id, timeout = 0) {
		return axios.get(
			base.base.terminal + '/status?id=' + id + '&timeout=' + timeout
		)
	},
	//各种功能开关请求
	changeMainpower(id, method, attr, param = '') {
		return axios.post(
			base.base.terminal +
				'/control?id=' +
				id +
				'&method=' +
				method +
				'&attr=' +
				attr,
			param
		)
	},
	//设备信息状态列表
	getMethodState() {
		return axios.get(base.base.terminal + '/control/web')
	},
	//修改或增加设备方法
	postMethod(id, param) {
		return axios.post(base.base.terminal + '/control/web?id=' + id, param)
	},
	//删除设备状态方法
	deleteMethod(id) {
		return axios.delete(base.base.terminal + '/control/web?id=' + id)
	},
	// 获取现在模块状态值
	getShowModule(id) {
		return axios.get(base.base.getShowModule + '/status?id=' + id)
	}
}

export default terminal
