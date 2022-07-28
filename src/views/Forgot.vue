<!--
 * @Description: 
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-08-24 09:15:30
 * @FilePath: \fang_lipt\src\views\Forgot.vue
 * El Psy Congroo
-->
<template>
  <el-container>
    <el-main class="login">
      <el-row>
        <div class="login-box">
          <div class="login-left">
            <div class="left-login">
              <img
                id="bglogo"
                class="left-logo"
                src=""
                onerror="this.src='/static/img/logo.png'"
              />
              <div class="left-school">{{ schoolName }}</div>
              <div class="left-school">{{ schoolPlat }}</div>
            </div>
          </div>
          <div class="login-right">
            <div class="login-list">
              <el-form
                :model="ruleForm"
                :rules="rules"
                status-icon
                ref="ruleForm"
                label-position="left"
                label-width="0px"
                class="demo-ruleForm login-page"
              >
                <h3 class="title">找回密码</h3>
                <el-form-item prop="phone" class="inp">
                  <el-input
                    prefix-icon="el-icon-phone"
                    type="text"
                    v-model="ruleForm.phone"
                    auto-complete="off"
                    placeholder="手机号码"
                    v-on:input="phonechange"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="code" class="inphq">
                  <el-tooltip placement="top">
                    <div slot="content">请输入四位数<br />字的验证码!</div>
                    <el-input
                      class="tippas"
                      prefix-icon="el-icon-s-claim"
                      type="number"
                      maxlength="4"
                      show-word-limit
                      clearable
                      v-model="ruleForm.code"
                      auto-complete="off"
                      placeholder="验证码"
                      v-on:input="codechange"
                    ></el-input>
                  </el-tooltip>
                  <el-button
                    type="success"
                    :disabled="hqdisabled"
                    @click="getAuthCode"
                    >{{ btnTitle }}</el-button
                  >
                </el-form-item>
                <div class="forger">
                  <router-link to="/Login">
                    <el-link type="success">想起密码，返回登录</el-link>
                  </router-link>
                </div>
                <el-form-item class="gongneng">
                  <el-button
                    :disabled="yzdisabled"
                    type="primary"
                    style="width: 65%"
                    @click="submitForm('ruleForm')"
                    >立即验证</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-row>
      <el-footer>
        <div class="login-footer">
          <p><span v-html="schoolFooter"></span></p>
        </div>
      </el-footer>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "forgot",
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else {
        if (value.toString().length !== 11) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          this.$refs.ruleForm.validateField("checkPhone");
          this.hqdisabled = false;
        }
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      console.log(value);
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (value.toString().length == 4) {
          this.$refs.ruleForm.validateField("checkCode");
        } else {
          callback(new Error("请输入4位数字的验证码"));
        }
        callback();
      }
    };
    return {
      hqdisabled: true,
      yzdisabled: true,
      btnTitle: "获取验证码",
      ruleForm: {
        phone: "",
        code: "",
        time: "",
      },
      rules: {
        phone: [
          {
            validator: validatePhone,
            trigger: "blur",
          },
        ],
        code: [
          {
            validator: validateCode,
            trigger: "blur",
          },
        ],
      },
      schoolName: "力扑智慧校园",
      schoolPlat: "力扑智慧科技",
      schoolFooter: "版权所有",
    };
  },
  created: function () {
    this.getInformation();
  },
  methods: {
    //获取学校等信息
    getInformation() {
      this.api.login.getInformation().then((res) => {
        this.schoolName = res.data.config_info.school.name;
        this.schoolPlat = res.data.config_info.school.plat_name;
        this.schoolFooter = res.data.config_info.school.footer;
        document.getElementById("bglogo").src =
          res.data.config_info.school.logo;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //监听手机号码oninput事件
    phonechange(value) {
      if (value.toString().length == 11) {
        this.hqdisabled = false;
      } else {
        this.hqdisabled = true;
      }
    },
    //监听验证码oninput事件
    codechange(value) {
      if (value.toString().length == 4) {
        this.yzdisabled = false;
      } else {
        this.yzdisabled = true;
      }
    },
    //  获取验证码
    getAuthCode() {
      //  验证
      //			      const verification =this.ReginForm.tel;
      //			       const url = " "
      //			       console.log("url",url);
      //			        this.$http.get(url)
      //			        .then(function (response) {
      //			         console.log("请求成功",response)
      //			         }, function (error) {
      //			         console.log("请求失败",error);
      //			        })
      //			      this.hqdisabled = false;
      //倒计时
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.hqdisabled = false;
          this.btnTitle = "获取验证码";
        } else {
          this.btnTitle = time + "秒后重试";
          this.hqdisabled = true;
          time--;
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.login {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url(/static/img/login_bg.07ab036.07ab036.jpg);
  background-size: cover;
  top: 0;
}

.login-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.login-left {
  width: 30%;
  height: 50vh;
  float: left;
  box-sizing: border-box;
}

.login-right {
  width: 30%;
  height: 50vh;
  float: right;
  background: #ffffff;
  box-sizing: border-box;
}

.login-list {
  padding: 50px 0;
}

.left-login {
  width: 100%;
  height: 100%;
  background: url(/static/img/login_l_bg.8f00cdc.8f00cdc.png);
  background-size: 100% 100%;
  top: 0;
}

.left-logo {
  width: 50%;
  margin: 0 auto;
  display: block;
  padding: 25px 0;
}

.left-school {
  color: #000;
  font-size: 18px;
  text-align: center;
  margin-top: 26px;
  letter-spacing: 1px;
}
.login-footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
  color: #eee;
  font-size: 12px;
  left: 0;
}

.title {
  color: #22ac38;
  text-align: center;
}

.inp {
  width: 65%;
  margin: 20px auto;
}

.inphq {
  width: 100%;
  margin: 20px auto;
  text-align: center;
}

.tippas {
  width: 35%;
}

.forger {
  text-align: right;
  margin-right: 50px;
}

.gongneng {
  text-align: center;
  margin-top: 30px;
}
</style>