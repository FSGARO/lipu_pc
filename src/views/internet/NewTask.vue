<template>
	<el-container>
		<el-header>
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>物联任务</el-breadcrumb-item>
					<el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main style="background-color: #fff; margin: 0 20px">
			<el-row style="width: 80%">
				<el-col :span="24"
					><h3 class="title title_c">{{ title }}</h3></el-col
				>
				<el-col :span="24">
					<div class="grid-content bg-purple-dark">
						<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
							<h3 class="title n-p">任务信息</h3>
							<el-form-item label="任务名称" prop="name" class="is-required">
								<el-input v-model="ruleForm.name" style="width: 150px"></el-input>
							</el-form-item>
							<h3 class="title n-p">任务操作</h3>
							<el-form-item>
								<el-table
									class="mdl"
									:row-key="getRowKeys"
									ref="controlTable"
									:data="tableInstruce"
									tooltip-effect="dark"
									style="width: 70%"
									@selection-change="handleSelectionChange"
								>
									<el-table-column :reserve-selection="true" type="selection" width="55" align="center"> </el-table-column>
									<el-table-column prop="name" label="指令名称" width="120" align="center">
										<!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
									</el-table-column>
									<el-table-column prop="comment" label="指令方法" width="120" align="center"> </el-table-column>
									<el-table-column prop="options" label="指令属性" width="150" align="center">
										<template slot-scope="scope">
											<el-select v-model="scope.row.select" clearable placeholder="请选择" @change="optionsChange">
												<el-option v-for="item in scope.row.options" :key="item.id" :label="item.comment" :value="item.id">
												</el-option>
											</el-select>
										</template>
									</el-table-column>
									<el-table-column prop="additional" label="指令附加数据" show-overflow-tooltip align="center">
										<template slot-scope="scope">
											<el-input size="small" v-model="scope.row.additional"></el-input>
										</template>
									</el-table-column>
								</el-table>
								<el-pagination
									class="pagin"
									@size-change="handleSizeChange1"
									@current-change="handleCurrentChange1"
									:current-page="currentPage1"
									:page-sizes="[10, 20, 50, 100]"
									:page-size="pageSize1"
									layout="total, sizes, prev, pager, next, jumper"
									:total="controltotal"
								>
								</el-pagination>
							</el-form-item>
							<h3 class="title n-p">位置选择<span class="color">必填</span></h3>
							<el-form-item class="is-required" prop="selectLocation">
								<el-tree
									:data="datas"
									show-checkbox
									node-key="id"
									ref="tree"
									highlight-current
									:props="ruleForm.selectLocation"
									@check-change="handleCheckChange"
									class="mdl"
									:default-checked-keys="checkKeys"
								>
								</el-tree>
							</el-form-item>
							<h3 class="title n-p">执行时间</h3>
							<el-form-item label="重复" class="t-list mdl">
								<el-radio-group v-model="ruleForm.repeatMode" @change="selectionType">
									<el-radio v-for="(item, index) in modeTasks" :key="index" :label="index - 1">{{ item }}</el-radio>
								</el-radio-group>
								<div class="time">
									<el-row v-show="cur !== -1">
										<el-col :span="7" v-for="(item, index) in ruleForm.datatime" :key="index">
											<el-form-item label="运行时间" class="is-required">
												<el-time-picker
													type="date"
													style="width: 60%"
													v-model="item.value"
													placeholder="选择时间点"
													value-format="HH:mm:ss"
													@change="timeChange"
												>
												</el-time-picker>
												<span v-if="index > 0" class="remove el-icon-circle-close" @click="deleteTimes(index)"></span>
											</el-form-item>
										</el-col>
										<el-col class="line" :span="2">
											<span class="add-col el-icon-plus" @click="add"></span>
										</el-col>
									</el-row>
									<el-row v-show="cur == 2">
										<el-col :span="7" v-for="(item, index) in arrDays" :key="index">
											<el-form-item label="日期" class="is-required">
												<el-date-picker
													type="date"
													style="width: 60%"
													v-model="item.value"
													placeholder="选择日期"
													value-format="M, d"
												>
												</el-date-picker>
												<span v-if="index > 0" class="remove el-icon-circle-close" @click="deleteDays(index)"></span>
											</el-form-item>
										</el-col>
										<el-col class="line" :span="2">
											<span class="add-col el-icon-plus" @click="addDays"></span>
										</el-col>
									</el-row>
									<el-row v-show="cur == 3">
										<el-form-item label="星期" class="is-required">
											<el-checkbox-group v-model="ruleForm.repeatWeeks" @change="changeweek">
												<el-checkbox v-for="(week, index) in weeks" :label="index" :key="index">{{ week }}</el-checkbox>
											</el-checkbox-group>
										</el-form-item>
									</el-row>
								</div>
							</el-form-item>

							<el-form-item style="margin-left: 100px">
								<el-button type="primary" @click="taskNew('ruleForm')" v-if="taskStake == 0">立即创建</el-button>
								<el-button type="primary" @click="taskNew('ruleForm')" v-else>立即修改</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			title: '新建任务',
			key: '',
			ruleForm: {
				name: '',
				selectLocation: {
					children: 'items',
					label: 'name'
				},
				repeatMode: -1,
				repeatWeeks: [],
				datatime: [
					{
						value: ''
					}
				]
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入任务名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 25,
						message: '长度在 1到 25 个字符',
						trigger: 'blur'
					}
				],
				selectLocation: [
					{
						required: true,
						message: '请选择位置',
						trigger: 'change'
					}
				]
			},
			datatime: [
				{
					value: ''
				}
			],
			arrDays: [
				{
					value: ''
				}
			],
			dengguang: false,
			dengvalue: false,
			dengdisabled: true,
			touyingji: false,
			tyjvalue: false,
			projectorabled: true,
			tyjkgdisabled: true,
			shuruyuan: 0,
			input2: '',
			shebei: false,
			datas: [],
			weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			cur: -1,
			modeTasks: ['按需', '单次', '每天', '指定日期', '按周重复', '法定节假日', '非法定节假日'],
			repeatProp: [],
			opTions: {},
			clock: [],
			taskId: '',
			taskStake: 0,
			enabled: '',
			checktree: [],
			oplist: [],
			tableInstruce: [],
			optionsInstruce: [],
			currentPage1: 1,
			pageSize1: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			controltotal: 1,
			hastableInstruce: [],
			checkKeys: [],
			devicesync: [],
			newdevicesync: [],
			taskid: '',
			getRowKeys(row) {
				return row.id
			}
		}
	},
	created: function () {
		this.getState()
		if (this.taskStake == 0) {
			//新建任务时直接加载
			this.getControl()
		}
	},
	mounted() {
		//获取修改任务信息
		if (this.$route.query.taskid) {
			this.taskid = this.$route.query.taskid
			this.getModifyTask(this.$route.query.taskid)
			//				this.allgetControl()
		} else {
			this.taskStake = 0
			this.title = `新建任务`
		}
	},
	methods: {
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//立即创建
		taskNew(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					//判断不同任务类型的repeatProp值
					if (this.ruleForm.repeatMode == 2) {
						this.repeatProp = []
						for (let item of this.arrDays) {
							if (item.value) {
								let values = item.value.split(',')
								values.forEach(item => {
									this.repeatProp.push(+item)
								})
							}
							//								else {
							//									this.$alert('日期没有填写完或者没有删除完', {dangerouslyUseHTMLString: true})
							//									return false
							//								}
						}
					} else if (this.ruleForm.repeatMode == 3) {
						this.repeatProp = this.ruleForm.repeatWeeks
					} else {
						this.repeatProp = null
					}

					this.oplist = []
					for (let item of this.newdevicesync) {
						for (let opt of item.options) {
							if (item.select == opt.id) {
								this.oplist.push({
									mode: 0,
									method: item.name,
									attr: parseInt(opt.attr),
									data: item.additional
								})
							}
						}
					}

					//把运行时间放进数组中
					this.clock = []
					for (let item of this.ruleForm.datatime) {
						if (item.value) {
							this.clock.push(item.value)
						}
						//							else {
						//								this.$alert('运行时间没有填写完或者没有删除完', {dangerouslyUseHTMLString: true})
						//								return false
						//							}
					}
					//判断播放位置选择
					//						if(this.checktree == '') {
					//							this.$alert('请选择播放位置', {dangerouslyUseHTMLString: true})
					//								return false
					//						}

					//参数
					this.opTions = {
						place: this.checktree,
						oplist: this.oplist
					}
					console.log(`build up ----- taskNew ----- this.oplist`, this.oplist)
					let params = {
						name: this.ruleForm.name,
						plan: {
							clock: this.clock,
							repeat: {
								mode: this.ruleForm.repeatMode,
								porp: this.repeatProp
							}
						},
						options: this.opTions
					}
					//						console.log(params)
					//						return
					if (this.taskStake == 1) {
						this.api.newctask
							.taskModify(this.taskid, 'modify', params)
							.then(() => {
								//								console.log(data)
								this.$message({
									message: '修改成功',
									type: 'success'
								})
								this.$router.push({
									path: '/internet/index'
								})
							})
							.catch(err => {
								console.log(err)
							})
					} else {
						this.api.newctask
							.taskNew(0, params)
							.then(() => {
								//									console.log(data)
								this.$message({
									message: '创建成功',
									type: 'success'
								})
								this.$router.push({
									path: '/internet/index'
								})
							})
							.catch(err => {
								console.log(err)
							})
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//获取修改任务
		getModifyTask(id) {
			this.api.controltask
				.getModifyTask(id)
				.then(res => {
					//					console.log(res)
					this.allgetControl(res.data.task_info_list.task_property_list[0])
				})
				.catch(err => {
					console.log(err)
				})
		},
		//获取修改函数
		async allgetControl(rows) {
			this.taskStake = 1
			this.title = `修改任务`
			this.ruleForm.name = rows.name
			this.checkKeys = rows.actions.place //位置
			for (let ple of this.checkKeys) {
				this.checktree.push(ple)
			}
			let hasInstruces = rows.actions.oplist
			console.log(`build up ----- allgetControl ----- hasInstruces`, hasInstruces)
			let res = await this.api.addcontrol.getInstructions(0, 999)
			this.tableInstruces = res.data.cmd_info_list.cmd_property_list
			for (let tbes of this.tableInstruces) {
				for (let has of hasInstruces) {
					if (tbes.name == has.method) {
						tbes.attr = has.attr
						tbes.data = has.data
						this.devicesync.push(tbes)
					}
				}
			}
			this.ruleForm.repeatMode = rows.repeat_mode
			if (this.ruleForm.repeatMode == 2) {
				this.selectionType(rows.repeat_mode)
				this.arrDays = []
				let days = rows.repeat_prop.toString()
				this.arrDays.push({ value: days })
				//					console.log(this.arrDays)
			} else if (this.ruleForm.repeatMode == 3) {
				this.ruleForm.repeatWeeks = rows.repeat_prop
				this.selectionType(rows.repeat_mode)
			} else {
				this.selectionType(rows.repeat_mode)
			}
			this.ruleForm.datatime = []
			if (rows.clock) {
				for (let item of rows.clock) {
					this.ruleForm.datatime.push({ value: item })
				}
			}
			this.getControl()
		},
		//获取地理位置
		getState() {
			this.api.operation
				.getState()
				.then(res => {
					//					console.log(res)
					this.datas = res.data.place_info
				})
				.catch(err => {
					console.log(err)
				})
		},
		//选择执行时间的类型
		selectionType(callback) {
			if (callback == -1) {
				this.cur = -1
			} else if (callback == 0) {
				this.cur = 0
			} else if (callback == 1) {
				this.cur = 1
			} else if (callback == 2) {
				this.cur = 2
			} else if (callback == 3) {
				this.cur = 3
			} else if (callback == 4) {
				this.cur = 4
			} else if (callback == 5) {
				this.cur = 5
			}
		},
		//添加时间
		add() {
			this.datatime.push({})
		},
		//删除时间
		deleteTimes(index) {
			this.datatime.splice(index, 1)
		},
		//增加日期
		addDays() {
			this.arrDays.push({})
		},
		//删除日期
		deleteDays(index) {
			this.arrDays.splice(index, 1)
		},
		//选择周几
		changeweek(value) {
			this.ruleForm.repeatWeeks = value
		},
		//运行时间改变
		timeChange() {
			//				console.log(value)
		},
		//获取任务操作列表
		getControl() {
			this.api.addcontrol
				.getInstructions(this.currentPage1 - 1, this.pageSize1)
				.then(res => {
					//					console.log(res)
					this.tableInstruce = res.data.cmd_info_list.cmd_property_list
					this.controltotal = res.data.cmd_info_list.total
					if (this.devicesync.length > 0) {
						this.$nextTick(() => {
							//勾选
							for (let item of this.devicesync) {
								// FIXME 选择时有问题
								for (let dec of this.tableInstruces) {
									if (item.id == dec.id) {
										this.$nextTick(() => {
											this.$refs.controlTable.toggleRowSelection(dec, true)
										})
										for (let atr of dec.options) {
											if (atr.attr == item.attr) {
												dec.select = atr.id
											}
										}
										dec.data = item.data
									}
								}
							}
						})
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//条数
		handleSizeChange1(val) {
			this.pageSize1 = val
			localStorage.setItem('pageSize', this.pageSize1)
			// localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10
			this.getControl()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange1(val) {
			this.currentPage1 = val
			this.getControl()
			//      console.log(`当前页: ${val}`);
		},
		//选择表格类目
		handleSelectionChange(val) {
			this.newdevicesync = val.map(e => {
				console.log(e)
				return e
			})
			console.log(`build up ----- handleSelectionChange ----- this.newdevicesync`, this.newdevicesync)
		},
		//指令选择
		optionsChange() {
			//				console.log(value)
		},
		//位置选择
		handleCheckChange() {
			let checkData = this.$refs.tree.getCheckedNodes()
			this.checktree = []
			checkData.forEach(item => {
				this.checktree.push(item.id)
			})
		}
	}
}
</script>

<style scoped>
.is-required {
	margin: 20px 0 20px 5px;
}

.n-p {
	height: 42px;
	width: 100%;
	line-height: 42px;
	background: #ecf0f6;
	padding-left: 10px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	font-size: 15px;
}

.radoes {
	margin-left: 20px;
}

.el-input__inner {
	width: 150px;
}

.add-col {
	width: 27px;
	height: 27px;
	background: #7176b7;
	border-radius: 5px;
	margin-top: 25px;
	color: #fff;
	text-align: center;
	line-height: 27px;
	font-size: 16px;
	cursor: pointer;
}

.remove {
	color: #f56c6c;
	cursor: pointer;
}
.title {
	margin-bottom: 20px;
}
.title_c {
	text-align: center;
}
.pagin {
	margin: 0 0 50px 40%;
}
.mdl {
	margin-left: 40px;
	margin-bottom: 30px;
}
</style>
