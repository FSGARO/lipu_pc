<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>校园一卡通</el-breadcrumb-item>
					<el-breadcrumb-item>卡片列表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<el-row>
				<el-button type="primary" size="small" icon="el-icon-upload" @click="uploadCard">表格上传</el-button>
				<el-button type="primary" size="small" icon="el-icon-zoom-in" @click="addCard">创建新卡</el-button>
				<el-button type="primary" size="small" icon="el-icon-copy-document" @click="batchCard">批量写卡</el-button>
				<el-button type="primary" size="small" icon="el-icon-edit-outline" @click="batchReviseCard">批量修改卡</el-button>
				<el-button type="primary" size="small" icon="el-icon-copy-document" @click="allCard">全部写卡</el-button>
				<el-button type="success" size="small" icon="el-icon-edit-outline" @click="readCard">读取卡片</el-button>
				<el-button type="success" size="small" icon="el-icon-tickets" @click="rightCrad">校准时间</el-button>
				<el-button type="warning" size="small" icon="el-icon-s-shop" @click="cacheCrad">清除卡缓存</el-button>
				<el-button type="warning" size="small" icon="el-icon-s-open" @click="basicCrad">清除基本卡</el-button>
				<el-button type="danger" size="small" icon="el-icon-delete" @click="recoveryCrad">恢复出厂设置</el-button>
				<el-button type="danger" size="small" icon="el-icon-delete" @click="stopCrad">停止执行任务</el-button>
				<div class="soso">
					<el-input placeholder="请输入内容" v-model="cardName" class="input-with-select" @keyup.enter.native="getCardList('', cardName)">
						<el-button
							slot="append"
							icon="el-icon-search"
							style="background-color: #67c23a; color: #fff"
							@click="getCardList('', cardName)"
						></el-button>
					</el-input>
				</div>
				<el-table border :data="tableData" class="cardlist" @select="selectChange" @select-all="allSelectChange">
					<el-table-column type="selection" width="50" align="center"> </el-table-column>
					<el-table-column align="center" prop="id" width="60" label="id"> </el-table-column>
					<el-table-column align="center" prop="card_id" label="卡号" width="100"> </el-table-column>
					<el-table-column align="center" prop="level" label="卡类型" width="100"> </el-table-column>
					<el-table-column align="center" prop="username" label="用户名" width="120"></el-table-column>
					<el-table-column align="center" prop="level_name" label="管理用户" width="80"></el-table-column>
					<el-table-column align="center" prop="refer_cnt" label="已下发数" width="80"></el-table-column>
					<el-table-column align="center" prop="comment" label="卡备注" width="120"></el-table-column>
					<el-table-column align="center" prop="create_time" label="创建时间" width="150" :formatter="formatDate"></el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="issueList(scope.row)" :disabled="scope.row.refer_cnt <= 0"
								>下发列表</el-button
							>
							<el-button type="warning" size="mini" @click="modifyCard(scope.row)">修改</el-button>
							<el-button type="danger" size="mini" @click="deleteWork(scope.row.id)">删除</el-button>
							<el-button type="danger" size="mini" @click="deleteRead(scope.row.id)">读卡器中删除</el-button>
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
				<el-dialog title="表格上传" :visible.sync="uploadDialog" width="30%" center>
					<el-tabs type="border-card" @tab-click="tabClick">
						<el-tab-pane label="非模板格式">
							<el-form :model="uploadForm" status-icon :rules="uploadRules" ref="uploadForm" label-width="160px" class="demo-ruleForm">
								<el-form-item label="表格起始行">
									<el-input v-model.number="uploadForm.start"></el-input>
								</el-form-item>
								<el-form-item label="表格卡片所在行" prop="idcard">
									<el-input v-model.number="uploadForm.idcard"></el-input>
								</el-form-item>
								<el-form-item label="表格权限/级别所在列">
									<el-input v-model.number="uploadForm.level"></el-input>
								</el-form-item>
								<el-form-item label="表格用户名所在列">
									<el-input v-model.number="uploadForm.username"></el-input>
								</el-form-item>
								<el-form-item label="表格卡备注所在列">
									<el-input v-model.number="uploadForm.comment"></el-input>
								</el-form-item>
							</el-form>
						</el-tab-pane>
						<el-tab-pane label="模板格式">
							模板地址下载:<el-link type="primary" href="/app/v1/account/idcard/template">下载模板</el-link>
						</el-tab-pane>
					</el-tabs>
					<el-upload
						class="upload-demo"
						ref="upload"
						action="/upload/idcard"
						:file-list="fileList"
						:auto-upload="false"
						:before-remove="beforeRemove"
						:on-success="handleSuccess"
						:on-error="handleError"
						:limit="limits"
						:on-exceed="handleExceed"
						:data="cardData"
					>
						<el-button slot="trigger" size="small" type="primary"><i class="el-icon-circle-plus-outline"></i>选取文件</el-button>
						<el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload"
							><i class="el-icon-upload2"></i>立即上传</el-button
						>
						<div slot="tip" v-show="uptip" class="el-upload__tip">你上传的文件格式不对或者文本太大</div>
					</el-upload>
				</el-dialog>
				<el-dialog :visible.sync="addDialog" width="40%" :close-on-click-modal="false" center>
					<h3 class="titles">{{ cardTitles }}</h3>
					<el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" @submit.native.prevent>
						<el-form-item label="卡号" prop="idcard">
							<el-input style="width: 50%" v-model="addForm.idcard" placeholder="卡号采用十六进制" :disabled="midifyStatic"></el-input
							><span style="margin-left: 10px">取值:00 00 00 01-FF FF FF FE</span>
						</el-form-item>
						<el-form-item label="权限/级别" prop="level">
							<el-select v-model="addForm.level" placeholder="请输入权限/级别">
								<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in cardlevel"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="用户名">
							<el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item label="备注">
							<el-input v-model="addForm.comment" placeholder="请输入备注"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="tac">
						<el-button @click="addDialog = false">取 消</el-button>
						<el-button type="primary" @click="trueAddCard('addForm')" v-if="!midifyStatic">确 定</el-button>
						<el-button type="primary" @click="trueMidifyCard('addForm')" v-else>修 改</el-button>
					</div>
				</el-dialog>
				<!-- FIXME 批量修改卡(变量未定义) -->
				<el-dialog :visible.sync="reviseDialog" width="40%" :close-on-click-modal="false" center>
					<h3 class="titles">批量修改卡</h3>
					<el-form :model="reviseForm" :rules="reviseRules" ref="reviseForm" label-width="100px" @submit.native.prevent>
						<el-form-item label="修改项" prop="field">
							<el-select v-model="reviseForm.field" placeholder="请选择修改项" @change="handleReviseChange">
								<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in cardModifyItem"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="isBatchModifyLevel" label="值" prop="value">
							<el-select v-model="reviseForm.value" placeholder="请选择权限/级别">
								<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in cardlevel"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-else label="值">
							<el-input v-model="reviseForm.value" placeholder="请输入修改值"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="tac">
						<el-button @click="handleReviseDialogCancel('reviseForm')">取 消</el-button>
						<el-button type="primary" @click="trueBatchReviseCard('reviseForm')">修 改</el-button>
					</div>
				</el-dialog>
				<el-dialog title="已同步列表" :visible.sync="dialogSync" width="40%" :close-on-click-modal="false" center>
					<p class="red">以下数据为缓存，如需获取设备端数据，请点击“重新同步”</p>
					<p class="red">总条数为:{{ syncNum }}</p>
					<el-table :data="syncData" border style="width: 100%">
						<el-table-column prop="id" label="ID" width="180" align="center"> </el-table-column>
						<el-table-column prop="card_id" label="卡号" width="180" align="center"> </el-table-column>
						<el-table-column prop="sync_time" label="同步时间" align="center" :formatter="formatDate"> </el-table-column>
					</el-table>
					<el-pagination class="footers" background layout="prev, pager, next" :total="syncNum"> </el-pagination>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogSync = false">取 消</el-button>
						<el-button type="primary" @click="resynChronize">重新同步</el-button>
					</div>
				</el-dialog>
				<el-dialog :visible.sync="dialogCalibration" width="30%" :close-on-click-modal="false" center>
					<h3 class="titlediao">{{ cardTitle }}</h3>
					<el-form :model="cardForm" :rules="cardRules" ref="cardForm">
						<el-form-item label="请选择教室" label-width="120px" prop="classrooms">
							<el-cascader
								:show-all-levels="false"
								style="width: 200px"
								v-model="cardForm.classrooms"
								:options="options"
								:props="positionProps"
								:key="cardKey"
								@change="handleChange"
								clearable
							></el-cascader>
						</el-form-item>
					</el-form>
					<div slot="footer" class="diafool">
						<el-button @click="dialogCalibration = false">取 消</el-button>
						<el-button type="primary" @click="trueBatchCard('cardForm')" v-if="batchStatic">批量写卡</el-button>
						<el-button type="primary" @click="trueAllCard('cardForm')" v-if="allStatic">全部写卡</el-button>
						<el-button type="primary" @click="trueReadCard('cardForm')" v-else-if="readStatic">读取卡片</el-button>
						<el-button type="primary" @click="trueRightCrad('cardForm')" v-else-if="righStatic">马上校准</el-button>
						<el-button type="primary" @click="trueCacheCrad('cardForm')" v-else-if="cacheStatic">清楚卡缓存</el-button>
						<el-button type="primary" @click="trueBasicCrad('cardForm')" v-else-if="basicStatic">清除基本卡</el-button>
						<el-button type="primary" @click="trueRecoveryCrad('cardForm')" v-else-if="recoveryStatic">恢复出厂设置</el-button>
						<el-button type="primary" @click="trueStopCard('cardForm')" v-else-if="stopStatic">停止执行任务</el-button>
						<el-button type="primary" @click="trueDeleteCard('cardForm')" v-else-if="deleteStatic">读卡中删除</el-button>
					</div>
				</el-dialog>
				<el-dialog title="已下发列表" :visible.sync="dialogissue" width="40%" :close-on-click-modal="false" center>
					<p class="red">当前卡号：{{ issues.card_id }}</p>
					<p class="red">级别：{{ issues.level_name }}</p>
					<p class="red">备注：{{ issues.comment }}</p>
					<p class="red">总条数为:{{ issueNum }}</p>
					<el-table :data="issueData" border style="width: 100%">
						<el-table-column prop="devid" label="ID" width="180" align="center"> </el-table-column>
						<el-table-column prop="name" label="卡号" width="180" align="center"> </el-table-column>
						<el-table-column prop="timestamp" label="同步时间" align="center" :formatter="formatDate"> </el-table-column>
					</el-table>
					<el-pagination class="footers" background layout="prev, pager, next" :total="issueNum"> </el-pagination>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogissue = false">取 消</el-button>
					</div>
				</el-dialog>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
