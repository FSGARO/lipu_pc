<template>
  <div style="margin-left: 10px">
    <div class="bcrumb">
      <span class="back" @click="prev"
        ><i class="el-icon-top-left"></i>返回</span
      >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>消息中心</el-breadcrumb-item>
        <el-breadcrumb-item>发送列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="toolsbar">
      <el-form class="el-form--inline" style="margin-bottom: 5px">
        <div class="input-box-search">
          <el-form-item>
            <el-input
              v-model="soso.input"
              placeholder="请输入关键字"
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
          <el-button type="primary" @click="reading"
            ><i class="el-icon-view"></i>撤回消息</el-button
          >
          <el-button type="danger" @click.native.prevent="deleteRow()"
            ><i class="el-icon-delete"></i>删除消息</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :default-sort="{ prop: 'date', order: 'descending' }"
        ref="multipleTable"
        :row-class-name="yuedu"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column label="标题内容" width="550" @click="getstatus">
          <template slot-scope="scope">
            <router-link to="">{{ scope.row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="date"
          label="时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="类型"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
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
      tableData: [
        {
          date: "2016-05-03",
          name: "通知通知通知",
          address: "校内消息",
          rowNum: 1,
        },
        {
          date: "2016-05-04",
          name: "通知通知通知",
          address: "校内消息",
          rowNum: 2,
        },
        {
          date: "2016-05-05",
          name: "通知通知通知",
          address: "校内消息",
          rowNum: 3,
        },
      ],
      multipleSelection: [],
      total: 3,
      currentPage: 1,
      isreaded: false,
    };
  },
  created: function () {
    //		this.reading()
    //      this.getstatus()
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //勾选数量
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getstatus() {
      console.log(123);
    },
    reading() {
      this.status = 1;
    },
    yuedu({ row }) {
      if (row.status !== 0) {
        return "readed";
      }
      return "";
    },
    //删除消息
    deleteRow() {
      let val = this.multipleSelection;
      let vallength = this.multipleSelection.length;
      if (vallength == 0) {
        alert("请选择要删除的数据");
      } else {
        this.$confirm("此操作将永久删除该位置, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            if (val) {
              val.forEach((val) => {
                this.tableData.forEach((v, i) => {
                  //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
                  if (val.rowNum === v.rowNum) {
                    this.tableData.splice(i, 1);
                  }
                });
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
        //清除选中状态
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
};
</script>

<style scoped="">
.readed {
  color: #999;
}
.input-box-search {
  height: 28px;
}
</style>