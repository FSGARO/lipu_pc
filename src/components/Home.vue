<!--
 * @Description: 
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-02-17 11:15:58
 * @FilePath: \fang_lipt\src\components\Home.vue
 * El Psy Congroo
-->
<template>
	<div>
		<el-header class="index-header" style="height: auto">
			<app-header></app-header>
		</el-header>
		<el-container style="background: #505e70">
			<div class="aside-box">
				<el-aside class="index-aside" v-bind:class="isOpen ? 'open' : 'unopen'">
					<app-menu @isOpens="isOpens" />
				</el-aside>
			</div>
			<el-main class="index-main">
				<router-view />
			</el-main>
		</el-container>
	</div>
</template>

<script>
import Header from './Header'
import Menu from './Menu'
export default {
	name: 'Home',
	data() {
		return {
			isOpen: true
		}
	},
	components: {
		'app-header': Header,
		'app-menu': Menu
	},
	methods: {
		isOpens: function (a) {
			this.isOpen = a
		}
	}
}
</script>

<style scoped>
.index-header {
	padding: 0;
	margin: 0;
	min-width: 1270px;
}
/*  done 样式*/
.index-main {
	padding: 0;
	min-width: 1150px;
	background: #f0f0f0;
	min-height: calc(100vh - 40px);
}
.index-aside {
	height: 100%;
	min-height: calc(100vh - 40px);
	/* padding-top: 10px; */
	/* width: 150px; */
	background: #505e70;
}
aside.el-aside.index-aside.open {
	width: 160px !important;
}
aside.el-aside.index-aside.unopen {
	width: 65px !important;
}
.aside-box {
	/* overflow: hidden; */
}
</style>
