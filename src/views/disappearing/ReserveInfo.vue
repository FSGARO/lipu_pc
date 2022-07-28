<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-04-07 15:21:29
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>消息中心</el-breadcrumb-item>
					<el-breadcrumb-item>审核信息</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<div class="time_box">
				<div class="toolsbar">
					<el-table :data="verifyInfoList" border>
						<el-table-column type="index" width="50" align="center"></el-table-column>
						<el-table-column prop="account" label="用户" align="center"> </el-table-column>
						<el-table-column label="类型" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.type == 0">教室预约</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="地点">
							<template slot-scope="scope">
								<span v-if="scope.row.type == 0">{{ scope.row.classroomAddress }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="startTime" label="起始时间" align="center"> </el-table-column>
						<el-table-column prop="endTime" label="结束时间" align="center"> </el-table-column>
						<el-table-column prop="purpose" label="备注" align="center"> </el-table-column>
						<el-table-column label="状态" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.state == 0" style="color: #67c23a">已同意</span>
								<span v-else-if="scope.row.state == 1" style="color: #909399">待审核</span>
								<span v-else-if="scope.row.state == 2" style="color: #f56c6c">已拒绝</span>
								<span v-else-if="scope.row.state == 3" style="color: red">已过期</span>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" label="申请时间" align="center"> </el-table-column>
						<el-table-column prop="" label="操作" width="" align="center" v-if="this.user == 'admin'">
							<template slot-scope="scope">
								<el-button type="success" size="small" :disabled="scope.row.state != 1" @click="handleVerify(scope.row.id, 0)"
									>同意</el-button
								>
								<el-button type="danger" size="small" :disabled="scope.row.state != 1" @click="handleVerify(scope.row.id, 2)"
									>拒绝</el-button
								>
							</template>
						</el-table-column>
					</el-table>
					<!-- <myTable :tableData="this.verifyInfoList" :rules="verifyInfoRules"></myTable> -->
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
					<el-dialog
						title="拒绝信息"
						:visible.sync="dialogReviewMsgVisible"
						width="40%"
						center
						@close="handleReDialogCancel('fromReviewMsg')"
					>
						<el-form :model="fromReviewMsg" ref="fromReviewMsg">
							<el-form-item label="拒绝理由" prop="purpose">
								<el-input v-model="fromReviewMsg.reviewMsg"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="handleReDialogCancel('fromReviewMsg')">取 消</el-button>
							<el-button type="primary" @click="trueReserve('fromReviewMsg')">确 定</el-button>
						</div>
					</el-dialog>
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<script>
// import myTable from '../../components/Table.vue'
export default {
	// components: { myTable },
	data() {
		return {
			user: localStorage.getItem('user') || '',
			currentPage: 0,
			pageSize: 10,
			verifyInfoList: [],
			total: 0,
			fromReviewMsg: { reviewMsg: '', reserveId: '', state: 0 },
			dialogReviewMsgVisible: false
			// verifyInfoRules: {
			// 	column: [
			// 		{ id: 0, prop: 'id', label: 'id' },
			// 		{ id: 1, prop: 'account', label: '用户' },
			// 		{
			// 			id: 2,
			// 			prop: 'type',
			// 			label: '类型',
			// 			formatter: ({ type }) => {
			// 				switch (type) {
			// 					case 0:
			// 						return '教室预约'
			// 					default:
			// 						return '空'
			// 				}
			// 			}
			// 		},
			// 		{ id: 3, prop: 'classroomAddress', label: '地点' },
			// 		{ id: 4, prop: 'purpose', label: '备注' },
			// 		{ id: 5, prop: 'startTime', label: '起始时间' },
			// 		{ id: 6, prop: 'endTime', label: '结束时间' },
			// 		{ id: 7, prop: 'createTime', label: '申请时间' },
			// 		{ id: 8, prop: 'createTime', label: '状态' },
			// 		{ id: 9, prop: 'createTime', label: '操作', isSolt: true, solts: `${console.log(12345)}` }
			// 	]
			// }
		}
	},
	created: function () {
		this.getVerifyInfo()
	},
	mounted: function () {
		// this.getVerifyInfo()
		console.log(`build up ----- getVerifyInfo ----- this.verifyInfoList`, this.verifyInfoList)
	},
	methods: {
		// 返回上一级
		prev() {
			this.$router.go(-1)
		},

		// 获取全部教室
		async getVerifyInfo() {
			let { data: res } = await this.api.reserve.getVerifyInfo(this.pageSize, this.currentPage)
			res.data.records.map(e => {
				e.createTime = this.moment(e.createTime).format('YYYY-MM-DD HH:mm')
			})
			this.verifyInfoList = res.data.records
			this.total = res.data.total
			console.log(`build up ---333333-- getVerifyInfo ----- this.verifyInfoList`, this.verifyInfoList)
		},
		// 当前页码改变
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage
			this.getVerifyInfo()
		},
		// 页数改变
		handleSizeChange(pageSize) {
			this.pageSize = pageSize
			this.getVerifyInfo()
		},
		async handleVerify(reserveId, state) {
			if (state != 2) {
				let reserveReviewEntity = { reserveId, state }
				let res = await this.api.reserve.addReserveReviewInfo(reserveReviewEntity)
				if (res.data.code == 'success') {
					this.getVerifyInfo()
					this.$message({
						message: res.data.msg,
						type: 'success'
					})
				} else {
					this.$message({
						message: res.data.msg,
						type: 'error'
					})
				}
			} else {
				this.dialogReviewMsgVisible = true
				this.fromReviewMsg.reserveId = reserveId
				this.fromReviewMsg.state = state
			}
		},
		async trueReserve(fromName) {
			let reserveReviewEntity = { ...this.fromReviewMsg }
			let res = await this.api.reserve.addReserveReviewInfo(reserveReviewEntity)
			if (res.data.code == 'success') {
				this.handleReDialogCancel(fromName)
				this.getVerifyInfo()
				this.$message({
					message: res.data.msg,
					type: 'success'
				})
			} else {
				this.$message({
					message: res.data.msg,
					type: 'error'
				})
			}
		},
		handleReDialogCancel(fromName) {
			this.dialogReviewMsgVisible = false
			this.$refs[fromName].resetFields()
		}
	}
}
</script>

<style scoped=""></style>
