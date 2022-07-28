<template>
  <div style="margin-left: 10px">
    <div class="bcrumb">
      <span class="back" @click="prev"
        ><i class="el-icon-top-left"></i>返回</span
      >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>教室环境管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
    >
      <span class="title-bar"><i class="el-icon-mouse sj"></i>传感器设置</span>
      <el-form-item label="位置选择" class="is-required" prop="selectLocation">
        <el-tree
          :data="datas"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :props="ruleForm.selectLocation"
          @check-change="handleCheckChange"
        >
        </el-tree>
      </el-form-item>
      <el-form-item label="温度" prop="temperature">
        <el-input-number
          v-model="ruleForm.temperature"
          :min="20"
          :max="35"
          :border="border"
          size="mini"
        ></el-input-number>
        <el-checkbox v-model="temperature.checked" class="col"
          >自动开启空调或风扇</el-checkbox
        >
      </el-form-item>
      <el-form-item label="光照值" prop="Illuminationsda">
        <el-input
          v-model="ruleForm.Illuminationsda"
          :border="border"
          size="mini"
          placeholder="建议100"
        ></el-input>
        <el-checkbox v-model="Illuminations.big" class="col"
          >大于自动关灯</el-checkbox
        ><br />
      </el-form-item>
      <el-form-item prop="Illuminationsxiao">
        <el-input
          v-model="ruleForm.Illuminationsxiao"
          :border="border"
          size="mini"
          placeholder="建议50"
        ></el-input>
        <el-checkbox v-model="Illuminations.small" class="col"
          >小于自动关灯</el-checkbox
        >
      </el-form-item>
      <el-form-item label="自动开启频率" prop="frequency">
        <el-input
          v-model="ruleForm.frequency"
          :border="border"
          placeholder="请输入频率"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据刷新频率" prop="refresh">
        <el-input
          v-model="ruleForm.refresh"
          :border="border"
          size="mini"
          placeholder="请输入频率"
          ><template slot="append">秒</template></el-input
        >
      </el-form-item>

      <el-form-item label="活动时间" required>
        <el-col :span="4">
          <el-form-item prop="date1" style="margin: 0">
            <el-time-picker
              placeholder="选择日期"
              v-model="ruleForm.date1"
              size="mini"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">至</el-col>
        <el-col :span="4">
          <el-form-item prop="date2" style="margin: 0">
            <el-time-picker
              placeholder="选择时间"
              size="mini"
              v-model="ruleForm.date2"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item required>
        <el-col :span="4">
          <el-form-item prop="date3" style="margin: 0">
            <el-time-picker
              placeholder="选择日期"
              v-model="ruleForm.date3"
              size="mini"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">至</el-col>
        <el-col :span="4">
          <el-form-item prop="date4" style="margin: 0">
            <el-time-picker
              placeholder="选择时间"
              size="mini"
              v-model="ruleForm.date4"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="其它">
        <el-checkbox v-model="tip" class="col"
          >报警提示到微信公众号</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="mini" @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      temperature: {
        checked: false,
      },
      Illuminations: {
        big: false,
        small: false,
      },
      ruleForm: {
        selectLocation: {
          children: "items",
          label: "name",
        },
        temperature: "",
        Illuminationsda: "",
        Illuminationsxiao: "",
        frequency: "",
        refresh: "",
        data1: "",
        data2: "",
        data3: "",
        data4: "",
      },
      rules: {
        temperature: [
          {
            type: "number",
            required: true,
            message: "请输入温度",
            trigger: "blur",
          },
        ],
        Illuminationsda: [
          {
            type: "number",
            required: true,
            message: "请输入最大灯光值",
            trigger: "blur",
          },
        ],
        Illuminationsxiao: [
          {
            type: "number",
            required: true,
            message: "请输入最小灯光值",
            trigger: "blur",
          },
        ],
        frequency: [
          {
            type: "number",
            required: true,
            message: "请输入自动开启频率",
            trigger: "blur",
          },
        ],
        refresh: [
          {
            type: "number",
            required: true,
            message: "请输入数据上报频率",
            trigger: "blur",
          },
        ],
        data1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        data2: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        data3: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        data4: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
      border: true,
      frequency: 1,
      refresh: 300,
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      tip: false,
      checktree: [],
      datas: [],
    };
  },
  created: function () {
    this.getState();
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    handleChange(value) {
      console.log(value);
    },
    //保存
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
    //位置选择
    handleCheckChange() {
      //			console.log(this.$refs.tree.getCheckedKeys())
      let checkData = this.$refs.tree.getCheckedNodes();
      this.checktree = [];
      checkData.forEach((item) => {
        // if (!item.hasOwnProperty("items")) {
		if (!item.items) {
          this.checktree.push(item.id);
        }
      });
      //				console.log(this.checktree)
    },
    //获取地理位置
    getState() {
      this.api.operation
        .getState()
        .then((res) => {
          //					console.log(res)
          this.datas = res.data.place_info;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped="">
.title-bar {
  display: block;
  background: #fff;
  padding: 10px 12px;
  box-sizing: border-box;
  font-size: 15px;
  color: #4d4d4d;
  font-weight: 600;
}
.sj {
  color: #7176b7;
  margin-right: 3px;
  width: 22px;
  font-size: 20px;
}
.el-form-item {
  margin: 20px;
}
.el-form-item__label {
  font-size: 14px;
  font-weight: 400;
}
.col {
  margin-left: 10px;
}
.el-input {
  width: 150px;
}
.el-tree {
  position: relative;
  cursor: default;
  background: #e9ecf3;
  color: #606266;
  margin-top: 7px;
}
</style>