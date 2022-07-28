<!--
 * @Description: 
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-08-24 09:23:54
 * @FilePath: \fang_lipt\src\views\Login.vue
 * El Psy Congroo
-->
<template>
  <el-container>
    <el-main class="login" :style="{backgroundImage: 'url('+require('../../public/static/img/login_bg.07ab036.jpg')+')'}">
      <el-row>
        <div class="login-box">
          <div class="login-left">
            <div class="left-login" :style="{background: 'url('+require('../../public/static/img/login_l_bg.8f00cdc.png')+')'}">
              <img
                id="bglogo"
                class="left-logo"
                :src="gbLogo"
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
                <h3 class="title">系统登录</h3>
                <el-form-item prop="username" class="inp">
                  <el-input
                    prefix-icon="el-icon-user"
                    type="text"
                    v-model="ruleForm.username"
                    auto-complete="off"
                    placeholder="用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="pass" class="inp">
                  <el-input
                    prefix-icon="el-icon-lock"
                    type="password"
                    v-model="ruleForm.pass"
                    auto-complete="off"
                    placeholder="密码"
                     @keyup.enter.native="inSign('ruleForm')"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="code" class="inp"  v-if="captche_enabled">
                  <el-input
                    v-model="ruleForm.code"
                    prefix-icon="el-icon-info"
                    type="text"
                    placeholder="请输入验证码"
                    @keyup.enter.native="inSign('ruleForm')"
                  >
                    <template slot="append">
                      <div class="login-code" @click="refreshCode">
                        <img class="codeimg" :src="codeSrc" />
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
                <!-- <div class="forger">
                  <el-link type="success" @click="forget">忘记密码？</el-link> -->
                  <!--<router-link to='/Forgot'>
										<el-link type="success">忘记密码？</el-link>
									</router-link>-->
                <!-- </div> -->
                <el-form-item class="gongneng">
                  <el-button
                    type="primary"
                    style="width: 40%"
                    @click="inSign('ruleForm')"
                    >登录</el-button
                  >
                  <el-button style="width: 40%" @click="resetForm('ruleForm')"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-row>
      <el-footer class="login-footer-wrapper">
        <div class="login-footer">
          <p><span v-html="schoolFooter"></span></p>
        </div>
      </el-footer>
    </el-main>
  </el-container>
</template>

<script>
import instance from '../api/http'

