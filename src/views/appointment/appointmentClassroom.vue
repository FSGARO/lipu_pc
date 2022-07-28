<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-03-31 11:36:18
 * El Psy Congroo
-->

<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>教室预约</el-breadcrumb-item>
					<el-breadcrumb-item>教室列表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<div class="time_box">
				<div class="toolsbar">
					<el-table :data="classroomList" border>
						<el-table-column type="index" width="50" align="center"></el-table-column>
						<el-table-column prop="classroomAddress" label="教室地址" width="" align="center"> </el-table-column>
						<el-table-column prop="createTime" label="创建时间" width="" align="center"> </el-table-column>
						<el-table-column prop="updateTime" label="更新时间" width="" align="center"> </el-table-column>
						<el-table-column prop="" label="操作" width="" align="center">
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="handleClassRoom(scope.row.classroomAddress, scope.row.id)"
									>查看预约</el-button
								>
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
					<!-- <el-dialog title="课表详情" :visible.sync="dialogClassRoomVisible" width="90%">
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
					</el-dialog> -->
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			currentPage: 0,
			pageSize: 10,
			classroomList: [],
			total: 0,
			// classroomAddress: '',
			// classRoomID: '',
			dialogClassRoomVisible: false
		}
	},
	created: function () {
		this.getClassroomList()
	},
	methods: {
		prev() {
			this.$router.go(-1)
		},

		// 获取全部教室
		async getClassroomList() {
			let { data: res } = await this.api.reserve.getClassroomList(this.pageSize, this.currentPage)
			this.classroomList = res.data.records
			this.total = res.data.total
		},
		// 当前页码改变
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage
			this.getClassroomList()
		},
		// 页数改变
		handleSizeChange(pageSize) {
			this.pageSize = pageSize
			this.getClassroomList()
		},
		// TODO 预约教室
		handleClassRoom(classroomAddress, id) {
			// this.classroomAddress = classroomAddress
			// this.classRoomID = id
			this.$router.push({
				query: {
					address: classroomAddress,
					id
				},
				path: '/appointment/reserveClassRoom'
			})
		}
	}
}
</script>

<style scoped=""></style>
