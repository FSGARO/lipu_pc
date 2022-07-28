<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-04-19 10:59:26
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>教室预约</el-breadcrumb-item>
					<el-breadcrumb-item>课程表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<div class="time_box">
				<div class="chuan">
					<el-upload
						style="display: inline-block"
						class="upload-demo"
						ref="upload"
						:action="upUrl"
						:headers="urlHeader"
						:file-list="fileList"
						:auto-upload="false"
						:before-remove="beforeRemove"
						:on-success="handleSuccess"
						:on-error="handleError"
						:limit="limits"
						:on-exceed="handleExceed"
					>
						<el-button slot="trigger" size="small" type="primary"><i class="el-icon-circle-plus-outline"></i>选取课表文件</el-button>
						<el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload"
							><i class="el-icon-upload2"></i>上传到服务器</el-button
						>
						<el-button type="primary" size="small" @click="getCourseFile"><i class="el-icon-refresh"></i>刷新列表</el-button>
						<el-button type="warning" size="small" @click="convert()" :disabled="isConvert">转换并加载</el-button>
						<div slot="tip" v-show="uptip" class="el-upload__tip">你上传的文件格式不对或者文本太大</div>
					</el-upload>
				</div>
				<el-table :data="timeTable" border style="width: 60%">
					<el-table-column type="index" width="50" align="center"> </el-table-column>
					<el-table-column align="center" prop="fileName" label="名称" width="180"> </el-table-column>
					<el-table-column align="center" prop="hasMerge" label="合并中" width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.hasMerge">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="loadCourseFile(currentPage, pageSize, scope.row.id, scope.row.fileName)"
								>加载</el-button
							>
							<el-button type="primary" size="mini" @click="selectCourse(0, 1, scope.row.id, scope.row.fileName)">同步数据</el-button>
							<el-button type="danger" size="mini" @click="deleteCourse(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-divider></el-divider>
				<p class="newss" v-if="!isConvert">
					当前为<span style="color: red">{{ newClass }}</span
					>的详细内容
				</p>
				<p class="newss" v-else>当前为<span style="color: red">转换</span>后的详细内容</p>
				<el-button :disabled="isConvert" type="primary" size="mini" @click="addData">新增数据</el-button>
				<!-- 表数据 -->
				<el-table ref="tableData" border :data="tablesData" style="margin-top: 10px" v-if="!isConvert">
					<el-table-column type="index" width="50" align="center"> </el-table-column>
					<el-table-column label="课程编号" prop="courseNo" width="200" align="center"> </el-table-column>
					<el-table-column label="课程名称" prop="courseName" width="180" align="center"> </el-table-column>
					<el-table-column label="属性" prop="attribute" width="60" align="center"> </el-table-column>
					<el-table-column label="性质" prop="nature" width="100" align="center"> </el-table-column>
					<!-- <el-table-column label="教师编号" prop="teacherNo" width="100" align="center">
            </el-table-column> -->
					<el-table-column label="教师名称" prop="teacherName" width="140" align="center"> </el-table-column>
					<el-table-column label="院系" prop="department" width="120" align="center"> </el-table-column>
					<!-- <el-table-column label="课室" prop="classNo" width="100" align="center">
            </el-table-column> -->
					<el-table-column label="上课时间" prop="courseTime" width="100" align="center"> </el-table-column>
					<el-table-column label="上课地点" prop="courseAddress" width="120" align="center"> </el-table-column>
					<el-table-column label="上课周次" prop="courseWeek" width="120" align="center"> </el-table-column>
					<el-table-column align="center" prop="update" label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="delectOneCourse(scope.row.id)">删除此行</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 转换后数据 -->
				<el-table v-else ref="convertData" border :data="convertData" style="margin-top: 10px">
					<el-table-column type="index" width="50" align="center"> </el-table-column>
					<el-table-column label="教室" prop="classroomAddress" align="center"> </el-table-column>
					<el-table-column label="创建时间" prop="createTime" align="center"> </el-table-column>
					<el-table-column label="更新时间" prop="updateTime" align="center"> </el-table-column>
					<el-table-column label="操作" align="center" key="solt">
						<template #default="scope">
							<el-button @click="viewCourse(scope.row.classroomAddress)" type="text" size="small">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 课表详情 -->
				<el-dialog title="课表详情" :visible.sync="timeTableIsShow" width="90%">
					<el-table ref="courseTimetable" border :data="courseTimetable" style="margin-top: 10px">
						<el-table-column align="center" width="80" key="solt0">
							<template slot="header" slot-scope="scope99">
								<div style="margin-left: 15px">课程</div>
								<div
									style="
										height: 0px;
										border: 1px solid #808080;
										width: 40px;
										transform: rotate(45deg);
										-o-transform: rotate(45deg);
										-moz-transform: rotate(45deg);
										-webkit-transform: rotate(45deg);
									"
								></div>
								<div style="margin-right: 15px">日期</div>
							</template>
							<template #default="scope">{{ scope.row[0] ? scope.row[0] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第1节课" align="center" key="solt1">
							<template #default="scope0">{{ scope0.row[1] ? scope0.row[1] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第2节课" align="center" key="solt2">
							<template #default="scope1">{{ scope1.row[2] ? scope1.row[2] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第3节课" align="center" key="solt3">
							<template #default="scope2">{{ scope2.row[3] ? scope2.row[3] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第4节课" align="center" key="solt4">
							<template #default="scope3">{{ scope3.row[4] ? scope3.row[4] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第5节课" align="center" key="solt5">
							<template #default="scope4">{{ scope4.row[5] ? scope4.row[5] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第6节课" align="center" key="solt6">
							<template #default="scope5">{{ scope5.row[6] ? scope5.row[6] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第7节课" align="center" key="solt7">
							<template #default="scope6">{{ scope6.row[7] ? scope6.row[7] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第8节课" align="center" key="solt8">
							<template #default="scope7">{{ scope7.row[8] ? scope7.row[8] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第9节课" align="center" key="solt9">
							<template #default="scope8">{{ scope8.row[9] ? scope8.row[9] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第10节课" align="center" key="solt10">
							<template #default="scope9">{{ scope9.row[10] ? scope9.row[10] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第11节课" align="center" key="solt11">
							<template #default="scope10">{{ scope10.row[11] ? scope10.row[11] : '/' }}</template>
						</el-table-column>
						<el-table-column label="第12节课" align="center" key="solt12">
							<template #default="scope11">{{ scope11.row[12] ? scope11.row[12] : '/' }}</template>
						</el-table-column>
					</el-table>
					<span slot="footer" class="dialog-footer">
						<el-button @click="timeTableIsShow = false">取 消</el-button>
						<el-button type="primary" @click="timeTableIsShow = false">确 定</el-button>
					</span>
				</el-dialog>
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
			<!-- 重命名 -->
			<el-dialog title="修改名称" :visible.sync="dialogRename" width="30%" center>
				<el-form :model="formRename" :rules="rulesRename" ref="formRename">
					<el-form-item label="请输入新名称" :label-width="formLabelWidth" prop="name">
						<el-input v-model="formRename.name"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogRename = false">取 消</el-button>
					<el-button type="primary" @click="trueRename('formRename')">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 同步数据 -->
			<el-dialog title="同步数据(选择你相同的列属性相匹配)" :visible.sync="dialogSelect" width="40%" :close-on-click-modal="false" center>
				<p class="tips">上传课表文件时,请确保第一行是表头数据,默认用第一行数据做匹配</p>
				<el-form :model="formSelect">
					<el-form-item label="要匹配的数据(默认第一行)" :label-width="formLabelWidths" class="is-required">
						<el-select v-model="formSelect.original" placeholder="请选择要匹配的数据">
							<el-option v-for="(item, index) of selectData" :label="item" :value="index" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="匹配到的数据" :label-width="formLabelWidths" class="is-required">
						<el-select v-model="formSelect.exist" placeholder="请选择要匹配到的数据">
							<el-option v-for="(item, index) of allSelect" :label="item.label" :value="item.prop" :key="index"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogSelect = false">取 消</el-button>
					<el-button type="primary" @click="trueSelect" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
				</div>
			</el-dialog>
			<!-- <el-dialog title="请选择课程表相关的地理信息" :visible.sync="dialogCourse" width="30%" :close-on-click-modal="false" center>
        <el-form :model="formCourse" :rules="ruleCourse" ref="formCourse">
            <el-form-item label="学校名称" class="hg" prop="school">
              <el-select
                v-model="formCourse.school"
                clearable
                placeholder="请选择学校"
                @change="changeSchool($event)"
                value-key="id"
              >
                <el-option
                  v-for="item in dataCourse"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="区域名称" class="hg" prop="region">
              <el-select
                v-model="formCourse.region"
                clearable
                placeholder="请选择区域"
                value-key="id"
              >
                <el-option
                  v-for="item in optionsRegion"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入楼栋id是有几位数组成的，例:20,则是填2" prop="build">
              <el-input v-model.number="formCourse.build" placeholder="例:2则填1, 02则填2, 202则填3，问技术提供"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCourse = false">取 消</el-button>
          <el-button type="primary" @click="trueFormCourse('formCourse')">确 定</el-button>
        </div>
      </el-dialog> -->
			<!-- 新增课程数据 -->
			<el-dialog title="新增课程数据" :visible.sync="dialogAddCourse" width="30%" :close-on-click-modal="false" center>
				<el-form :model="addCourseForm" :rules="ruleAdd" ref="addCourseForm" label-width="100px">
					<el-form-item label="课程编号" prop="courseNo">
						<el-input v-model="addCourseForm.courseNo"></el-input>
					</el-form-item>
					<el-form-item label="课程名称" prop="courseName">
						<el-input v-model="addCourseForm.courseName"></el-input>
					</el-form-item>
					<el-form-item label="属性" prop="attribute">
						<el-input v-model="addCourseForm.attribute"></el-input>
					</el-form-item>
					<el-form-item label="性质" prop="nature">
						<el-input v-model="addCourseForm.nature"></el-input>
					</el-form-item>
					<el-form-item label="教师名称" prop="teacherName">
						<el-input v-model="addCourseForm.teacherName"></el-input>
					</el-form-item>
					<el-form-item label="院系" prop="department">
						<el-input v-model="addCourseForm.department"></el-input>
					</el-form-item>
					<el-form-item label="上课时间" prop="courseTime">
						<el-input v-model="addCourseForm.courseTime"></el-input>
					</el-form-item>
					<el-form-item label="上课地点" prop="courseAddress">
						<el-input v-model="addCourseForm.courseAddress"></el-input>
					</el-form-item>
					<!-- <el-form-item label="学校名称" class="hg" prop="school">
            <el-select
              v-model="addCourseForm.school"
              clearable
              placeholder="请选择学校"
              @change="changeSchool($event)"
              value-key="id"
            >
              <el-option
                v-for="item in dataCourse"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域名称" class="hg" prop="region">
            <el-select
              v-model="addCourseForm.region"
              clearable
              placeholder="请选择区域"
              @change="changeRegion($event)"
              value-key="id"
            >
              <el-option
                v-for="item in optionsRegion"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择楼栋" prop="course">
            <el-select
              v-model="addCourseForm.course"
              clearable
              placeholder="请选择楼栋"
              @change="changeBuild($event)"
              value-key="id"
            >
              <el-option
                v-for="item in optionsBuild"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择教室" prop="class">
            <el-select
              v-model="addCourseForm.class"
              clearable
              placeholder="请选择教室"
              value-key="id"
            >
              <el-option
                v-for="item in optionsClass"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
					<el-form-item label="上课周次" prop="courseWeek">
						<el-input v-model="addCourseForm.courseWeek"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogAddCourse = false">取 消</el-button>
					<el-button type="primary" @click="trueAddCourse('addCourseForm')">确定增加</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
