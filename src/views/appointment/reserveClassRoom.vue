<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-05-07 16:49:57
 * El Psy Congroo
-->
//TODO 课表
<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>教室预约</el-breadcrumb-item>
					<el-breadcrumb-item>预约信息</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<div class="time_box">
				<div class="toolsbar">
					<el-date-picker
						v-model="dates"
						type="date"
						:picker-options="pickerOptions"
						placeholder="请选择日期"
						format="yyyy 年 MM 月 dd 日"
						value-format="yyyy-MM-dd"
						@change="handleTimeChange"
					>
					</el-date-picker>
					<!-- <el-table ref="reserveInfo" border :data="reserveInfo" style="margin-top: 10px">
						<el-table-column align="center" width="160px">
							<template slot="header">
								<div style="margin-left: 30px">课时</div>
								<div
									style="
										height: 0px;
										border: 1px solid #808080;
										width: 120px;
										transform: rotate(45deg);
										-o-transform: rotate(45deg);
										-moz-transform: rotate(45deg);
										-webkit-transform: rotate(45deg);
									"
								></div>
								<div style="margin-right: 30px">日期</div>
							</template>
							<template slot-scope="scope">
								<p>{{ scope.row.date }}</p>
								({{ scope.row.week }})
							</template>
						</el-table-column>
						<el-table-column v-for="(item, index) in planTimeList" align="center" :key="item.id">
							<template slot="header">
								<p>{{ item.projectName }}</p>
								{{ `(${item.startTime}-${item.endTime})` }}
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.weekLessons[index].isMake" style="color: red">
									{{ scope.row.weekLessons[index].text }}
								</div>
								<div v-else-if="scope.row.weekLessons[index].isValue">
									{{ scope.row.weekLessons[index].text }}
								</div>
								<div v-else-if="scope.row.weekLessons[index].isOverdue" class="guoqi">已过期</div>
								<div v-else class="vacant" @click.prevent="myMake(item, scope.row.date)">可预约</div>
							</template>
						</el-table-column>
					</el-table> -->

					<el-table ref="planTimeList" border :data="planTimeList" style="margin-top: 10px">
						<el-table-column align="center" width="160px">
							<template slot="header">
								<div style="margin-left: 30px">日期</div>
								<div
									style="
										height: 0px;
										border: 1px solid #808080;
										width: 120px;
										transform: rotate(45deg);
										-o-transform: rotate(45deg);
										-moz-transform: rotate(45deg);
										-webkit-transform: rotate(45deg);
									"
								></div>
								<div style="margin-right: 30px">课时</div>
							</template>
							<template slot-scope="scope">
								<p>{{ scope.row.projectName }}</p>
								({{ `${scope.row.startTime}-${scope.row.endTime}` }})
							</template>
						</el-table-column>
						<el-table-column v-for="item in reserveInfo" align="center" :key="item.id">
							<template slot="header">
								<p>{{ item.date }}</p>
								{{ item.week }}
							</template>
							<template slot-scope="scope">
								<div v-if="item.weekLessons[scope.row.number - 1].isMake" style="color: red">
									{{ item.weekLessons[scope.row.number - 1].text }}
								</div>
								<div v-else-if="item.weekLessons[scope.row.number - 1].isValue">
									{{ item.weekLessons[scope.row.number - 1].text }}
								</div>
								<div v-else-if="item.weekLessons[scope.row.number - 1].isOverdue" class="guoqi">已过期</div>
								<div v-else class="vacant" @click.prevent="myMake(scope.row, item.date)">可预约</div>
							</template>
						</el-table-column>
					</el-table>
					<el-dialog
						title="预约教室"
						:visible.sync="dialogClassRoomVisible"
						width="40%"
						center
						@close="handleReDialogCancel('fromReserve')"
					>
						<el-form :model="fromReserve" :rules="rulesReserve" ref="fromReserve">
							<el-form-item label="开始时间" prop="name">
								<!-- <el-input v-model="formRename.name"></el-input> -->
								{{ fromReserve.startTime }}
							</el-form-item>
							<el-form-item label="结束时间" prop="name">
								<!-- <el-input v-model="formRename.name"></el-input> -->{{ fromReserve.endTime }}
							</el-form-item>
							<el-form-item label="教室用途" prop="purpose">
								<el-input v-model="fromReserve.purpose"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="handleReDialogCancel('fromReserve')">取 消</el-button>
							<el-button type="primary" @click="trueReserve('fromReserve')">确 定</el-button>
						</div>
					</el-dialog>
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<script>
let app = {}
export default {
	data() {
		return {
			weekList: [],
			dates: '',
			classroomAddress: '',
			classRoomID: '',
			dialogClassRoomVisible: false,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < app.moment().startOf('day')
				}
			},
			planTimeList: [],
			reserveInfo: [],
			fromReserve: {
				startTime: '',
				endTime: '',
				purpose: '',
				planTimeId: ''
			},
			rulesReserve: {
				purpose: [
					{
						required: true,
						message: '请输入预约教室用途',
						trigger: 'blur'
					}
				]
			}
		}
	},
	created: function () {
		app = this
		let { id, address } = this.$route.query
		this.classRoomID = id
		this.classroomAddress = address
		this.dates = this.moment(Date.now()).format('yyyy-MM-DD')
		this.getPlanTimeList()
		this.getReserveInfo(), this.getWeekList()
	},
	methods: {
		trueReserve(fromName) {
			this.$refs[fromName].validate(async valid => {
				if (valid) {
					let reserveEntity = { ...this.fromReserve, courseInfoId: this.classRoomID, type: 0, classroomaddress: this.classroomAddress }
					let { data: res } = await this.api.reserve.addReserveInfo(reserveEntity)
					if (res.code == 'success') {
						this.$message({
							message: '提交预约成功,请等待管理员审核',
							type: 'success'
						})
						this.handleReDialogCancel(fromName)
					} else {
						this.$message({
							message: '发生了错误',
							type: 'error'
						})
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		handleReDialogCancel(fromName) {
			this.dialogClassRoomVisible = false
			this.$refs[fromName].resetFields()
		},
		prev() {
			this.$router.go(-1)
		},
		async getPlanTimeList() {
			let { data: res } = await this.api.reserve.getPlanTimeList()
			if (res.data) this.planTimeList = res.data
			console.log(`build up ----- getPlanTimeList ----- this.planTimeList`, this.planTimeList)
		},
		// 获取一周的预约信息
		async getReserveInfo() {
			let { data: res } = await this.api.reserve.getReserveInfo(this.classRoomID, this.dates)
			if (res.data) {
				res.data.map((e, i) => {
					e.date = this.weekList[i]
					e.weekLessons = e.weekLessons.map((x, y) => {
						console.log(this.planTimeList)
						let o = {}
						if (x) {
							if (x == '已被预约') {
								o.isMake = true
							}
							o.isValue = true
						} else if (new Date() - new Date(this.weekList[i] + ' ' + this.planTimeList[y].startTime) > 0) {
							o.isOverdue = true
						}
						o.text = x
						o.date = this.weekList[i]
						return o
					})
					return e
				})
				this.reserveInfo = res.data
				console.log(`build up ----- getReserveInfo ----- 	this.reserveInfo`, this.reserveInfo)
			}
		},
		// 切换时间
		handleTimeChange(date) {
			this.dates = date
			this.getWeekList()
			this.getReserveInfo()
		},
		// TODO 预约
		myMake(obj, date) {
			console.log(`build up ----- myMake ----- obj, date`, obj, date)
			this.fromReserve.startTime = date + ' ' + obj.startTime
			this.fromReserve.endTime = date + ' ' + obj.endTime
			this.fromReserve.planTimeId = obj.id
			this.dialogClassRoomVisible = true
		},
		// 获取这一周时间
		getWeekList() {
			let date = this.moment(this.dates, 'YYYY-MM-DD')
			let week = date.format('E')
			let Monday = date.subtract(week - 1, 'days').format('YYYY-MM-DD')
			let weekList = []
			for (let index = 0; index < 5; index++) {
				weekList.push(this.moment(Monday).add(index, 'd').format('YYYY-MM-DD'))
			}
			this.weekList = weekList
		}
	}
}
</script>

<style scoped="">
.guoqi {
	color: #f74200;
}
.vacant {
	color: #2ecc71;
}
</style>
