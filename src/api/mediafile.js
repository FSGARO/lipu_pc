/*
 * @Description:
 * @Author:
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-09-27 14:22:26
 * El Psy Congroo
 */

//mediafile模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const mediafile = {
	//获取媒体列表
	getMediaList(off, cnt, keyword = '') {
		let keywords = encodeURIComponent(keyword) //中文转码
		return axios.get(
			base.base.mediafile + '?off=' + off + '&cnt=' + cnt + '&keyword=' + keywords
		)
	},
	// 获取媒体信息
	getMediaById(id) {
		return axios.get(base.base.mediafile + '?id=' + id)
	},
	//获取视频列表
	getMediaData(off, cnt, keyword = '') {
		let keywords = encodeURIComponent(keyword) //中文转码
		return axios.get(
			base.base.mediafile + '?mode=video&off=' + off + '&cnt=' + cnt + '&keyword=' + keywords
		)
	},
	// 获取提示信息
	getNotice() {
		return axios.get(base.base.mediafile + '/notice')
	},
	//获取音频列表
	getYinData(off, cnt, keyword = '') {
		let keywords = encodeURIComponent(keyword) //中文转码
		return axios.get(
			base.base.mediafile + '?mode=audio&off=' + off + '&cnt=' + cnt + '&keyword=' + keywords
		)
	},
	//播放视频
	playVideos(id, level) {
		return axios.get(base.base.mediafile + '/play?id=' + id + '&level=' + level)
	},
	//开始转码
	starTranscoding(id) {
		return axios.post(base.base.mediafile + '/reload?id=' + id)
	},
	//停止转码
	stopTranscoding(id) {
		return axios.post(base.base.mediafile + '/stop?id=' + id)
	},
	//删除视频
	delectVideo(id) {
		return axios.delete(base.base.mediafile + '?id=' + id)
	},
	//自定义上传图片列表
	getCustom(off, cnt, keyword) {
		let keywords = encodeURIComponent(keyword)
		return axios.get(
			base.base.mediafile + '/picture?off=' + off + '&cnt=' + cnt + '&keyword=' + keywords
		)
	},
	//修改图片信息
	postCustom(id, name) {
		let names = encodeURIComponent(name)
		return axios.post(base.base.mediafile + '/picture?id=' + id + '&name=' + names)
	},
	//删除图片
	deleteCustom(id) {
		return axios.delete(base.base.mediafile + '/picture?id=' + id)
	},
	//裁剪图片
	putCustom(id, x, y, width, height) {
		return axios.get(
			base.base.mediafile +
				'/picture?id=' +
				id +
				'+&x=' +
				x +
				'&y=' +
				y +
				'&width=' +
				width +
				'&height=' +
				height
		)
	}
}

export default mediafile
