<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header>
			<div class="bcrumb">
				<span class="back" @click="prev"
					><i class="el-icon-top-left"></i>返回</span
				>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>物联网</el-breadcrumb-item>
					<el-breadcrumb-item>其他模块</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-row class="toolsbar terminal_search">
				<el-button type="primary" @click="newLink"
					><i class="el-icon-plus" size="mini"></i>新增</el-button
				>
			</el-row>
		</el-header>
		<el-main>
			<el-table border :data="tableData" style="width: 70%">
				<el-table-column type="index" width="55" align="center">
				</el-table-column>
				<el-table-column
					prop="data.name"
					label="名称"
					width="150"
					align="center"
				>
				</el-table-column>
				<el-table-column
					prop="data.url"
					label="跳转地址"
					width="300"
					align="center"
				>
				</el-table-column>
				<el-table-column
					prop="data.addtime"
					label="添加时间"
					width="150"
					align="center"
				>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<div class="btn_box">
							<div class="btn">
								<el-button
									type="success"
									size="mini"
									:icon="
										link_button_mode == 'only_title'
											? ''
											: 'el-icon-right'
									"
									@click="jumpUrl(scope.row)"
									><span
										v-if="link_button_mode !== 'only_icon'"
										>{{ link_button_name }}</span
									></el-button
								>
							</div>
							<div class="btn">
								<el-button
									:icon="
										link_button_mode == 'only_title'
											? ''
											: 'el-icon-close'
									"
									type="danger"
									size="mini"
									@click.native.stop="deleteUrl(scope.row.id)"
								>
									<span
										v-if="link_button_mode !== 'only_icon'"
										>删除</span
									></el-button
								>
							</div>
						</div>
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
			<el-dialog
				title="新增地址"
				:visible.sync="dialogUrl"
				width="35%"
				:close-on-click-modal="false"
				center
			>
				<el-form
					:model="urlForm"
					:rules="urlRules"
					ref="urlForm"
					label-width="100px"
					@submit.native.prevent
				>
					<el-form-item label="名称">
						<el-input
							v-model="urlForm.name"
							placeholder="请输入地址名称"
						></el-input>
					</el-form-item>
					<el-form-item label="地址">
						<el-input
							v-model="urlForm.url"
							placeholder="https://www.baidu.com"
						></el-input>
					</el-form-item>
					<el-form-item label="图标">
						<el-input
							style="width: 70%"
							v-model="urlForm.icon"
							placeholder="图标名称如：el-icon-setting"
						></el-input
						><el-button
							type="success"
							size="small"
							style="margin-left: 10px"
							@click="selectIcon"
							>选择图标</el-button
						>
					</el-form-item>
					<el-form-item label="背景颜色">
						<el-color-picker
							v-model="urlForm.color"
							show-alpha
							:predefine="predefineColors"
						>
						</el-color-picker>
					</el-form-item>
				</el-form>
				<div slot="footer" class="tac">
					<el-button @click="dialogUrl = false">取 消</el-button>
					<el-button type="primary" @click="trueUrl('urlForm')"
						>确 定</el-button
					>
				</div>
			</el-dialog>
			<el-dialog
				title="图标选择"
				:visible.sync="dialogIcon"
				width="60%"
				:close-on-click-modal="false"
				center
			>
				<el-tabs
					type="border-card"
					v-model="activeName"
					@tab-click="handleClick"
				>
					<el-tab-pane label="系统图标" name="system">
						<ul class="ul-icon">
							<li
								class="iconblock"
								v-for="fit in fits"
								:key="fit"
								@click="iconSelect(fit)"
								:class="{ stateicon: yuanicon == fit }"
							>
								<i class="iconfit" :class="fit"></i>
								<span>{{ fit }}</span>
							</li>
						</ul>
						<el-button
							type="text"
							size="small"
							@click="allIcon"
							class="allimg"
							>加载全部图标</el-button
						>
					</el-tab-pane>
					<el-tab-pane label="自定义图标" name="custom">
						<el-upload
							class="upload-demo"
							ref="upload"
							:headers="urlHeader"
							action="/upload/picture"
							:file-list="fileList"
							:auto-upload="false"
							:on-success="handleSuccess"
							:on-error="handleError"
							:limit="1"
						>
							<el-button
								slot="trigger"
								size="small"
								type="primary"
								>选取文件</el-button
							>
							<el-button
								style="margin-left: 10px"
								size="small"
								type="success"
								@click="submitUpload"
								>上传到服务器</el-button
							>
							<div slot="tip" class="el-upload__tip">
								请选择上传文件
							</div>
						</el-upload>
						<el-divider></el-divider>
						<span
							>自定义图片列表<span class="red"
								>(请点击其中一行选择你的图标)</span
							></span
						>
						<el-table
							:data="customData"
							border
							style="width: 100%; margin-top: 10px"
							highlight-current-row
							@current-change="currentChange"
						>
							<el-table-column
								prop="id"
								label="ID"
								width="50"
								align="center"
							>
							</el-table-column>
							<el-table-column
								prop="date"
								label="缩略图"
								width="150"
								align="center"
							>
								<template slot-scope="scope">
									<img
										:src="scope.row.path"
										min-width="30"
										height="30"
									/>
								</template>
							</el-table-column>
							<el-table-column
								prop="name"
								label="名称"
								width="250"
								align="center"
							>
							</el-table-column>
							<el-table-column
								prop="name"
								label="分辨率"
								width="100"
								align="center"
							>
								<template slot-scope="scope">
									{{ scope.row.width }} x
									{{ scope.row.height }}
								</template>
							</el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-button
										type="primary"
										size="mini"
										@click="renamCustom(scope.row)"
										>改名</el-button
									>
									<el-button
										type="success"
										size="mini"
										@click="CropPicture(scope.row)"
										>裁剪</el-button
									>
									<el-button
										type="danger"
										size="mini"
										@click="deleteCustom(scope.row.id)"
										>删除</el-button
									>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							class="pagination"
							@size-change="handleSizeChange1"
							@current-change="handleCurrentChange1"
							:current-page="currentPage"
							:page-sizes="[10, 20, 50, 100]"
							:page-size="pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="customTotal"
						>
						</el-pagination>
					</el-tab-pane>
				</el-tabs>
				<div slot="footer" class="tac">
					<el-button @click="dialogIcon = false">取 消</el-button>
					<el-button type="primary" @click="trueIcon(yuanicon)"
						>确 定</el-button
					>
				</div>
			</el-dialog>
			<el-dialog
				title="修改图片名称"
				:visible.sync="dialogRenam"
				width="30%"
				center
			>
				<el-form :model="renamForm">
					<el-form-item label="新名称" :label-width="formLabelWidth">
						<el-input v-model="renamForm.name"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogRenam = false">取 消</el-button>
					<el-button type="primary" @click="trueRenam"
						>确 定</el-button
					>
				</div>
			</el-dialog>
			<el-dialog
				title="请输入图片裁剪参数"
				:visible.sync="dialogTailor"
				width="20%"
				center
			>
				<el-form :model="tilorForm" :rules="tilorRules" ref="tilorForm">
					<el-form-item style="text-align: center">
						<span
							>当前尺寸: {{ tilorRow.width }} x
							{{ tilorRow.height }}</span
						>
					</el-form-item>
					<el-form-item label="X" label-width="50px" prop="x">
						<el-input v-model="tilorForm.x"></el-input>
					</el-form-item>
					<el-form-item label="Y" label-width="50px" prop="y">
						<el-input v-model="tilorForm.y"></el-input>
					</el-form-item>
					<el-form-item label="W" label-width="50px" prop="w">
						<el-input v-model="tilorForm.w"></el-input>
					</el-form-item>
					<el-form-item label="H" label-width="50px" prop="h">
						<el-input v-model="tilorForm.h"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogTailor = false">取 消</el-button>
					<el-button type="primary" @click="trueTilor('tilorForm')"
						>确 定</el-button
					>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
