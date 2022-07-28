<template>
  <div style="margin-left: 10px">
    <div class="bcrumb">
      <span class="back" @click="prev"
        ><i class="el-icon-top-left"></i>返回</span
      >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>消息中心</el-breadcrumb-item>
        <el-breadcrumb-item>发布消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="推送字幕" name="first">
        <el-form
          class="tsform"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="内容" prop="textarea">
            <el-row>
              <el-col :span="11">
                <div class="grid-content bg-purple">
                  <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="ruleForm.textarea"
                  >
                  </el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-input
              type="color"
              class="zt_color"
              size="mini"
              :border="border"
            ></el-input>
          </el-form-item>
          <el-form-item label="播放时长" prop="sotime">
            <el-input
              placeholder="5到22880秒"
              type="number"
              v-model="ruleForm.sotime"
              style="width: 150px"
              size="mini"
              :border="border"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择对象">
            <el-button type="primary" size="mini" @click="address"
              ><i class="el-icon-plus"></i>添加</el-button
            >
            <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
              <span>添加位置</span>
              <el-tree
                :data="datas"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :props="ruleForm.defaultProps"
                @check-change="handleCheckChange"
              >
              </el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="wzqr">确 定</el-button>
              </span>
            </el-dialog>
            <div class="location-list" v-show="locallist">
              <template>
                <div class="t">教学楼</div>
                <div class="l"><span>101,102</span></div>
              </template>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item>
            <el-button
              type="success"
              size="mini"
              @click="submitForm('ruleForm')"
              >推送</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="发布消息" name="second">
        <div class="public-msg">
          <span class="title-bar">信息内容</span>
          <el-form
            class="tsform"
            :model="ruleForm1"
            :rules="rules1"
            ref="ruleForm1"
            label-width="100px"
          >
            <el-form-item label="标题">
              <el-input
                v-model="ruleForm1.title"
                style="width: 500px"
              ></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="textarea1">
              <el-row>
                <el-col :span="11">
                  <div class="grid-content bg-purple">
                    <el-input
                      type="textarea"
                      :rows="5"
                      placeholder="请输入内容"
                      v-model="ruleForm1.textarea1"
                    >
                    </el-input>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label="选择接收对象"
              class="dui"
              style="font-size: 15px"
            >
              <el-button type="primary" size="mini"
                ><i class="el-icon-plus"></i>添加</el-button
              >
              <el-dialog
                title="提示"
                :visible.sync="dialogVisible1"
                width="30%"
              >
                <span>添加用户</span>
                <!--<el-tree :data="datas" show-checkbox node-key="id" ref="tree" highlight-current :props="ruleForm.defaultProps" @check-change="handleCheckChange">
							</el-tree>-->
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible1 = false">取 消</el-button>
                  <el-button type="primary">确 定</el-button>
                </span>
              </el-dialog>
            </el-form-item>
            <el-form-item class="result-list">
              <div class="select-user">
                <div class="title1">
                  <span class="nic">用户名称</span>
                  <span class="nic">姓名</span>
                </div>
                <div class="content">
                  <ul>
                    <li>
                      <span class="nic">admin</span>
                      <span class="nic">admin</span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitForm('ruleForm')"
                >发布</el-button
              >
              <el-button @click="resetForm('ruleForm')">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      sotime: "",
      border: true,
      dialogVisible: false,
      dialogVisible1: false,
      datas: [
        {
          id: 1,
          label: "教学楼",
          children: [
            {
              id: 2,
              label: "101",
            },
            {
              id: 3,
              label: "102",
            },
          ],
        },
      ],
      ruleForm: {
        textarea: "",
        sotime: "",
        name: "",
        defaultProps: {
          children: "children",
          label: "label",
        },
      },
      ruleForm1: {
        title: "",
        textarea1: "",
      },
      rules: {
        textarea: [
          { required: true, message: "请填写活动内容", trigger: "blur" },
        ],
        sotime: [{ required: true, message: "播放时长不能为空" }],
      },
      rules1: {
        title: [{ required: true, message: "标题不能为空" }],
        textarea1: [
          { required: true, message: "请填写活动内容", trigger: "blur" },
        ],
      },
      locallist: false,
      checkIdArr: [],
      checkedKeyArr: [],
      checkedKeyStr: [],
    };
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    handleClick() {
      //	        console.log(tab, event)
    },
    //点击选择位置
    address() {
      this.dialogVisible = true;
    },
    //确认位置
    wzqr() {
      this.dialogVisible = false;
      this.locallist = true;
    },
    handleCheckChange(data, checked) {
      if (checked) {
        this.checkIdArr.push(data.id);
        this.checkedKeyArr = [...this.rowOrgIdList, ...this.checkIdArr];
        this.checkedKeyArr = Array.from(new Set(this.checkedKeyArr));
        this.checkedKeyStr = this.checkedKeyArr.join(","); // 把选中的节点id数组转为字符串传给后台的参数
      } else {
        this.checkedKeyArr.splice(
          this.checkedKeyArr.findIndex((v) => v === data.id),
          1
        );
        this.checkedKeyStr = this.checkedKeyArr.join(",");
        if (this.checkedKeyStr.length == 0) {
          this.checkIdArr = [];
          this.rowOrgIdList = [];
        }
      }
      console.log(this.checkIdArr, this.checkedKeyArr, this.checkedKeyStr);
    },
    //推送
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
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped="">
.tsform {
  margin-top: 20px;
}
.zt_color {
  width: 50px;
  height: 25px;
  margin-top: 10px;
}
.location-list {
  overflow: hidden;
  margin-top: 20px;
  padding-left: 15px;
  box-sizing: border-box;
  border-top: 1px solid #d5d7db;
}
.list-box {
  margin-bottom: 10px;
}
.t {
  display: inline-block;
  background: #7176b7;
  padding: 2px 10px;
  color: #fff;
  border-radius: 7px;
  margin-right: 10px;
  font-size: 12px;
  line-height: 25px;
}
.l {
  margin: 2px 0 10px;
}
.title-bar {
  display: block;
  background: #fff;
  padding: 8px 12px;
  box-sizing: border-box;
  font-size: 15px;
  color: #4d4d4d;
  font-weight: 600;
}
.dui {
  margin-top: 20px;
  display: block;
  background: #fff;
  padding: 8px 12px;
  box-sizing: border-box;
  color: #4d4d4d;
  font-weight: 600;
  margin-bottom: 10px;
}
.result-list {
  margin-bottom: 10px;
}
.title1 {
  overflow: hidden;
}
.nic {
  list-style: none;
  display: block;
  float: left;
  width: 120px;
  line-height: 20px;
}
.content {
  box-sizing: border-box;
  outline: 0;
}
ul li {
  list-style: none;
  margin-top: 5px;
  overflow: hidden;
}
</style>