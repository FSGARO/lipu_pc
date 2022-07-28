<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-10-08 11:36:40
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header style="height: auto; margin-bottom: -10px">
			<div class="bcrumb">
				<span class="back" @click="prev"
					><i class="el-icon-top-left"></i>返回</span
				>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>校园广播站</el-breadcrumb-item>
					<el-breadcrumb-item>媒体资源管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="toolsbar">
				<el-form
					class="el-form--inline"
					style="margin-bottom: 5px"
					@submit.native.prevent
				>
					<div class="input-box-search">
						<el-form-item>
							<el-input
								v-model="seachinput"
								placeholder="按名称搜索"
								class="el-input__inner"
								@keyup.enter.native="getMediaList(seachinput)"
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button
								type="success"
								@click="getMediaList(seachinput)"
								><i class="el-icon-search"></i>搜索</el-button
							>
						</el-form-item>
					</div>
					<el-form-item>
						<el-upload
							class="upload-demo"
							ref="upload"
							:headers="urlHeader"
							action="/upload/media"
							:file-list="fileList"
							:auto-upload="false"
							:before-remove="beforeRemove"
							:on-success="handleSuccess"
							:on-error="handleError"
							:limit="limits"
							:on-exceed="handleExceed"
						>
							<el-button
								slot="trigger"
								size="small"
								type="primary"
								><i class="el-icon-circle-plus-outline"></i
								>选取文件</el-button
							>
							<el-button
								style="margin-left: 10px"
								size="small"
								type="success"
								@click="submitUpload"
								><i class="el-icon-upload2"></i
								>上传到服务器</el-button
							>
							<el-button type="primary" @click="getMediaList()"
								><i class="el-icon-refresh"></i
								>刷新列表</el-button
							>
							<div
								slot="tip"
								v-show="uptip"
								class="el-upload__tip"
							>
								你上传的文件格式不对或者文本太大
							</div>
						</el-upload>
					</el-form-item>
				</el-form>
			</div>
		</el-header>
		<el-main>
			<el-row>
				<el-col :span="24">
					<p class="notice" v-for="(item, i) in noticeList" :key="i">
						{{ item }}
					</p>
					<el-table
						ref="multipleTable"
						:data="tableData"
						:border="border"
						:label="tableData.id"
						v-model="multipleSelection"
						tooltip-effect="dark"
						style="width: 100%"
						highlight-current-row
					>
						<el-table-column
							align="center"
							prop="id"
							label="序号"
							width="50"
						>
						</el-table-column>
						<el-table-column
							align="center"
							prop="name"
							label="文件名称"
							width="310"
						>
						</el-table-column>
						<el-table-column
							align="center"
							prop="type"
							label="文件类型"
							width="100"
						>
						</el-table-column>
						<el-table-column
							align="center"
							prop="duration"
							label="播放时长/秒"
							width="100"
						>
						</el-table-column>
						<el-table-column
							align="centen"
							label="文件状态"
							width="100"
						>
							<template slot-scope="scope">
								<div
									v-if="scope.row.encoded"
									class="table_encoded"
								>
									已转码
								</div>
								<div
									class="table_encoded"
									v-else-if="scope.row.encoding"
								>
									<div>正在转码</div>
									<div>{{ scope.row.progress }}%</div>
								</div>
								<div
									class="table_encoded"
									v-else-if="scope.row.queue"
								>
									队列中
								</div>
								<div class="table_encoded" v-else>待转码</div>
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							label="转码耗时"
							width="100"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.encoded">
									{{ scope.row.consume }}
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<!-- <el-table-column
							align="center"
							label="返回状态<br/>转码计数 错误计数"
							width="100"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.encoded">
									{{ scope.row.last_status }}/{{ scope.row.replay_count }}/{{
										scope.row.error_count
									}}
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column> -->
						<el-table-column
							align="center"
							prop="reslove"
							label="分辨率"
							width="110"
						>
						</el-table-column>
						<el-table-column
							align="center"
							label="操作"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<el-button
									@click="starTranscoding(scope.row)"
									v-show="scope.row.encoded != true"
									:disabled="
										scope.row.queue == true ||
										scope.row.encoding == true
									"
									type="primary"
									size="mini"
									>开始转码</el-button
								>
								<el-button
									@click="starTranscoding(scope.row)"
									v-show="scope.row.encoded"
									:disabled="
										scope.row.queue == true ||
										scope.row.encoding == true
									"
									type="primary"
									size="mini"
									>重新转码</el-button
								>
								<el-button
									@click="stopTranscoding(scope.row)"
									type="warning"
									size="mini"
									:disabled="
										scope.row.queue != true &&
										scope.row.encoding != true
									"
									>停止转码</el-button
								>
								<el-button
									v-if="scope.row.has_video"
									@click="
										playVideos(
											scope.row.id,
											(level = 'middle'),
											scope.row.name
										)
									"
									type="success"
									size="mini"
									:disabled="scope.row.encoded ? false : true"
									>播放</el-button
								>
								<el-button
									v-else
									@click="
										playVideos(
											scope.row.id,
											(level = 'audio'),
											scope.row.name
										)
									"
									type="success"
									size="mini"
									:disabled="scope.row.encoded ? false : true"
									>播放</el-button
								>
								<el-button
									@click="delectVideo(scope.row.id)"
									type="danger"
									size="mini"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
					<el-dialog
						title="播放"
						:visible.sync="centerDialogVisible"
						width="40%"
						center
						:show-close="close"
					>
						<span class="video_title"
							>当前视频为<span class="qxd">{{
								definition
							}}</span></span
						>
						<span slot="footer" class="dialog-footer">
							<span v-if="videoshow">
								<el-button type="primary" @click="ultraVideo()"
									>超清</el-button
								>
								<el-button type="primary" @click="highVideo()"
									>高清</el-button
								>
								<el-button
									type="primary"
									@click="standardVideo()"
									>标清</el-button
								>
							</span>
							<span v-else>
								<el-button type="primary" @click="audioVideo()"
									>音频</el-button
								>
							</span>
							<el-button @click="defaultVideo">关 闭</el-button>
						</span>
						<div class="videos">
							<!--v-on:click="playVideo()"-->
							<video
								src=""
								class="video-js vjs-default-skin vjs-big-play-centered"
								id="videoPlay"
								controls
							>
								浏览器不支持video,建议使用谷歌或者火狐浏览器
							</video>
						</div>
						<span class="video_name">{{ videosnames }}</span>
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
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
import moment from 'moment'
export default {
	data() {
		return {
			urlHeader: {
				'S-C-Project-Session': window.localStorage.getItem('token')
					? window.localStorage.getItem('token')
					: ''
			},
			centerDialogVisible: false,
			videoshow: true,
			sp: true,
			limits: 3,
			seachinput: '',
			definition: '高清',
			videoSrc: '',
			videosid: '',
			videosnames: '',
			timer: '',
			close: false,
			border: true,
			tableData: [],
			multipleSelection: [],
			MediaIdArr: [],
			total: 3,
			pageSize: localStorage.getItem('pageSize')
				? parseInt(localStorage.getItem('pageSize'))
				: 10,
			currentPage: 1,
			fileList: [],
			uptip: false,
			noticeList: []
		}
	},
	created: function () {
		this.getNotice()
		this.getMediaList()
	},
	destroyed: function () {
		window.clearInterval(this.timer)
	},
	methods: {
		// 获取提示
		getNotice() {
			this.api.mediafile
				.getNotice()
				.then(res => {
					this.noticeList = res.data
				})
				.catch(err => {
					console.log(err)
				})
		},
		// // 轮询
		// getMediaTimerOut(id) {

		// },
		// 通过id获取信息
		getMediaById(id) {
			window.clearInterval(this.timer)
			this.timer = setInterval(() => {
				console.log(this.timer)
				this.api.mediafile
					.getMediaById(id)
					.then(res => {
						this.tableData.forEach(e => {
							if (
								this.MediaIdArr.indexOf(e.id) >= 0 &&
								e.id ==
									res.data.media_list.media_property_list[0]
										.id
							) {
								e.progress =
									res.data.media_list.media_property_list[0].progress
								e.encoding = true
								e.queue = false
							}
						})
					})
					.catch(err => {
						console.log(err)
					})
			}, 3000)
			if (this.MediaIdArr.length <= 0) {
				setTimeout(() => {
					window.clearInterval(this.timer)
				}, 0)
			}
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取媒体列表
		getMediaList(keyword = '') {
			this.tableData = []
			this.api.mediafile
				.getMediaList(this.currentPage - 1, this.pageSize, keyword)
				.then(res => {
					this.tableData = res.data.media_list.media_property_list
					this.total = res.data.media_list.total
					if (this.tableData) {
						for (let item of this.tableData) {
							if (this.MediaIdArr.length > 0) {
								if (
									(item.encoding || item.queue) &&
									item.id == this.MediaIdArr[0]
								) {
									this.getMediaById(item.id)
								}
							} else {
								window.clearInterval(this.timer)
							}
							let consume = item.consume || 0
							if (consume) {
								let hours = Math.floor(consume / 3600)
								consume = consume % 3600
								let minutes = Math.floor(consume / 60)
								let seconds = item.consume % 60
								item.consume = moment({
									h: hours,
									m: minutes,
									s: seconds
								}).format('HH:mm:ss')
							}
							// if (item.encoded == true) {
							// 	item.encodeds = `正常\n${item.progress}`
							// } else {
							// 	item.encodeds = `未转码`
							// }
							item.reslove = `${item.width} x ${item.height}`
							if (item.has_video == true) {
								item.type = `视频`
							} else {
								item.type = `音频`
							}
						}
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
			this.getMediaList()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getMediaList()
			//      console.log(`当前页: ${val}`);
		},
		//播放视频
		playVideos(id, level, name = this.videosnames) {
			if (level == `audio`) {
				this.videoshow = false
				this.definition = `音频`
			} else {
				this.videoshow = true
			}
			this.videosid = id
			this.centerDialogVisible = true
			this.videoSrc = ''
			this.api.mediafile
				.playVideos(id, level)
				.then(res => {
					document.getElementById('videoPlay').src =
						res.data.play_url.url
					//					this.videoSrc = `${res.data.play_url.url}`
					//   let str = res.data.play_url.url.split("/");
					this.videosnames = name
				})
				.catch(err => {
					console.log(err)
				})
		},

		//超清
		ultraVideo() {
			let id = this.videosid
			let level = 'high'
			this.playVideos(id, level)
			this.definition = `超清`
		},
		//高清
		highVideo() {
			let id = this.videosid
			let level = 'middle'
			this.playVideos(id, level)
			this.definition = `高清`
		},
		//标清
		standardVideo() {
			let id = this.videosid
			let level = 'low'
			this.playVideos(id, level)
			this.definition = `标清`
		},
		//音频
		audioVideo() {
			let id = this.videosid
			let level = 'audio'
			this.playVideos(id, level)
			this.definition = `音频`
		},
		//取消视频播放
		defaultVideo() {
			this.centerDialogVisible = false
			this.videoSrc = ''
		},
		//开始转码
		starTranscoding(row) {
			this.api.mediafile
				.starTranscoding(row.id)
				.then(() => {
					this.MediaIdArr.push(row.id)
					this.getMediaList()
				})
				.catch(err => {
					console.log(err)
				})
		},
		//停止转码
		stopTranscoding(row) {
			this.api.mediafile
				.starTranscoding(row.id)
				.then(() => {
					window.clearInterval(this.timer)
					this.tableData.forEach(e => {
						if (e.id == row.id) {
							e.progress = 0
							e.encoding = false
							e.queue = false
							this.getMediaList()
						}
					})
					this.MediaIdArr = this.MediaIdArr.filter(e => e != row.id)
					// setTimeout(() => {}, 1100)
				})
				.catch(err => {
					console.log(err)
				})
		},
		//删除视频
		delectVideo(id) {
			this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.mediafile
						.delectVideo(id)
						.then(() => {
							let totalPage = Math.ceil(
								(this.total - 1) / this.pageSize
							)
							let currentPage =
								this.currentPage > totalPage
									? totalPage
									: this.currentPage
							this.currentPage = currentPage < 1 ? 1 : currentPage
							this.getMediaList()
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
		//选择项发生变化时
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		//上传到服务器
		submitUpload() {
			//				console.log(this.$refs.upload.uploadFiles)
			if (this.$refs.upload.uploadFiles.length == 0) {
				this.$message.warning(`请选取上传的文件`)
			} else {
				this.$refs.upload.submit()
			}
		},
		//上传成功
		handleSuccess(response) {
			if (response) {
				for (let item of response) {
					if (item.result == false) {
						if (item.errcode == 2002) {
							this.$notify.error({
								title: '失败',
								message: `文件类型或名称重复`
							})
						}
					} else {
						this.$notify.error({
							title: '成功',
							message: `文件上传成功`
						})
						this.getMediaList()
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
			//				console.log(fileList)
			this.$message.warning(
				`只能选择 ${this.limits} 个文件，当前共选择了 ${
					file.length + fileList.length
				} 个`
			)
		},
		//移除上传视频
		beforeRemove(file) {
			this.$confirm(`确定移除 ${file.name}？`)
		}
	}
}
</script>

<style scoped>
.el-form-item {
	margin-bottom: 0.1px;
}

.cell {
	text-align: center;
}

.blue {
	color: rgb(255, 255, 255);
	background-color: rgb(113, 118, 183);
}
.video_title {
	margin-bottom: 10px;
	text-align: center;
	display: block;
}
.videos {
	width: 100%;
}
#videoPlay {
	margin: 0 auto;
}
.qxd {
	color: red;
	font-weight: 600;
}
.video_name {
	margin-top: 10px;
	text-align: center;
	display: block;
	color: #3c6eed;
	font-weight: 600;
}
.table_encoded {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
}
.notice {
	text-align: left;
	color: red;
	margin: 10px 0;
}
td .el-button {
	margin-left: 10px;
}
</style>
