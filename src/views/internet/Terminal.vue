<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header style="height: auto" ref="headers">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>物联网</el-breadcrumb-item>
					<el-breadcrumb-item>物联教室</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="toolsbar terminal_search">
				<el-form class="el-form--inline" style="margin-bottom: 5px">
					<!-- <div class="input-box-search">
            <el-form-item>
              <el-input
                v-model="sos.input"
                placeholder="按位置、IP或序列号"
                class="el-input__inner"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success"
                ><i class="el-icon-search"></i>搜索</el-button
              >
            </el-form-item>
          </div> -->
					<el-form-item>
						<el-button type="success" @click="screenArea" v-if="!stiteScreen"><i class="el-icon-refresh-right"></i>筛选</el-button>
						<el-button type="warning" v-else @click="eliminate"><i class="el-icon-refresh-right"></i>清除筛选</el-button>
						<el-button type="primary"><i class="el-icon-search"></i>搜索在线设备</el-button>
						<el-button type="success" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading"
							><i class="el-icon-refresh-right"></i>刷新列表</el-button
						>
						<el-button type="danger" @click="deleteAll"><i class="el-icon-close-notification"></i>删除所有设备</el-button>
						<el-button type="primary" @click="addIot"><i class="el-icon-plus"></i>指令信息</el-button>

						<el-dropdown split-button type="success" class="links" @click="goControl">
							其他模块
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="item in controlUrl" :key="item.data.id" @click.native="jumpOutside(item)">{{
									item.data.name
								}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button type="primary" @click="wechat"><i class="el-icon-plus"></i>微信小程序</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-header>
		<el-main style="padding: 0 20px">
			<el-row style="width: 100%">
				<el-col :span="16">
					<div class="grid-content bg-purple">
						<!--  删除排序规则        :default-sort="{ prop: 'online', order: 'ascending' }" -->
						<el-table
							highlight-current-row
							ref="multipleTable"
							:row-key="getRowKeys"
							:data="tableData"
							border
							:label="tableData.id"
							tooltip-effect="dark"
							style="width: 100%"
							@selection-change="handleSelectionChange"
							@row-click="selectQu"
						>
							<el-table-column type="selection" width="55" align="center" :reserve-selection="true" :selectable="selectOffline">
							</el-table-column>
							<el-table-column prop="place" label="位置" width="200" sortable align="center"> </el-table-column>
							<el-table-column prop="online" label="物联模块状态" width="150" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.online">在线</span>
									<span v-else style="color: red">离线</span>
								</template>
							</el-table-column>
							<el-table-column prop="status" label="设备状态" width="150" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.status" class="iconclass">
										<i v-if="scope.row.status.system_enabled" class="el-icon-video-play" style="color: green"></i>
										<i v-else class="el-icon-video-pause" style="color: red"></i>
									</span>
									<span v-else class="iconclass"><i class="el-icon-video-pause" style="color: red"></i></span>
								</template>
							</el-table-column>
							<el-table-column prop="groupName" label="组名" width="150" align="center">
								<template slot-scope="scope">
									<span v-if="!scope.row.ext_info"></span>
									<span v-else-if="scope.row.ext_info.groupName">{{ scope.row.ext_info.groupName }}</span>
									<span v-else>默认(未分组)</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" show-overflow-tooltip align="center">
								<template slot-scope="scope">
									<el-button type="text" size="small" @click.stop="operaTions(scope.row)">详情</el-button>
									<el-button type="text" size="small" @click.stop="deleteEquipment(scope.row.id)">删除</el-button>
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
					</div>
				</el-col>
				<el-col :span="8" :style="{ 'margin-top': bigHeight + 'px' }">
					<div class="grid-content bg-purple-light ter-right">
						<terdetails v-if="caozuo" ref="childterdetails" :idValue="moduleId" :getMethodStates="getDeviceList" />
						<operation v-else :rows="rows" ref="childterdetails" @addItem="addItem" @back="back" @getDeviceList="getDeviceList" />
					</div>
				</el-col>
			</el-row>
			<el-dialog title="筛选" :visible.sync="dialogScreen" width="35%" :close-on-click-modal="false">
				<el-form :model="screenForm" :rules="screenRules" ref="screenForm" label-width="100px" @submit.native.prevent>
					<el-form-item label="关键字">
						<el-input v-model="screenForm.keyword" placeholder="请输入关键字" @keyup.enter.native="trueScreen('screenForm')"></el-input>
					</el-form-item>
					<el-form-item label="指定区域" class="mgt">
						<el-cascader
							ref="elcascader"
							class="wdt"
							v-model="screenForm.position"
							:options="datas"
							:props="selectLocation"
							@change="caderChange"
							clearable
							@keyup.enter.native="trueScreen('screenForm')"
						></el-cascader>
					</el-form-item>
				</el-form>
				<div slot="footer" class="tac">
					<el-button @click="dialogScreen = false">取 消</el-button>
					<el-button type="primary" @click="trueScreen('screenForm')">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="新增教室" :visible.sync="addItemDialog" width="35%" :close-on-click-modal="false">
				<el-form :model="classNameForm" :rules="classNameRules" ref="classNameForm" label-width="100px" @submit.native.prevent>
					<el-form-item label="教室名称" prop="name">
						<el-input
							v-model="classNameForm.name"
							placeholder="请输入教室名称"
							@keyup.enter.native="trueClassName('classNameForm')"
						></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="tac">
					<el-button @click="unAddItem">取 消</el-button>
					<el-button type="primary" @click="trueClassName('classNameForm')">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
import operation from '@/components/internet/operation'
import terdetails from '@/components/internet/terdetails'
var app
export default {
	components: {
		operation: operation,
		terdetails: terdetails
	},
	data() {
		return {
			pid: 99,
			addItemDialog: false,
			moduleId: 99,
			groupName: '',
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			caozuo: true,
			sos: {
				input: '',
				loading: false
			},
			classNameForm: {
				name: '',
				comment: ''
			},
			classNameRules: {
				name: [
					{
						required: true,
						message: '请输入教室名称',
						trigger: 'blur'
					}
				]
			},
			selectArr: [],
			loading: true,
			tableData: [],
			checkAll: false,
			checkedCities: ['0'],
			isIndeterminate: true,
			fullscreenLoading: false,
			id: '',
			total: 8,
			rows: {},
			dialogScreen: false,
			screenForm: {
				keyword: '',
				position: ''
			},
			selectLocation: {
				value: 'id',
				children: 'items',
				label: 'name',
				checkStrictly: true
			},
			groupNameArr: [{ value: '', label: '默认' }],
			screenRules: {
				keyword: [
					{
						required: true,
						message: '请输入关键字',
						trigger: 'blur'
					}
				]
			},
			datas: [],
			stiteScreen: false,
			getRowKeys(row) {
				return row.id
			},
			controlUrl: [],
			bigHeight: 0
		}
	},
	created: function () {
		this.getDeviceList(this.currentPage, this.pageSize)
		this.timerOut() //轮询
		this.getState() //位置
		this.getLink() //获取物联管控的url
	},
	mounted() {
		app = this
		if (this.$route.query.rows) {
			//				console.log(this.$route.query.rows)
			let idskeyword = ''
			let indexId = this.$route.query.rows.place_id
			this.getDeviceList(this.currentPage, this.pageSize, idskeyword, indexId)
			//				this.timerOut(indexkey, indexId)
		}
		window.addEventListener('scroll', this.boxScrollx, true)
	},
	methods: {
		unAddItem() {
			console.log(this.$refs.childterdetails.position)
			this.addItemDialog = false
			this.$refs.childterdetails.position = []
		},
		addItem(pid) {
			this.pid = pid
			this.addItemDialog = true
		},
		// 教室名称
		trueClassName(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.api.position
						.addLocation(this.classNameForm.name, this.pid, 1, this.classNameForm.comment)
						.then(res => {
							console.log('👻 ----- trueClassName ----- res', res)
							if (res.data.result.code == 0) {
								this.addItemDialog = false
								this.pid = 99
								this.$refs.childterdetails.tyingDevice(res.data.data.id)
								this.rows.place = this.classNameForm.name
								this.$refs.childterdetails.getMethodState()
								setTimeout(
									() => {
										this.$refs.childterdetails.getState(this.rows, 5)
									},

									0
								)
								this.$refs[formName].resetFields()
							}
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//设备信息列表
		getDeviceList(currentPage, pageSize, keyword = '', id = '') {
			this.api.terminal
				.getDeviceList(currentPage - 1, pageSize, keyword, id)
				.then(res => {
					// console.log("设备信息列表", res);
					this.tableData = []
					if (res.data.device_info_list.device_property_list) {
						this.tableData = res.data.device_info_list.device_property_list
						this.total = res.data.device_info_list.total
						// 排序
						for (let i = 0; i < this.tableData.length; i++) {
							for (let j = 0; j < this.tableData.length - i - 1; j++) {
								if (!this.tableData[j].online && this.tableData[j + 1].online) {
									;[this.tableData[j], this.tableData[j + 1]] = [this.tableData[j + 1], this.tableData[j]]
								}
							}
						}
						//done 获取设备分组
						this.tableData.map(ele => {
							if (ele.ext_info && ele.ext_info.groupName) {
								this.groupNameArr.push({
									value: ele.ext_info.groupName,
									label: ele.ext_info.groupName
								})
							}
						})
						// 数组对象去重
						let obj = {}
						this.groupNameArr = this.groupNameArr.reduce((cur, next) => {
							obj[next.value] ? '' : (obj[next.value] = true && cur.push(next))
							return cur
						}, [])
						// 把设备分组赋值给子组件
						this.$refs.childterdetails.groupType = this.groupNameArr
						// 自动点击
						if (this.selectArr.length == 0 && this.tableData[0].online) {
							this.moduleId = this.tableData[0].id
							this.groupName =
								this.tableData[0].ext_info && this.tableData[0].ext_info.groupName ? this.tableData[0].ext_info.groupName : ''
							this.$refs.multipleTable.toggleRowSelection(this.tableData[0])
							this.selectArr.push(this.tableData[0].id)
							this.$refs.childterdetails.setGroupName(this.groupName)
						}
					}
				})
				.catch(function (error) {
					// 请求失败处理
					console.log(error)
				})
		},
		//轮询
		timerOut(keyword = '', id = '') {
			window.clearInterval(this.timer) //清除原有的轮询
			this.timer = setInterval(() => {
				this.getDeviceList(this.currentPage, this.pageSize, keyword, id)
			}, 5000)
		},
		//条数
		handleSizeChange(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.getDeviceList(this.currentPage, this.pageSize)
			this.timerOut() //开始轮询
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getDeviceList(this.currentPage, this.pageSize)
			this.timerOut() //开始轮询
			//      console.log(`当前页: ${val}`);
		},
		//删除设备
		deleteEquipment(id) {
			this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.terminal
						.deleteEquipment(id)
						.then(() => {
							let totalPage = Math.ceil((this.total - 1) / this.pageSize)
							let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
							this.currentPage = currentPage < 1 ? 1 : currentPage
							this.getDeviceList(this.currentPage, this.pageSize)
							this.timerOut() //开始轮询
						})
						.catch(err => {
							console.log(err)
						})
					this.$message({
						type: 'success',
						message: '删除成功!'
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		//删除所有设备
		deleteAll() {
			this.$confirm('此操作将永久删除所有设备, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.terminal
						.deleteEquipment('all')
						.then(() => {
							this.currentPage = 1
							this.getDeviceList(this.currentPage, this.pageSize)
							this.timerOut() //开始轮询
						})
						.catch(err => {
							console.log(err)
						})
					this.$message({
						type: 'success',
						message: '删除成功!'
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		//添加物联信息
		addIot() {
			this.$router.push({
				path: '/internet/AddControl'
			})
		},
		wechat() {
			window.open(`${process.env.VUE_APP_BASE_API}/app/v1/miniprogram`)
		},
		//多选
		handleSelectionChange(val) {
			console.log(`build up ----- handleSelectionChange ----- val`, val)
			if (val.length > 0) {
				let controlId = [] //批量设备id
				let row = val[0] //默认使用最开始勾选那条
				if (val.length > 1) {
					for (let item of val) {
						controlId.push(item.id)
						if (this.selectArr.indexOf(item.id) == -1) this.selectArr.push(item.id)
					}
					row.controlId = controlId
				}
				//					console.log(row.controlId)
				this.moduleId = row.id
				this.$refs.childterdetails.getMethodState()
				setTimeout(() => {
					this.$refs.childterdetails.getState(row)
				}, 0)
				//调用子组件方法
			} else {
				let row = {}
				this.moduleId = 999
				//2022-2-24 ?
				// this.$refs.childterdetails.getMethodState()
				setTimeout(() => {
					this.$refs.childterdetails.getState(row)
				}, 0)
			}
		},
		//点击表格行，发送参数
		selectQu(row, column) {
			console.log(`build up ----- selectQu ----- row, column`, row, column)
			console.log('点击行', row)
			if (column.type == 'selection') return //多选列不影响此方法
			this.$refs.multipleTable.clearSelection()
			//清空原来有的勾选
			if (row.online) {
				this.selectArr = []
				if (this.selectArr.indexOf(row.id) == -1) this.selectArr.push(row.id)
				this.$refs.multipleTable.toggleRowSelection(row, true) //勾选当前列
				this.groupName = row.ext_info && row.ext_info.groupName ? row.ext_info.groupName : ''
				//调用子组件方法
				try {
					this.$refs.childterdetails.setGroupName(this.groupName)
					this.$refs.childterdetails.timerOut()
				} catch (e) {
					console.log('setGroupName')
				}
			} else {
				this.caozuo = true
				setTimeout(() => {
					this.$refs.childterdetails.getState(row)
				}, 0)
			}
			this.rows = row //传参给子组件
			this.moduleId = row.id
		},
		//刷新列表
		openFullScreen() {
			this.getDeviceList(this.currentPage, this.pageSize)
			this.timerOut() //开始轮询
			this.fullscreenLoading = true
			setTimeout(() => {
				this.fullscreenLoading = false
			}, 500)
		},
		//点击详情
		operaTions(row) {
			this.$refs.multipleTable.clearSelection()
			this.rows = row //传参给子组件
			this.moduleId = row.id
			this.caozuo = false
			setTimeout(() => {
				this.$refs.childterdetails.getState(row)
			}, 0)
		},
		//点击返回
		back() {
			if (this.selectArr.length > 0) {
				this.selectArr = Array.from(new Set(this.selectArr))
				this.caozuo = true
				this.$refs.multipleTable.clearSelection()
				this.moduleId = this.selectArr[0]
				for (let index = 0; index < this.tableData.length; index++) {
					if (this.tableData[index].id == this.moduleId) {
						setTimeout(() => {
							app.$refs.multipleTable.toggleRowSelection(this.tableData[index])
							app.$refs.childterdetails.setGroupName(this.groupName)
							app.$refs.childterdetails.getMethodState()
							setTimeout(app.$refs.childterdetails.getState(this.moduleId), 0)
						}, 0)
						return
					}
				}
			}
		},
		//获取地理位置
		getState() {
			this.api.operation
				.getState()
				.then(res => {
					//					console.log(res)
					this.datas = res.data.place_info
					if (this.datas) {
						for (let one of this.datas) {
							if (one.items) {
								for (let two of one.items) {
									if (two.items) {
										for (let tree of two.items) {
											if (tree.items) {
												for (let four of tree.items) {
													four.disabled = true
												}
											}
										}
									}
								}
							}
						}
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//筛选
		screenArea() {
			this.dialogScreen = true
		},
		//确认筛选
		trueScreen(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let id = ''
					if (this.screenForm.position) {
						id = this.screenForm.position[this.screenForm.position.length - 1]
					}
					let keyword = this.screenForm.keyword
					this.getDeviceList(this.currentPage, this.pageSize, keyword, id)
					this.timerOut(keyword, id) //加了条件的轮询
					this.dialogScreen = false
					this.stiteScreen = true
				}
			})
		},
		//清除筛选
		eliminate() {
			this.stiteScreen = false
			this.getDeviceList(this.currentPage, this.pageSize)
			this.timerOut() //开始轮询
		},
		//指定区域发生变化时触发
		caderChange() {
			this.$refs.elcascader.dropDownVisible = false
		},
		//获取url列表
		getLink() {
			this.api.config
				.getLink(0, 10) //只显示前10个
				.then(res => {
					//					console.log(res)
					this.controlUrl = res.data.link_list.list
				})
				.catch(err => {
					console.log(err)
				})
		},
		//外部跳转
		jumpOutside(item) {
			window.open(item.data.url)
		},
		//多选屏蔽离线设备
		selectOffline(row) {
			//  console.log(this.selectArr);
			if (row.online) {
				// if(this.selectArr.length==0) return true
				if ((this.groupName ? this.groupName : '') == (row.ext_info.groupName ? row.ext_info.groupName : '')) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		},
		//距离浏览器高度
		boxScrollx() {
			if (window.pageYOffset >= 150) {
				//					let heights = this.$refs.header.offsetHeight + 50
				this.bigHeight = window.pageYOffset - 140
			} else {
				this.bigHeight = 0
			}
		},
		//跳转到其他模块页面
		goControl() {
			this.$router.push('/internet/control')
		}
	},
	destroyed() {
		//页面跳转，清除定时器
		window.clearInterval(this.timer)
	}
}
</script>

<style>
.el-form-item {
	margin-bottom: 0.1px;
}

.terminal-detail .signal .list .el-radio-group .el-radio {
	margin: 5px 5px;
}

.el-radio__label {
	margin-left: -5px;
}

.ter-right {
	height: 780px;
	width: 100%;
	background: #fff;
	float: right !important;
	overflow-y: auto;
}

.box {
	padding: 10px;
	box-sizing: border-box;
}

.el-switch {
	float: right;
}

.el-switch {
	margin-top: 10px;
}

.mgt {
	margin-top: 20px;
}

.wdt {
	width: 100%;
}

.tac {
	text-align: center;
}

.el-radio__label {
	margin-left: 5px;
}
.links {
	margin: 0 10px;
}
.iconclass {
	font-size: 22px;
}
</style>
