/*
 * @Description:
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-03-31 15:19:54
 * @FilePath: \fang_lipt\src\main.js
 * El Psy Congroo
 */
import 'babel-polyfill' //浏览器兼容
import Vue from 'vue'
// import Vue from 'vue/dist/vue.common.js';
import App from './App'
import router from './router'
import api from './api'
// import axios from './api/http';
import store from './store'
import permission from '@/router/permission' //路由守卫
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/public.css'
import moment from 'moment' //时间格式化
import videoPlayer from 'vue-video-player' //视频播放
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import 'videojs-contrib-hls'
import 'vue-video-player/src/custom-theme.css'
// import vueVideoPlayer from 'vue-video-player'
import '@/assets/icon/iconfont.css'

Vue.prototype.api = api //封装请求
moment.locale('zh-cn')
// vue.prototype.axios = axios //axios请求
Vue.prototype.moment = moment //时间格式化
Vue.prototype.resetSetItem = function (key, newVal) {
	//监听本地存储 tips 是否改变
	if (key === 'tips') {
		var newStorageEvent = document.createEvent('StorageEvent')
		const storage = {
			setItem: function (k, val) {
				localStorage.setItem(k, val)
				newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null) //初始化创建的事件
				window.dispatchEvent(newStorageEvent) // 派发对象
			}
		}
		return storage.setItem(key, newVal)
	}
}
// TODO 待做
// HACK 不是很确定
// NOTE 说明
// INFO 一些信息
// TAG 标记
//XXX 随便写点
// FIXME 已知有问题
// BUG 有bug
Vue.use(ElementUI)
Vue.use(videoPlayer)
Vue.use(permission)

Vue.config.productionTip = false
new Vue({
	beforeCreate() {
		Vue.prototype.$bus = this //安装全局事件总线，$bus就是当前应用的vm
	},
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
// new Vue({
//   router,
//   store,
//   render: h => h(app)
// }).$mount('#app')
