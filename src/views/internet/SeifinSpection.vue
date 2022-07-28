<template>
  <el-container>
    <el-header>
      <div class="bcrumb">
        <span class="back" @click="prev"
          ><i class="el-icon-top-left"></i>返回</span
        >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>物联网</el-breadcrumb-item>
          <el-breadcrumb-item>设备自检</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="toolsbar">
        <el-button type="success" icon="el-icon-refresh" @click="checkNow"
          >马上自检</el-button
        >
        <el-button type="success" icon="el-icon-time" @click="testTiming"
          >定时自检</el-button
        >
        <el-button type="primary" icon="el-icon-time" @click="allMessageList"
          >全部消息</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-s-comment"
          @click="unreadMessageList"
          >未阅读消息</el-button
        >
        <el-button type="warning" icon="el-icon-chat-square" @click="allRead"
          >全部标为已读</el-button
        >
      </div>
      <el-dialog
        title="定时自检"
        :visible.sync="dialogVisible"
        width="30%"
        center
      >
        <span>执行时间</span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="执行方式" prop="implementation">
            <el-radio-group v-model="ruleForm.implementation">
              <el-radio label="closed">关闭</el-radio>
              <el-radio label="everyday">每天</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间" prop="date">
            <el-time-picker
              v-model="ruleForm.date"
              placeholder="选择时间点"
              format="HH:mm:ss"
            >
            </el-time-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="tureTimingSelfTest('ruleForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-header>
    <el-main>
      <el-table
        border
        @row-click="readingMessage"
        :data="tableData"
        style="width: 60%"
      >
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column
          prop="read"
          label="自检消息状态"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="time"
          label="自检时间"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="msg" label="自检结果" width="250" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click.native.stop="deleteMessage(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      checkedwx: false,
      checkedem: false,
      tableData: [],
      currentPage: 1,
      pageSize: localStorage.getItem("pageSize")
        ? parseInt(localStorage.getItem("pageSize"))
        : 10,
      total: 1,
      dialogVisible: false,
      ruleForm: {
        implementation: "",
        date: "",
      },
      rules: {
        implementation: [
          { required: true, message: "请选择方式", trigger: "change" },
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  created: function () {
    this.allMessageList();
    //轮询
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        this.waitMessage();
      }, 0);
    }, 5000);
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //自检消息列表
    allMessageList() {
      this.api.seifinspection
        .allMessageList(this.currentPage - 1, this.pageSize)
        .then((res) => {
          //			console.log(res)
          this.tableData = res.data.notice.list;
          this.total = res.data.notice.total;
          if (this.tableData) {
            for (let item of this.tableData) {
              item.time = this.timeConversion(item.timestamp);
              if (item.unread == true) {
                item.read = `未阅读消息`;
              } else {
                item.read = `已阅读消息`;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //未读消息列表
    unreadMessageList() {
      this.api.seifinspection
        .unreadMessageList(this.currentPage - 1, this.pageSize)
        .then((res) => {
          this.tableData = res.data.notice.list;
          this.total = res.data.notice.total;
          // this.resetSetItem('tips', res.data.notice.total)  //重新设置更新本地未读消息
          localStorage.setItem("tips", res.data.notice.total); //重新设置更新本地未读消息
          if (this.tableData) {
            for (let item of this.tableData) {
              item.time = this.timeConversion(item.timestamp);
              if (item.unread == true) {
                item.read = `未阅读消息`;
              } else {
                item.read = `已阅读消息`;
              }
            }
          }
        });
    },
    //阅读消息
    readingMessage(row) {
      this.api.seifinspection
        .readingMessage(row.id)
        .then(() => {
          this.$router.push({
            query: {
              message: row,
            },
            path: "/internet/MessageDetails",
          });
          this.unreadMessageList(); //更新未读消息列表
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //条数
    handleSizeChange(val) {
      this.pageSize = val;
      localStorage.setItem("pageSize", val); //更新本地缓存pageSize的默认条数
      this.allMessageList();
      //      console.log(`每页 ${val} 条`);
    },
    //页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.allMessageList();
      //      console.log(`当前页: ${val}`);
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
    //马上自检
    checkNow() {
      this.api.seifinspection
        .checkNow()
        .then((res) => {
          //			console.log(res)
          if (res.data.result.code == 0) {
            this.$message({
              type: "success",
              message: "自检需要花费几分钟时间，请耐心等待！",
            });
          } else if (res.data.result.code == 2110) {
            this.$message({
              type: "warning",
              message: "自检正在进行中，请勿重复操作！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //定时自检
    testTiming() {
      this.dialogVisible = true;
    },
    //确定定时自检
    tureTimingSelfTest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let H = this.ruleForm.date.getHours();
          let M = this.ruleForm.date.getMinutes();
          let S = this.ruleForm.date.getSeconds();
          let postTime =
            this.getzf(H) + ":" + this.getzf(M) + ":" + this.getzf(S);
          this.api.seifinspection
            .tureTimingSelfTest(this.ruleForm.implementation, postTime)
            .then(() => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "操作成功！",
              });
            })
            .catch((err) => console.log(err));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //补0操作
    getzf(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },
    //全部标为已经
    allRead() {
      this.api.seifinspection.allRead();
    },
    //删除消息
    deleteMessage(id) {
      this.api.seifinspection.deleteMessage(id);
    },
    //等待更新信息(是否有新的消息)
    waitMessage() {
      this.api.seifinspection
        .waitMessage()
        .then((res) => {
          //  		console.log(res)
          if (res.data.msg_info) {
            if (res.data.msg_info.id > 0) {
              this.unreadMessageList();
              this.allMessageList();
              this.$confirm("你有新的消息，请注意查收！", "提示", {
                confirmButtonText: "去查看",
                cancelButtonText: "知道了",
                type: "warning",
              })
                .then(() => {
                  this.unreadMessageList();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
};
</script>

<style>
.el-form-item {
  margin-bottom: 0.1px;
}
</style>
