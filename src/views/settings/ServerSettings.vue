<template>
  <div style="margin-left: 10px">
    <div class="bcrumb">
      <span class="back" @click="prev"
        ><i class="el-icon-top-left"></i>返回</span
      >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>服务器管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="server">
      <div class="db-box">
        <span class="title-bar">
          <i class="el-icon-document-copy"></i>数据备份
          <span class="tip">(备份或同步时请勿离开本页面)</span>
        </span>
        <div class="data-backup">
          <el-button-group class="sdbf">
            <el-button
              type="primary"
              icon="el-icon-copy-document"
              size="mini"
              style="margin-right: 15px"
              >手动备份</el-button
            >
            <el-button type="success" icon="el-icon-back" size="mini"
              >导出备份文件</el-button
            >
          </el-button-group>
          <div class="auto">
            <el-checkbox v-model="qitian">7天自动备份</el-checkbox>
            <el-checkbox v-model="yun">自动备份到云端</el-checkbox>
          </div>
        </div>
      </div>
      <div class="db-box auto">
        <span class="title-bar">
          <i class="el-icon-refresh"></i>服务器时间同步
        </span>
        <div class="data-backup">
          <el-button
            type="primary"
            icon="el-icon-copy-document"
            size="mini"
            style="margin-right: 15px"
            >手动备份</el-button
          >
          <el-checkbox v-model="qitian">7天自动备份</el-checkbox>
        </div>
      </div>
      <div class="db-box">
        <span class="title-bar">
          <i class="el-icon-document-copy"></i>服务器升级
          <span class="ban">服务器版本:1.5.01</span>
          <span class="ban">WEB版本:1.3.3</span>
        </span>
        <div class="data-backup">
          <el-button-group class="sdbf">
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              size="mini"
              style="margin-right: 15px"
              >加载文件</el-button
            >
            <el-button type="success" icon="el-icon-top" size="mini"
              >导开始升级</el-button
            >
          </el-button-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qitian: false,
      yun: false,
    };
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
.server {
  box-sizing: border-box;
  padding: 5px 0;
}
.title-bar {
  display: block;
  background: #fff;
  padding: 10px 12px;
  box-sizing: border-box;
  font-size: 15px;
  color: #4d4d4d;
  font-weight: 600;
}
.tip {
  font-size: 12px;
  margin-left: 15px;
  font-weight: 400;
  color: #f40;
}
.data-backup {
  margin-top: 20px;
  width: 700px;
  overflow: hidden;
  padding: 0 20px;
}
.sdbf {
  margin-bottom: 20px;
}
.auto {
  margin-bottom: 20px;
}
.ban {
  margin-left: 20px;
  font-size: 12px;
  font-weight: 400;
  margin-left: 20px;
  color: #a8a8a8;
}
</style>