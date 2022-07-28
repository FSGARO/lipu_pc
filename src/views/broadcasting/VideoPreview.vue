<template>
	<el-container>
		<el-header style="height: auto; margin-bottom: 0px">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>校园广播站</el-breadcrumb-item>
					<el-breadcrumb-item>在线巡课</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<div class="live-preview">
				<div class="box">
					<div class="video-tie">
						<el-button type="primary" size="small" @click="clickVideo"><i class="el-icon-plus"></i>添加画面</el-button>
						<el-button type="success" size="small" @click="videoList"><i class="el-icon-refresh"></i>刷新列表</el-button>
						<p class="red">请注意，由于网页功能受限，视频画面可能存在延迟(10秒-3分钟)</p>
						<p class="red">由于视频解码需要大量的CPU资源，同时打开3个或以上画面时可能存在系统卡顿或死机</p>
					</div>
					<div class="video-player">
						<div class="video-list">
							<div v-for="(video, index) in videos" :key="video.id" class="thumbnail">
								<div class="rtmp">
									<video-player
										class="video-js vjs-default-skin vjs-big-play-centered"
										style="width: 100%; height: 260px"
										ref="videoPlayer"
										:playsinline="true"
										:options="video.shipin"
										@play="onPlayerPlay($event, index)"
										@pause="onPlayerPause($event)"
										@ended="onPlayerEnded($event)"
									>
									</video-player>
									<span class="endit el-icon-edit" @click="editVideo(video)"></span>
									<span class="remove el-icon-circle-close" @click="delectVideo(video.stream)"></span>
									<div class="rtmp_title">
										{{ video.name }}<el-link type="success" @click="postUrl(video)" class="rtmp_tui">获取推流地址</el-link>
									</div>
								</div>
							</div>
							<div style="clear: both"></div>
							<div class="box ye">
								<div class="pagination">
									<el-pagination
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
						</div>
					</div>
				</div>
				<!--弹窗-->
				<el-dialog :title="edititle" :visible.sync="dialogFormVisible" width="30%">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
						<el-form-item label="名称" prop="name" class="is-required">
							<el-input v-model="ruleForm.name"></el-input>
						</el-form-item>
						<!--<el-form-item label="源地址" prop="url">
							<el-input v-model="ruleForm.url" type="url"></el-input>
						</el-form-item>-->
						<el-form-item label="源地址类型">
							<el-radio-group v-model="ruleForm.forward">
								<el-radio :label="0">局域网(内)</el-radio>
								<el-radio :label="1">因特网(外)</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="位置" prop="region">
							<el-cascader
								style="width: 300px"
								v-model="positionSchool"
								:options="optionSchool"
								:props="props"
								clearable
								@change="handleChange"
								:key="positionSchool"
							></el-cascader>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="trueEditVideo('ruleForm')" v-if="editstatic">修改</el-button>
						<el-button type="primary" @click="addVideo('ruleForm')" v-else>确 定</el-button>
					</div>
				</el-dialog>
				<el-dialog title="获取成功" :visible.sync="urlDialog" width="35%" center>
					<div class="cent">
						<p>点击确定把地址复制到剪贴板</p>
						<p style="margin-top: 20px">{{ pushFlow }}</p>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button
							type="primary"
							@click="trueDialog"
							v-clipboard:copy="pushFlow"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							>确 定</el-button
						>
					</span>
				</el-dialog>
			</div>
		</el-main>
	</el-container>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
	data() {
		return {
			dialogTableVisible: false,
			dialogFormVisible: false,
			ruleForm: {
				name: '',
				url: '',
				forward: 0,
				region: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 20,
						message: '长度在 1到 20 个字符',
						trigger: 'blur'
					}
				]
			},
			videos: [],
			currentPage: 1,
			total: 6,
			pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			props: {
				value: 'id',
				label: 'name',
				children: 'items'
			},
			optionSchool: [],
			positionSchool: '',
			edititle: '添加画面',
			stream: '',
			editstatic: false,
			urlDialog: false,
			pushFlow: '',
			playVideoNum: []
		}
	},
	created: function () {
		this.videoList()
	},
	mounted: function () {},
	methods: {
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取视频列表函数
		async videoList() {
			this.videos = []
			let res = await this.api.videopreview.videoList(this.currentPage - 1, this.pageSize)
			//				console.log(res)
			this.total = res.data.rtmp_info_list.total
			let video = res.data.rtmp_info_list.rtmp_property_list
			for (let item of video) {
				let id = item.id
				if (item.publishing == true) {
					//							let rtmpUrl = ''
					let flvUrl = ''
					let hlsUrl = ''
					await this.getFlvUrl(item.stream, id)
						.then(res => {
							flvUrl = res
						})
						.catch(() => {
							flvUrl = ''
						})
					await this.getHlsUrl(item.stream, id)
						.then(res => {
							hlsUrl = res
						})
						.catch(() => {
							hlsUrl = ''
						})
					item.shipin = {
						controls: true, // 控制条
						fluid: true, // 按比例缩放适应容器
						aspectRatio: '16:9',
						techOrder: ['html5', 'flash'], // 兼容顺序
						sourceOrder: true,
						flash: {
							hls: {
								withCredentials: false
							}
						},
						html5: {
							hls: {
								withCredentials: false
							}
						},
						// fluid: true, // 当true时，按比例缩放以适应其容器
						sources: [
							{
								type: 'flv/rtmp',
								src: flvUrl
							},
							{
								type: 'application/x-mpegURL', //如果是直播的话  此处务必这样配置
								src: hlsUrl //视频url地址
							}
							//									{
							//										type: 'rtmp/flv',
							//										src: rtmpUrl //视频url地址
							//									}
						],
						notSupportedMessage: '此视频流加载失败',
						poster: item.snapshot, //你的封面地址
						autoplay: false // 自动播放
					}
					this.videos.push(item)
				} else {
					item.shipin = {
						sources: [
							{
								type: 'rtmp/mp4',
								src: ''
							}
						],
						notSupportedMessage: '此视频流还未开始推流' //允许覆
					}
					this.videos.push(item)
				}
			}
		},
		//条数
		handleSizeChange(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.videoList()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.videoList()
			//      console.log(`当前页: ${val}`);
		},
		//点击添加画面
		clickVideo() {
			this.edititle = `添加画面`
			this.getState()
			this.editstatic = false
			this.dialogFormVisible = true
		},
		//添加视频
		addVideo(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let forward = ''
					let areaid = this.positionSchool
					if (this.ruleForm.forward == 0) {
						forward = false
					} else {
						forward = true
					}
					this.api.videopreview
						.addVideo(this.ruleForm.name, forward, areaid)
						.then(() => {
							//								console.log(res)
							//   let stream = res.data.rtmp_info.stream;
							this.$message({
								type: 'success',
								message: '添加成功!'
							})
							this.videoList()
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '添加失败!'
							})
						})
					this.dialogFormVisible = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//编辑视频
		editVideo(video) {
			//				console.log(video)
			this.edititle = `修改画面`
			this.getState()
			this.ruleForm.name = video.name
			this.stream = video.stream
			this.positionSchool = video.areaid
			if (video.forward == false) {
				this.ruleForm.forward = 0
			} else {
				this.ruleForm.forward = 1
			}
			this.editstatic = true
			this.dialogFormVisible = true
		},
		//修改视频
		trueEditVideo(formName) {
			this.$refs[formName].validate(valid => {
				let forward = ''
				let areaid = this.positionSchool
				if (this.ruleForm.forward == 0) {
					forward = false
				} else {
					forward = true
				}
				if (valid) {
					this.api.videopreview
						.trueEditVideo(this.stream, this.ruleForm.name, forward, areaid)
						.then(() => {
							//				    		console.log(res)
							this.$message({
								type: 'success',
								message: '修改成功！'
							})
							this.videoList()
						})
						.catch(err => {
							console.log(err)
						})
					this.dialogFormVisible = false
				}
			})
		},
		//获取flv流地址
		getFlvUrl(stream, id) {
			var that = this
			return new Promise(function (resolve, reject) {
				that.api.videopreview
					.getFlvUrl(stream, id)
					.then(res => {
						//						console.log(res)
						let flvUrl = res.data.rtmp_url.url
						resolve(flvUrl)
					})
					.catch(() => {
						let flvUrl = ''
						reject(flvUrl)
					})
			})
		},
		//获取hls流地址
		getHlsUrl(stream, id) {
			var that = this
			return new Promise(function (resolve, reject) {
				that.api.videopreview
					.getHlsUrl(stream, id)
					.then(res => {
						let hlsUrl = res.data.rtmp_url.url
						resolve(hlsUrl)
					})
					.catch(() => {
						let hlsUrl = ''
						reject(hlsUrl)
					})
			})
		},
		//删除视频
		delectVideo(stream) {
			this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.videopreview
						.delectVideo(stream)
						.then(() => {
							let totalPage = Math.ceil((this.total - 1) / this.pageSize)
							let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
							this.currentPage = currentPage < 1 ? 1 : currentPage
							this.videoList()
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
		//播放
		onPlayerPlay(event, index) {
			// console.log(event)
			this.playVideoNum.push(event.id_)
			if (this.playVideoNum.length > 2) {
				this.$confirm(
					'当前正在播放的视频数为' + this.playVideoNum.length + '个,同时打开3个或以上画面时可能存在系统卡顿或死机, 是否继续?',
					'提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true,
						closeOnClickModal: false
					}
				)
					.then(() => {})
					.catch(() => {
						this.$refs.videoPlayer[index].player.pause() //暂停当前视频
						this.playVideoNum.splice(
							this.playVideoNum.findIndex(e => {
								e == event.id_
							}),
							1
						)
					})
			}
		},
		//暂停
		onPlayerPause(event) {
			this.playVideoNum.splice(
				this.playVideoNum.findIndex(e => {
					e == event.id_
				}),
				1
			)
		},
		//结束
		ended(event) {
			this.playVideoNum.splice(
				this.playVideoNum.findIndex(e => {
					e == event.id_
				}),
				1
			)
		},
		//获取地理位置
		getState() {
			this.api.operation
				.getState()
				.then(res => {
					this.optionSchool = res.data.place_info
					//					console.log(this.optionSchool)
				})
				.catch(err => {
					console.log(err)
				})
		},
		//点击推流地址
		postUrl(video) {
			this.api.videopreview
				.postUrl(video.stream)
				.then(res => {
					//					console.log(res)
					this.pushFlow = res.data.rtmp_url.url
					this.urlDialog = true
				})
				.catch(err => {
					console.log(err)
				})
		},
		//确定复制推流地址
		trueDialog() {
			this.urlDialog = false
		},
		// 复制成功时的回调函数
		onCopy() {
			this.$message.success('内容已复制到剪切板！')
		},
		// 复制失败时的回调函数
		onError() {
			this.$message.error('抱歉该浏览器不兼容，复制失败，请手动复制！')
		},
		//位置选择
		handleChange(callback) {
			this.positionSchool = callback[callback.length - 1]
		}
		//获取视频流授权客户端
		//			getClient(stream) {
		//				this.api.videopreview.getClient(stream)
		//				.then(res => {
		//					console.log(res)
		//				})
		//			}
	}
}
</script>

