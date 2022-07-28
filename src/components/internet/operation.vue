<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<el-container class="have-permission">
		<el-header class="title">
			<span class="back" @click="goBack"
				><i class="el-icon-arrow-left left"></i>返回</span
			>
			<div class="d">
				<span class="na"
					>当前位置: <font>{{ rows.place }}</font></span
				>
				<span class="na"
					>序列号:{{ rows.sn }} &nbsp;&nbsp; IP:{{ rows.ip }}</span
				>
			</div>
		</el-header>
		<el-main class="container">
			<div class="location">
				<h3 class="h-title">
					<i class="el-icon-location"></i>绑定位置
					<el-button
						type="primary"
						size="mini"
						@click="tyingDevice(0)"
						class="bd"
						v-if="rows.place_id == 0"
						>绑定</el-button
					>
					<el-button
						type="primary"
						size="mini"
						@click="untyingDevice"
						class="bd"
						v-else
						>解绑</el-button
					>
				</h3>
				<div class="tree" v-if="rows.place_id == 0">
					<el-cascader
						style="width: 300px"
						v-model="position"
						:options="options"
						:props="props"
						@change="handleChange"
						clearable
					></el-cascader>
				</div>
				<div class="bind-success" v-else>
					<i class="el-icon-circle-check success-i"></i>
					<span>位置已绑定</span>
				</div>
			</div>
			<div class="device-info">
				<h3 class="h-title">
					<i class="el-icon-info"></i>关于设备
					<el-button
						type="primary"
						size="mini"
						@click="modifyDevice"
						class="bd"
						icon="el-icon-edit"
						v-show="original"
						>修改</el-button
					>
					<el-button-group v-show="newsb">
						<el-button
							type="success"
							icon="el-icon-check"
							size="mini"
							@click="submitForm('ruleForm')"
							>保存</el-button
						>
						<el-button
							type="danger"
							icon="el-icon-close"
							@click="cancelModify"
							size="mini"
							>取消</el-button
						>
					</el-button-group>
				</h3>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
					<el-form-item label="设备IP" prop="ip">
						<span class="val" v-show="original">{{ rows.ip }}</span>
						<el-input
							v-show="newsb"
							v-model="ruleForm.ip"
							placeholder="ruleForm.ip"
							class="input-ip"
							clearable
						></el-input>
					</el-form-item>
					<el-form-item label="设备网关" prop="gateway">
						<span class="val" v-show="original">{{
							rows.gateway
						}}</span>
						<el-input
							v-show="newsb"
							v-model="ruleForm.gateway"
							placeholder="ruleForm.gateway"
							class="input-ip"
							clearable
						></el-input>
					</el-form-item>
					<el-form-item label="设备子网掩码" prop="netmask">
						<span class="val" v-show="original">{{
							rows.netmask
						}}</span>
						<el-input
							v-show="newsb"
							v-model="ruleForm.netmask"
							placeholder="ruleForm.netmask"
							class="input-ip"
							clearable
						></el-input>
					</el-form-item>
					<el-form-item label="业务服务器IP" prop="businessip">
						<span class="val" v-show="original">{{ rows.ip }}</span>
						<el-input
							v-show="newsb"
							v-model="ruleForm.ip"
							placeholder="ruleForm.ip"
							class="input-ip"
							clearable
						></el-input>
					</el-form-item>
					<el-form-item label="直播服务器IP" prop="liveip">
						<span class="val" v-show="original">{{ rows.ip }}</span>
						<el-input
							v-show="newsb"
							v-model="ruleForm.ip"
							placeholder="ruleForm.ip"
							class="input-ip"
							clearable
						></el-input>
					</el-form-item>
					<el-form-item label="MAC地址">
						<span class="val">{{ rows.mac }}</span>
					</el-form-item>
					<el-form-item label="软件版本">
						<span class="val">{{ rows.firmware_version }}</span>
					</el-form-item>
					<el-form-item label="硬件版本">
						<span class="val">{{ rows.hardware_version }}</span>
					</el-form-item>
				</el-form>
			</div>
		</el-main>
	</el-container>
</template>

