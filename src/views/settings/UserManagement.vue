<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header>
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>系统设置</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="toolsbar terminal_search">
				<el-form class="el-form--inline" style="margin-bottom: 5px" @submit.native.prevent>
					<div class="input-box-search">
						<el-form-item>
							<el-input
								v-model="usersearch"
								placeholder="输入关键字"
								class="el-input__inner"
								@keyup.enter.native="getAccountList(usersearch)"
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="getAccountList(usersearch)"><i class="el-icon-search"></i>搜索</el-button>
						</el-form-item>
					</div>
					<el-form-item>
						<el-button type="primary" size="small" @click="refreshAccountList"><i class="el-icon-refresh-right"></i>刷新列表</el-button>
						<el-button
							type="success"
							icon="el-icon-plus"
							size="small"
							style="margin: 0 0 10px 10px"
							@click="addUsers"
							:disabled="level == '100'"
							>添加用户</el-button
						>
						<el-button type="primary" size="small" :disabled="level == '100'" @click="toSyncAccount"
							><i class="el-icon-plus"></i>同步用户</el-button
						>
						<el-button type="danger" size="small" :disabled="level == '100'" @click="clearAllSyncAccount"
							><i class="el-icon-close-notification"></i>清空已同步用户</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</el-header>
		<el-main>
			<el-table :data="tableData" border style="width: 100%">
				<!-- width="110"-->
				<el-table-column align="center" prop="username" label="用户账户"> </el-table-column>
				<el-table-column align="center" prop="name" label="用户名称"> </el-table-column>
				<el-table-column align="center" prop="level_name" label="用户级别"> </el-table-column>
				<el-table-column align="center" prop="enableds" label="是否启用"> </el-table-column>
				<!-- <el-table-column align="center" prop="create_times" label="创建时间" width="150"> </el-table-column>
				<el-table-column align="center" prop="last_failed_times" label="最后登录失败时间" width="150"> </el-table-column>
				<el-table-column align="center" prop="last_login_times" label="最后登录时间" width="150"> </el-table-column> -->
				<!--  width="80"-->
				<el-table-column align="center" prop="is_sync" label="本地账号"> </el-table-column>
				<!-- width="120" -->
				<el-table-column align="center" label="小程序绑定状态">
					<template slot-scope="scope">
						<div v-if="scope.row.deleteDisabled">
							<el-button @click.native.prevent="proGram(scope.row)" type="text" size="small" v-if="!scope.row.bind_ok"
								>立即扫码绑定</el-button
							>
							<el-button @click.native.prevent="defaultGram(scope.row)" type="text" size="small" v-else>取消绑定</el-button>
						</div>
						<div v-else>
							<el-button @click.native.prevent="proGram(scope.row)" type="text" size="small" v-if="!scope.row.bind_ok" disabled
								>请登录后扫码绑定</el-button
							>
							<el-button @click.native.prevent="defaultGram(scope.row)" type="text" size="small" disabled v-else
								>请登录后取消绑定</el-button
							>
						</div>
					</template>
				</el-table-column>
				<!-- width="160"  -->
				<el-table-column align="center" prop="phone_num" label="手机号码"> </el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<div class="btnWrapBox">
							<div><el-button @click="handleDetailsOpen(scope.row)" type="text" size="small">详情</el-button></div>
							<div><el-button @click="modify(scope.row, false)" type="text" size="small">修改</el-button></div>
							<div>
								<el-button @click.native.prevent="deleteUs(scope.row)" type="text" size="small" :disabled="scope.row.deleteDisabled"
									>删除</el-button
								>
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				class="pagination"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[10, 20, 50, 100]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
			<el-dialog title="设备管理权限" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
				<el-tree :data="datas" ref="tree" highlight-current node-key="id" :props="props" show-checkbox> </el-tree>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="condel">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="用户详情" center :visible.sync="dialogDetailsVisible" width="30%" :before-close="handleDetailsClose">
				<el-table :data="account" border stripe>
					<el-table-column align="center" prop="create_times" label="创建时间" > </el-table-column>
					<el-table-column align="center" prop="last_failed_times" label="最后登录失败时间" > </el-table-column>
					<el-table-column align="center" prop="last_login_times" label="最后登录时间" > </el-table-column>
				</el-table>
				<!-- <el-form :model="account" ref="account" :inline="false" size="normal">
					<el-form-item label="创建时间"> {{ account.create_times }}</el-form-item>
					<el-form-item label="最后登录时间">{{ account.last_login_times }}</el-form-item>
					<el-form-item label="最后登录失败时间">{{ account.last_failed_times }} </el-form-item>
				</el-form> -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogDetailsVisible = false">关闭</el-button>
				</span>
			</el-dialog>
			<el-dialog title="菜单权限设置" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose1">
				<el-tree :data="datas" ref="tree" highlight-current node-key="id" :props="props" show-checkbox> </el-tree>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible1 = false">取 消</el-button>
					<el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog title="扫描二维码绑定小程序" :visible.sync="bindingVisible" width="250px" center>
				<div id="qrCode" ref="qrCodeDiv"></div>
				<span slot="footer" class="dialog-footer">
					<!--<el-button @click="noBinding">取 消</el-button>-->
					<el-button type="primary" @click="yesBinding">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 权限验证 -->
			<el-dialog title="权限验证" :visible.sync="dialogPassword" width="30%" @close="dialogPasswordCancel">
				<el-form :model="formDelete" :rules="rules" ref="formDelete" label-width="140px">
					<el-form-item label="密码" prop="password">
						<el-input v-model="formDelete.password" type="password" show-password></el-input>
					</el-form-item>
					<p class="red">您正在{{ isClearAllSyncAccount ? '清空所有已同步账号' : '删除一个账号' }},请输入当前用户密码</p>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogPassword = false">取 消</el-button>
					<el-button type="primary" @click="deleteUser('formDelete')">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 修改用户信息 -->
			<el-dialog lock-scroll title="修改本用户信息" :visible.sync="dialogOwn" width="30%" @close="modifyDialogCancel">
				<el-form :model="ownForm" status-icon :rules="ownRules" ref="ownForm" label-width="100px">
					<el-form-item label="用户账号" prop="user" class="mb">
						<el-input :disabled="true" v-model="ownForm.user"></el-input>
					</el-form-item>

					<el-form-item label="密码" prop="oldPass" class="mb">
						<el-input type="password" v-model="ownForm.oldPass"></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="pass" class="mb">
						<el-input type="password" v-model="ownForm.pass"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass" class="mb" v-if="this.ownForm.pass">
						<el-input type="password" v-model="ownForm.checkPass"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="phone_num" class="mb">
						<el-input
							v-model="ownForm.phone_num"
							placeholder="请输入手机号(选填,用于匹配小程序)"
							:maxlength="11"
							show-word-limit
							clearable
							prefix-icon="el-icon-mobile"
						></el-input>
					</el-form-item>
					<el-form-item label="用户名称" class="mb">
						<el-input v-model="ownForm.name"></el-input>
					</el-form-item>
					<el-form-item class="cen">
						<el-button type="primary" @click="submitOwnForm('ownForm')">确认修改</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
	data() {
		// const validatePass = (rule, value, callback) => {
		// 	if ((value ?? '') != '') {
		// 		if (this.ownForm.checkPass !== '') {
		// 			this.$refs.ownForm.validateField('checkPass')
		// 		}
		// 		callback()
		// 	}
		// }
		const validatePass2 = (rule, value, callback) => {
			if ((value ?? '') === '') {
				callback(new Error('请再次输入新密码'))
			} else if (value !== this.ownForm.pass) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		}
		return {
			isClearAllSyncAccount: false,
			tableData: [],
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			total: 0,
			dialogVisible: false,
			dialogVisible1: false,
			centerDialogVisible: false,
			dialogDetailsVisible: false,
			bindingVisible: false,
			datas: [],
			props: {
				children: 'children',
				label: 'label'
			},
			xiuGai: {},
			QRcode: {
				qrLoading: false
			},
			account: {},
			textUrl: '',
			usersearch: '',
			level: localStorage.getItem('role_level'),
			formDelete: {
				password: ''
			},
			rules: {
				password: [
					{
						required: true,
						message: '请输入管理员密码',
						trigger: 'blur'
					}
				]
			},
			dialogPassword: false,
			deleteUsername: '',
			ownForm: {
				user: '',
				oldPass: '',
				pass: '',
				checkPass: '',
				name: '',
				phone_num: ''
			},
			ownRules: {
				user: [
					{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}
				],
				oldPass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				// pass: [{ validator: validatePass, trigger: 'blur' }],
				checkPass: [{ validator: validatePass2, trigger: 'blur' }],
				phone_num: [
					{
						pattern: /^1(3|4|5|7|8|9)\d{9}$/,
						message: '手机号格式错误',
						trigger: 'blur'
					}
				]
			},
			dialogOwn: false
		}
	},
	mounted() {
		this.$bus.$on('changePass', prams => {
			this.modify(prams, true)
		})
	},
	//解绑监听事件
	// beforeDestroy() {
	// 	this.$bus.$off('changePass')
	// },
	created: function () {
		this.getAccountList()
	},
	methods: {
		handleDetailsClose() {
			this.dialogDetailsVisible = false
		},
		async handleDetailsOpen(account) {
			this.account = [ {...account} ]
			this.dialogDetailsVisible = true
		},
		dialogPasswordCancel() {
			this.isClearAllSyncAccount = false
			this.$refs['ownForm'].resetFields()
		},
		async affClearAllSyncAccount() {
			let res = await this.api.usermanagement.clearSyncAccout(this.formDelete.password)
		},
		// 清空已同步设备
		clearAllSyncAccount() {
			this.isClearAllSyncAccount = true
			this.dialogPassword = true
			// this.api.usermanagement
			// 	.clearAllSyncAccount()
			// 	.then(res => {
			// 		console.log(
			// 			'👻 ----- this.api.usermanagement.clearAllSyncAccount ----- res',
			// 			res
			// 		)
			// 	})
			// 	.catch(err => {
			// 		console.log(err)
			// 	})
		},
		// 刷新列表
		refreshAccountList() {
			this.getAccountList()
		},
		// 开始同步其他平台账号
		toSyncAccount() {
			window.open(`${process.env.VUE_APP_BASE_API}/app/v1/account/sync`)
		},
		//修改弹框取消
		modifyDialogCancel() {
			this.$refs['ownForm'].resetFields()
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取账户列表
		getAccountList(keyword = '') {
			this.api.usermanagement.getAccountList(this.currentPage - 1, this.pageSize, keyword).then(res => {
				if (res.data.account_list) {
					this.tableData = res.data.account_list.account_property_list
					this.total = res.data.account_list.total
					for (let item of this.tableData) {
						if (item.level == this.level) {
							//级别判断
							item.modifyDisabled = true
							item.deleteDisabled = true
						} else {
							item.modifyDisabled = false
							item.deleteDisabled = false
						}
						if (item.enabled == true) {
							item.enableds = `启用`
						} else {
							item.enableds = `禁用`
						}
						item.create_times = item.create_time > 0 ? this.timeConversion(item.create_time) : '未知'
						item.last_failed_times = item.last_failed_time > 0 ? this.timeConversion(item.last_failed_time) : '从未'
						item.last_login_times = item.last_login_time > 0 ? this.timeConversion(item.last_login_time) : '从未'
						item.is_sync = item.is_sync ? '否' : '是'
					}
				}
			})
		},
		//条数
		handleSizeChange(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			//      console.log(`每页 ${val} 条`);
			this.getAccountList()
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getAccountList()
			//      console.log(`当前页: ${val}`);
		},
		//时间戳转换成日期
		timeConversion(timeStamp) {
			if (timeStamp == 0) {
				return 0
			} else {
				let date = new Date(timeStamp * 1000) //毫秒*1000
				let year = date.getFullYear()
				let month = (date.getMonth() + 1).toString().padStart(2, '0') //补0
				let day = date.getDate().toString().padStart(2, '0')
				let hour = date.getHours().toString().padStart(2, '0')
				let minute = date.getMinutes().toString().padStart(2, '0')
				let second = date.getSeconds().toString().padStart(2, '0')
				return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
			}
		},
		//添加用户
		addUsers() {
			this.$router.push({ path: '/settings/AddUser' })
		},
		//关闭删除
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(() => {
					done()
				})
				.catch()
		},
		handleClose1(done) {
			this.$confirm('确认关闭？')
				.then(() => {
					done()
				})
				.catch(() => {})
		},
		//确认删除
		condel() {
			this.dialogVisible = false
		},
		menudel() {
			this.dialogVisible1 = false
		},
		//权限管理
		jurisdiction() {
			this.dialogVisible = true
		},
		//菜单权限
		menu() {
			this.dialogVisible1 = true
		},
		//加载树形
		handleCheckChange(data, checked, indeterminate) {
			console.log(data, checked, indeterminate)
		},
		//修改
		modify(row, isHeaderToModifyPass = false) {
			if (isHeaderToModifyPass || row.level == this.level) {
				//是否为修改自己
				this.dialogOwn = true
				console.log('👻 ----- modify ----- this.dialogOwn', this.dialogOwn)
				this.ownForm.user = row.username
				this.ownForm.name = row.name
				this.ownForm.phone_num = row.phone_num
			} else {
				this.$router.push({
					query: {
						id: row.id
					},
					path: '/settings/AddUser'
				})
			}
		},
		//修改自身账号密码等信息
		submitOwnForm(formName) {
			console.log(`build up ----- submitOwnForm ----- formName`, formName)
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						password: this.ownForm.pass,
						name: this.ownForm.name,
						phone_num: this.ownForm.phone_num
					}
					console.log(`build up ----- submitOwnForm ----- params`, params)
					let oldPass = this.ownForm.oldPass
					//	    			console.log(params, oldPass)
					//	    			return
					this.api.usermanagement
						.submitOwnForm(params, oldPass)
						.then(() => {
							this.getAccountList()
							this.$message({
								type: 'success',
								message: '修改成功'
							})
							this.dialogOwn = false
							this.$refs[formName].resetFields()
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					console.log('error submit!')
					return false
				}
			})
		},
		//绑定小程序
		proGram() {
			const getToken = localStorage.getItem('token')
			if (getToken) {
				this.api.usermanagement
					.proGram()
					.then(res => {
						//      			console.log(res)
						if (res.data.bind_url) {
							if (res.data.bind_url.qrcode == '') {
								this.textUrl = res.data.bind_url.url
								this.bindingVisible = true
								setTimeout(() => {
									//生成二维码
									this.bindQRCode()
								}, 500)
							}
						} else {
							this.$message.error('网络繁忙，请稍后重试!')
						}
					})
					.catch(function (err) {
						console.log(err)
					})
			} else {
				this.$router.push({ path: '/Login' })
				localStorage.clear()
			}
		},
		//取消绑定
		defaultGram() {
			this.$confirm('此操作将解除绑定, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.usermanagement
						.defaultGram()
						.then(() => {
							this.getAccountList()
							this.$message({
								type: 'success',
								message: '解绑成功!'
							})
						})
						.catch(err => {
							console.log(err)
						})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消解除绑定'
					})
				})
		},
		//确认绑定
		yesBinding() {
			this.getAccountList()
			this.bindingVisible = false
		},
		//生成二维码
		bindQRCode() {
			document.getElementById('qrCode').innerHTML = ''
			new QRCode(this.$refs.qrCodeDiv, {
				text: this.textUrl,
				//			text: 'www.baidu.com',
				width: 200,
				height: 200,
				colorDark: '#333333', //二维码颜色
				colorLight: '#ffffff', //二维码背景色
				correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
			})
		},
		deleteUs(row) {
			this.deleteUsername = row.username
			this.dialogPassword = true
			this.isClearAllSyncAccount = false
		},
		//删除用户
		deleteUser(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm(`此操作将删除${this.isClearAllSyncAccount ? '所有已同步账号' : '指定账户'}且无法恢复, 是否继续?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							if (this.isClearAllSyncAccount) {
								this.affClearAllSyncAccount()
							} else {
								this.api.usermanagement
									.deleteUser(this.deleteUsername, this.formDelete.password)
									.then(res => {
										console.log('👻 ----- .then ----- res', res)
									})
									.catch(err => {
										console.log(err)
									})
							}
							let totalPage = Math.ceil((this.total - 1) / this.pageSize)
							let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
							this.currentPage = currentPage < 1 ? 1 : currentPage
							setTimeout(() => {
								this.getAccountList()
							}, 0)
							this.dialogPassword = false
							this.isClearAllSyncAccount = false
							this.is
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
							this.$refs[formName].resetFields()
						})
						.catch(err => {
							console.log('👻 ----- deleteUser ----- err', err)
							this.$message({
								type: 'info',
								message: '已取消删除'
							})
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		}
	}
}
</script>

<style scoped="">
.el-form-item {
	margin-bottom: 0.1px;
}
.mb {
	margin-bottom: 20px;
}
.red {
	color: red;
	text-align: center;
	margin-top: 20px;
}
.cen {
	text-align: center;
}
.btnWrapBox button {
	padding: 0 !important;
}
</style>