import moment from 'moment'
export default {
	data() {
		return {
			urlHeader: {
				'S-C-Project-Session': localStorage.getItem('token')
			},
			timeTableIsShow: false,
			courseTimetable: [],
			dailyCourse: [],
			timeTable: [],
			keyName: [],
			tableData: [],
			convertData: [],
			fileList: [],
			limits: 1,
			uptip: false,
			newClass: '',
			formLabelWidth: '120px',
			formLabelWidths: '200px',
			formRename: {
				name: ''
			},
			rulesRename: {
				name: [
					{
						required: true,
						message: '请输入课程表名称',
						trigger: 'blur'
					}
				]
			},
			dialogRename: false,
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			total: 0,
			isConvert: false,
			upUrl: `${process.env.VUE_APP_BASE_API}/app/v2/course/upload`,
			courseFileId: '',
			renameId: '',
			selectData: [],
			allSelect: [],
			dialogSelect: false,
			formSelect: {
				original: '',
				exist: ''
			},
			fullscreenLoading: false,
			dialogCourse: false,
			formCourse: {
				school: '',
				region: '',
				build: ''
			},
			ruleCourse: {
				school: [{ required: true, message: '请选择学校', trigger: 'change' }],
				region: [{ required: true, message: '请选择区域', trigger: 'change' }],
				build: [
					{
						required: true,
						message: '教室id位数不能为空,如果没有则为0'
					},
					{ type: 'number', message: '教室id位数必须为数字值' }
				]
			},
			dataCourse: [],
			optionsRegion: [],
			optionsBuild: [],
			optionsClass: [],
			addCourseForm: {
				courseNo: '',
				courseName: '',
				attribute: '',
				nature: '',
				teacherName: '',
				department: '',
				courseTime: '',
				school: '',
				region: '',
				course: '',
				class: '',
				courseWeek: '',
				courseAddress: ''
			},
			ruleAdd: {
				courseNo: [
					{
						required: true,
						message: '请输入课程编号',
						trigger: 'blur'
					}
				],
				courseName: [
					{
						required: true,
						message: '请输入课程名称',
						trigger: 'blur'
					}
				],
				attribute: [{ required: true, message: '请输入属性', trigger: 'blur' }],
				nature: [{ required: true, message: '请输入性质', trigger: 'blur' }],
				teacherName: [
					{
						required: true,
						message: '请输入教师名称',
						trigger: 'blur'
					}
				],
				department: [{ required: true, message: '请输入院系', trigger: 'blur' }],
				courseTime: [
					{
						required: true,
						message: '请输入上课时间',
						trigger: 'blur'
					}
				],
				school: [{ required: true, message: '请选择学校', trigger: 'change' }],
				region: [{ required: true, message: '请选择区域', trigger: 'change' }],
				course: [{ required: true, message: '请选择楼栋', trigger: 'change' }],
				class: [{ required: true, message: '请选择教室', trigger: 'change' }],
				courseWeek: [
					{
						required: true,
						message: '请输入上课周次',
						trigger: 'blur'
					}
				],
				courseAddress: [{ required: true, message: '请输入课地点', trigger: 'blur' }]
			},
			dialogAddCourse: false
		}
	},
	created: function () {
		this.getCourseFile()
		console.log(this.formCourse)
	},
	methods: {
		// 查看教室的课程
		async viewCourse(classroomAddress) {
			let res = await this.api.curriculum.getCourse(classroomAddress)
			this.timeTableIsShow = true
			for (const key in res.data.data) {
				switch (key) {
					case '周一': {
						let arr = res.data.data[key]
						arr.unshift('周一')
						this.courseTimetable[0] = arr
						break
					}
					case '周二': {
						let arr = res.data.data[key]
						arr.unshift('周二')
						this.courseTimetable[1] = arr
						break
					}
					case '周三': {
						let arr = res.data.data[key]
						arr.unshift('周三')
						this.courseTimetable[2] = arr
						break
					}
					case '周四': {
						let arr = res.data.data[key]
						arr.unshift('周四')
						this.courseTimetable[3] = arr
						break
					}
					case '周五': {
						let arr = res.data.data[key]
						arr.unshift('周五')
						this.courseTimetable[4] = arr
						break
					}
					case '周六': {
						let arr = res.data.data[key]
						arr.unshift('周六')
						this.courseTimetable[5] = arr
						break
					}
					default:
						console.log('👻 -- viewCourse -- this.courseTimetable------------', this.courseTimetable)
						break
				}
			}
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取所有课程列表数据
		getCourseFile() {
			this.api.curriculum
				.getCourseFile()
				.then(res => {
					console.log(res)
					if (res.data.data) {
						this.timeTable = res.data.data.records
						if (this.courseFileId) {
							this.loadCourseFile(this.currentPage, this.pageSize, this.courseFileId)
						} else {
							this.loadCourseFile(this.currentPage, this.pageSize)
						}
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//加载其中一条课程数据
		loadCourseFile(currentPage, pageSize, id, name) {
			this.isConvert = false
			if (id) {
				this.courseFileId = id
			} else {
				id = this.timeTable[0].id
				this.courseFileId = id
			}
			if (name) {
				this.newClass = name
			} else {
				this.newClass = this.timeTable[0].fileName
			}
			this.api.curriculum
				.loadCourseFile(currentPage - 1, pageSize, id)
				.then(res => {
					// console.log(res)
					if (res.data.data) {
						this.tableData = res.data.data.records
						this.total = res.data.data.total
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//条数
		async handleSizeChange(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			if (!this.isConvert) {
				this.loadCourseFile(this.currentPage, this.pageSize, this.courseFileId)
			} else {
				await this.getConvertData()
			}
		},
		async getConvertData() {
			let res = await this.api.curriculum.getConvertData(this.currentPage, this.pageSize)
			res.data.records.forEach(e => {
				e.createTime = moment(e.createTime).format('yyyy-MM-DD hh:mm:ss')
				e.updateTime = moment(e.updateTime).format('yyyy-MM-DD hh:mm:ss')
			})
			this.convertData = res.data.records
			this.total = res.data.total
		},
		//页数
		async handleCurrentChange(val) {
			this.currentPage = val
			if (!this.isConvert) {
				this.loadCourseFile(this.currentPage, this.pageSize, this.courseFileId)
			} else {
				await this.getConvertData()
			}
		},
		//上传到服务器
		submitUpload() {
			// console.log(this.$refs.upload.uploadFiles)
			if (this.$refs.upload.uploadFiles.length == 0) {
				this.$message.warning(`请选取上传的文件`)
			} else {
				this.$refs.upload.submit()
			}
		},
		//上传成功
		handleSuccess(res) {
			// console.log(res)
			this.getCourseFile()
			this.$message({
				type: 'success',
				message: '上传成功'
			})
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
			//				console.log(fileList)
			this.$message.warning(`只能选择 ${this.limits} 个文件，当前共选择了 ${file.length + fileList.length} 个`)
		},
		//移除
		beforeRemove(file) {
			this.$confirm(`确定移除 ${file.name}？`)
		},
		//重命名
		reName(id) {
			this.dialogRename = true
			this.renameId = id
		},
		async convert() {
			let res = await this.api.curriculum.convertOneCourse()
			if (res) {
				this.$message.success('转换成功')
				this.isConvert = true
				await this.getConvertData()
			}
		},
		//确定重命名
		trueRename(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.api.curriculum
						.renameCourse(this.formRename.name, this.renameId)
						.then(res => {
							// console.log(res)
							this.getCourseFile()
						})
						.catch(err => {
							console.log(err)
						})
					this.dialogRename = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//同步数据
		selectCourse(currentPage, pageSize, id, name) {
			this.courseFileId = id
			this.dialogSelect = true
			this.selectData = []
			this.allSelect = []
			this.api.curriculum
				.loadCourseFile(currentPage, pageSize, id)
				.then(res => {
					// console.log(res)
					if (res.data.data) {
						this.selectData = JSON.parse(res.data.data.records[0].fullData)
						this.$refs.tableData.$children.forEach(obj => {
							if (obj.label && obj.prop) {
								this.allSelect.push({
									label: obj.label,
									prop: obj.prop
								})
							}
						})
						this.allSelect = this.allSelect.filter(Boolean)
						this.allSelect.pop() //删除最后一个元素
						this.formSelect.original = 0
						this.formSelect.exist = this.allSelect[0].prop
						this.loadCourseFile(this.currentPage, this.pageSize, id, name)
						// console.log(this.selectData, this.allSelect)
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//确认同步数据
		trueSelect() {
			this.fullscreenLoading = true
			this.dialogSelect = false
			this.api.curriculum
				.trueSelect(this.courseFileId, this.formSelect.exist, this.formSelect.original)
				.then(err => {
					// console.log(err)
					this.$message({
						type: 'success',
						message: '已经进行数据同步，如果还没有数据，请稍后按“加载”按钮！'
					})
					this.fullscreenLoading = false
					this.loadCourseFile(this.currentPage, this.pageSize, this.courseFileId)
				})
				.catch(err => {
					console.log(err)
				})
		},
		//删除此行
		delectOneCourse(id) {
			// console.log(id)
			this.$confirm('此操作将永久删除该行数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.curriculum
						.delectOneCourse(id)
						.then(() => {
							// console.log(res)
							this.loadCourseFile(this.currentPage, this.pageSize, this.courseFileId)
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
		//选择学校
		changeSchool(e) {
			// console.log(e)
			this.optionsRegion = e.items
		},
		//选择区域
		changeRegion(e) {
			// console.log(e)
			this.optionsBuild = e.items
		},
		//选择楼栋
		changeBuild(e) {
			// console.log(e)
			this.optionsClass = e.items
		},
		//新增数据
		addData() {
			this.api.operation
				.getState()
				.then(res => {
					//				console.log(res)
					this.dataCourse = res.data.place_info
					this.dialogAddCourse = true
				})
				.catch(err => {
					console.log(err)
				})
		},
		//确认新增数据
		trueAddCourse(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// console.log(this.addCourseForm)
					let params = {
						courseNo: this.addCourseForm.courseNo,
						courseName: this.addCourseForm.courseName,
						attribute: this.addCourseForm.attribute,
						nature: this.addCourseForm.nature,
						// teacherNo: this.addCourseForm.teacherNo,
						teacherName: this.addCourseForm.teacherName,
						department: this.addCourseForm.department,
						// houseNo: this.addCourseForm.course.id,
						// classNo: this.addCourseForm.class,
						courseTime: this.addCourseForm.courseTime,
						courseWeek: this.addCourseForm.courseWeek,
						// oneTwoWeek: this.addCourseForm.oneTwoWeek,
						courseFileId: this.courseFileId,
						areaId: this.addCourseForm.region.id,
						courseAddress: this.addCourseForm.courseAddress
					}
					// console.log(params)
					// return
					this.api.curriculum
						.trueAddCourse(params)
						.then(res => {
							// console.log(res)
							this.dialogAddCourse = false
							this.loadCourseFile(this.currentPage, this.pageSize, this.courseFileId)
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
		//删除课程表
		deleteCourse(id) {
			this.$confirm('此操作将永久删除该课程表, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.curriculum
						.deleteCourse(id)
						.then(() => {
							this.courseFileId = this.timeTable[0].id
							this.getCourseFile()
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
		}
	},
	computed: {
		tablesData: function () {
			let data = this.tableData
			data.splice(0, 1)
			return data
		}
	}
}
</script>

<style scoped="">
.down_temp {
	color: #6fc197;
	font-size: 12px;
	margin-left: 15px;
	text-decoration: underline;
	cursor: pointer;
}
.chuan {
	margin-bottom: 20px;
}
.tips {
	text-align: center;
	color: red;
	margin-bottom: 30px;
	font-size: 16px;
}
.newss {
	text-align: center;
	margin: 20px 0;
	text-indent: 1em;
	font-size: 16px;
}
.mdl {
	margin-left: 40px;
	margin-top: 10px;
}
</style>
