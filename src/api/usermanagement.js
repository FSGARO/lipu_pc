/*
 * @Description:
 * @Author:
 * El Psy Congroo
 */
//usermanagement模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const usermanagement = {
	// 清空已同步用户
	clearSyncAccout(password) {
		return axios.delete(
			base.base.usermanagement + '/sync?password=' + password
		)
	},
	//获取账户列表
	getAccountList(off, cnt, keyword = '') {
		let keywords = encodeURIComponent(keyword) //中文转码
		return axios.get(
			base.base.usermanagement +
				'?off=' +
				off +
				'&cnt=' +
				cnt +
				'&keyword=' +
				keywords
		)
	},
	//创建用户
	createUser(params) {
		return axios.post(base.base.usermanagement, params)
	},
	//获取用户信息
	allModify(id) {
		return axios.get(base.base.usermanagement + '?id=' + id)
	},
	//修改用户信息
	modifySubmit(username, password, params) {
		return axios.put(
			base.base.usermanagement +
				'?username=' +
				username +
				'&password=' +
				password,
			params
		)
	},
	//修改本身账号
	submitOwnForm(params, password) {
		return axios.put(
			base.base.usermanagement + '?password=' + password,
			params
		)
	},
	//删除用户
	deleteUser(username, password) {
		return axios.delete(
			base.base.usermanagement +
				'?username=' +
				username +
				'&password=' +
				password
		)
	},
	//绑定小程序
	proGram() {
		return axios.get(base.base.usermanagement + '/bind')
	},
	//取消绑定
	defaultGram() {
		return axios.delete(base.base.usermanagement + '/bind')
	}
}

export default usermanagement
