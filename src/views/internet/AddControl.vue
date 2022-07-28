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
					<el-breadcrumb-item>物联网</el-breadcrumb-item>
					<el-breadcrumb-item>指令模块</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<h1 class="title">
				<span class="xin">指令信息</span>
			</h1>
		</el-header>
		<el-main>
			<el-row>
				<h3 class="alt">
					<i class="el-icon-s-help">指令控制</i>
					<span class="ins">
						<el-button type="success" size="small" @click="scriptList()">脚本列表</el-button>
						<el-button type="primary" size="small" @click="refreshTable">刷新列表</el-button>
						<el-button type="success" size="small" @click="addInstructions">新增指令</el-button>
					</span>
				</h3>
				<el-table border :data="tableData" :row-key="getRowKeys" :expand-row-keys="expands" @row-click="toggleRowExpansion">
					<el-table-column type="expand" width="60" label="查看子指令">
						<template slot-scope="scope">
							<el-button type="success" size="small" class="childInts" @click="addChild(scope.row)">新增子指令</el-button>
							<!-- 子指令表格 -->
							<el-table :data="scope.row.options" border>
								<el-table-column property="id" label="id" width="50" align="center"></el-table-column>
								<el-table-column prop="attr" label="属性" :formatter="childFormatter" width="50" align="center"> </el-table-column>
								<el-table-column prop="modes" label="模式" width="100" align="center"></el-table-column>
								<el-table-column prop="target" label="目标" width="100" align="center"></el-table-column>
								<el-table-column prop="type" label="类型" width="60" align="center"></el-table-column>
								<el-table-column prop="data" label="数据" width="200" align="center"></el-table-column>
								<el-table-column prop="seq" label="序号" width="60" align="center"></el-table-column>
								<el-table-column prop="comment" label="备注" width="100" align="center"></el-table-column>
								<el-table-column label="操作" align="center">
									<template slot-scope="scope">
										<el-button type="primary" size="small" @click="postChild(scope.row)">模拟发送</el-button>
										<el-button type="success" size="small" :disabled="scope.row.disabledScript" @click="lookScript(scope.row)"
											>查看脚本</el-button
										>
										<el-button type="warning" size="small" @click="modifyChlidInts(scope.row)">修改</el-button>
										<el-button type="danger" size="small" @click="deleteInts(scope.row.id, false)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</el-table-column>
					<el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
					<el-table-column align="center" prop="name" label="名称" width="200">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.name" v-if="scope.row.edit"></el-input>
							<span v-else>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="预设" width="80">
						<template slot-scope="scope">
							<i v-if="scope.row.preseted == true" class="el-icon-check"></i>
							<i v-else class="el-icon-close"></i>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="enableds" label="状态" width="80"> </el-table-column>
					<el-table-column align="center" prop="comment" label="备注" width="200">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.comment" v-if="scope.row.edit == true"></el-input>
							<span v-else>{{ scope.row.comment }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="count" label="子令个数" width="50"> </el-table-column>
					<el-table-column align="center" label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button type="primary" size="small" v-if="scope.row.enabled == true" @click="modifyInstructions(false, scope.row)"
								>禁用</el-button
							>
							<el-button type="success" size="small" v-else @click="modifyInstructions(true, scope.row)">启用</el-button>
							<el-button type="success" size="small" @click="postAnalog(scope.row)">模拟发送</el-button>
							<el-button type="warning" size="small" @click="modifyEdit(scope.row)">修改</el-button>
							<el-button type="danger" size="small" @click="deleteInts(scope.row.id, true)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					class="pagin"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
				<el-dialog :visible.sync="dialogInts" width="40%">
					<h2 class="attrmode">{{ intname }}</h2>
					<el-form :model="addInts" :rules="Intsrules" ref="addInts" label-width="150px">
						<el-form-item label="填写指令名称(汉字)" prop="comment">
							<el-input v-model="addInts.comment" placeholder="请输入汉字"></el-input>
						</el-form-item>
						<el-form-item label="填写指令句柄(字母)">
							<el-input v-model="addInts.name" placeholder="请输入英文名称或字母(如不填将随机生成)"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogInts = false">取 消</el-button>
						<el-button type="primary" @click="trueInts('addInts')" v-if="!intstate">确 定</el-button>
						<el-button type="primary" v-else @click="trueInts('addInts')">确定修改</el-button>
					</div>
				</el-dialog>
				<el-dialog :visible.sync="dialogChild" width="50%">
					<el-form :model="addIntChild" :rules="Intchildrules" ref="addIntChild" label-width="150px">
						<h2 class="attrmode">{{ childTitle }}</h2>
						<el-form-item label="指令控制模式" prop="mode">
							<el-select v-model="addIntChild.mode" placeholder="请选择指令控制模式" @change="intsChange" clearable>
								<el-option v-for="item in modeoptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="指令属性(attr)" prop="attr">
							<el-input :disabled="isExpansionMode" v-model="addIntChild.attr" placeholder="请输入指令属性"></el-input>
						</el-form-item>
						<el-form-item label="指令目标地址" prop="target">
							<el-input v-model="addIntChild.target" placeholder="必须是偶数(十六进制)例:11"></el-input>
						</el-form-item>
						<el-form-item label="指令数据类型" prop="type">
							<el-input v-model="addIntChild.type" placeholder="必须是偶数(十六进制)例:22"></el-input>
						</el-form-item>
						<el-form-item label="指令数据值(data)" prop="data">
							<el-select v-model="addIntChild.data" placeholder="请选择" v-if="scriptSelect" clearable>
								<el-option v-for="item in script" :label="item.name" :value="item.id" :key="item.id"> </el-option>
							</el-select>
							<el-input v-model="addIntChild.data" placeholder="常规模式时填写十六进制,脚本模式时填写脚本名称" v-else></el-input>
						</el-form-item>
						<el-form-item label="序号" v-show="modifyState">
							<el-input class="no-number" type="number" v-model.number="addIntChild.seq" placeholder="优先级，越小越高"></el-input>
						</el-form-item>
						<el-form-item label="指令备注" prop="comment">
							<el-input v-model="addIntChild.comment" placeholder="例如: 开或关"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="childOrderDialogCancel">取 消</el-button>
						<el-button type="primary" @click="trueIntsChild('addIntChild')" v-if="!modifyState">确 定</el-button>
						<el-button type="primary" @click="trueChildModify('addIntChild')" v-else>确定修改</el-button>
					</div>
				</el-dialog>

				<el-dialog title="模拟发送" :visible.sync="transmission" width="30%" center>
					<span class="transmissions"
						>必须输入属性才能控制设置，例如："灯光控制"为主指令，那么必然有"开灯"、"关闭"两种控制属性，因此可以指定attr: 0为"关灯"，attr:
						1为开灯</span
					>
					<el-form :model="transmissionForm" :rules="formAnalog" ref="transmissionForm" label-width="130px">
						<el-form-item label="请输入属性(attr)" prop="attr">
							<el-input v-model="transmissionForm.attr" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="transmission = false">取 消</el-button>
						<el-button type="primary" @click="trueAnalog('transmissionForm')">确 定</el-button>
					</div>
				</el-dialog>
				<el-dialog center title="数据" :visible.sync="alertAnalog" width="50%">
					<ul>
						<li v-for="(item, index) in arrAnalog" :key="item.index">
							{{ index + 1 }}:<span class="alertAnalogcolor">{{ item }}</span>
						</li>
					</ul>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="alertAnalog = false">确 定</el-button>
					</span>
				</el-dialog>
				<el-dialog center title="数据(子指令)" :visible.sync="alertAnalogchild" width="50%">
					<span class="alertchild">{{ arrAnalogchild }}</span>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="alertAnalogchild = false">确 定</el-button>
					</span>
				</el-dialog>
				<el-dialog title="请输入测试数据" :visible.sync="jsalertAnalog" width="30%" center>
					<span>脚本模式指令需要输入json格式数据，请在下方输入</span>
					<el-form :model="jstransmissionForm" :rules="jsformAnalog" ref="jstransmissionForm">
						<el-form-item prop="measure">
							<el-input v-model="jstransmissionForm.measure"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="jsalertAnalog = false">取 消</el-button>
						<el-button type="primary" @click="truejsAnalog('jstransmissionForm')">确 定</el-button>
					</div>
				</el-dialog>
				<el-dialog center title="数据" :visible.sync="checkScript" width="80%">
					<el-input type="textarea" :rows="15" v-model="scriptContent"></el-input>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="checkScript = false">关 闭</el-button>
					</span>
				</el-dialog>
				<el-dialog title="脚本列表" :visible.sync="dialogScriptList" width="80%">
					<span class="childInts">
						<el-button type="primary" size="small" @click="scriptList()">刷新列表</el-button>
						<el-button type="success" size="small" @click="addScript()">新增脚本</el-button>
					</span>
					<el-table :data="tableScriptlist" border>
						<el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
						<el-table-column prop="name" label="名称" width="200" align="center"></el-table-column>
						<el-table-column prop="checksum" label="校验和" width="350" align="center"></el-table-column>
						<el-table-column prop="avaiables" label="是否有效" width="60" align="center"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="success" size="small" @click="checkScripts(scope.row)">查看脚本</el-button>
								<el-button type="warning" size="small" @click="modifyName(scope.row)">修改名称</el-button>
								<el-button type="warning" size="small" @click="modifyContent(scope.row)">修改/调试</el-button>
								<el-button type="danger" size="small" @click="deleteJs(scope.row.id)">删除</el-button>
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
						:total="totaljs"
					>
					</el-pagination>
				</el-dialog>
				<el-dialog center title="新建脚本" :visible.sync="newScript" width="40%">
					<el-tabs type="border-card">
						<el-tab-pane label="手动输入">
							<el-form :model="newjsForm" :rules="newjsrules" ref="newjsForm">
								<el-form-item label="脚本名称" prop="name" label-width="80px">
									<el-input v-model="newjsForm.name"></el-input>
								</el-form-item>
								<el-form-item label="脚本内容" prop="content">
									<el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="newjsForm.content"> </el-input>
								</el-form-item>
							</el-form>
							<span>
								<el-button type="text" @click="newScript = false">取消</el-button>
								<el-button type="primary" @click="trueNewjs('newjsForm')">确 定</el-button>
							</span>
						</el-tab-pane>
						<el-tab-pane label="文件上传">
							<el-upload
								ref="upload"
								class="upload-demo"
								action="/upload/script"
								:limit="3"
								accept="lua"
								:file-list="fileList"
								:auto-upload="false"
								:before-remove="beforeRemove"
								:on-success="handleSuccess"
								:on-error="handleError"
								:on-exceed="handleExceed"
							>
								<el-button slot="trigger" size="small" type="primary"><i class="el-icon-circle-plus-outline"></i>选取文件</el-button>
								<el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload"
									><i class="el-icon-upload2"></i>上传到服务器</el-button
								>
								<div slot="tip" class="el-upload__tip">只能上传.lua文件，且不超过1M</div>
							</el-upload>
						</el-tab-pane>
					</el-tabs>
				</el-dialog>
				<el-dialog title="修改脚本名称" :visible.sync="dialogModifyName" width="30%">
					<el-form :model="newjsForm" :rules="newjsrules" ref="newjsForm">
						<el-form-item label="脚本名称" prop="name" label-width="80px">
							<el-input v-model="newjsForm.name" class="md2"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogModifyName = false">取 消</el-button>
						<el-button type="primary" @click="trueDialogModifyName('newjsForm')">确 定</el-button>
					</div>
				</el-dialog>
				<el-dialog title="修改脚本内容" :visible.sync="dialogModifyContent">
					<el-form :model="newjsForm" :rules="newjsrules" ref="newjsForm">
						<el-form-item label="脚本内容" prop="content">
							<el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="newjsForm.content"> </el-input>
						</el-form-item>
					</el-form>
					<el-form :model="testForm" :rules="testrules" ref="testForm" class="testregion">
						<span class="testtip">此圈内为代码调试区域(仅供测试)</span>
						<el-form-item label="method" prop="method">
							<el-input v-model="testForm.method"></el-input>
						</el-form-item>
						<el-form-item label="attr" prop="attr">
							<el-input v-model="testForm.attr"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="testSubmitForm('testForm')">调试</el-button>
							<el-button @click="resetForm('testForm')">重置</el-button>
						</el-form-item>
						<el-form-item>
							<div class="testres">
								<span>调试结果：{{ testRegion.status }}</span>
								<el-divider></el-divider>
								<span>脚本数据：{{ testRegion.result }}</span>
							</div>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogModifyContent = false">取 消</el-button>
						<el-button type="primary" @click="trueDialogModifyContent('newjsForm')">确定修改</el-button>
					</div>
				</el-dialog>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		let validateAttr = (rule, value, callback) => {
			if (!this.isExpansionMode && (value ?? '') === '') {
				callback(new Error('该模式必须填写'))
			} else {
				callback()
			}
		}
		return {
			weizhi: [],
			options0: [],
			ip: '',
			serial: '',
			tableData: [],
			tableChild: [],
			childTitle: '',
			total: 2,
			totaljs: 1,
			dialogChild: false,
			modeoptions: [
				{
					value: '0',
					label: '常规模式'
				},
				{
					value: '1',
					label: '脚本模式'
				},
				{
					value: '2',
					label: '扩展模式'
				}
			],
			addInts: {
				enabled: '',
				name: '',
				comment: ''
			},
			addIntChild: {
				mode: '',
				attr: '',
				target: '',
				type: '',
				data: '',
				seq: '',
				comment: ''
			},
			Intsrules: {
				//					name: [{
				//							required: true,
				//							message: '请输入任务名称',
				//							trigger: 'blur'
				//						},
				//						{
				//							pattern: /^[a-zA-Z]+$/,
				//							message: '请输入英文字母且不能有空格!',
				//							trigger: 'blur'
				//						}
				//					],
				comment: [
					{
						required: true,
						message: '请输入指令备注',
						trigger: 'blur'
					},
					{
						pattern: /^[\u4E00-\u9FA5]+$/,
						message: '请输入中文名称且不能有空格!',
						trigger: 'blur'
					}
				]
			},
			Intchildrules: {
				mode: [
					{
						required: true,
						message: '请选择指令控制模式',
						trigger: 'change'
					}
				],
				attr: [
					{
						validator: validateAttr
					}
				],
				target: [
					{
						required: true,
						message: '请输入指令地址',
						trigger: 'blur'
					}
				],
				type: [
					{
						required: true,
						message: '请输入数据类型',
						trigger: 'blur'
					}
				],
				data: [
					{
						required: true,
						message: '请输指令数据值',
						trigger: 'blur'
					}
				],
				comment: [
					{
						required: true,
						message: '请输指令备注',
						trigger: 'blur'
					}
				]
			},
			dialogInts: false,
			intstate: false,
			formLabelWidth: '120px',
			childRow: {},
			modifyInts: false,
			modifyID: '',
			modifyState: false,
			script: [],
			scriptSelect: false,
			isExpansionMode: false,
			deleteVisible: false,
			transmission: false,
			alertAnalog: false,
			newScript: false,
			newjsForm: {
				name: '',
				content: ''
			},
			newRow: {},
			newjsrules: {
				name: [
					{
						required: true,
						message: '请输入脚本名称',
						trigger: 'blur'
					}
				],
				content: [
					{
						required: true,
						message: '请输入脚本内容',
						trigger: 'blur'
					}
				]
			},
			transmissionForm: {
				attr: 0
			},
			formAnalog: {
				attr: [
					{
						required: true,
						message: '请输入指令属性',
						trigger: 'blur'
					}
				]
			},
			analogId: '',
			arrAnalog: [],
			alertAnalogchild: false,
			arrAnalogchild: [],
			alertChildid: '',
			jstransmissionForm: {
				measure: ''
			},
			jsformAnalog: {
				measure: [
					{
						required: true,
						message: '请输入数据',
						trigger: 'blur'
					}
				]
			},
			jsalertAnalog: false,
			checkScript: false,
			scriptContent: '',
			dialogScriptList: false,
			tableScriptlist: [
				{
					id: 1,
					name: 'test',
					checksum: 'bb46acf001e62aa90e3cbfc452f793f2ee1dec27',
					avaiable: true
				}
			],
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			currentPage1: 1,
			pageSize1: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			fileList: [],
			dialogModifyName: false,
			dialogModifyContent: false,
			modifyjsid: '',
			testForm: {
				method: '',
				attr: ''
			},
			testrules: {
				method: [
					{
						required: true,
						message: '请输入method数据',
						trigger: 'blur'
					}
				],
				attr: [
					{
						required: true,
						message: '请输入attr数据',
						trigger: 'blur'
					}
				]
			},
			testRegion: {
				status: '',
				result: ''
			},
			intname: '',
			getRowKeys(row) {
				return row.id
			},
			expands: []
		}
	},
	created: function () {
		this.getInstructions()
	},
	methods: {
		childFormatter(row) {
			if (0 > row.attr) return '-'
			return row.attr
			// switch (parseInt(row.mode)) {
			// 	case 0:
			// 		return 0
			// 	case 1:
			// 		return 1
			// 	default:
			// 		return '-'
			// }
		},
		// 子指令弹出框取消
		childOrderDialogCancel() {
			this.dialogChild = false
			this.isExpansionMode = false
			this.$refs['addIntChild'].resetFields()
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取所有指令
		getInstructions() {
			this.api.addcontrol.getInstructions(this.currentPage - 1, this.pageSize).then(res => {
				// console.log(res)
				this.tableData = res.data.cmd_info_list.cmd_property_list
				this.total = res.data.cmd_info_list.total
				if (this.tableData) {
					for (let item of this.tableData) {
						if (item.options) {
							for (let opt of item.options) {
								if (opt.mode == 0) {
									opt.modes = `常规模式`
									opt.disabledScript = true
								} else if (opt.mode == 2) {
									opt.modes = `扩展模式`
									opt.disabledScript = true
								} else {
									opt.modes = '-'
									opt.modes = `脚本模式`
									opt.disabledScript = false
								}
							}
						}
						if (item.enabled == true) {
							item.enableds = `启用`
						} else {
							item.enableds = `禁用`
						}
					}
				}
			})
		},
		//条数
		handleSizeChange(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.getInstructions()
			//      console.log(`每页 ${val} 条`)
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getInstructions()
		},
		refreshTable() {
			this.getInstructions()
		},
		//增加根指令
		addInstructions() {
			this.intname = `创建根指令`
			this.addInts = {}
			this.dialogInts = true
			this.intstate = false
		},
		//确定增加根指令
		trueInts(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let parameter = {
						name: this.addInts.name,
						comment: this.addInts.comment
					}
					if (this.intstate) {
						//修改
						this.api.addcontrol
							.modifyInstructions(this.modifyID, parameter)
							.then(() => {
								this.getInstructions()
								this.modifyInts = false
								this.dialogInts = false
								this.$message({
									message: '修改成功',
									type: 'success'
								})
							})
							.catch(err => {
								console.log(err)
							})
					} else {
						//新增
						this.api.addcontrol
							.trueInts(0, parameter)
							.then(() => {
								//								console.log(res)
								this.dialogInts = false
								this.getInstructions()
								this.$message({
									message: '创建成功',
									type: 'success'
								})
							})
							.catch(err => {
								console.log(err)
							})
					}
				} else {
					return false
				}
			})
		},
		//确认修改根指令
		determineModify(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let parameter = {
						enabled: this.addInts.enabled,
						name: this.addInts.name,
						comment: this.addInts.comment
					}
					this.api.addcontrol
						.modifyInstructions(this.modifyID, parameter)
						.then(() => {
							this.getInstructions()
							this.modifyInts = false
							this.$message({
								message: '修改成功',
								type: 'success'
							})
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					return false
				}
			})
		},
		//修改根指令
		modifyEdit(row) {
			this.intname = `修改根指令`
			this.addInts.enabled = row.enabled
			this.addInts.name = row.name
			this.addInts.comment = row.comment
			this.modifyID = row.id
			//				this.modifyInts = true
			this.intstate = true
			this.dialogInts = true
		},
		//新增子指令
		addChild(row) {
			console.log(`build up ----- addChild ----- row`, row)
			this.childRow = row
			this.modifyState = false
			this.dialogChild = true
			this.addIntChild = {}
			this.childTitle = `创建子指令`
			this.isExpansionMode = false
		},
		//确定新增子指令
		trueIntsChild(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let mode = parseInt(this.addIntChild.mode)
					// let attr =
					// 	mode === 2 ? '-' : parseInt(this.addIntChild.attr)
					let parameter = {
						id: this.childRow.id,
						mode,
						target: this.addIntChild.target,
						type: this.addIntChild.type,
						data: this.addIntChild.data,
						comment: this.addIntChild.comment
					}
					this.api.addcontrol
						.trueInts(1, parameter)
						.then(() => {
							//								console.log(res)
							this.dialogChild = false
							this.getInstructions()
							this.expands = []
							this.expands.push(this.childRow.id) //默认展开本行
							this.$message({
								message: '创建成功',
								type: 'success'
							})
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					return false
				}
			})
		},
		//修改子指令
		modifyChlidInts(row) {
			this.newRow = { ...row }
			if (this.newRow.mode === 2) {
				this.isExpansionMode = true
			}
			this.modifyState = true
			this.dialogChild = true
			this.addIntChild = this.newRow
			this.addIntChild.mode = String(this.newRow.mode)
			console.log(`build up ----- modifyChlidInts ----- this.addIntChild.mode`, this.addIntChild.mode)
			this.childTitle = `修改子指令`
		},
		//确认修改子指令
		trueChildModify(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let mode = parseInt(this.addIntChild.mode)
					let attr = mode === 2 ? '-' : parseInt(this.addIntChild.attr)
					let parameter = {
						attr,
						mode,
						target: this.addIntChild.target,
						type: this.addIntChild.type,
						data: this.addIntChild.data,
						seq: this.addIntChild.seq,
						comment: this.addIntChild.comment
					}

					this.api.addcontrol
						.trueChildModify(this.addIntChild.id, parameter)
						.then(() => {
							//								console.log(res)
							this.dialogChild = false
							this.getInstructions()
							//								this.expands//默认展开本行
							this.$message({
								message: '修改成功',
								type: 'success'
							})
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					return false
				}
			})
		},
		//启用、禁用根指令
		modifyInstructions(operation, row) {
			let parameter = {
				enabled: operation
			}
			this.api.addcontrol
				.modifyInstructions(row.id, parameter)
				.then(() => {
					this.getInstructions()
					this.$message({
						message: '操作成功',
						type: 'success'
					})
				})
				.catch(err => {
					console.log(err)
				})
		},
		//常规和脚本模式切换
		intsChange(callback) {
			console.log(`build up ----- intsChange ----- callback`, callback)
			// 常规
			if (callback == 0) {
				this.addIntChild.attr = 0
				this.isExpansionMode = false
				this.scriptSelect = false
			} else if (callback == 1) {
				this.addIntChild.attr = 1
				this.isExpansionMode = false
				this.scriptSelect = true
				this.api.addcontrol
					.intsChange()
					.then(res => {
						this.script = res.data.script_info_list.script_property_list
						if (this.script) {
							for (let item of this.script) {
								item.id = `id:${item.id}`
							}
						}
					})
					.catch(err => {
						console.log(err)
					})
			} else {
				this.addIntChild.attr = '-'
				this.isExpansionMode = true
				this.scriptSelect = false
			}
		},
		//确定删除指令
		deleteInts(id, zhu) {
			this.$confirm('此操作将永久删除改指令, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					if (zhu) {
						this.api.addcontrol
							.deleteInts(id)
							.then(() => {
								let totalPage = Math.ceil((this.total - 1) / this.pageSize)
								let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
								this.currentPage = currentPage < 1 ? 1 : currentPage
								this.getInstructions()
							})
							.catch(err => {
								console.log(err)
							})
					} else {
						this.api.addcontrol
							.deleteChildInts(id)
							.then(res => {
								console.log(res)
								this.getInstructions()
							})
							.catch(err => {
								console.log(err)
							})
					}
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
		//模拟发送根指令
		postAnalog(row) {
			this.transmission = true
			this.analogId = row
		},
		//确认模拟发送
		trueAnalog(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.api.addcontrol
						.trueAnalog(this.analogId.id, this.transmissionForm.attr)
						.then(res => {
							this.arrAnalog = []
							this.arrAnalog = res.data.data
							this.transmission = false
							this.alertAnalog = true
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					return false
				}
			})
		},
		//模拟发送子指令
		postChild(row) {
			this.alertChildid = row.id
			if (row.mode == 0) {
				this.api.addcontrol
					.postChild(row.id)
					.then(res => {
						this.arrAnalogchild = res.data.data
						this.alertAnalogchild = true
					})
					.catch(err => {
						console.log(err)
					})
			} else {
				this.jsalertAnalog = true
			}
		},
		//模拟发送子指令(脚本模式)
		truejsAnalog(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let parameter = {
						measure: parseInt(this.jstransmissionForm.measure)
					}
					this.api.addcontrol
						.postChild(this.alertChildid, parameter)
						.then(res => {
							this.jsalertAnalog = false
							this.alertAnalogchild = true
							this.arrAnalogchild = res.data.data
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					return false
				}
			})
		},
		//查看脚本
		lookScript(row) {
			this.api.addcontrol
				.lookScript(row.id)
				.then(res => {
					this.scriptContent = ''
					this.scriptContent = res.data
					this.checkScript = true
				})
				.catch(err => {
					console.log(err)
				})
		},
		//查看脚本(列表)
		checkScripts(row) {
			this.api.addcontrol
				.checkScripts(row.id)
				.then(res => {
					this.scriptContent = ''
					this.scriptContent = res.data
					this.checkScript = true
				})
				.catch(err => {
					console.log(err)
				})
		},
		//脚本列表
		scriptList() {
			this.dialogScriptList = true
			this.api.addcontrol
				.scriptList(this.currentPage1 - 1, this.pageSize1)
				.then(res => {
					this.tableScriptlist = res.data.script_info_list.script_property_list
					this.totaljs = res.data.script_info_list.total
					if (this.tableScriptlist) {
						for (let item of this.tableScriptlist) {
							if (item.avaiable == true) {
								item.avaiables = `是`
							} else {
								item.avaiables = `否`
							}
						}
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//脚本条数
		handleSizeChange1(val) {
			this.pageSize1 = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.scriptList()
			//			      console.log(`每页 ${val} 条`);
		},
		//脚本页数
		handleCurrentChange1(val) {
			this.currentPage1 = val
			this.scriptList()
			//			      console.log(`当前页: ${val}`);
		},
		//删除脚本
		deleteJs(id) {
			this.$confirm('此操作将永久删除该脚本, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.addcontrol
						.deleteJs(id)
						.then(() => {
							let totalPage = Math.ceil((this.totaljs - 1) / this.pageSize1)
							let currentPage = this.currentPage1 > totalPage ? totalPage : this.currentPage1
							this.currentPage1 = currentPage < 1 ? 1 : currentPage
							this.scriptList()
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
		//新增脚本
		addScript() {
			this.newScript = true
		},
		//确定新增脚本
		trueNewjs(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let parameter = {
						headers: {
							'Content-Type': 'text/plain'
						}
					}
					this.api.addcontrol
						.trueNewjs(name, this.newjsForm.content, parameter)
						.then(() => {
							this.scriptList()
							this.newScript = false
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					return false
				}
			})
		},
		//上传到服务器
		submitUpload() {
			if (this.$refs.upload.uploadFiles.length == 0) {
				this.$message.warning(`请选取上传的文件`)
			} else {
				this.$refs.upload.submit()
			}
		},
		//上传成功
		handleSuccess(response) {
			//				console.log(response)
			if (response) {
				for (let item of response) {
					if (item.result == false) {
						this.$notify.error({
							title: '失败',
							message: `文件类型或名称重复`
						})
					} else {
						this.$notify.error({
							title: '成功',
							message: `文件上传成功`
						})
						this.newScript = false
						this.scriptList()
					}
				}
			}
		},
		//上传失败
		handleError() {
			//				console.log(err)
			this.$notify.error({
				title: '错误',
				message: `文件上传失败`
			})
		},
		//文件超出个数限制时
		handleExceed(file, fileList) {
			this.$message.warning(`只能选择 ${this.limits} 个文件，当前共选择了 ${file.length + fileList.length} 个`)
		},
		//移除上传文件
		beforeRemove(file) {
			this.$confirm(`确定移除 ${file.name}？`)
		},
		//修改脚本名称
		modifyName(row) {
			this.modifyjsid = row.id
			this.dialogModifyName = true
			this.newjsForm.name = row.name
		},
		//确认修改脚本名称
		trueDialogModifyName(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let parameter = {
						name: this.newjsForm.name,
						headers: {
							'Content-Type': 'application/json'
						}
					}
					this.api.addcontrol
						.trueDialogModifyName(this.modifyjsid, parameter)
						.then(() => {
							this.scriptList()
							this.dialogModifyName = false
							this.$message({
								type: 'success',
								message: '修改成功!'
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
		//修改脚本内容
		modifyContent(row) {
			this.modifyjsid = row.id
			this.dialogModifyContent = true
			this.api.addcontrol
				.checkScripts(this.modifyjsid)
				.then(res => {
					this.newjsForm.content = res.data
				})
				.catch(err => {
					console.log(err)
				})
		},
		//确认修改脚本内容
		trueDialogModifyContent(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let parameter = {
						headers: {
							'Content-Type': 'text/plain'
						}
					}
					this.api.addcontrol
						.trueDialogModifyContent(this.modifyjsid, this.newjsForm.content, parameter)
						.then(() => {
							this.scriptList()
							this.dialogModifyContent = false
							this.$message({
								type: 'success',
								message: '修改成功!'
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
		//调试
		testSubmitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.api.addcontrol.testSubmitForm(this.modifyjsid, this.testForm.method, this.testForm.attr).then(res => {
						//          	console.log(res)
						this.testRegion.status = res.data.status
						this.testRegion.result = res.data.result
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//重置
		resetForm(formName) {
			this.$refs[formName].resetFields()
		},
		//展开行
		toggleRowExpansion(row) {
			//				console.log(row)
			if (this.expands.length > 0) {
				for (let item of this.expands) {
					if (item == row.id) {
						this.expands = []
					} else {
						this.expands = []
						this.expands.push(row.id)
					}
				}
			} else {
				this.expands = []
				this.expands.push(row.id)
			}
		}
	}
}
</script>

<style scoped="">
.title {
	display: block;
	font-size: 18px;
	padding-bottom: 5px;
	border-bottom: 1px solid #b3b3b3;
	margin-top: 5px;
	font-weight: 400;
	line-height: 29px;
}

.xin {
	margin-right: 70px;
}

.add-terminal-box {
	margin-top: 10px;
	background: #fff;
}

.query {
	padding: 10px 20px;
	box-sizing: border-box;
	margin-top: 15px;
	font-size: 12px;
	overflow: hidden;
}

.pagin {
	margin-top: 20px;
	text-align: right;
}

.location {
	float: left;
	line-height: 28px;
}

.ins {
	float: right;
	margin-right: 50px;
}

.ziling {
	color: red;
}

.ip {
	float: left;
	line-height: 28px;
	margin-left: 5%;
	margin-right: 50px;
}

.ip span {
	margin-right: 50px;
}

.childInts {
	float: right;
	margin-bottom: 10px;
}

.transmissions {
	display: block;
	margin-bottom: 30px;
	color: #999;
}

.alertAnalogcolor {
	margin-left: 10px;
	font-weight: 600;
}

.alertchild {
	text-align: center;
	font-weight: 600;
	display: block;
}

.ipcon {
	color: #a8a8a8;
}

.col-list {
	padding: 10px;
}

.alt {
	font-size: 16px;
	font-weight: 600;
	color: #7176b7;
	background: #f0f0f0;
	padding: 12px 15px;
	box-sizing: border-box;
	overflow: hidden;
}

.box {
	padding: 10px 15px;
	box-sizing: border-box;
	background: #fff;
}

.elform {
	width: 19%;
	display: inline-block;
}

.set-voice {
	box-sizing: border-box;
	outline: 0;
	overflow: hidden;
}

.box1 {
	overflow: hidden;
}

.shuru {
	float: left;
	width: 49%;
	padding: 15px 10px;
	box-sizing: border-box;
}

.v-title {
	font-size: 15px;
	text-align: center;
	margin-bottom: 20px;
}

.t {
	width: 20%;
	text-align: right;
	padding-right: 15px;
	font-size: 12px;
	line-height: 60px;
	display: inline-block;
}

.val {
	width: 75%;
	margin-bottom: 15px;
	float: right;
}

.wai {
	display: inline-block;
	width: 40%;
	margin-right: 15px;
	position: relative;
	top: 15px;
}

.waishu {
	display: inline-block;
}

.line {
	width: 1px;
	height: 260px;
	background: #dcdfe6;
	margin-top: 55px;
	float: left;
}

.testregion {
	border: 2px solid red;
	/*background-color: #606266;*/
	padding: 5px;
}

.testres {
	border: 1px solid #000000;
	margin: 5px;
}

.testtip {
	color: red;
	text-align: center;
	display: block;
}
.el-dialog {
	width: 30%;
}
.attrmode {
	text-align: center;
	margin-bottom: 20px;
}
</style>
35 あア　いイ　うウ　えエ　おオ かカ　きキ　くク　けケ　こコ さサ　しシ　すス　せセ　そソ たタ　ちチ　つツ　てテ　とト なナ　にニ　ぬヌ　ねネ　のノ
はハ　ひヒ　ふフ　へヘ　ほホ まマ　みミ　むム　めメ　もモ