// import classroom from '@/components/classroomdialog/classroom';
export default {
	// components: {
	//   classroom
	// },
	data() {
		return {
			tableData: [],
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			total: 0,
			uploadDialog: false,
			uploadForm: {
				start: '',
				idcard: '',
				level: '',
				username: '',
				comment: ''
			},
			uploadRules: {
				idcard: [
					{ required: true, message: '值不能为空' },
					{ type: 'number', message: '值必须为数字值' }
				]
			},
			fileList: [],
			limits: 1,
			uptip: false,
			cardTitles: '创建新卡',
			addDialog: false,
			addForm: {
				idcard: '',
				level: '',
				username: '',
				comment: ''
			},
			addRules: {
				idcard: [{ required: true, message: '请输入卡号', trigger: 'blur' }],
				level: [{ required: true, message: '请输入权限', trigger: 'change' }]
			},
			cardlevel: [
				{ label: '管理员', value: '0' },
				{ label: '老师', value: '1' },
				{ label: '临时', value: '2' }
			],
			// TODO data配置
			reviseForm: {
				field: '',
				id: [],
				value: ''
			},
			reviseRules: {
				field: [{ required: true, message: '请选择修改项', trigger: 'change' }],
				value: [{ required: true, message: '请填写修改值', trigger: 'change' }]
			},
			cardModifyItem: [
				{ label: '权限/级别', value: 'level' },
				{ label: '用户名', value: 'username' },
				{ label: '备注', value: 'comment' }
			],
			isBatchModifyLevel: false,
			allSelect: 0,
			syncData: [],
			dialogSync: false,
			syncNum: 0,
			dialogCalibration: false,
			cardForm: {
				classrooms: []
			},
			cardRules: {
				classrooms: [{ required: true, message: '请选择教室', trigger: 'change' }]
			},
			options: [],
			cardKey: 0,
			positionProps: {
				value: 'id',
				label: 'name',
				children: 'items'
			},
			cardTitle: '',
			batchStatic: false,
			readStatic: false,
			allStatic: false,
			righStatic: false,
			cacheStatic: false,
			basicStatic: false,
			recoveryStatic: false,
			stopStatic: false,
			deleteStatic: false,
			cardIndex: 0,
			listCardId: [],
			cardData: {},
			midifyStatic: false,
			midifyId: '',
			cardName: '',
			dialogissue: false,
			issueNum: '',
			issueData: [],
			issues: {},
			reviseDialog: false
		}
	},
	created: function () {
		this.getCardList()
	},
	methods: {
		// TODO 批量修改方法
		handleReviseDialogCancel(fromName) {
			this.reviseDialog = false
			this.resetForm(fromName)
			this.reviseForm.value = ''
		},
		// 重置表单
		resetForm(fromName) {
			this.$refs[fromName].resetFields()
		},
		handleReviseChange(e) {
			this.isBatchModifyLevel = e === 'level'
			this.reviseForm.value = ''
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取卡列表
		getCardList(id, keyword = '') {
			this.api.cardlist
				.getCardList(this.currentPage - 1, this.pageSize, id, keyword)
				.then(res => {
					// console.log(res)
					if (res.data.list.idcard_list) {
						this.tableData = res.data.list.idcard_list
						this.total = res.data.list.total
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//条数
		handleSizeChange(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.getCardList()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getCardList()
			//      console.log(`当前页: ${val}`);
		},
		//下发列表
		issueList(row) {
			// console.log(row)
			this.issues = row
			let keyword = ''
			this.api.cardlist
				.getCardList(this.currentPage - 1, this.pageSize, row.id, keyword)
				.then(res => {
					// console.log(res)
					if (res.data.list.idcard_list) {
						this.issueData = res.data.list.idcard_list[0].refer_list
						this.issueNum = res.data.list.idcard_list[0].refer_cnt
						this.dialogissue = true
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//时间格式
		formatDate(row, column, cellValue, index) {
			// console.log(row, column, cellValue, index)
			if (cellValue) {
				return this.moment(cellValue * 1000).format('YYYY-MM-DD HH:mm:ss')
			} else {
				return ''
			}
		},
		//tab
		tabClick(callback) {
			if (callback.index == 1) {
				this.cardIndex = 1
			} else {
				this.cardIndex = 0
			}
		},
		//表格上传
		uploadCard() {
			this.uploadDialog = true
		},
		//上传到服务器
		submitUpload() {
			//				console.log(this.$refs.upload.uploadFiles)
			if (this.cardIndex == 1) {
				this.cardData = {
					idcard: ''
				}
			} else {
				this.cardData = {
					start: this.uploadForm.start,
					idcard: this.uploadForm.idcard,
					level: this.uploadForm.level,
					username: this.uploadForm.username,
					comment: this.uploadForm.comment
				}
			}
			// console.log(this.cardData)
			if (this.$refs.upload.uploadFiles.length == 0) {
				this.$message.warning(`请选取上传的文件`)
			} else {
				console.log('开始上传')
				this.$refs.upload.submit()
			}
		},
		//上传成功
		handleSuccess(response, file, fileList) {
			// console.log(response, file, fileList)
			this.uploadDialog = false
		},
		//上传失败
		handleError(err) {
			// console.log(err)
			this.$notify.error({
				title: '错误',
				message: `文件上传失败`
			})
		},
		//文件超出个数限制时
		handleExceed(file, fileList) {
			//				console.log(fileList)
			this.$message.warning(`只能选择 ${this.limits} 个文件，当前共选择了 ${file.length + fileList.length} 个`)
		},
		//移除上传视频
		beforeRemove(file) {
			this.$confirm(`确定移除 ${file.name}？`)
		},
		//创建新卡
		addCard() {
			this.addDialog = true
			this.cardTitles = '创建新卡'
			this.midifyStatic = false
		},
		//确定新增卡
		trueAddCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						idcard: this.addForm.idcard,
						level: this.addForm.level * 1,
						username: this.addForm.username,
						comment: this.addForm.comment
					}
					this.api.cardlist
						.trueAddCard(params)
						.then(res => {
							console.log(res)
							this.getCardList()
							this.$message({
								type: 'success',
								message: '增加成功'
							})
							this.addDialog = false
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
		//选择
		selectChange(selection, row) {
			// console.log(selection)
			this.allSelect = selection.length
			if (selection) {
				this.listCardId = []
				for (let item of selection) {
					this.listCardId.push(item.id)
				}
			} else {
				this.listCardId = []
			}
		},
		//全选、反选
		allSelectChange(selection) {
			// console.log(selection)
			this.allSelect = selection.length
			if (selection) {
				this.listCardId = []
				for (let item of selection) {
					this.listCardId.push(item.id)
				}
			} else {
				this.listCardId = []
			}
		},
		//批量写卡
		batchCard() {
			if (this.allSelect > 0) {
				this.cardForm.classrooms = []
				this.getClassroom()
				this.cardTitle = '批量写卡'
				this.batchStatic = true
				this.dialogCalibration = true
			} else {
				this.$message('请选择卡片！')
			}
		},
		//确定批量写卡
		trueBatchCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1],
						list: this.listCardId
					}
					this.publicCard('write', params)
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// TODO 批量修改卡
		batchReviseCard() {
			if (this.allSelect > 0) {
				this.reviseDialog = true
			} else {
				this.$message('请选择卡片！')
			}
		},
		// TODO 确认修改卡
		trueBatchReviseCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						...this.reviseForm,
						id: this.listCardId
					}
					this.publicCard('edit_batch', params)
					this.handleReviseDialogCancel('reviseForm')
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//全部写卡
		allCard() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '读取卡片'
			this.allStatic = true
			this.batchStatic = false
			this.dialogCalibration = true
		},
		//确定全部写卡
		trueAllCard(formName) {
			let params = {
				areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1],
				list: [0]
			}
			this.publicCard('write', params)
			this.allStatic = false
			this.dialogCalibration = false
		},
		//读取卡片
		readCard() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '读取卡片'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = true
			this.dialogCalibration = true
		},
		//确认读取卡片
		trueReadCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					}
					let areaid = this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					this.publicCard('read', params)
					this.api.cardlist
						.getCache(areaid, this.currentPage - 1, this.pageSize)
						.then(res => {
							console.log(res)
							this.syncData = res.data.list.idcard_list
							this.syncNum = res.data.list.total
							this.dialogCalibration = false
							this.readStatic = false
							this.dialogSync = true
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
		//重新同步
		resynChronize() {
			let params = {
				areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
			}
			this.publicCard('read', params)
			this.dialogSync = fasle
		},
		//校准时间
		rightCrad() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '校准时间'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = false
			this.righStatic = true
			this.dialogCalibration = true
		},
		//确定校准校准
		trueRightCrad(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					}
					this.publicCard('timesync', params)
					this.righStatic = false
					this.dialogCalibration = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//清除卡缓存
		cacheCrad() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '清除卡的缓存'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = false
			this.righStatic = false
			this.cacheStatic = true
			this.dialogCalibration = true
		},
		//确定清除卡缓存
		trueCacheCrad(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					}
					this.publicCard('delete_al', params)
					this.cacheStatic = false
					this.dialogCalibration = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//清除基本卡
		basicCrad() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '清除基本卡'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = false
			this.righStatic = false
			this.cacheStatic = false
			this.basicStatic = true
			this.dialogCalibration = true
		},
		//确定清除基本卡
		trueBasicCrad(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					}
					this.publicCard('delete_remote', params)
					this.basicStatic = false
					this.dialogCalibration = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//恢复出厂设置
		recoveryCrad() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '恢复出厂设置'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = false
			this.righStatic = false
			this.cacheStatic = false
			this.basicStatic = false
			this.recoveryStatic = true
			this.dialogCalibration = true
		},
		//确定恢复出厂设置
		trueRecoveryCrad(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					}
					this.publicCard('factory', params)
					this.recoveryStatic = false
					this.dialogCalibration = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//读卡器中删除
		deleteRead(id) {
			this.deleteCardId = id
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '在读卡器中删除'
			this.deleteStatic = true
			this.dialogCalibration = true
		},
		//确定读卡器中删除
		trueDeleteCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						areaid: this.cardForm.classrooms[this.cardForm.classrooms.length - 1],
						id: this.deleteCardId
					}
					this.publicCard('delete_remote', params)
					this.deleteStatic = false
					this.dialogCalibration = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//NOTE 异步操作公共函数
		publicCard(method, params) {
			this.api.cardlist
				.operationCard(method, params)
				.then(res => {
					console.log(res)
					this.getCardList()
					this.dialogCalibration = false
					if (res.data.result.code == 0) {
						this.$message({
							type: 'success',
							message: '操作成功'
						})
					} else {
						this.$message({
							type: 'error',
							message: '批量操作失败，设备只有‘闲置’状态才能操作'
						})
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//停止执行任务
		stopCrad() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '停止执行任务'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = false
			this.righStatic = false
			this.cacheStatic = false
			this.basicStatic = false
			this.recoveryStatic = false
			this.stopStatic = true
			this.dialogCalibration = true
		},
		//确定停止执行任务
		trueStopCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let areaid = this.cardForm.classrooms[this.cardForm.classrooms.length - 1]
					this.api.cardlist
						.trueStopCard(areaid)
						.then(res => {
							console.log(res)
							this.getCardList()
							this.stopStatic = false
							this.dialogCalibration = false
							this.$message({
								type: 'success',
								message: '成功停止任务'
							})
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
		//读卡器中删除
		recoveryCrad() {
			this.cardForm.classrooms = []
			this.getClassroom()
			this.cardTitle = '恢复出厂设置'
			this.allStatic = false
			this.batchStatic = false
			this.readStatic = false
			this.righStatic = false
			this.cacheStatic = false
			this.basicStatic = false
			this.recoveryStatic = false
			this.recoveryStatic = true
			this.dialogCalibration = true
		},
		//获取教室设备及状态
		getClassroom() {
			this.options = []
			this.api.operation
				.getState()
				.then(res => {
					if (res.data.place_info) {
						this.options = res.data.place_info
						for (let one of res.data.place_info) {
							if (one.items) {
								for (let two of one.items) {
									if (two.items) {
										for (let tree of two.items) {
											if (tree.items) {
												for (let four of tree.items) {
													this.api.cardlist
														.getEquipmentState(four.id)
														.then(res => {
															if (res.data.result.code == 100) {
																four.name = four.name + ' (闲置)'
															} else if (res.data.result.code == 101) {
																four.name = four.name + ' (忙碌)'
															} else if (res.data.result.code == 102) {
																four.name = four.name + ' (离线)'
															} else {
																four.name = four.name + ' (未绑定)'
															}
														})
														.catch(errr => {
															console.log(console.log(err))
														})
												}
											}
										}
									}
								}
							}
						}
						this.options = [...res.data.place_info, { name: '全部教室', id: -1, comment: '' }]
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//设备状态查询
		getCardStatic(id) {
			// this.api.
		},
		//选择教室
		handleChange(value) {
			console.log(value)
		},
		//修改卡
		modifyCard(row) {
			console.log(row)
			this.addDialog = true
			this.cardTitles = '修改卡片'
			this.midifyStatic = true
			this.addForm.idcard = row.card_id
			this.addForm.level = row.level.toString()
			this.addForm.username = row.username
			this.addForm.comment = row.comment
			this.midifyId = row.id
		},
		//确定修改卡
		trueMidifyCard(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = {
						id: this.midifyId,
						level: this.addForm.level * 1,
						username: this.addForm.username,
						comment: this.addForm.comment
					}
					this.api.cardlist
						.operationCard('edit', params)
						.then(res => {
							console.log(res)
							this.getCardList()
							this.$message({
								type: 'success',
								message: '修改成功'
							})
							this.addDialog = false
							this.midifyStatic = false
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
		//删除卡
		deleteWork(id) {
			this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.cardlist
						.deleteCard(id)
						.then(res => {
							// console.log(res)
							this.getCardList()
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
						})
						.catch(err => {
							console.log(err)
						})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		}
	},
	watch: {
		//切换数据源
		options(newVal) {
			++this.cardKey
		}
	}
}
</script>

<style scoped="">
.upload-demo {
	margin: 20px auto 0;
	text-align: center;
}
.red {
	color: red;
	text-align: center;
	margin-bottom: 10px;
}
.titlediao {
	text-align: center;
	margin-bottom: 20px;
}
.cardlist {
	width: 100%;
	margin-top: 10px;
}
.titles {
	text-align: center;
	margin-bottom: 20px;
}
.soso {
	width: 20%;
	margin: 20px 0;
}
.footers {
	text-align: center;
	margin-top: 20px;
}
</style>
