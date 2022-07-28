<template>
  <el-container>
    <el-header>
      <div class="bcrumb">
        <span class="back" @click="prev"
          ><i class="el-icon-top-left"></i>返回</span
        >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>校园广播站</el-breadcrumb-item>
          <el-breadcrumb-item>音视频广播</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="toolsbar">
        <el-form class="el-form--inline" style="margin-bottom: 5px">
          <div class="input-box-search">
            <el-form-item>
              <el-input
                v-model="soso.input"
                placeholder="按名称搜索"
                class="el-input__inner"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success"
                ><i class="el-icon-search"></i>搜索</el-button
              >
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="newtasks"
              ><i class="el-icon-plus"></i>新建任务</el-button
            >
            <el-button
              type="success"
              @click="loadList"
              v-loading.fullscreen.lock="fullscreenLoading"
              ><i class="el-icon-refresh-right"></i>更新列表</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="tableData"
            :border="border"
            :label="tableData.id"
            v-model="multipleSelection"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row
          >
            <el-table-column
              prop="name"
              label="任务名称"
              align="center"
              sortable
              width="100"
            >
            </el-table-column>
            <el-table-column label="周期" align="center" width="120">
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.clock" :key="index">
                  {{ item }}</span
                >
                <br />
                {{ scope.row.repeatMode }}
              </template>
            </el-table-column>
            <el-table-column
              prop="methodtask"
              label="任务类型"
              align="center"
              width="110"
            >
            </el-table-column>
            <el-table-column
              prop="runnings"
              label="任务状态"
              align="center"
              width="60"
            >
            </el-table-column>
            <el-table-column
              prop=""
              label="运行时间"
              align="center"
              width="200"
            >
              <template slot-scope="scope"
                >上次运行：{{ scope.row.prev }}<br />下次运行：{{
                  scope.row.next
                }}</template
              >
            </el-table-column>
            <!--<el-table-column prop="" label="控制内容" align="center" width="200">
						</el-table-column>-->
            <el-table-column
              prop="address"
              label="执行区域"
              align="center"
              width="140"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              :formatter="formatter"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!--<el-button-group>-->
                <el-button
                  type="primary"
                  size="mini"
                  @click="taskEnable(scope.row.id, (method = 'run'))"
                  :disabled="!scope.row.enabled"
                  >立即运行</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  @click="taskEnable(scope.row.id, (method = 'stop'))"
                  :disabled="!scope.row.enabled"
                  >停止运行</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  @click="taskEnable(scope.row.id, (method = 'active'))"
                  v-if="!scope.row.enabled"
                  >启用</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  @click="taskEnable(scope.row.id, (method = 'deactive'))"
                  v-else
                  >禁用</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="taskModify(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="taskDelete(scope.row.id)"
                  >删除</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="scope.row.recordState"
                  @click="recordExecution(scope.row.id, 1, pageSize1)"
                  >执行记录</el-button
                >
                <!--</el-button-group>-->
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
        </el-col>
      </el-row>
      <el-dialog
        title="执行记录"
        :visible.sync="dialogImplementData"
        width="40%"
        center
      >
        <div class="cell">
          <el-button type="warning" size="mini" @click="partDeleRecord"
            >选择删除</el-button
          >
          <el-button type="danger" size="mini" @click="allDeleRecord(recordid)"
            >全部删除</el-button
          >
        </div>
        <el-table :data="implementData" style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column type="expand" width="50" label="详情">
            <template slot-scope="scope">
              <el-table :data="scope.row.results" border>
                <el-table-column
                  prop="devid"
                  label="设备"
                  width="110"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="mode_name"
                  label="操作名"
                  width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="cost"
                  label="耗时(毫秒)"
                  width="60"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="result"
                  label="结果"
                  align="center"
                ></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            property="time"
            label="执行时间"
            align="center"
            width="150"
          ></el-table-column>
          <el-table-column
            property="run_cost"
            label="执行耗时(毫秒/ms)"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            property="type"
            label="执行类型"
            align="center"
          ></el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
        >
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogImplementData = false"
            >取 消</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="选择时间段删除记录"
        :visible.sync="dialogRecord"
        width="30%"
        center
      >
        <el-form
          :model="deleteRecordForm"
          :rules="recordRules"
          ref="deleteRecordForm"
        >
          <el-form-item label="选择时间" prop="time">
            <el-date-picker
              v-model="deleteRecordForm.time"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRecord = false">取 消</el-button>
          <el-button
            type="primary"
            @click="trueDeleteRecord('deleteRecordForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      soso: [
        {
          input: "",
        },
      ],
      border: true,
      tableData: [],
      multipleSelection: [],
      total: 2,
      currentPage: 1,
      pageSize: localStorage.getItem("pageSize")
        ? parseInt(localStorage.getItem("pageSize"))
        : 10,
      fullscreenLoading: false,
      datas: [],
      allOption: [],
      selectOptionName: "",
      dialogImplementData: false,
      implementData: [],
      recordid: "",
      expands: [],
      deleteRecordForm: {
        time: "",
      },
      recordRules: {
        time: [
          {
            type: "date",
            required: true,
            message: "请选择日期时间",
            trigger: "change",
          },
        ],
      },
      dialogRecord: false,
      currentPage1: 1,
      pageSize1: localStorage.getItem("pageSize")
        ? parseInt(localStorage.getItem("pageSize"))
        : 10,
      total1: 0,
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
    //获取地理位置
    getState() {
      this.api.operation
        .getState()
        .then((res) => {
          //				console.log(res)
          this.datas = res.data.place_info;
          this.loadTask();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //多媒体任务列表
    async loadTask() {
      let res = await this.api.controltask.loadTask(
        1,
        this.currentPage - 1,
        this.pageSize
      );
      //		console.log(res)
      this.tableData = res.data.task_info_list.task_property_list;
      this.total = res.data.task_info_list.total;
      for (let item of this.tableData) {
        item.methodtask = `多媒体教学任务`;
        if (item.repeat_mode == 0) {
          item.repeatMode = `单次运行`;
        } else if (item.repeat_mode == -1) {
          item.repeatMode = `按需执行`;
        } else if (item.repeat_mode == 1) {
          item.repeatMode = `每天`;
        } else if (item.repeat_mode == 2) {
          item.repeatMode = `指定日期: ${item.repeat_prop[0]}月${item.repeat_prop[1]}日`;
        } else if (item.repeat_mode == 3) {
          this.weekTimes = [];
          for (let weeks of item.repeat_prop) {
            switch (weeks) {
              case 0:
                weeks = "周日";
                break;
              case 1:
                weeks = "周一";
                break;
              case 2:
                weeks = "周二";
                break;
              case 3:
                weeks = "周三";
                break;
              case 4:
                weeks = "周四";
                break;
              case 5:
                weeks = "周五";
                break;
              case 6:
                weeks = "周六";
                break;
              default:
                weeks = "按周重复";
            }
            this.weekTimes.push(weeks);
          }
          item.repeatMode = this.weekTimes.toString();
        } else if (item.repeat_mode == 4) {
          item.repeatMode = `法定节假日`;
        } else if (item.repeat_mode == 5) {
          item.repeatMode = `非法定节假日`;
        }

        if (item.running == true) {
          item.runnings = `运行中`;
        } else {
          item.runnings = `未运行`;
        }
        //运行时间
        item.prev = this.timeConversion(item.prev);
        item.next = this.timeConversion(item.next);
        //位置
        this.allOption = [];
        for (let ids of item.actions.place) {
          let ares = this.optionAction(this.datas, ids);
          this.allOption.push(ares);
        }
        item.address = this.allOption.toString();
        //任务记录按钮状态
        let recordSun = parseInt(item.cnt_autorun) + parseInt(item.cnt_manual);
        if (recordSun == 0) {
          item.recordState = true;
        } else {
          item.recordState = false;
        }
      }
    },
    //条数
    handleSizeChange(val) {
      this.pageSize = val;
      localStorage.setItem("pageSize", val); //更新本地缓存pageSize的默认条数
      this.loadTask();
      //      console.log(`每页 ${val} 条`);
    },
    //页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadTask();
      //      console.log(`当前页: ${val}`);
    },
    //位置函数
    optionAction(array, id) {
      if (array) {
        for (let item of array) {
          if (item.id == id) {
            this.selectOptionName = "";
            this.selectOptionName = item.name;
            break;
          }
          if (item.items) {
            this.optionAction(item.items, id);
          }
        }
      }
      return this.selectOptionName;
    },
    //时间戳转换成日期
    timeConversion(timeStamp) {
      if (timeStamp == 0) {
        return `未设置`;
      } else {
        let date = new Date(timeStamp * 1000); //毫秒*1000
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if (parseInt(hour) < 10) {
          //加0
          hour = "0" + hour;
        }
        if (parseInt(minute) < 10) {
          //加0
          minute = "0" + minute;
        }
        if (parseInt(second) < 10) {
          //加0
          second = "0" + second;
        }
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
    //启用、禁用、立即执行、停止执行任务
    taskEnable(id, method) {
      this.api.controltask
        .taskEnable(id, method)
        .then(() => {
          //			console.log(res)
          this.loadTask();
          this.$message({
            message: "操作成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //修改任务
    taskModify(row) {
      this.$router.push({
        query: {
          taskid: row.id,
        },
        path: "/broadcasting/NewTask",
      });
    },
    //更新列表
    loadList() {
      this.loadTask();
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1000);
    },
    //新建任务
    newtasks() {
      this.$router.push({
        path: "/broadcasting/NewTask",
      });
    },
    //删除消息
    taskDelete(id) {
      this.$confirm("此操作将永久删除该位置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.api.controltask
            .taskDelete(id)
            .then(() => {
              let totalPage = Math.ceil((this.total - 1) / this.pageSize);
              let currentPage =
                this.currentPage > totalPage ? totalPage : this.currentPage;
              this.currentPage = currentPage < 1 ? 1 : currentPage;
              this.loadTask();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    formatter(row) {
      return row.address;
    },
    //执行时间
    recordExecution(id, currentPage, pageSize) {
      this.currentPage1 = currentPage;
      this.pageSize1 = pageSize
      this.recordid = id;
      this.dialogImplementData = true;
      this.api.controltask
        .recordExecution(id, currentPage - 1, pageSize)
        .then((res) => {
          //					console.log(res)
          this.implementData = [];
          this.total1 = 0;
          if (res.data.record_info_list.list) {
            this.implementData = res.data.record_info_list.list;
            this.total1 = res.data.record_info_list.total;
            for (let item of this.implementData) {
              item.time = this.timeConversion(item.timestamp);
              if (item.run_once == true) {
                item.type = `手动执行`;
              } else {
                item.type = `定时执行`;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //条数
    handleSizeChange1(val) {
      this.pageSize1 = val;
      localStorage.setItem("pageSize", val); //更新本地缓存pageSize的默认条数
      this.recordExecution(this.recordid, this.currentPage1, this.pageSize1);
      //      console.log(`每页 ${val} 条`);
    },
    //页数
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.recordExecution(this.recordid, this.currentPage1, this.pageSize1);
      //      console.log(`当前页: ${val}`);
    },
    //删除所有任务记录
    allDeleRecord(id, timestamp) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.api.controltask
            .allDeleRecord(id, timestamp)
            .then((res) => {
              console.log(res);
              this.recordExecution(this.recordid, this.currentPage1, this.pageSize1);
              this.$message({
                type: "success",
                message: "删除成功",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //选择删除
    partDeleRecord() {
      this.dialogRecord = true;
    },
    //确认删除执行记录
    trueDeleteRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let date = new Date(this.deleteRecordForm.time / 1000);
          let recordTime = date.getTime();
          this.allDeleRecord(this.recordid, recordTime);
          this.dialogRecord = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0.1px;
}
.cell {
  text-align: center;
}
.blue {
  color: rgb(255, 255, 255);
  background-color: rgb(113, 118, 183);
}
</style>
