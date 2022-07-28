<template>
	<el-container>
		<el-header style="margin-bottom: -30px">
			<div class="bcrumb">
				<span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>系统设置</el-breadcrumb-item>
					<el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<h1 class="title">基本资料</h1>
			<div class="add-user">
				<span class="title-bar">基本资料</span>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="small">
					<el-form-item label="当前用户密码" prop="adminpassword" v-if="modifystake">
						<el-input type="password" v-model="ruleForm.adminpassword" show-password size="mini"></el-input>
						<p class="red">您正在修改其它用户的资料,为了保证安全，请输入当前用户密码</p>
					</el-form-item>
					<el-form-item label="用户账号" prop="username">
						<el-input v-model="ruleForm.username" size="mini" :disabled="modifystake"></el-input>
					</el-form-item>
					<el-form-item label="密码" v-if="modifystake">
						<el-input type="password" v-model="ruleForm.password" show-password size="mini"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" v-else>
						<el-input type="password" v-model="ruleForm.password" show-password size="mini"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="phone_num">
						<el-input
							v-model="ruleForm.phone_num"
							placeholder="请输入手机号"
							:maxlength="11"
							show-word-limit
							clearable
							prefix-icon="el-icon-mobile"
						></el-input>
						<span class="red">选填,用于匹配微信小程序</span>
					</el-form-item>
					<el-form-item label="用户名称">
						<el-input v-model="ruleForm.name" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="用户权限等级">
						<el-select v-model="ruleForm.level" placeholder="请选择" size="mini">
							<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
						<span class="red">最高级管理员才可以修改</span>
					</el-form-item>
					<el-form-item label="是否启用" v-show="modifystake">
						<el-select v-model="ruleForm.enabled" placeholder="请选择" size="mini">
							<el-option v-for="item in enabledoptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="部门名称">
            <el-input v-model="ruleForm.department" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="ruleForm.tel" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="ruleForm.email" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="一卡通">
            <el-input v-model="ruleForm.cake" size="mini"></el-input>
            <el-button type="primary" size="mini">读取</el-button
            ><el-button type="primary" size="mini">导入</el-button
            ><el-button type="primary" size="mini">导出</el-button
            ><el-button type="success" size="mini">写入</el-button>
          </el-form-item> -->
					<el-form-item>
						<el-button type="success" @click="submitForm('ruleForm')" size="mini" v-if="modifystake == false">立即创建</el-button>
						<el-button type="success" @click="modifySubmit('ruleForm')" size="mini" v-else>确认修改</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		//  	var checkPhone = (rule, value, callback) => {
		//      if (!value) {
		//        return callback(new Error('手机号不能为空'));
		//      } else {
		//        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
		//        console.log(reg.test(value));
		//        if (reg.test(value)) {
		//          callback();
		//        } else {
		//          return callback(new Error('请输入正确的手机号'));
		//        }
		//      }
		//    };
		return {
			title: '添加用户',
			ruleForm: {
				phone_num: '',
				username: '',
				password: '',
				adminpassword: '',
				name: '',
				level: 100,
				enabled: true
				//        department:'',
				//        cake: '',
				//        tel:'',
				//        email: ''
			},
			rules: {
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				adminpassword: [{ required: true, message: '请输入当前管理员密码', trigger: 'blur' }],
				phone_num: [
					{
						pattern: /^1(3|4|5|7|8|9)\d{9}$/,
						message: '手机号格式错误',
						trigger: 'blur'
					}
				]
				//        name: [
				//          { required: true, message: '请输入姓名', trigger: 'blur' },
				//        ],
				//        department:[
				//          { required: true, message: '请输入用户名', trigger: 'blur' }
				//        ],
				//        role: [
				//          { required: true, message: '请选择权限', trigger: 'change' }
				//        ],
				//        tel:[
				//          {required: true, validator: checkPhone, trigger: 'blur'}
				//        ]
			},
			level: localStorage.getItem('role_level'),
			useroptions: [
				{
					value: 100,
					label: '普通用户'
				},
				{
					value: 1,
					label: '管理员'
				}
			],
			enabledoptions: [
				{
					value: true,
					label: '启用'
				},
				{
					value: false,
					label: '禁用'
				}
			],
			modifystake: false
		}
	},
	mounted() {
		//获取修改信息
		if (this.$route.query.id) {
			this.allModify(this.$route.query.id)
		} else {
			this.modifystake = false
			this.title = `添加用户`
		}
	},
	//  created:function(){
	//
	//	},
	methods: {
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//添加
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (this.ruleForm.level == '') {
					this.ruleForm.level = 100
				}
				if (valid) {
					let params = {
						username: this.ruleForm.username,
						password: this.ruleForm.password,
						name: this.ruleForm.name,
						level: this.ruleForm.level,
						phone_num: this.ruleForm.phone_num
					}
					//        	console.log(params)
					this.api.usermanagement
						.createUser(params)
						.then(() => {
							//          	console.log(res)
							this.$refs[formName].resetFields()
							this.$message({
								message: '创建成功',
								type: 'success'
							})
							this.$router.push({
								path: '/settings/UserManagement'
							})
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
		//确认修改用户信息
		modifySubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (this.ruleForm.level == '') {
					this.ruleForm.level = 100
				}
				if (valid) {
					let params = {
						password: this.ruleForm.password,
						name: this.ruleForm.name,
						level: this.ruleForm.level,
						enabled: this.ruleForm.enabled,
						phone_num: this.ruleForm.phone_num
					}
					//        	console.log(params)
					this.api.usermanagement
						.modifySubmit(this.ruleForm.username, this.ruleForm.adminpassword, params)
						.then(() => {
							//          	console.log(res)
							this.$message({
								message: '修改成功',
								type: 'success'
							})
							this.$router.push({
								path: '/settings/UserManagement'
							})
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
		//获取修改用户信息
		allModify(id) {
			this.modifystake = true
			this.title = `修改用户`
			this.api.usermanagement
				.allModify(id)
				.then(res => {
					//  		console.log(res)
					this.ruleForm.username = res.data.account_list.account_property_list[0].username
					this.ruleForm.name = res.data.account_list.account_property_list[0].name
					this.ruleForm.level = res.data.account_list.account_property_list[0].level
					this.ruleForm.enabled = res.data.account_list.account_property_list[0].enabled
					this.ruleForm.phone_num = res.data.account_list.account_property_list[0].phone_num
				})
				.catch(err => {
					console.log(err)
				})
		}
	}
}
</script>

<style scoped="">
.title {
	font-weight: 600;
	color: #4d4d4d;
	box-sizing: border-box;
	display: block;
	font-size: 18px;
	padding: 5px 0 10px;
	border-bottom: 1px solid #9ea7b3;
}
.add-user {
	box-sizing: border-box;
	padding: 20px;
}
.title-bar {
	margin-bottom: 10px;
	background: #fff;
	padding: 12px;
	font-size: 15px;
	display: block;
}
.el-input {
	width: 200px;
}
.red {
	color: red;
}
</style>