<style scoped>
.el-form-item {
	margin-top: 20px;
}

.el-form-item__error {
	margin-top: 4px;
}

.thumbnail {
	float: left;
	width: 100%;
	max-width: 450px;
	margin: 0 20px 20px 0;
	position: relative;
	top: 0;
}

.adress {
	font-weight: 400;
	font-size: 14px;
	margin-bottom: 2px;
}

.video {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: auto;
}

.remove {
	display: none;
	position: absolute;
	font-size: 22px;
	top: -11px;
	z-index: 2;
	right: -7px;
	color: rgb(245, 108, 108);
}
.endit {
	display: none;
	position: absolute;
	font-size: 22px;
	top: -11px;
	z-index: 2;
	right: 30px;
	color: rgb(245, 108, 108);
}

.rtmp:hover .remove {
	display: block;
}
.rtmp:hover .endit {
	display: block;
}
.pagination {
	margin: 20px 20% 0 0;
}
.ye {
	width: 100%;
	margin: 0 100px 100px 0;
}
.rtmp_title {
	text-align: center;
}
.rtmp_tui {
	float: right;
	margin-right: 30px;
}
.cent {
	text-align: center;
	color: #999;
}
.red {
	text-align: left;
	color: red;
	margin-top: 10px;
}
.video-tie {
	margin-bottom: 20px;
	text-align: left;
}
</style>
