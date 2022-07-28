/*
 * @Description:
 * @Author:
 * El Psy Congroo
 */
//timetable模块接口

import base from './base'
import axios from './http'

const timetable = {
	//获取课程时间表列表
	getTimelists(pageNo, pageSize) {
		return axios.get(
			base.base.timetable +
				'/list?pageNo=' +
				pageNo +
				'&pageSize=' +
				pageSize
		)
	},
	//增加课时时间
	addWorkTime(params) {
		return axios.post(base.base.timetable + '/add', params)
	},
	//获取某一课时时间
	getWork(id) {
		return axios.get(base.base.timetable + '/goUpdate?id=' + id)
	},
	//修改课时时间
	putWork(params) {
		return axios.put(base.base.timetable + '/doUpdate', params)
	},
	//删除课时时间
	deleteWork(id) {
		return axios.delete(base.base.timetable + '/delete?id=' + id)
	}
}

export default timetable
