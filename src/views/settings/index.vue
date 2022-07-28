<template>
  <el-container>
    <el-header>
      <div class="bcrumb">
        <span class="back" @click="prev"
          ><i class="el-icon-top-left"></i>返回</span
        >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>位置设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <h1 class="title-p el-icon-plus">添加位置信息</h1>
    </el-header>
    <el-main>
      <div class="add-title">
        <span><i class="el-icon-s-tools sj"></i>学校设置</span>
      </div>
      <el-form class="content" :rules="rules" ref="ruleForm" :model="ruleForm">
        <el-form-item label="学校名称" class="hg">
          <span v-show="schoolnames"
            >{{ schoolname
            }}<el-button
              class="edi"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editSchool"
            ></el-button>
          </span>
          <span v-show="schooleait">
            <el-input
              v-model="schoolname"
              clearable
              autosize
              class="schoolname"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-check"
              size="mini"
              @click="preservationSchoolName"
              >保存</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-close"
              size="mini"
              @click="cancel"
              >取消</el-button
            >
          </span>
        </el-form-item>
        <el-form-item label="区域名称" class="hg" prop="region">
          <el-select
            v-model="ruleForm.region"
            clearable
            placeholder="请选择区域"
            @change="changeRegion($event)"
            value-key="id"
          >
            <el-option
              v-for="item in optionsRegion"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addRegion"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item label="楼栋名称" class="hg" prop="building">
          <el-select
            v-model="ruleForm.building"
            clearable
            placeholder="请选择楼栋"
            value-key="id"
            @change="changeBuilding($event)"
          >
            <el-option
              v-for="item in optionsBuilding"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addBuilding"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item label="教室名称" class="hg" prop="classroomNumber">
          <el-input
            v-model="ruleForm.classroomNumber"
            clearable
            autosize
            class="schoolname"
          ></el-input>
        </el-form-item>
        <el-form-item label="请输入备注" class="hg">
          <el-input
            v-model="ruleForm.comment"
            clearable
            autosize
            class="schoolname"
          ></el-input>
        </el-form-item>
        <el-form-item class="addtitle">
          <el-button
            v-if="modityStatic"
            type="success"
            @click="trueClassModify('ruleForm')"
            >修改</el-button
          >
          <el-button type="success" @click="addLocation('ruleForm')" v-else
            >添加位置</el-button
          >
        </el-form-item>
      </el-form>
      <el-dialog title="信息列表" :visible.sync="dialogRegion" width="40%">
        <div class="regiontitle">
          <el-button type="primary" size="small" @click="listLocation"
            >刷新</el-button
          >
          <el-button type="success" size="small" @click="addRegions"
            >新增区域</el-button
          >
          <el-button type="success" size="small" @click="addBuilding"
            >新增楼栋</el-button
          >
        </div>
        <el-table
          :data="optionsRegion"
          row-key="id"
          border
          :tree-props="{ children: 'items' }"
        >
          <el-table-column
            property="id"
            label="id"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            property="name"
            label="名称"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="modifyRegion(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="deleteRegion(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="dialogNews" width="30%">
        <h4 class="h4">{{ regionTitle }}</h4>
        <el-form
          :model="regionForm"
          :rules="regionRules"
          ref="regionForm"
          label-width="100px"
        >
          <el-form-item label="区域名称" prop="name">
            <el-input v-model="regionForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogNews = false">取 消</el-button>
          <el-button
            type="primary"
            @click="trueRegion('regionForm')"
            v-if="regionStates"
            >确 定</el-button
          >
          <el-button
            type="primary"
            @click="trueRegionModify('regionForm')"
            v-else
            >确定修改</el-button
          >
        </div>
      </el-dialog>
      <el-dialog title="新增楼栋" :visible.sync="dialogBuilding" width="30%">
        <el-form
          :model="buildingForm"
          :rules="buildingRules"
          ref="buildingForm"
          label-width="100px"
        >
          <el-form-item label="区域名称" prop="region">
            <el-select
              v-model="buildingForm.region"
              clearable
              placeholder="请选择区域"
            >
              <el-option
                v-for="item in optionsRegion"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋名称" prop="name">
            <el-input v-model="buildingForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBuilding = false">取 消</el-button>
          <el-button type="primary" @click="trueBuildingModify('buildingForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <div class="add-title">
        <span
          ><i class="el-icon-s-operation sj"></i>位置列表
          <!--<el-button type="danger" size="mini" icon="el-icon-delete" @click.native.prevent="deleteRow()" class="del">删除全部</el-button>-->
          <el-button type="primary" size="mini" @click="listLocation"
            >更新列表</el-button
          >
        </span>
        <el-table
          highlight-current-row
          ref="multipleTable"
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          :border="border"
        >
          <el-table-column type="index" width="50" align="center">
          </el-table-column>
          <el-table-column
            prop="schoolname"
            label="学校名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="campus"
            label="校区"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="buildings"
            label="楼栋"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="classroom"
            label="教室名称"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="comment"
            label="备注"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="modifyClass(scope.row)"
                >修改教室</el-button
              >
              <el-button type="warning" size="small" @click="remarks(scope.row)">修改备注</el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteRegion(scope.row.classid)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="修改备注"
          :visible.sync="dialogFormVisible"
          class="wzbeizhu"
        >
          <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1">
            <el-form-item
              label="请输入新的备注"
              label-width="150px"
            >
              <el-input
                v-model="ruleForm1.newtip"
                autocomplete="off"
                placeholder="请输入新的备注名称"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click.stop.prevent="trueComment('ruleForm1')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: localStorage.getItem("pageSize")
        ? parseInt(localStorage.getItem("pageSize"))
        : 10,
      schoolname: "力扑智能",
      schooleait: false,
      schoolnames: true,
      optionsRegion: [],
      optionsBuilding: [],
      dialogRegion: false,
      dialogNews: false,
      regionTitle: "新增区域",
      regionStates: true,
      regionForm: {
        name: "",
      },
      regionRules: {
        name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
      },
      dialogBuilding: false,
      dialogClass: false,
      buildingForm: {
        region: "",
        name: "",
      },
      buildingRules: {
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
      },
      ruleForm: {
        region: "",
        building: "",
        classroomNumber: "",
        comment:""
      },
      ruleForm1: {
        newtip: "",
      },
      rules: {
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        classroomNumber: [
          { required: true, message: "请输入教室名称", trigger: "blur" }
        ],
        building: [
          { required: true, message: "请选择楼栋区域", trigger: "change" },
        ],
        comment:[{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      rules1: {
        newtip: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
      },
      tableData: [],
      classID: "",
      border: true,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      index: 0,
      modityStatic: false,
      pid: "",
      commentId: ""
    };
  },
  created: function () {
    this.listLocation();
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //位置列表
    listLocation() {
      this.api.position
        .listLocation()
        .then((res) => {
          // console.log(res)
          this.tableData = [];
          this.school = res.data.place_info[0].items;
          this.schoolname = res.data.place_info[0].name;
          this.optionsRegion = res.data.place_info[0].items;
          if (this.school) {
            for (let sch of this.school) {
              let campusname = sch.name;
              if (sch.items == null) {
                continue;
              }
              for (let blg of sch.items) {
                let buildingsname = blg.name;
                if (blg.items == null) {
                  continue;
                }
                for (let item of blg.items) {
                  this.tableData.push({
                    schoolname: this.schoolname,
                    campusid: sch.id,
                    campus: campusname,
                    buildingsid: blg.id,
                    buildings: buildingsname,
                    classid: item.id,
                    classroom: item.name,
                    comment: item.comment,
                  });
                }
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //条数
    handleSizeChange(val) {
      this.pageSize = val;
      localStorage.setItem("pageSize", val); //更新本地缓存pageSize的默认条数
      this.listLocation();
      //	        console.log(`每页 ${val} 条`)
    },
    //页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listLocation();
      //	        console.log(`当前页: ${val}`)
    },
    //编辑学校名称
    editSchool() {
      this.schoolnames = false;
      this.schooleait = true;
    },
    //保存学校名称
    preservationSchoolName() {
      if (this.schoolname == "") {
        this.$message({
          type: "warning",
          message: "请填写学校名称",
        });
      } else {
        let params = { name: this.schoolname };
        this.api.position
          .preservationSchoolName(0, params)
          .then(() => {
            this.listLocation();
            this.schooleait = false;
            this.schoolnames = true;
          })
          .catch((err) => console.log(err));
      }
    },
    //取消学校名称
    cancel() {
      this.schooleait = false;
      this.schoolnames = true;
    },
    //添加区域名称
    addRegion() {
      this.dialogRegion = true;
    },
    //新增区域名称
    addRegions() {
      this.regionStates = true;
      this.regionTitle = `新增区域`;
      this.dialogNews = true;
    },
    //确认新增区域名称
    trueRegion(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.api.position
            .trueRegion(this.regionForm.name)
            .then(() => {
              this.listLocation();
              this.dialogNews = false;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击修改区域
    modifyRegion(row) {
      this.regionStates = false;
      this.regionTitle = `修改区域`;
      this.dialogNews = true;
      this.regionForm = row;
    },
    //确认修改区域名称
    trueRegionModify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = { name: this.regionForm.name };
          this.api.position
            .putComment(this.regionForm.id, params)
            .then(() => {
              this.listLocation();
              this.dialogNews = false;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除区域
    deleteRegion(id) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.api.position
            .deleteRegion(id)
            .then(() => {
              let totalPage = Math.ceil(
                (this.tableData.length - 1) / this.pageSize
              );
              let currentPage =
                this.currentPage > totalPage ? totalPage : this.currentPage;
              this.currentPage = currentPage < 1 ? 1 : currentPage;
              this.listLocation();
            })
            .catch((err) => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //选择区域值发生变化时触发
    changeRegion(e) {
      this.optionsBuilding = e.items;
      this.ruleForm.id = e.id;
    },
    //选择楼栋值发生变化时触发
    changeBuilding(e) {
      this.ruleForm.id = e.id;
      this.pid = e.id;
    },
    //新增楼栋
    addBuilding() {
      this.dialogBuilding = true;
    },
    //确认增加楼栋
    trueBuildingModify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.api.position
            .trueBuildingModify(
              this.buildingForm.name,
              this.buildingForm.region
            )
            .then(() => {
              this.listLocation();
              this.dialogBuilding = false;
              this.$message({
                type: "success",
                message: "添加成功",
              });
            })
            .catch((err) => {
              {
                console.log(err);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加位置/教室
    addLocation(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.api.position
            .addLocation(this.ruleForm.classroomNumber, this.ruleForm.id, 1, this.ruleForm.comment)
            .then((res) => {
              // console.log(res)
              this.$refs[formName].resetFields();
              this.listLocation();
              this.$message({
                type: "success",
                message: "添加成功",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改教室
    modifyClass(row) {
      //	    	console.log(row)
      this.modityStatic = true;
      this.schoolname = row.schoolname;
      this.ruleForm.region = row.campus;
      this.ruleForm.building = row.buildings;
      this.ruleForm.classroomNumber = row.classroom;
      this.pid = row.buildingsid;
      this.classID = row.classid;
      for (let item of this.optionsRegion) {
        if (item.id == row.campusid) {
          this.optionsBuilding = item.items;
        }
      }
    },
    //确定修改教室
    trueClassModify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = { name: this.ruleForm.classroomNumber, pid: this.pid };
          this.api.position
            .preservationSchoolName(this.classID, params)
            .then(() => {
              //		          	console.log(res)
              this.listLocation();
              this.modityStatic = false;
              this.$refs[formName].resetFields();
              this.$message({
                type: "success",
                message: "修改成功",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //备注
    remarks(row) {
      // console.log(row)
      this.ruleForm1.newtip = row.comment;
      this.commentId = row.classid;
      this.dialogFormVisible = true;
    },
    //确认修改备注
    trueComment(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            comment: this.ruleForm1.newtip
          }
          this.api.position.putComment(this.commentId, param)
          .then(res => {
            // console.log(res)
            this.listLocation();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "修改成功",
            });
          })
          .catch(err=>{console.log(err)})
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.title-p {
  font-size: 18px;
  color: #4d4d4d;
  padding: 5px 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #9ea7b3;
  display: block;
}
.add-location {
  margin: 20px 20px 0;
}
.add-title {
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
.edi {
  margin-left: 5px;
}
.schoolname {
  width: 200px;
}
.content {
  margin: 20px 0 0 20px;
}
.hg {
  margin-bottom: 20px;
}
.del {
  margin-left: 10px;
}
.wzbeizhu {
  width: 70%;
  margin: auto;
}
.regiontitle {
  text-align: right;
  margin-bottom: 20px;
}
.h4 {
  text-align: center;
  margin: 20px 0;
}
.addtitle {
  margin: 0 0 50px 100px;
}
</style>