<template>
	<el-container>
		<el-main
			class="home"
			:style="{
				backgroundImage: 'url(' + require('../../public/static/img/home_bg.24aa641.jpg') + ')'
			}"
		>
			<div
				class="top"
				:style="{
					backgroundImage: 'url(' + require('../../public/static/img/111.png') + ')'
				}"
			>
				<p>{{ schoolname }}</p>
			</div>
			<div class="middle">
				<div class="ml">
					<div class="weather">
						<div class="days">
							<div class="wt_list">
								<iframe
									scrolling="no"
									src="https://tianqiapi.com/api.php?style=tr&skin=cherry"
									frameborder="0"
									width="100%"
									height="220"
									allowtransparency="true"
								></iframe>
							</div>
						</div>
					</div>
					<div class="news">
						<h3 class="new-title">通知消息<span class="new_more" @click="moreInform">更多</span></h3>
						<div class="new-list">
							<div class="new" v-for="item of unInformation" :key="item.id">
								<el-link type="success" @click="readingMessage(item)">{{ item.msg }}</el-link>
							</div>
							<!--<div class="new" v-show="unInformstatic">
								<el-link disabled>没有未读消息</el-link>
							</div>-->
						</div>
					</div>
				</div>
				<div class="mm">
					<div
						class="school"
						:style="{
							backgroundImage: 'url(' + require('../../public/static/img/m_m.a7b71a2.png') + ')'
						}"
					>
						<h3 class="school-alt">
							设备分布概况<el-button v-if="!editstate" type="primary " size="mini" round @click="editSign">编辑</el-button
							><el-button v-else type="success " size="mini" round @click="complaceSign">完成</el-button>
						</h3>
						<div class="school-box">
							<div class="box-img" id="boximg" @click="signBox($event)">
								<img id="topView" @load="distributionList" :src="boxImg" />
								<!-- <img
                  id="topView"
                  @load="distributionList"
                  src="/static/img/m-map.c73433a.png"
                /> -->
								<el-link
									:underline="false"
									icon="el-icon-location"
									class="icon-link"
									v-for="item of hasSign"
									:key="item.id"
									@click.prevent="deviceAddress(item)"
									:style="'left:' + item.x + 'px;top:' + item.y + 'px'"
									><span class="num">{{ item.index }}</span
									><i class="el-icon-close delect" @click.stop="delectSign(item.id)" v-show="editstate"></i
								></el-link>
							</div>
						</div>
						<div class="school-tag">
							<ul>
								<li class="tag-li" v-for="(item, index) of schoolAddress" :key="item.id" @click="deviceAddress(item)">
									<span>{{ index + 1 }}</span
									><i class="el-icon-location" style="color: #ff00ff"></i>{{ item.place }}
									<el-button
										v-show="editstate"
										style="padding: 1px"
										type="primary"
										round
										size="mini"
										@click.stop="markingPosition($event, item)"
										>标记</el-button
									>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="mr">
					<div class="power">
						<h3 class="power-title">用电统计<span class="new_more" @click="moreDevice">更多</span></h3>
						<div class="power-energy">
							<span class="energy-left">设备</span>
							<span class="energy-right">用电量</span>
						</div>
						<div class="power-energys">
							<ul>
								<li v-for="item of this.energyDevice" :key="item.id">
									<span class="energy-left">{{ item.location }}</span>
									<span class="energy-right">{{ item.list.list[0].energy_device }}</span>
								</li>
							</ul>
						</div>
					</div>
					<div class="power">
						<h3 class="new-title">在线巡课<span class="new_more" @click="moreVideo">更多</span></h3>
						<div class="videolist" v-if="videliu">
							<el-carousel indicator-position="outside" :interval="15000">
								<el-carousel-item v-for="(item, index) in allVideoOptions" :key="index">
									<video-player
										class="video-js vjs-default-skin vjs-big-play-centered"
										style="width: 100%; height: 150px"
										ref="videoPlayer"
										:playsinline="true"
										:options="item"
										@play="onPlayerPlay($event)"
									>
									</video-player>
									<span class="videoname">{{ item.name }}</span>
								</el-carousel-item>
							</el-carousel>
						</div>
						<div class="wu" v-else>暂无视频数据</div>
					</div>
					<div class="power">
						<h3 class="power-title">设备统计<span class="new_more" @click="moreStatistics">更多</span></h3>
						<div class="sbtj" id="Statistics"></div>
					</div>
				</div>
			</div>
		</el-main>
	</el-container>