import iconjs from '../../../public/static/icon.js'
export default {
	data() {
		return {
			urlHeader: {
				'S-C-Project-Session': window.localStorage.getItem('token')
					? window.localStorage.getItem('token')
					: ''
			},
			link_button_mode: JSON.parse(localStorage.getItem('link'))
				.button_mode,
			link_button_name: JSON.parse(localStorage.getItem('link'))
				.button_name,
			tableData: [],
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize')
				? parseInt(localStorage.getItem('pageSize'))
				: 10,
			total: 0,
			dialogUrl: false,
			urlForm: {
				name: '',
				url: '',
				icon: '',
				color: 'rgba(255, 69, 0, 0.68)'
			},
			urlRules: {},
			dialogIcon: false,
			fits: [
				'el-icon-delete',
				'el-icon-setting',
				'el-icon-user',
				'el-icon-phone-outline',
				'el-icon-star-off',
				'el-icon-check',
				'el-icon-close',
				'el-icon-camera',
				'el-icon-bell',
				'el-icon-s-platform',
				'el-icon-s-operation',
				'el-icon-s-promotion',
				'el-icon-s-home',
				'el-icon-share',
				'el-icon-back',
				'el-icon-right',
				'el-icon-video-pause',
				'el-icon-video-play',
				'el-icon-refresh-right',
				'el-icon-refresh-left'
			],
			yuanicon: '',
			predefineColors: [
				'#ff4500',
				'#ff8c00',
				'#ffd700',
				'#90ee90',
				'#00ced1',
				'#1e90ff',
				'#c71585',
				'rgba(255, 69, 0, 0.68)',
				'rgb(255, 120, 0)',
				'hsv(51, 100, 98)',
				'hsva(120, 40, 94, 0.5)',
				'hsl(181, 100%, 37%)',
				'hsla(209, 100%, 56%, 0.73)',
				'#c7158577'
			],
			activeName: 'system',
			fileList: [],
			customData: [],
			customTotal: 0,
			dialogRenam: false,
			formLabelWidth: '120px',
			renamForm: {
				name: ''
			},
			customId: '',
			dialogTailor: false,
			tilorForm: {
				x: '',
				y: '',
				w: '',
				h: ''
			},
			tilorRules: {
				x: [
					{
						required: true,
						message: '请输入左上角x坐标',
						trigger: 'blur'
					}
				],
				y: [
					{
						required: true,
						message: '请输入左上角y坐标',
						trigger: 'blur'
					}
				],
				w: [
					{
						required: true,
						message: '请输入裁剪的宽度',
						trigger: 'blur'
					}
				],
				h: [
					{
						required: true,
						message: '请输入裁剪的高度',
						trigger: 'blur'
					}
				]
			},
			cropId: '',
			tilorRow: ''
		}
	},
	created: function () {
		this.getLink()
	},
	methods: {
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//获取url列表
		getLink() {
			this.api.config
				.getLink(this.currentPage - 1, this.pageSize)
				.then(res => {
					//					console.log(res)
					if (res.data.link_list.list) {
						this.tableData = res.data.link_list.list
						this.total = res.data.link_list.total
						if (this.tableData) {
							for (let item of this.tableData) {
								item.data.addtime = this.timeConversion(
									item.data.timestamp
								)
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
			this.getLink()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getLink()
			//      console.log(`当前页: ${val}`);
		},
		//新建url
		newLink() {
			this.dialogUrl = true
		},
		//确认新增
		trueUrl(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// console.log(this.urlForm);
					this.api.config
						.newLink(
							this.urlForm.name,
							this.urlForm.url,
							this.urlForm.icon,
							this.urlForm.color
						)
						.then(res => {
							// console.log(res)
							this.dialogUrl = false
							this.$message({
								type: 'success',
								message: '添加成功'
							})
							this.getLink()
						})
						.catch(err => {
							console.log(err)
						})
				}
			})
		},
		//删除url
		deleteUrl(id) {
			this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.config
						.deleteUrl(id)
						.then(() => {
							let totalPage = Math.ceil(
								(this.total - 1) / this.pageSize
							)
							let currentPage =
								this.currentPage > totalPage
									? totalPage
									: this.currentPage
							this.currentPage = currentPage < 1 ? 1 : currentPage
							this.getLink()
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
		},
		//跳转url
		jumpUrl(row) {
			window.open(row.data.url)
		},
		//时间戳转换成日期
		timeConversion(timeStamp) {
			let date = new Date(timeStamp * 1000) //毫秒*1000
			let year = date.getFullYear()
			let month = date.getMonth() + 1
			let day = date.getDate()
			let hour = date.getHours()
			let minute = date.getMinutes()
			let second = date.getSeconds()
			if (parseInt(hour) < 10) {
				//加0
				hour = '0' + hour
			}
			if (parseInt(minute) < 10) {
				//加0
				minute = '0' + minute
			}
			if (parseInt(second) < 10) {
				//加0
				second = '0' + second
			}
			return (
				year +
				'-' +
				month +
				'-' +
				day +
				' ' +
				hour +
				':' +
				minute +
				':' +
				second
			)
		},
		//选择图标
		selectIcon() {
			this.dialogIcon = true
		},
		//加载全部图标
		allIcon() {
			this.fits = iconjs
		},
		//点击图标
		iconSelect(val) {
			console.log(val)
			this.yuanicon = val
		},
		//确认选择图标
		trueIcon(val) {
			this.urlForm.icon = val
			this.dialogIcon = false
		},
		//tab切换
		handleClick(tab) {
			if (tab.name == 'custom') {
				this.getCustom()
			}
		},
		//上传图片
		submitUpload() {
			console.log('upload', this.$refs.upload)
			this.$refs.upload.submit()
		},
		//上传成功后的回调
		handleSuccess(response) {
			this.getCustom()
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
		//获取自定义图片列表
		getCustom(keyword = '') {
			this.api.mediafile
				.getCustom(this.currentPage - 1, this.pageSize, keyword)
				.then(res => {
					console.log(res)
					if (res.data.list.list) {
						this.customData = res.data.list.list
						this.customTotal = res.data.list.total
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//条数
		handleSizeChange1(val) {
			this.pageSize = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.getCustom()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange1(val) {
			this.currentPage = val
			this.getCustom()
			//      console.log(`当前页: ${val}`);
		},
		//表格单选
		currentChange(val) {
			console.log(val)
			this.yuanicon = val.path
			console.log(this.yuanicon)
		},
		//改名
		renamCustom(row) {
			this.dialogRenam = true
			this.renamForm.name = row.name
			this.customId = row.id
		},
		//确定改名
		trueRenam() {
			this.api.mediafile
				.postCustom(this.customId, this.renamForm.name)
				.then(res => {
					console.log(res)
					this.getCustom()
					this.dialogRenam = false
					this.$message({
						type: 'scuess',
						message: '修改成功'
					})
				})
				.catch(err => {
					console.log(err)
				})
		},
		//删除
		deleteCustom(id) {
			this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.api.mediafile
						.deleteCustom(id)
						.then(() => {
							let totalPage = Math.ceil(
								(this.customTotal - 1) / this.pageSize
							)
							let currentPage =
								this.currentPage > totalPage
									? totalPage
									: this.currentPage
							this.currentPage = currentPage < 1 ? 1 : currentPage
							this.getCustom()
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
		},
		//裁剪
		CropPicture(row) {
			this.dialogTailor = true
			this.cropId = row.id
			this.tilorRow = row
		},
		//确定裁剪
		trueTilor(formName) {
			console.log(this.tilorForm)
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.api.mediafile
						.putCustom(
							this.cropId,
							this.tilorForm.x,
							this.tilorForm.y,
							this.tilorForm.w,
							this.tilorForm.h
						)
						.then(res => {
							console.log(res)
							this.getCustom()
							this.dialogTailor = false
							if (res.data.result.code == 0) {
								this.$message({
									type: 'success',
									message: '裁剪成功'
								})
							} else {
								this.$message({
									type: 'error',
									message: '裁剪失败'
								})
							}
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		}
	}
}
</script>

<style>
.pagin {
	margin: 0 0 50px 40%;
}
.ul-icon {
	overflow: hidden;
	list-style: none;
	padding: 0 !important;
	border: 1px solid #eaeefb;
	border-radius: 4px;
}
.iconblock {
	float: left;
	width: 20%;
	text-align: center;
	height: 100px;
	line-height: 50px;
	font-size: 13px;
	border-right: 1px solid #eee;
	border-bottom: 1px solid #eee;
	margin-right: -1px;
	margin-bottom: -1px;
	padding-top: 20px;
}
.stateicon {
	border: 1px solid red;
	margin: -1px;
}
.iconblock span {
	display: inline-block;
	padding: 0 3px;
	height: 1em;
}
.iconfit {
	display: block;
	font-size: 32px;
	text-align: center;
	margin-bottom: 15px;
}
.allimg {
	display: block;
	margin: 20px auto 0;
}
.red {
	color: red;
}

.btn_box .btn {
	margin: 6px 0;
}
</style>