<script>
export default {
	//   props: {
	//     rows: {
	//       type: Object,
	//       required: true,
	//     },
	//   },
	data() {
		return {
			props: {
				value: 'id',
				label: 'name',
				children: 'items'
			},
			sn: '',
			ip: '',
			id: '',
			place: '',
			gateway: '',
			netmask: '',
			businessip: '',
			liveip: '',
			original: true,
			newsb: false,
			edition: '',
			hardware: '',
			status: null,
			position: [],
			shuzi: '',
			options: [],
			ruleForm: {
				ip: '',
				gateway: '',
				netmask: '',
				businessip: '',
				liveip: '',
				firmware_version: '',
				hardware_version: '',
				mac: ''
			},
			rules: {
				ip: [
					{
						required: true,
						message: '请输入设备ip',
						trigger: 'blur'
					}
				],
				gateway: [
					{
						required: true,
						message: '请输入设备网关',
						trigger: 'blur'
					}
				],
				netmask: [
					{
						required: true,
						message: '请输入设备子网掩码',
						trigger: 'blur'
					}
				],
				businessip: [
					{
						required: true,
						message: '请输入业务服务器IP',
						trigger: 'blur'
					}
				],
				liveip: [
					{
						required: true,
						message: '请输入直播服务器IP',
						trigger: 'blur'
					}
				]
			},
			areaid: '',
			rows: {},
			currentPage: 1,
			pageSize: localStorage.getItem('pageSize')
				? parseInt(localStorage.getItem('pageSize'))
				: 10
		}
	},
	created: function () {},
	methods: {
		getMethodState(e) {
			console.log(e)
		},
		//获取路由参数
		getState(rows) {
			console.log('👻 ----- getState ----- rows', rows)
			this.ruleForm = rows
			this.rows = rows
			this.api.operation.getState().then(res => {
				this.options = []
				if (res.data.place_info) {
					// this.recursiveArr(res.data.place_info)
					this.options = res.data.place_info
					this.addItem(this.options, 0)
				}
			})
		},

		// 递归
		addItem(options, id) {
			options.map((e, i, arr) => {
				if (!e.items && i == 0) {
					arr.push({
						id: id,
						name: '新增位置',
						comment: ''
					})
					return
				}
				if (e.items instanceof Array) {
					this.addItem(e.items, e.id)
				}
			})
		},
		// recursiveArr(arr) {
		// 	arr.map(e => {
		// 		if (e.items instanceof Array) {
		// 			this.recursiveArr(e.items)
		// 		} else {
		// 			arr.push({
		// 				id: 0,
		// 				name: '新增位置'
		// 			})
		// 		}
		// 	})
		// },
		//返回
		goBack() {
			this.$emit('back')
		},
		//解绑
		untyingDevice() {
			let parameter = { areaid: parseInt(0) }
			this.api.operation
				.fixedDevice(this.rows.id, 'place', parameter)
				.then(() => {
					//					console.log(res)
					this.rows.place_id = 0
					this.rows.place = ''
					this.position = []
					this.$emit('getDeviceList', this.currentPage, this.pageSize) //调用父组件方法
					this.$message({
						showClose: true,
						message: '恭喜你，设备号' + this.rows.sn + '解绑成功!',
						type: 'success'
					})
				})
				.catch(function (err) {
					// 请求失败处理
					console.log(err)
				})
		},
		//绑定
		tyingDevice(id) {
			var parameter
			var positions
			if (id > 0) {
				positions = id
				parameter = { areaid: positions }
			} else {
				positions = this.position[this.position.length - 1]
				parameter = { areaid: positions }
			}
			this.api.operation
				.fixedDevice(this.rows.id, 'place', parameter)
				.then(() => {
					this.rows.place_id = positions
					this.$emit('getDeviceList', this.currentPage, this.pageSize) //调用父组件方法
					this.$message({
						showClose: true,
						message: '恭喜你，设备号' + this.rows.sn + '绑定成功!',
						type: 'success'
					})
				})
				.catch(function (error) {
					//请求失败处理
					console.log(error)
				})
		},
		//选择教室
		handleChange(value) {
			if (
				value.length > 0 &&
				value[value.length - 1] == value[value.length - 2]
			) {
				this.$emit('addItem', value[value.length - 1])
				this.position = []
				return
			}
			let str = value
			let a = str[str.length - 1]
			this.areaid = a
		},
		//点击修改设备
		modifyDevice() {
			this.original = false
			this.newsb = true
		},
		//保存修改
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					alert('submit!')
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//取消修改
		cancelModify() {
			this.original = true
			this.newsb = false
		}
	}
}
</script>

<style scoped>
.title {
	width: 100%;
	font-size: 14px;
	background: #f2f2f2;
	height: 48px;
	line-height: 48px;
	font-weight: 600;
	color: #4d4d4d;
	position: relative;
	top: 0;
	padding: 0 7px;
	box-sizing: border-box;
	font-weight: 400;
	overflow: hidden;
}

.d {
	margin-top: 7px;
	margin-left: 10px;
}

.na {
	display: block;
	line-height: normal;
	font-size: 13px;
	color: #a8a8a8;
}

.back {
	display: block;
	float: left;
	font-size: 14px;
	overflow: hidden;
	color: #6fc197;
	margin-right: 10px;
}

.left {
	margin-right: -3px;
	font-weight: 700;
	font-size: 18px;
	float: left;
	line-height: inherit;
}

.container {
	width: 100%;
	box-sizing: border-box;
	padding: 10px;
}

.location {
	margin-bottom: 10px;
}

.h-title {
	height: 42px;
	width: 100%;
	line-height: 42px;
	background: #ecf0f6;
	padding-left: 10px;
	box-sizing: border-box;
	font-size: 15px;
	color: #4d4d4d;
	max-height: 500px;
}

.bd {
	font-size: 12px;
	font-weight: 400;
	padding: 3px 10px;
	color: #fff;
	margin-left: 10px;
}

.bind-success {
	margin-top: 10px;
	padding-left: 60px;
	overflow: hidden;
	line-height: 34px;
}

.success-i {
	display: block;
	font-size: 34px;
	color: #13ce66;
	float: left;
}

.input-ip {
	width: 50%;
}

.have-permission {
	box-sizing: border-box;
	margin-left: 1px;
	width: 98%;
}

.tree {
	box-sizing: border-box;
	margin-top: 10px;
	max-height: 520px;
	overflow-y: auto;
	padding-left: 20px;
}
</style>
