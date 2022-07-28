<template>
  <el-container>
    <el-header>
      <div class="bcrumb">
        <span class="back" @click="prev"
          ><i class="el-icon-top-left"></i>返回</span
        >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>设备自检</el-breadcrumb-item>
          <el-breadcrumb-item>消息详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-header>
    <el-main>
      <div class="detail">
        <h1 class="title">{{ messagetitle }}</h1>
        <span class="time">{{ readmsgtime }}</span>
        <el-divider></el-divider>
        <div class="content">
          <p>{{ notices.msg }}</p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      notices: {},
      messagetitle: "设备自检信息详情",
      readmsgtime: "",
    };
  },
  creaded: function () {},
  mounted() {
    //		console.log(this.$route.query)
    if (this.$route.query.message) {
      this.notices = this.$route.query.message;
      this.readmsgtime = this.timeConversion(
        this.$route.query.message.timestamp
      );
    }
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //时间戳转换成日期
    timeConversion(timeStamp) {
      if (timeStamp * 1000 == 0) {
        return `未设置`;
      } else {
        let date = new Date(timeStamp * 1000);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return (
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second
        );
      }
    },
  },
};
</script>

<style scoped="">
.detail {
  padding: 25px 40px;
  border: 1px solid #ddd;
  margin-top: 10px;
  border-radius: 3px;
}
.title {
  font-size: 22px;
  text-align: center;
  font-weight: 400;
  color: #4d4d4d;
}
.time {
  display: block;
  text-align: center;
  font-size: 13px;
  margin-top: 10px;
  color: #999;
}
.content {
  line-height: 22px;
}
</style>