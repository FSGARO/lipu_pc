<template>
  <div style="margin-left: 10px">
    <div class="bcrumb">
      <span class="back" @click="prev"
        ><i class="el-icon-top-left"></i>返回</span
      >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>消息中心</el-breadcrumb-item>
        <el-breadcrumb-item>消息详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail">
      <h1 class="title">对讲呼叫失败提醒</h1>
      <span class="time">2019-06-12</span>
      <el-divider></el-divider>
      <div class="content">
        <p>
          您好: 教学楼 101[2019-06-12 14:58:34]
          发送了语音对讲请求，未接通。请及时处理!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
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