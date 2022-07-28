<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-10-29 11:14:16
 * El Psy Congroo
-->

<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"
					><i class="el-icon-top-left"></i>返回</span
				>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>教室预约</el-breadcrumb-item>
					<el-breadcrumb-item>作息时间</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<div class="time_box">
				<div class="toolsbar">
					<!-- <div class="chuan"> -->
					<!-- <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button type="success" icon="el-icon-bottom-right"
                >导入课表</el-button
              >
              
              <el-button type="text" class="mob">模板下载</el-button>
            </el-upload>
          </div> -->
					<el-button
						type="primary"
						icon="el-icon-zoom-in"
						@click="addWork"
						>新增课时</el-button
					>
					<!-- 表格 -->
					<el-table
						border
						:data="tableData"
						style="width: 60%; margin-top: 10px"
					>
						<el-table-column type="index" width="50" align="center">
						</el-table-column>
						<el-table-column
							align="center"
							prop="projectName"
							label="名称"
							width="100"
						>
						</el-table-column>
						<el-table-column
							align="center"
							prop="number"
							label="第几节课"
							width="100"
						>
							<template slot-scope="scope">
								第{{ scope.row.number }}节
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							prop="startTime"
							label="开始时间"
							width="100"
						>
						</el-table-column>
						<el-table-column
							align="center"
							prop="endTime"
							label="结束时间"
							width="150"
						></el-table-column>
						<el-table-column align="center" label="操作">
							<template slot-scope="scope">
								<el-button
									type="warning"
									size="mini"
									@click="putWork(scope.row.id)"
									>修改</el-button
								>
								<el-button
									type="danger"
									size="mini"
									@click="deleteWork(scope.row.id)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
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
			</div>
			<!-- 新增课时 修改课时 -->
			<el-dialog :visible.sync="dialogTimetable" width="40%" center>
				<p class="dialogtitle">{{ dialogMessage }}</p>
				<el-form :model="workForm" :rules="rulesWork" ref="workForm">
					<el-form-item
						label="课程名称"
						:label-width="formLabelWidth"
						prop="projectName"
					>
						<el-input
							v-model="workForm.projectName"
							style="width: 60%"
						></el-input>
					</el-form-item>
					<el-form-item
						label="第几节课"
						:label-width="formLabelWidth"
						prop="number"
					>
						<el-input
							step="1"
							v-model.number="workForm.number"
							style="width: 60%"
						></el-input>
					</el-form-item>
					<el-form-item
						label="课程时间"
						:label-width="formLabelWidth"
						prop="time"
					>
						<el-time-picker
							is-range
							v-model="workForm.time"
							format="HH:mm"
							value-format="HH:mm"
							range-separator="至"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							placeholder="选择时间范围"
						>
						</el-time-picker>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogTimetableCancel()"
						>取 消</el-button
					>
					<el-button
						type="primary"
						@click="truedTimetable('workForm')"
						v-if="!workState"
						>确 定</el-button
					>
					<el-button
						type="primary"
						@click="truedTimetable('workForm')"
						v-else
						>修改</el-button
					>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			tableData: [],
			fileList: [],
			dialogTimetable: false,
			formLabelWidth: '100px',
			dialogMessage: '新增课程',
			workState: false,
			workForm: {
				projectName: '',
				time: '',
				number: ''
			},
			rulesWork: {
				projectName: [
					{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}
				],
				time: [
					{ required: true, message: '请选择日期', trigger: 'change' }
				],
				number: [
					{
						required: true,
						message: '请输入是第几节课',
						trigger: 'change'
					},
					{
						type: 'number',
						message: '请输入数字'
					}
				]
			},
			pageSize: localStorage.getItem('pageSize')
				? parseInt(localStorage.getItem('pageSize'))
				: 10,
			currentPage: 1,
			total: 0,
			id: 0
		}
	},
	created: function () {
		this.getTimelists()
	},
	methods: {
		dialogTimetableCancel() {
			this.dialogTimetable = false
			this.$refs.workForm.resetFields()
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取课程时间列表
		getTimelists() {
			this.api.timetable
				.getTimelists(this.currentPage, this.pageSize)
				.then(res => {
					// console.log(res)
					if (res.data.data) {
						this.tableData = res.data.data.records
						console.log(
							'👻 -- getTimelists -- res.data.data.records',
							res.data.data.records.length
						)
						this.total = res.data.data.total
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		// 条数
		handleSizeChange(val) {
			this.pageSize = val

			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.getTimelists(this.currentPage - 1, this.pageSize)
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getTimelists(this.currentPage - 1, this.pageSize)
		},
		//新增课时
		addWork() {
			this.dialogTimetable = true
			this.workState = false
			this.dialogMessage = '新增课程'
		},
		//新增或修改课时
		truedTimetable(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					console.log(
						'👻 -- truedTimetable -- this.workState',
						this.workState
					)
					if (!this.workState) {
						this.api.timetable
							.addWorkTime({
								projectName: this.workForm.projectName,
								startTime: this.workForm.time[0],
								endTime: this.workForm.time[1],
								number: this.workForm.number
							})
							.then(res => {
								this.$message({
									type: 'success',
									message: '添加成功'
								})
							})
							.catch(err => {
								console.log(err)
							})
					} else {
						this.api.timetable
							.putWork({
								id: this.id,
								projectName: this.workForm.projectName,
								startTime: this.workForm.time[0],
								endTime: this.workForm.time[1],
								number: this.workForm.number
							})
							.then(res => {
								this.$message({
									type: 'success',
									message: '修改成功'
								})
							})
							.catch(err => {
								console.log(err)
							})
					}
					this.dialogTimetableCancel()
					this.getTimelists()
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//修改课时时间
		putWork(id) {
			this.id = id
			this.dialogMessage = '修改课程'
			this.workState = true
			this.api.timetable
				.getWork(id)
				.then(res => {
					// console.log(res)
					this.workForm.projectName = res.data.data.projectName
					if (res.data.data.startTime && res.data.data.endTime) {
						let workTimes = []
						workTimes.push(
							res.data.data.startTime,
							res.data.data.endTime
						)
						this.workForm.time = workTimes
					}
					this.dialogTimetable = true
				})
				.catch(err => {
					console.log(err)
				})
		},
		//删除课时时间
		deleteWork(id) {
			this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.timetable
						.deleteWork(id)
						.then(() => {
							this.getTimelists()
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
		//上传文件
		handleRemove(file, fileList) {
			console.log(file, fileList)
		},
		handlePreview(file) {
			console.log(file)
		},
		handleExceed(files, fileList) {
			this.$message.warning(
				`当前限制选择 3 个文件，本次选择了 ${
					files.length
				} 个文件，共选择了 ${files.length + fileList.length} 个文件`
			)
		},
		beforeRemove(file) {
			return this.$confirm(`确定移除 ${file.name}？`)
		}
	}
}
</script>

<style scoped="">
.chuan {
	position: relative;
}
.mob {
	display: inline-block;
}
.dialogtitle {
	text-align: center;
	margin-bottom: 20px;
	line-height: 24px;
	font-size: 18px;
	color: #303133;
}
.pagination {
	text-align: center;
}
</style>