export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (this.ruleForm.checkUsername !== "") {
          this.$refs.ruleForm.validateField("checkUsername");
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        pass: "",
        code: "",
        captcha_key: "",
      },
      rules: {
        username: [
          {
            validator: validateUsername,
            trigger: "blur",
          },
        ],
        pass: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
        ],
      },
 
      schoolName: "力扑智慧校园",
      schoolPlat: "力扑智慧科技",
      schoolFooter: "版权所有",
      browserType: "",
      gbLogo: require("../../public/static/img/logo.png"),
      codeSrc: "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==",
      // captche_enabled:JSON.parse(localStorage.getItem("login")).captche_enabled
     captche_enabled: this.$store.state.captche_enabled
    };
  },
  created: function () {
    // console.log(" captche_enabled",this.captche_enabled)
    // console.log(" captche_enabled",this.captche_enabled)
    // console.log(" captche_enabled store==========>",this.$store.state.captche_enabled)
    this.getBrowerInfo();
    this.getInformation();
    // this.refreshCode();


    this.refreshCode();

  },
  methods: {
    //获取浏览器类型和版本号
    getBrowerInfo() {
      // console.log(window.navigator.userAgent)
      let userAgent = window.navigator.userAgent.toLowerCase();
      console.log("userAgent",userAgent);
      this.browserType = "";
      let browserVersion = "";
      // 浏览器类型-IE
      if (
        userAgent.match(/msie/) != null ||
        userAgent.match(/trident/) != null
      ) {
        this.browserType = "IE";
        browserVersion = userAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
        // console.log(browserType, browserVersion)
        console.log("browserVersion", browserVersion)

        if (parseInt(browserVersion) < 11) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // opera
      else if (window.opera || userAgent.indexOf("opera") > 0) {
        this.browserType = "opera";
        browserVersion = this.getOperaVersion(userAgent);
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 38) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // UC
      else if (userAgent.indexOf("ubrowser") > 0) {
        this.browserType = "UC";
        browserVersion = userAgent.match(/ubrowser\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 12) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // 百度
      else if (userAgent.indexOf("bidubrowser") > 0) {
        this.browserType = "百度";
        browserVersion = userAgent.match(/bidubrowser\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 8) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // 搜狗
      else if (
        userAgent.indexOf("metasr") > 0 ||
        userAgent.indexOf("se 2.x") > 0
      ) {
        this.browserType = "搜狗";
        userAgent = userAgent.replace(/\s*/g, '');
        // console.log("userAgent",userAgent)
        browserVersion = userAgent.match(/metasr([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 6) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // QQ
      else if (userAgent.indexOf("tencenttraveler") > 0) {
        this.browserType = "QQ";
        browserVersion = userAgent.match(/tencenttraveler\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 10) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // QQ
      else if (userAgent.indexOf("qqbrowser") > 0) {
        this.browserType = "QQ";
        browserVersion = userAgent.match(/qqbrowser\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 10) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // 遨游
      else if (userAgent.indexOf("maxthon") > 0) {
        this.browserType = "遨游";
        browserVersion = userAgent.match(/maxthon\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
      }
      // 火狐
      else if (userAgent.indexOf("firefox") > 0) {
        this.browserType = "火狐";
        browserVersion = userAgent.match(/firefox\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 54) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // edge
      else if (userAgent.indexOf("edge") > 0) {
        this.browserType = "Edge";
        browserVersion = userAgent.match(/edge\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 15) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // 谷歌/360
      else if (userAgent.indexOf("chrome") > 0) {
        if (this.validate360("type", "application/x360mmplugin")) {
          this.browserType = "360";
          browserVersion = userAgent.match(/chrome\/([\d.]+)/)[1];
          // console.log(browserType, browserVersion)
          if (parseInt(browserVersion) < 51) {
            this.$alert(
              "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
              { showConfirmButton: false, showClose: false }
            );
            return;
          }
        } else {
          this.browserType = "谷歌";
          browserVersion = userAgent.match(/chrome\/([\d.]+)/)[1];
          // console.log(browserType, browserVersion)
          if (parseInt(browserVersion) < 51) {
            this.$alert(
              "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
              { showConfirmButton: false, showClose: false }
            );
            return;
          }
        }
      }
      // 苹果
      else if (userAgent.indexOf("Safari") > -1) {
        this.browserType = "Safari";
        browserVersion = userAgent.match(/version\/([\d.]+)/)[1];
        // console.log(browserType, browserVersion)
        if (parseInt(browserVersion) < 10) {
          this.$alert(
            "浏览器版本低，请更新到最新版本，推荐使用谷歌浏览器打开本网站！",
            { showConfirmButton: false, showClose: false }
          );
          return;
        }
      }
      // return browserType + ' ' + browserVersion
    },
    // 获取opera浏览器版本
    getOperaVersion(userAgent) {
      try {
        if (window.opera) {
          return userAgent.match(/opera.([\d.]+)/)[1];
        } else if (userAgent.indexOf("opr") > 0) {
          return userAgent.match(/opr\/([\d.]+)/)[1];
        }
      } catch (e) {
        return 0;
      }
    },
    //判断是否为360浏览器
    validate360(option, value) {
      let mimeTypes = window.navigator.mimeTypes;
      console.log("mimeTypes===>",mimeTypes)
      for (let mt in mimeTypes) {
        // console.log(mimeTypes[mt][option], value)
        if (mimeTypes[mt][option] == value) {
          return true;
        }
      }
      return false;
    },
    //获取学校等信息
    getInformation() {
      this.api.login.getInformation().then((res) => {
        console.log(res)
        if(res.data.config_info.school) {
          this.schoolName = res.data.config_info.school.name;
          this.schoolPlat = res.data.config_info.school.plat_name;
          this.schoolFooter = res.data.config_info.school.footer;
        }
        if(res.data.config_info.link) {
          localStorage.setItem("link",JSON.stringify(res.data.config_info.link));
        }
          if(res.data.config_info.login) {
          localStorage.setItem("login",JSON.stringify(res.data.config_info.login));
          this.$store.commit("SET_captche_enabled",res.data.config_info.login.captche_enabled)
          this.captche_enabled=res.data.config_info.login.captche_enabled
        }
          if(res.data.config_info.panel) {
          localStorage.setItem("panel",JSON.stringify(res.data.config_info.panel));
        }
      }).catch(err =>{console.log(console.log(err))})
    },
    //获取和更新验证码
    refreshCode() {
      this.api.login
        .refreshCode()
        .then((res) => {
          // console.log(res)
          
          this.ruleForm.captcha_key = res.data.key;
          this.imgUrl(this.ruleForm.captcha_key);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //给验证码路径赋值
    imgUrl(key) {
      this.api.login
        .imgUrl(key)
        .then((res) => {
          // console.log(res)
           this.codeSrc = instance.defaults.baseURL + res.config.url;
        //  this.codeSrc ="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //登陆
    inSign(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            login: {
              name: this.ruleForm.username,
              password: this.ruleForm.pass,
              captcha_key: this.ruleForm.captcha_key, //验证码Key
              code: this.ruleForm.code, //验证码值
            },
          };
          this.api.login
            .inSign(param)
            .then((res) => {
              // console.log(res)
              // localStorage.clear();
              if (res.data.result.code == 0) {
                localStorage.setItem("user", res.data.login_info.user);
                localStorage.setItem("token", res.data.login_info.token);
                localStorage.setItem("role", res.data.login_info.role);
                localStorage.setItem("id", res.data.login_info.id);
                localStorage.setItem("reformTime", new Date().getTime());
                localStorage.setItem(
                  "role_level",
                  res.data.login_info.role_level
                );
                localStorage.setItem("name", res.data.login_info.name);
                localStorage.setItem("tips", res.data.login_info.unread_number);
                localStorage.setItem("schoolname", this.schoolName);
                localStorage.setItem("pageSize", 10); //列表默认10条一页
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$router.push({
                  path: "/main",
                });
              } else {
                this.$message({
                  message: "用户名或者密码错误",
                  type: "warning",
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          //						console.log('error submit!!')
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //忘记密码
    forget() {
      this.$alert("此功能暂不可用，请联系系统管理员！", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        center: true,
      });
    },
  },
};
</script>

<style scoped>
.login {
  position: absolute;
  height: 100%;
  width: 100%;
  /* background: url(/static/img/login_bg.07ab036.jpg); */
  background-size: cover;
  top: 0;
}
/* done 修改样式 */
.login-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 60px);
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
  width: 100%;
  height: 100%;
  min-height: 370px;
  background: #fff;
}

.left-login {
  width: 100%;
  height: 100%;
  /* background: url(/static/img/login_l_bg.8f00cdc.png); */
  background-size: 100% 100%;
  top: 0;
  min-height: 370px;
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
footer.el-footer.login-footer-wrapper{
  height: 20px !important;
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
  padding: 20px 0;
}

.inp {
  width: 65%;
  margin: 20px auto;
}

.forger {
  text-align: right;
  margin-right: 50px;
}

.gongneng {
  text-align: center;
  margin-top: 30px;
}

.codeimg {
  width: 60px;
  height: 40px;
  margin-bottom: -10px;
}
</style>