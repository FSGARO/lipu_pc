<template>
  <el-container>
    <el-header>
      <div class="bcrumb">
        <span class="back" @click="prev"
          ><i class="el-icon-top-left"></i>返回</span
        >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>数据采集</el-breadcrumb-item>
          <el-breadcrumb-item>设备统计</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="power_search"
      >
        <el-form-item label="位置" prop="position" style="width: 250px">
          <el-select
            v-model="ruleForm.position"
            placeholder="请选择"
            size="mini"
            clearable
            @change="locationChange"
            style="width: 60%"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.location"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            icon="el-icon-search"
            size="mini"
            @click="setStatistics"
            >设置统计</el-button
          >
          <el-button
            type="success"
            icon="el-icon-search"
            size="mini"
            @click="statisMonth('ruleForm')"
            >月度统计</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-top-left"
            size="mini"
            @click="statisDays('ruleForm')"
            >天数统计</el-button
          >
          <el-button
            type="success"
            icon="el-icon-refresh"
            size="mini"
            @click="allStatisMonth"
            >所有设备统计</el-button
          >
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="18">
          <div class="tongji" id="Statistics"></div>
        </el-col>
      </el-row>
      <el-dialog
        title="选择统计种类"
        :visible.sync="dialogTableVisible"
        width="20%"
        center
      >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="allstatis"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="item in tableStatis" :label="item" :key="item">{{
            item
          }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="trueAddStatis">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        position: "",
        checkTime: "",
      },
      rules: {
        position: [
          { required: true, message: "请选择位置", trigger: "change" },
        ],
      },
      options: [],
      dialogTableVisible: false,
      allstatis: ["设备电能", "总电能", "设备功率", "总功率"],
      tableStatis: [
        "设备电能",
        "总电能",
        "设备功率",
        "总功率",
        "采样数",
        "设备电流",
        "总电流",
        "电压",
      ],
      checkAll: false,
      isIndeterminate: true,
      abscissa: [],
      series: [],
      energydevice: [],
      energytotal: [],
      powerdevice: [],
      powertotal: [],
      samples: [],
      currentdevice: [],
      currenttotal: [],
      voltage: [],
      operateName: "所有设备",
      echartstitle: "统计图",
      hours: 0,
    };
  },
  created: function () {
    this.positionList();
    this.allStatisMonth();
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //位置
    positionList() {
      this.api.powerstats
        .energyList(0, 1)
        .then((res) => {
          //				console.log(res)
          this.options = res.data.billing;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //Change位置
    locationChange(val) {
      if (val) {
        let obj = {};
        obj = this.options.find((item) => {
          //这里的operateOption就是上面遍历的数据源
          return item.id === val; //筛选出匹配数据
        });
        this.operateName = obj.location;
      } else {
        this.operateName = "所有设备";
      }
    },
    //点击设置统计
    setStatistics() {
      this.dialogTableVisible = true;
    },
    //选择表格类目
    handleCheckedCitiesChange(val) {
      this.allstatis = [];
      this.allstatis = val;
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.tableStatis.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableStatis.length;
      if (checkedCount == 0) {
        this.$message.error("请选择最少一个类目！");
      }
    },
    //全选或者取消
    handleCheckAllChange(val) {
      this.allstatis = val ? this.tableStatis : [];
      this.isIndeterminate = false;
      if (this.allstatis.length == 0) {
        this.$message.error("请选择最少一个类目！");
      }
    },
    //确认选择类目
    trueAddStatis() {
      if (this.allstatis.length == 0) {
        this.$message.error("请选择最少一个类目！");
        return false;
      }
      this.dialogTableVisible = false;
    },
    //月度统计
    statisMonth(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.allstatis.length == 0) {
            this.$message.error("请选择最少一个类目！");
            return false;
          }
          this.api.powerstats
            .energyChart(this.ruleForm.position, "monthly", 6)
            .then((res) => {
              //	          		console.log(res)
              this.echartsOption(res, "month");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //天数统计
    statisDays(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.allstatis.length == 0) {
            this.$message.error("请选择最少一个类目！");
            return false;
          }
          this.api.powerstats
            .energyChart(this.ruleForm.position, "daily", 0)
            .then((res) => {
              //				    	console.log(res)
              this.echartsOption(res, "daily");
            });
        }
      });
    },
    //所有设备统计
    allStatisMonth() {
      this.api.powerstats.energyList(0, 1).then((res) => {
        //				console.log(res)
        let abscissa = [];
        let series = [];
        let energy_total = [];
        for (let item of res.data.billing) {
          abscissa.push(item.location);
          energy_total.push(item.list.list[0].energy_total);
        }
        series.push({ name: "能耗统计", type: "line", data: energy_total });
        //引入echarts
        const echarts = require("echarts");
        let myChart = echarts.init(document.getElementById("Statistics"));
        myChart.clear(); //清空echarts原有数据
        myChart.setOption({
          title: {
            text: "所有设备月度统计",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["能耗统计"],
            //				        data: this.allstatis
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            //				        data: ['周一', '周二', '周三', '周四', '周五', '周六']
            data: abscissa,
          },
          yAxis: {
            type: "value",
          },
          series: series,
        });
      });
    },
    //封装echarts
    echartsOption(res, hen) {
      this.abscissa = [];
      this.energydevice = [];
      this.energytotal = [];
      this.powerdevice = [];
      this.powertotal = [];
      this.samples = [];
      this.currentdevice = [];
      this.currenttotal = [];
      this.voltage = [];
      this.hours = 0;
      for (let item of res.data.billing.list) {
        let day = new Date(item.timestamp * 1000);
        let year = day.getFullYear();
        let month = day.getMonth() + 1;
        let days = day.getDate();
        //    			let hours = day.getHours()
        if (hen == "month") {
          //当为月份时  横坐标数据
          this.abscissa.push(year + "年" + month + "月");
          this.echartstitle = this.operateName + "： " + "月度统计图";
        } else if (hen == "daily") {
          this.hours += 1;
          this.abscissa.push(days + "日");
          this.echartstitle =
            this.operateName + "： " + month + "月" + "统计图";
        }
        this.energydevice.push(item.energy_device); //设备电能
        this.energytotal.push(item.energy_total); //总电能
        this.powerdevice.push(item.power_device); //设备功率
        this.powertotal.push(item.power_total); //总功率
        this.samples.push(item.samples); //采样数
        this.currentdevice.push(item.current_device); //设备电流
        this.currenttotal.push(item.current_total); //总电流
        this.voltage.push(item.voltage); //电压
      }
      //判断用户选择了那些统计数据
      this.series = [];
      for (let item of this.allstatis) {
        if (item == `设备电能`) {
          this.series.push({
            name: "设备电能",
            type: "line",
            data: this.energydevice,
          });
        } else if (item == `总电能`) {
          this.series.push({
            name: "总电能",
            type: "line",
            data: this.energytotal,
          });
        } else if (item == `设备功率`) {
          this.series.push({
            name: "设备功率",
            type: "line",
            data: this.powerdevice,
          });
        } else if (item == `总功率`) {
          this.series.push({
            name: "总功率",
            type: "line",
            data: this.powertotal,
          });
        } else if (item == `采样数`) {
          this.series.push({
            name: "采样数",
            type: "line",
            data: this.samples,
          });
        } else if (item == `设备电流`) {
          this.series.push({
            name: "设备电流",
            type: "line",
            data: this.currentdevice,
          });
        } else if (item == `总电流`) {
          this.series.push({
            name: "总电流",
            type: "line",
            data: this.currenttotal,
          });
        } else if (item == `电压`) {
          this.series.push({ name: "电压", type: "line", data: this.voltage });
        }
      }
      //引入echarts
      //    		console.log(this.series, this.abscissa)
      const echarts = require("echarts");
      let myChart = echarts.init(document.getElementById("Statistics"));
      myChart.clear(); //清空echarts原有数据
      myChart.setOption({
        title: {
          text: this.echartstitle,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          //				        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          data: this.allstatis,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          //				        data: ['周一', '周二', '周三', '周四', '周五', '周六']
          data: this.abscissa,
        },
        yAxis: {
          type: "value",
        },
        series: this.series,
      });
    },
  },
};
</script>

<style scoped="">
.el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  line-height: 28px;
}
.block {
  width: 100%;
  margin-left: 10px;
}
.tongji {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  background: #f0f0f0;
}
</style>