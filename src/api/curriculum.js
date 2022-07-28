  //curriculum

import axios from './http'
import base from './base'

const curriculum = {
	//获取所有课程列表数据
	getCourseFile() {
		return axios.get(base.base.curriculumFile + '/list?')
	},
	//加载某条课程数据
	loadCourseFile(currentPage, pageSize, id) {
		return axios.get(
			base.base.curriculum +
				'/list?pageNo=' +
				currentPage +
				'&pageSize=' +
				pageSize +
				'&courseFileId=' +
				id
		)
	},
	//重命名
	renameCourse(name, id) {
		let names = encodeURIComponent(name)
		return axios.put(
			base.base.curriculumFile + '/rename?filename=' + names + '&id=' + id
		)
	},
	//删除课程表
	deleteCourse(id) {
		return axios.delete(base.base.curriculumFile + '/delete?id=' + id)
	},
	//确认同步数据
	trueSelect(id, filed, index, courseCode, areaId) {
		return axios.put(
			base.base.curriculum +
				'/syncSelected?courseFileId=' +
				id +
				'&field=' +
				filed +
				'&index=' +
				index +
				'&courseCode=' +
				courseCode +
				'&areaId=' +
				areaId
		)
	},
	//确认增加课程数据
	trueAddCourse(params) {
		return axios.post(base.base.curriculum + '/add', params)
	},
	//删除此行
	delectOneCourse(id) {
		return axios.delete(base.base.curriculum + '/delete?courseId=' + id)
	},
	// 转换数据
	convertOneCourse() {
		return axios.post(base.base.curriculum + '/info/convertData')
	},
	// 获取转换后的数据
	getConvertData(pageNo, pageSize) {
		return axios.get(
			base.base.curriculum +
				'/info/list?pageNo=' +
				pageNo +
				'&pageSize=' +
				pageSize
		)
	},
	getCourse(classroomAddress) {
		return axios.get(
			base.base.curriculum +
				'/info/getByclassroomAddress?classroomAddress=' +
				classroomAddress
		)
	}
}

export default curriculum