</template>
<script>
export default {
	data() {
		return {
			boxImg: require('../../public/static/img/m-map.c73433a.png'),
			schoolname: localStorage.getItem('schoolname'),
			weather: {},
			unInformation: [],
			allVideoOptions: [],
			videoOptions: {},
			energyDevice: [],
			videliu: true,
			schoolAddress: [],
			currentPage: 0,
			pageSize: 10,
			deviceTotal: 0,
			pagetotal: 1,
			videoPage: 0,
			videoSize: 10,
			videoTotal: 0,
			videoPagetotal: 1,
			hasSign: [],
			signArr: [],
			signItem: {},
			editstate: false
		}
	},
	created: function () {
		this.allMessageList()
		this.getVideo(this.videoPage, this.videoSize)
		this.allStatisMonth()
		this.energyList()
		this.schoolAddress = []
		this.getDeviceList(this.currentPage, this.pageSize)
		this.allVideoOptions = []
	},
	methods: {
		//更多信息
		moreInform() {
			this.$router.push({
				path: '/internet/SeifinSpection'
			})
		},
		//所有消息列表
		allMessageList() {
			this.api.seifinspection
				.allMessageList(0, 5)
				.then(res => {
					// console.log(res)
					this.unInformation = res.data.notice.list
				})
				.catch(err => {
					console.log(err)
				})
		},
		//阅读消息
		readingMessage(row) {
			this.api.seifinspection
				.readingMessage(row.id)
				.then(() => {
					this.$router.push({
						query: {
							message: row
						},
						path: '/internet/MessageDetails'
					})
				})
				.catch(err => {
					console.log(err)
				})
		},
		//设备信息列表
		getDeviceList(currentPage, pageSize) {
			this.api.terminal
				.getDeviceList(currentPage, pageSize)
				.then(res => {
					// console.log(res);
					if (res.data.device_info_list.device_property_list) {
						for (let item of res.data.device_info_list.device_property_list) {
							this.schoolAddress.push(item)
						}
						this.deviceTotal = res.data.device_info_list.total //总条数
						this.pagetotal = Math.ceil(this.deviceTotal / this.pageSize) - 1 //分多少页
						if (this.currentPage < this.pagetotal) {
							this.currentPage += 1
							this.getDeviceList(this.currentPage, this.pageSize)
						} else {
							this.currentPage = 0
						}
					}
				})
				.catch(function (error) {
					// 请求失败处理
					console.log(error)
				})
		},
		//点击设备位置
		deviceAddress(item) {
			this.$router.push({
				query: {
					rows: item
				},
				path: '/internet/Terminal'
			})
		},
		//获取视频列表
		async getVideo(videoPage, videoSize) {
			let res = await this.api.videopreview.videoList(videoPage, videoSize)
			//  	console.log(res)
			this.videoTotal = res.data.rtmp_info_list.total //总条数
			this.videoPagetotal = Math.ceil(this.videoTotal / this.videoSize) - 1 //分多少页
			// this.allVideoOptions = [];
			for (let item of res.data.rtmp_info_list.rtmp_property_list) {
				console.log(`build up ----- getVideo ----- item`, item)
				// item.publishing == true
				if (item.publishing == true) {
					let flvUrl = ''
					let hlsUrl = ''
					await this.getFlvUrl(item.stream, res.id)
						.then(res => {
							flvUrl = res
						})
						.catch(() => {
							flvUrl = ''
						})
					await this.getHlsUrl(item.stream, res.id)
						.then(res => {
							hlsUrl = res
						})
						.catch(() => {
							hlsUrl = ''
						})
					this.allVideoOptions.push({
						name: item.name,
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
					})
				}
			}
			if (this.videoPage < this.videoPagetotal) {
				//分次加载
				this.videoPage += 1
				this.getVideo(this.videoPage, this.videoSize)
			} else {
				this.videoPage = 0
			}
			if (this.allVideoOptions.length == 0) {
				//判断是否有视频推流
				this.videliu = false
			} else {
				this.videliu = true
			}
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
		//播放
		onPlayerPlay() {},
		//暂停
		onPlayerPause() {},
		//更多视频
		moreVideo() {
			this.$router.push({
				path: '/broadcasting/VideoPreview'
			})
		},
		//所有设备统计
		allStatisMonth() {
			this.api.powerstats.energyList(0, 1).then(res => {
				//				console.log(res)
				let abscissa = []
				let series = []
				let energy_total = []
				if (res.data.billing) {
					for (let item of res.data.billing) {
						abscissa.push(item.location)
						energy_total.push(item.list.list[0].energy_total)
					}
					series.push({ name: '能耗统计', type: 'line', data: energy_total })
				}
				//引入echarts
				const echarts = require('echarts')
				let myChart = echarts.init(document.getElementById('Statistics'))
				myChart.clear() //清空echarts原有数据
				myChart.setOption({
					title: {
						text: ''
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['能耗统计']
						//				        data: this.allstatis
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						//				        data: ['周一', '周二', '周三', '周四', '周五', '周六']
						data: abscissa
					},
					yAxis: {
						type: 'value'
					},
					series: series
				})
			})
		},
		//更多统计
		moreStatistics() {
			this.$router.push({
				path: '/collection/index'
			})
		},
		//能耗列表
		energyList(areaid = 0, month = 1) {
			this.api.powerstats.energyList(areaid, month).then(res => {
				//			console.log(res)
				this.energyDevice = res.data.billing
			})
		},
		//更多用电量
		moreDevice() {
			this.$router.push({
				path: '/collection/PowerStats'
			})
		},
		//标记
		markingPosition(e, item) {
			this.signItem = {}
			console.log(e, item)
			this.signItem = item
		},
		//标记区域
		signBox(e) {
			let bgimg = document.querySelector('#topView')
			e = e || window.event
			let x = e.offsetX || e.layerX
			let y = e.offsetY || e.layerY
			let currWidth = bgimg.clientWidth
			let currHeight = bgimg.clientHeight
			let ProportionWidth = x / currWidth
			let ProportionHeigh = y / currHeight
			if (this.signItem.id) {
				for (let item of this.hasSign) {
					if (item.id == this.signItem.id) {
						item.prowidth = ProportionWidth
						item.proheigh = ProportionHeigh
						this.distributionList()
					} else {
						this.hasSign.push({
							id: this.signItem.id,
							index: this.signItem.index + 1,
							place: this.signItem.name,
							prowidth: ProportionWidth,
							proheigh: ProportionHeigh
						})
						this.distributionList()
					}
				}
			}
			//		console.log("图片比例宽度:"+ProportionWidth, "图片比例高度:"+ProportionHeigh)
		},
		//在图片上标记
		distributionList() {
			let bgimg = document.querySelector('#topView')
			let currWidth = bgimg.width
			let currHeight = bgimg.height
			if (this.hasSign != '') {
				for (let item of this.hasSign) {
					item.x = currWidth * item.prowidth - 6
					item.y = currHeight * item.proheigh - 9
				}
			}
		},
		//编辑标记
		editSign() {
			this.editstate = true
		},
		//完成标记
		complaceSign() {
			this.editstate = false
		},
		//删除标记
		delectSign(id) {
			//		console.log(id)
			if (id) {
				for (let i = 0; i < this.hasSign.length; i++) {
					if (this.hasSign[i].id == id) {
						this.hasSign.splice(i, 1)
					}
				}
			}
		}
	}
}
</script>

<style scoped="">
.home {
	padding: 0 !important;
	overflow: hidden;
	background: no-repeat 100% 50%;
	background-size: cover;
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 40px);
	position: relative;
}
.top {
	width: 100%;
	height: 85px;
	background-size: 100% 100%;
	background: no-repeat 50%;
}
.top p {
	color: #fff;
	width: 100%;
	line-height: 65px;
	text-align: center;
	font-size: 22px;
}
.middle {
	overflow: hidden;
	margin-top: 10px;
}
.ml {
	margin-left: 1%;
	width: 24%;
	float: left;
}
.weather {
	padding: 20px;
	color: #fff;
	border: solid #6fc197 1px;
	border-radius: 5px;
	background-color: #4b5a6c;
}
.days {
	overflow: hidden;
}
.alt {
	font-size: 16px;
}
.wt_list {
	margin-top: 10px;
	/*background-color: #F0F0F0;*/
}
.news {
	margin-top: 20px;
	padding: 20px;
	color: #fff;
	border: solid #6fc197 1px;
	border-radius: 5px;
	background-color: #4b5a6c;
}
.new-title {
	font-size: 16px;
	font-weight: 400;
	position: relative;
	z-index: 1;
}
.new_more {
	display: block;
	float: right;
	font-size: 12px;
	color: #5a9674;
	cursor: pointer;
}
.new-list {
	margin-top: 20px;
	font-size: 12px;
}
.new {
	width: 100%;
	font-size: 14px;
	background: #3c436d;
	color: #efff46;
	text-align: center;
	border: 1px solid #5a6883;
	margin-bottom: 8px;
	border-radius: 3px;
	overflow: hidden;
	line-height: 38px;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.new a {
	color: #efff46;
	text-decoration: none;
}
.mm {
	width: 48%;
	margin: 0 1%;
	float: left;
}
.school {
	width: 100%;
	height: auto;
	background: no-repeat;
	background-size: 100% 100%;
	overflow: hidden;
	position: relative;
	top: 0;
}
.school-alt {
	font-size: 18px;
	color: #5a9674;
	margin: 30px 0 0 40px;
	font-weight: 400;
}
.school-box {
	margin-bottom: 50px;
	position: relative;
	top: 0;
	width: 70%;
	display: inline-block;
	margin: 20px 0 0 20px;
}
.school-tag {
	color: #fff;
	font-size: 12px;
	height: 80%;
	max-height: 250px;
	overflow: auto;
	width: 25%;
	display: inline-block;
	vertical-align: top;
	margin-top: 20px;
}
.school-tag li {
	list-style-type: none;
	margin-bottom: 10px;
	cursor: pointer;
}
.box-img {
	width: 100%;
	position: relative;
}
.box-img img {
	width: 95%;
	margin: 0 auto;
}
.mr {
	margin-right: 1%;
	width: 24%;
	float: right;
}
.power {
	color: #fff;
	background-size: 100% 100%;
	position: relative;
	top: 0;
	height: 180px;
	background-color: #4b5a6c;
	border: 1px solid #6fc197;
	padding: 10px;
	margin-bottom: 20px;
	border-radius: 5px;
}
.power-title {
	width: 100%;
}
.power-list {
	position: absolute;
	width: 100%;
	height: 90%;
	bottom: 10px;
	left: 0;
	padding: 0 15px;
	z-index: 0;
}
.current-row {
	background-color: red;
}
.videolist {
	width: 100%;
	height: 100%;
	margin: 0 auto;
}
.sbtj {
	width: 100%;
	height: 90%;
	background-color: #f0f0f0;
}
.power-energy {
	width: 100%;
	padding: 10px 0;
	border-bottom: solid 1px #060000;
}
.power-energys {
	width: 100%;
	padding: 10px 0;
	height: 100px;
	overflow: auto;
}
.energy-left {
	width: 59%;
	display: inline-block;
	text-align: center;
}
.energy-right {
	width: 36%;
	display: inline-block;
	text-align: center;
}
.el-carousel__container {
	height: 0.1px;
}
.videoname {
	font-size: 12px;
	line-height: 25px;
}
.wu {
	line-height: 100px;
	text-align: center;
	font-size: 20px;
}
.icon-link {
	position: absolute;
	cursor: pointer;
	color: #ff00ff;
}
/* .color{
		color: #ffoff;
	} */
.num {
	display: block;
	position: absolute;
	z-index: 2;
	top: -15px;
	left: -2px;
	text-align: center;
	width: 90%;
	height: 15px;
	font-size: 12px;
	color: #fff;
}
.delect {
	display: block;
	position: absolute;
	z-index: 2;
	top: 10px;
	left: -1.5px;
	text-align: center;
	width: 90%;
	height: 15px;
	font-size: 12px;
	color: red;
}
</style>
