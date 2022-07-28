// 预约教室模块
import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例
const reserve = {
	// 获取所有教室
	getClassroomList(pageSize, pageNo) {
		return axios.get(`${base.base.reserve}/getClassroomList?pageSize=${pageSize}&pageNo=${pageNo}`)
	},
	// 添加预约
	addReserveInfo(params) {
		return axios.post(`${base.base.reserve}/addReserveInfo`, params)
	},
	// 根据日期和课程Id获取当前日期的预约信息
	getReserveInfoByDate(courseInfoId, date) {
		return axios.get(`${base.base.reserve}/getReserveInfoByDate/${courseInfoId}/${date}`)
	},
	// 根据课程Id和指定日期获取该日期所在周的所有课时信息和预约信息
	getReserveInfo(courseInfoId, date) {
		return axios.get(`${base.base.reserve}/getReserveInfo/${courseInfoId}/${date}`)
	},
	//获取课时信息
	getPlanTimeList() {
		return axios.get(`${base.base.reserve}/getPlanTimeList`)
	},
	// 获取待审核信息
	getVerifyInfo(pageSize, pageNo) {
		return axios.get(`${base.base.reserve}/review/getVerifyInfo?pageSize=${pageSize}&pageNo=${pageNo}`)
	},
	// 审核信息
	addReserveReviewInfo(params) {
		return axios.post(`${base.base.reserve}/review/addReserveReviewInfo`, params)
	}
}
export default reserve
