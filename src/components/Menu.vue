<!--
 * @Description: 
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-04-07 15:20:57
 * @FilePath: \fang_lipt\src\components\Menu.vue
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-main style="padding: 0">
			<el-menu
				:default-active="$route.path"
				class="el-menu-vertical-demo"
				@open="handleOpen"
				@close="handleClose"
				:collapse="!isOpen"
				background-color="#545c64"
				text-color="#fff"
				active-text-color="#ffd04b"
				:unique-opened="true"
				router
			>
				<el-menu-item @click="toggleCollapse">
					<i :class="!isOpen ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
					<span slot="title"><span v-if="!isOpen">展开面板</span><span v-else>折叠面板</span></span>
				</el-menu-item>
				<el-menu-item index="/main" v-if="panel_enabled">
					<i class="el-icon-s-platform"></i>
					<span slot="title">主面板</span>
				</el-menu-item>
				<el-menu-item index="/index">
					<i class="el-icon-s-home"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-submenu index="1" id="el-submenu_index">
					<template slot="title">
						<i class="el-icon-s-operation"></i>
						<span slot="title">物联网</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/internet/index">物联任务</el-menu-item>
						<el-menu-item index="/internet/Terminal">物联教室</el-menu-item>
						<el-menu-item index="/internet/SeifinSpection">设备自检</el-menu-item>
						<el-menu-item index="/internet/Control" v-if="link_enabled">其他模块</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-video-camera-solid"></i>
						<span slot="title">校园广播站</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/broadcasting/index">音视频广播</el-menu-item>
						<el-menu-item index="/broadcasting/MediaFile">媒体资源管理</el-menu-item>
						<el-menu-item index="/broadcasting/VideoPreview">在线巡课</el-menu-item>
						<!--<el-menu-item index="/broadcasting/VoiceBroadcast">语音通话</el-menu-item>-->
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="3">
					<template slot="title">
						<i class="el-icon-setting"></i>
						<span slot="title">系统设置</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/settings/index">位置设置</el-menu-item>
						<el-menu-item index="/settings/MangeEnvironment">教室环境管理</el-menu-item>
						<el-menu-item index="/settings/UserManagement">用户管理</el-menu-item>
						<el-menu-item index="/settings/ServerSettings">服务器管理</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="4">
					<template slot="title">
						<i class="iconfont lipu-weixinxiaochengxu2x icon-right"></i>
						<span slot="title">微信小程序</span>
					</template>
					<el-menu-item-group>
						<el-menu-item @click="miniprogram" index="4-1">操作指导</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="5">
					<template slot="title">
						<i class="el-icon-s-comment"></i>
						<span slot="title">消息中心</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/disappearing/index">接收列表</el-menu-item>
						<el-menu-item index="/disappearing/ReleaseNews">发布消息</el-menu-item>
						<el-menu-item index="/disappearing/SenderList">发送列表</el-menu-item>
						<el-menu-item index="/disappearing/reserveInfo">审核信息</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="6">
					<template slot="title">
						<i class="el-icon-pie-chart"></i>
						<span slot="title">数据采集</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/collection/index">设备统计</el-menu-item>
						<el-menu-item index="/collection/PowerStats">能耗统计</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="7">
					<template slot="title">
						<i class="el-icon-alarm-clock"></i>
						<span slot="title">教室预约</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/appointment/index">作息时间</el-menu-item>
						<el-menu-item index="/appointment/CurriCulum">课程表</el-menu-item>
						<el-menu-item index="/appointment/appointmentClassroom">教室列表</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="8">
					<template slot="title">
						<i class="el-icon-postcard"></i>
						<span slot="title">校园一卡通</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/campuscard/index">卡片列表</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			isCollapse: false,
			isOpen: true,
			link_enabled: JSON.parse(localStorage.getItem('link')) ? JSON.parse(localStorage.getItem('link')).enabled : true,
			panel_enabled: JSON.parse(localStorage.getItem('panel')) ? JSON.parse(localStorage.getItem('panel')).enabled : true,
			user: localStorage.getItem('user') || ''
		}
	},
	created: function () {
		this.getLists()
	},
	methods: {
		toggleCollapse() {
			this.isOpen = !this.isOpen
			console.log('this.isOpen', this.isOpen)
			this.$emit('isOpens', this.isOpen)
		},
		//获取列
		getLists() {
			this.api.login.getInformation().then(() => {
				// console.log(res)
			})
		},
		//展开
		handleOpen() {
			//    console.log(key, keyPath)
		},
		//收起
		handleClose() {
			//    console.log(key, keyPath)
		},
		miniprogram() {
			window.open(`${process.env.VUE_APP_BASE_API}/app/v1/miniprogram`)
		}
	}
}
</script>

<style scoped>
/* done 修改样式 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 160px;
	min-height: 400px;
}
.el-submenu .el-menu-item {
	height: 50px;
	line-height: 50px;
	padding: 0 45px;
	min-width: 139px;
}
.iscoll {
	margin-bottom: 20px;
	background-color: #505e70;
}
#el-submenu_index {
	padding-left: 0 !important;
}
/* done 样式 */
.isCollapse {
	width: 160px;
	text-align: center;
}
.icon-right {
	margin-right: 5px;
}
ul.el-menu-vertical-demo.el-menu {
	border-right: unset;
}
</style>
