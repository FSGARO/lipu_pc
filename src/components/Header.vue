<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-main class="header-content">
			<el-row>
				<div
					class="row-bg"
					:style="{
						backgroundImage:
							'url(' +
							require('../../public/static/img/topbar_bg.png') +
							')'
					}"
				>
					<div class="setting">
						<div class="setting-school">{{ name }}</div>
						<div class="setting-notice">
							<el-badge :value="tips" class="item">
								<i class="icon-bell"></i>
							</el-badge>
						</div>
						<el-dropdown class="setting-dropdown">
							<span
								class="el-dropdown-link"
								style="
									font-size: 20px;
									color: #fff;
									margin-right: 10px;
								"
							>
								<i class="el-icon-user el-icon--right"></i
								><span class="admin">{{ user }}</span>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item
									icon="el-icon-edit-outline"
									@click.native="forget"
									>修改密码</el-dropdown-item
								>
								<el-dropdown-item
									icon="el-icon-set-up"
									@click.native="logout"
									>退出登录</el-dropdown-item
								>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			user: localStorage.getItem('user'),
			name: localStorage.getItem('name'),
			tips: localStorage.getItem('tips')
		}
	},
	created: function () {
		//监听缓存内的消息变化
		window.addEventListener('setItem', () => {
			this.tips = localStorage.getItem('tips')
		})
	},
	methods: {
		logout() {
			this.$router.push({ path: '/Login' })
			localStorage.clear()
		},
		forget() {
			this.$router.push({ path: '/settings/UserManagement' })
			console.log('-----')
			let username = localStorage.getItem('user') || ''
			let name = localStorage.getItem('name') || ''
			let level = localStorage.getItem('role_level') || ''
			let row = { username, name, level }
			setTimeout(() => {
				this.$bus.$emit('changePass', row)
			}, 0)
		}
	}
}
</script>

<style scoped>
.header-content {
	widows: 100%;
	padding: 0;
	margin: 0;
}
.admin {
	margin-left: 10px;
}
.item {
	font-size: 23px;
}
.row-bg {
	overflow: hidden;
	width: 100%;
	background: no-repeat 100% 100%;
}
.setting {
	float: right;
	line-height: 30px;
	margin-right: 10px;
}
.setting-school {
	font-size: 15px;
	color: #fff;
	line-height: 40px;
	display: inline-block;
}
.setting-notice {
	margin: 5px 15px 0;
	top: 0;
	color: #fff;
	display: inline-block;
}
.setting-dropdown {
	display: inline-block;
	cursor: pointer;
	/* done 1px */
	border-left: 1px solid #fff;
}
</style>
