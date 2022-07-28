<template>
  <div class="voice-broadcast" style="margin-left: 10px">
    <div class="bcrumb">
      <span class="back" @click="prev"
        ><i class="el-icon-top-left"></i>返回</span
      >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>校园广播站</el-breadcrumb-item>
        <el-breadcrumb-item>语音广播</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="height: 542px">
      <div class="play-box">
        <div class="title-bar">
          <span
            v-for="(item, index) in yuyin"
            :key="item.index"
            class="tab"
            v-on:click="addClass(index)"
            v-bind:class="{ active: index == cur }"
            >{{ item.title }}</span
          >
        </div>
        <div class="play-broadcast">
          <div class="col operate no-start">
            <div class="recording"></div>
            <a class="words">启动</a>
          </div>
          <div class="line"></div>
          <div class="col time-box">
            <div class="time">00:00:00</div>
            <div class="settime_tingzhi" v-show="tingzhi">停止</div>
          </div>
        </div>
      </div>
      <div class="place">
        <div class="title-bar">
          <span style="margin-right: 10px">选择位置</span>
          <el-button type="success" icon="el-icon-plus" @click="address"
            >添加位置</el-button
          >
        </div>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      yuyin: [{ title: "语音广播" }, { title: "语音对讲" }],
      cur: 0,
      tingzhi: false,
      dialogVisible: false,
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
        name: "",
        defaultProps: {
          children: "children",
          label: "label",
        },
      },
      locallist: false,
    };
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //选择语音的类型
    addClass(index) {
      this.cur = index;
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
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked);
    },
  },
};
</script>

<style scoped>
.title-bar {
  background: #fff;
  padding: 10px 12px;
  box-sizing: border-box;
  font-size: 15px;
  color: #4d4d4d;
  font-weight: 600;
}
.tab {
  margin-right: 30px;
  cursor: pointer;
  position: relative;
  top: 0;
}
.active {
  color: #22ac38;
}
.play-broadcast {
  overflow: hidden;
  padding: 40px 0;
  box-sizing: border-box;
  margin-top: 10px;
  position: relative;
  top: 0;
}
.operate {
  color: #b4ebf0;
  position: relative;
  top: 0;
  width: 50%;
  box-sizing: border-box;
  float: left;
  text-align: center;
}
.recording {
  display: inline-block;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
  border: 1px solid currentcolor;
  border-radius: 50%;
  -webkit-box-shadow: inset 0 0 0 20px hsla(0, 0%, 100%, 0.2);
  box-shadow: inset 0 0 0 20px hsla(0, 0%, 100%, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  top: 0;
}
.words {
  background: linear-gradient(90deg, #22ac38 0, #45ceda);
  opacity: 0.46;
  position: absolute;
  display: block;
  top: 15px;
  width: 170px;
  height: 170px;
  line-height: 160px;
  left: 50%;
  border-radius: 50%;
  font-size: 40px;
  color: #fff;
  margin-left: -85px;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: pointer;
}
.line {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -40px;
  height: 80px;
  border-right: 1px solid #b2b2b2;
}
.time-box {
  width: 50%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: left;
  text-align: center;
}
.time {
  text-align: center;
  font-size: 52px;
  color: #999;
  margin-top: 60px;
}
.location-list {
  overflow: hidden;
  margin-top: 20px;
  padding-left: 15px;
  box-sizing: border-box;
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
}
.l {
  margin: 2px 0 10px;
}
</style>