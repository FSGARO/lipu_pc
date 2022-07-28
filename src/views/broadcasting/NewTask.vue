<template>
  <el-container>
    <el-header>
      <div class="bcrumb">
        <span class="back" @click="prev"
          ><i class="el-icon-top-left"></i>返回</span
        >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>音视频广播</el-breadcrumb-item>
          <el-breadcrumb-item>新建任务</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-header>
    <el-main style="background-color: #fff; margin: 0 20px">
      <el-row style="width: 80%">
        <el-col :span="24"
          ><h3 class="title_t">{{ title }}</h3></el-col
        >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-col :span="24" class="mdb">
            <h3 class="title n-p">任务信息</h3>
            <div class="mdl">
              <el-form-item label="任务名称" prop="name" class="is-required">
                <el-input
                  v-model="ruleForm.name"
                  style="width: 150px"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="广播类型"
                prop="broadcast"
                class="is-required"
              >
                <el-radio-group
                  v-model="ruleForm.broadcast"
                  @change="changeBroadcast"
                >
                  <el-radio :label="0">视频</el-radio>
                  <el-radio :label="1">音频</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="优先级" prop="priority">
                <el-input
                  v-model.number="ruleForm.priority"
                  style="width: 160px"
                  placeholder="值越低，优先级越高"
                ></el-input
                ><span>值越低，优先级越高(0为最高)</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24" v-show="videolayout">
            <h3 class="title n-p">视频画面布局</h3>
            <el-radio-group
              v-model="ruleForm.layout"
              class="ztbj"
              @change="layoutChange"
            >
              <el-row :gutter="21" style="margin-bottom: 20px">
                <el-col :span="7">
                  <div class="bordercontent1">1</div>
                  <el-radio :label="1" class="layout">布局1</el-radio>
                </el-col>
                <el-col :span="7">
                  <div class="bordercontent2_1">1</div>
                  <div class="bordercontent2_2">2</div>
                  <el-radio :label="2" class="layout">布局2</el-radio>
                </el-col>
                <el-col :span="7">
                  <div class="bordercontent3">
                    <div class="bordercontent3_1">1</div>
                    <div class="bordercontent3_2">2</div>
                  </div>
                  <el-radio :label="3" class="layout">布局3</el-radio>
                </el-col>
              </el-row>
              <el-row :gutter="21" style="margin-bottom: 20px">
                <el-col :span="7">
                  <div class="bordercontent4">
                    <div class="bordercontent4_1">1</div>
                    <div class="bordercontent4_2">2</div>
                    <div class="bordercontent4_2">3</div>
                  </div>
                  <el-radio :label="4" class="layout">布局4</el-radio>
                </el-col>
                <el-col :span="7">
                  <div class="bordercontent5_1">1</div>
                  <div class="bordercontent5_2">2</div>
                  <div class="bordercontent5_3">3</div>
                  <el-radio :label="5" class="layout">布局5</el-radio>
                </el-col>
                <el-col :span="7">
                  <div class="bordercontent6">
                    <div class="bordercontent6_1">1</div>
                    <div class="bordercontent6_2">
                      <div class="bordercontent6_3">2</div>
                      <div class="bordercontent6_4">3</div>
                    </div>
                  </div>
                  <el-radio :label="6" class="layout">布局6</el-radio>
                </el-col>
              </el-row>
              <el-row :gutter="21" class="mb">
                <el-col :span="7">
                  <div class="bordercontent7">
                    <div class="bordercontent7_1">
                      <div class="bordercontent7_2">1</div>
                      <div class="bordercontent7_3">3</div>
                    </div>
                    <div class="bordercontent7_4">
                      <div class="bordercontent7_5">2</div>
                      <div class="bordercontent7_6">4</div>
                    </div>
                  </div>
                  <el-radio :label="7" class="layout">布局7</el-radio>
                </el-col>
                <el-col :span="7">
                  <div class="bordercontent8">
                    <div class="bordercontent8_1">
                      <div class="bordercontent8_2">1</div>
                      <div class="bordercontent8_3">3</div>
                    </div>
                    <div class="bordercontent8_4">
                      <div class="bordercontent8_5">2</div>
                      <div class="bordercontent8_6">4</div>
                    </div>
                  </div>
                  <el-radio :label="8" class="layout">布局8</el-radio>
                </el-col>
                <el-col :span="7">
                  <div class="bordercontent9">
                    <div class="bordercontent9_1">1</div>
                    <div class="bordercontent9_2">
                      <div class="bordercontent9_3">2</div>
                      <div class="bordercontent9_4">3</div>
                      <div class="bordercontent9_5">4</div>
                    </div>
                  </div>
                  <el-radio :label="9" class="layout">布局9</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-col>
          <el-col :span="24">
            <h3 class="title n-p">选择音视频源</h3>
            <el-row class="mb">
              <el-table
                border
                ref="multipleTable"
                :data="tableyuan"
                tooltip-effect="dark"
                style="width: 70%"
              >
                <el-table-column prop="id" width="55" align="center">
                </el-table-column>
                <el-table-column label="选择源" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="selectYuan(scope.row)"
                      >请选择源</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="category"
                  label="源类型"
                  width="120"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="target"
                  label="源地址"
                  width="240"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  label="是否开启声音"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.audio_enabled"
                      clearable
                      placeholder="请选择"
                      @change="optionsChange"
                    >
                      <el-option
                        v-for="item in allstatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
          <el-dialog
            title="添加视频源"
            :visible.sync="dialogYuan"
            width="60%"
            center
          >
            <el-row class="xuanzhe is-required" label="请选择音视频源:">
              <el-radio-group v-model="category" @change="selectionVideo">
                <el-radio
                  v-for="(item, index) in modeTask"
                  :key="index"
                  :label="index"
                  >{{ item }}</el-radio
                >
              </el-radio-group>
            </el-row>
            <el-row class="mdl mgr-a" v-show="video == 0">
              <el-input
                placeholder="http://xx.xxx.com/media/file.mp4"
                v-model="categoryurl"
                class="urlinput"
                @change="changeUrl"
              ></el-input>
            </el-row>
            <el-row class="mdl mgr-a" v-show="video == 1">
              <el-col :span="24" class="mgr-con">
                <div class="categorycontent">
                  文件名:
                  <el-input
                    autosize
                    placeholder="按文件名搜索"
                    v-model="categoryinput"
                    class="categoryinput"
                    size="mini"
                    @keyup.enter.native="getMediaData(categoryinput)"
                  >
                  </el-input
                  ><el-button
                    type="success"
                    icon="el-icon-search"
                    size="mini"
                    @click="getMediaData(categoryinput)"
                    >搜索文件</el-button
                  >
                </div>
              </el-col>
              <el-table
                border
                class="mgr-con"
                ref="multipleTableMedia"
                :data="mediaData"
                tooltip-effect="dark"
                style="width: 70%"
                @selection-change="categorySelectionChange"
              >
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="文件名称"
                  width="250"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="duration"
                  label="播放时长"
                  show-overflow-tooltip
                  align="center"
                >
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
            </el-row>
            <el-row class="mdl mgr-a" v-show="video == 3">
              <el-col>
                <p class="shenyin">信号源</p>
                <el-radio-group v-model="ruleForm.yuan" class="shenyin">
                  <el-radio :label="0">电脑HDMI</el-radio>
                  <el-radio :label="1">笔记本HDMI</el-radio>
                  <el-radio :label="2">投屏HDMI</el-radio>
                </el-radio-group>
              </el-col>
              <el-col>
                <p class="shenyin">
                  录像位置选择<span class="color">(只能选择一间教室)</span>
                </p>
                <el-tree
                  :data="datas"
                  show-checkbox
                  node-key="id"
                  ref="trees"
                  highlight-current
                  :props="ruleForm.selectLocation"
                  @check-change="videotapeCheckChange"
                  class="mdl"
                >
                </el-tree>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogYuan = false">取 消</el-button>
              <el-button type="primary" @click="trueYuan">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="添加音频源"
            :visible.sync="dialogYin"
            width="60%"
            center
          >
            <el-row class="mdl mgr-a">
              <el-col :span="24">
                <div class="categorycontent">
                  文件名:
                  <el-input
                    autosize
                    placeholder="按文件名搜索"
                    v-model="yininput"
                    class="categoryinput"
                    size="mini"
                    @keyup.enter.native="getYinData(yininput)"
                  >
                  </el-input
                  ><el-button
                    type="success"
                    icon="el-icon-search"
                    size="mini"
                    @click="getYinData(yininput)"
                    >搜索文件</el-button
                  >
                </div>
              </el-col>
              <el-table
                border
                class="mgr-con"
                ref="multipleTableYin"
                :data="yinData"
                tooltip-effect="dark"
                style="width: 70%"
                @selection-change="categorySelectionChange1"
              >
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="文件名称"
                  width="250"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="duration"
                  label="播放时长"
                  show-overflow-tooltip
                  align="center"
                >
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
                :total="total1"
              >
              </el-pagination>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogYin = false">取 消</el-button>
              <el-button type="primary" @click="trueYin">确 定</el-button>
            </span>
          </el-dialog>
          <el-col :span="24">
            <h3 class="title n-p">
              播放位置选择<span class="color">必填</span>
            </h3>
            <el-form-item class="is-required" prop="selectLocation">
              <el-tree
                :data="datas"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :props="ruleForm.selectLocation"
                @check-change="handleCheckChange"
                class="mdl"
                :default-checked-keys="checkKeys"
              >
              </el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <h3 class="title n-p">添加同步控制</h3>
            <el-table
              class="mdl"
              :row-key="getRowKeys"
              ref="controlTable"
              :data="tableInstruce"
              tooltip-effect="dark"
              style="width: 60%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                :reserve-selection="true"
                type="selection"
                width="55"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="指令名称"
                width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="comment"
                label="指令方法"
                width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="options"
                label="指令属性"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.select"
                    clearable
                    placeholder="请选择"
                    @change="optionsChange"
                  >
                    <el-option
                      v-for="item in scope.row.options"
                      :key="item.id"
                      :label="item.comment"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="additional"
                label="指令附加数据"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.additional"
                  ></el-input>
                </template>
              </el-table-column>
              <div class="tongbu" slot="append">
                <el-checkbox v-model="synchronization"></el-checkbox>
                <span class="mgl">等待设备同步完成</span>
                <el-input
                  placeholder="请输入秒数"
                  v-model="synchronizationtime"
                  class="miaoshu"
                >
                  <template slot="append">秒</template>
                </el-input>
              </div>
            </el-table>
            <el-pagination
              class="pagin"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="controltotal"
            >
            </el-pagination>
          </el-col>
          <el-col :span="24">
            <h3 class="title n-p">执行时间</h3>
            <el-form-item label="重复" class="t-list mdl">
              <el-radio-group
                v-model="ruleForm.repeatMode"
                @change="selectionType"
              >
                <el-radio
                  v-for="(item, index) in modeTasks"
                  :key="index"
                  :label="index - 1"
                  >{{ item }}</el-radio
                >
              </el-radio-group>
              <div class="time">
                <el-row v-show="cur !== -1">
                  <el-col
                    :span="7"
                    v-for="(item, index) in ruleForm.datatime"
                    :key="index"
                  >
                    <el-form-item label="运行时间" class="is-required">
                      <el-time-picker
                        type="date"
                        style="width: 60%"
                        v-model="item.value"
                        placeholder="选择时间点"
                        value-format="HH:mm:ss"
                        @change="timeChange"
                      >
                      </el-time-picker>
                      <span
                        v-if="index > 0"
                        class="remove el-icon-circle-close"
                        @click="deleteTimes(index)"
                      ></span>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">
                    <span class="add-col el-icon-plus" @click="add"></span>
                  </el-col>
                </el-row>
                <el-row v-show="cur == 2">
                  <el-col
                    :span="7"
                    v-for="(item, index) in arrDays"
                    :key="index"
                  >
                    <el-form-item label="日期" class="is-required">
                      <el-date-picker
                        type="date"
                        style="width: 60%"
                        v-model="item.value"
                        placeholder="选择日期"
                        value-format="MM,dd"
                        @change="handleTimestamp"
                      >
                      </el-date-picker>
                      <!--<span v-if="index>0" class="remove el-icon-circle-close" @click="deleteDays(index)"></span>-->
                    </el-form-item>
                  </el-col>
                  <!--<el-col class="line" :span="2">
										<span class="add-col el-icon-plus" @click="addDays"></span>
									</el-col>-->
                </el-row>
                <el-row v-show="cur == 3">
                  <el-form-item label="星期" class="is-required">
                    <el-checkbox-group
                      v-model="ruleForm.repeatWeeks"
                      @change="changeweek"
                    >
                      <el-checkbox
                        v-for="(week, index) in weeks"
                        :label="index"
                        :key="index"
                        >{{ week }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </el-form-item>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="runing">
        <!--<el-form-item>
				<el-button type="primary" @click="taskNew('ruleForm')">立即创建</el-button>
			</el-form-item>-->
            <el-form-item style="margin-left: 100px">
              <el-button
                type="primary"
                @click="taskNew('ruleForm')"
                v-if="taskStake == 0"
                >立即创建</el-button
              >
              <el-button type="primary" @click="taskNew('ruleForm')" v-else
                >立即修改</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      title: "新建任务",
      taskStake: 0,
      key: "",
      ruleForm: {
        name: "",
        broadcast: 0,
        priority: 0,
        layout: 1,
        voice: 1,
        yuan: 0,
        selectLocation: {
          children: "items",
          label: "name",
        },
        repeatMode: -1,
        datatime: [{ value: "" }],
        repeatWeeks: [],
        additional: "",
        select: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: "blur",
          },
        ],
        broadcast: [
          {
            required: true,
            message: "请选择任务类型",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "请输入优先级",
            trigger: "blur",
          },
          {
            required: true,
            type: "number",
            message: "必须为数字值",
            trigger: "blur",
          },
        ],
        selectLocation: [
          {
            required: true,
            message: "请选择位置",
            trigger: "change",
          },
        ],
        datatime: [
          {
            type: "date",
            required: true,
            message: "请选择运行时间",
            trigger: "change",
          },
        ],
      },
      videolayout: true,
      modeTask: ["URL地址", "视频文件", "直播流", "本地回环"],
      category: 0,
      categoryinput: "",
      yininput: "",
      mediaData: [],
      yinData: [],
      total: 3,
      total1: 1,
      pageSize: localStorage.getItem("pageSize")
        ? parseInt(localStorage.getItem("pageSize"))
        : 10,
      currentPage: 1,
      currentPage1: 1,
      pageSize1: localStorage.getItem("pageSize")
        ? parseInt(localStorage.getItem("pageSize"))
        : 10,
      categoryurl: "",
      datas: [],
      areaid: "",
      opTions: {},
      source: [],
      checktree: [],
      videotapetree: [],
      tableInstruce: [],
      tableInstruces: [],
      hastableInstruce: [],
      optionsInstruce: [
        {
          value: 0,
          label: "升高",
        },
        {
          value: 1,
          label: "降低",
        },
      ],
      controltotal: 1,
      synchronization: false,
      synchronizationtime: "",
      cities: ["1", "2", "3"],
      cur: -1,
      video: 0,
      weeks: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      modeTasks: [
        "按需",
        "单次",
        "每天",
        "指定日期",
        "按周重复",
        "法定节假日",
        "非法定节假日",
      ],
      arr: [
        {
          value: "",
        },
      ],
      arrDays: [
        {
          value: "",
        },
      ],
      clock: [],
      repeatProp: [],
      audio_task: false,
      duration: 0,
      target: "",
      target4: "",
      audio_enabled: false,
      device_sync: [],
      devicesync: [],
      newdevicesync: [],
      tableyuan: [
        {
          id: 1,
          category: "",
          target: "",
          audio_enabled: false,
        },
      ],
      allstatus: [
        { value: true, label: "开" },
        { value: false, label: "关" },
      ],
      dialogYuan: false,
      dialogYin: false,
      yuanid: "",
      checkKeys: [],
      taskid: "",
      getRowKeys(row) {
        return row.id;
      },
    };
  },
  created: function () {
    this.getState();
    if (this.taskStake == 0) {
      //新建任务时直接加载
      this.getControl();
    }
  },
  mounted() {
    //获取修改任务信息
    if (this.$route.query.taskid) {
      this.taskid = this.$route.query.taskid;
      this.getModifyTask(this.$route.query.taskid);
    } else {
      this.taskStake = 0;
      this.title = `新建任务`;
    }
  },
  methods: {
    //返回上一次浏览的页面
    prev() {
      this.$router.go(-1);
    },
    //新建或修改媒体任务
    taskNew(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //判断不同任务类型的repeatProp值
          if (this.ruleForm.repeatMode == 2) {
            this.repeatProp = [];
            for (let item of this.arrDays) {
              if (item.value) {
                let values = item.value.split(",");
                values.forEach((item) => {
                  this.repeatProp.push(+item);
                });
              }
              //						else {
              //							this.$alert('日期没有填写完或者没有删除完', {dangerouslyUseHTMLString: true})
              //							return false
              //						}
            }
            //					console.log(this.repeatProp)
          } else if (this.ruleForm.repeatMode == 3) {
            this.repeatProp = this.ruleForm.repeatWeeks;
          } else {
            this.repeatProp = null;
          }
          //把运行时间放进数组中
          this.clock = [];
          for (let item of this.ruleForm.datatime) {
            if (item.value) {
              this.clock.push(item.value);
            }
            //                  else {
            ////						this.$message.error('运行时间没有填写完或者没有删除完')
            //						this.$alert('运行时间没有填写完或者没有删除完', {dangerouslyUseHTMLString: true})
            //						return false
            //					}
          }
          //判断播放位置选择
          //				if(this.checktree == '') {
          //					this.$alert('请选择播放位置', {dangerouslyUseHTMLString: true})
          //						return false
          //				}

          this.device_sync = [];
          for (let item of this.newdevicesync) {
            if (item.options == null) {
              //当没有子指令时attr提交0(或没选择时)
              this.device_sync.push({
                mode: 0,
                method: item.name,
                attr: parseInt(0),
                data: item.additional,
              });
            } else {
              for (let opt of item.options) {
                if (item.select == opt.id) {
                  this.device_sync.push({
                    mode: 0,
                    method: item.name,
                    attr: parseInt(opt.attr),
                    data: item.additional,
                  });
                }
              }
            }
          }
          //判断是否勾选了设备同步完成按钮
          if (this.synchronization) {
            this.device_sync.push({
              mode: 1,
              method: "",
              attr: parseInt(this.synchronizationtime),
              data: "",
            });
          }
          //source源
          this.source = [];
          for (let item of this.tableyuan) {
            this.source.push({
              category: item.category,
              target: item.target + "",
              audio_enabled: item.audio_enabled,
            });
          }
          //参数
          this.opTions = {
            place: this.checktree,
            audio_task: this.audio_task,
            priority: this.ruleForm.priority,
            duration: this.duration,
            layout: this.ruleForm.layout,
            source: this.source,
            device_sync: this.device_sync,
          };
          let params = {
            name: this.ruleForm.name,
            plan: {
              clock: this.clock,
              repeat: {
                mode: this.ruleForm.repeatMode,
                prop: this.repeatProp,
              },
            },
            options: this.opTions,
          };
          if (this.taskStake == 1) {
            //					console.log(params)
            //					return
            this.api.newctask
              .taskModify(this.taskid, "modify", params)
              .then(() => {
                //		            	console.log(res)
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.$router.push({
                  path: "/broadcasting/index",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            //					console.log(params)
            //					return
            this.api.newctask
              .taskNew(1, params)
              .then(() => {
                //		            	console.log(res)
                this.$message({
                  message: "创建成功",
                  type: "success",
                });
                this.$router.push({
                  path: "/broadcasting/index",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //音视频源
    selectionVideo(callback) {
      if (callback == 0) {
        this.video = 0;
      } else if (callback == 1) {
        this.$refs.multipleTableMedia.clearSelection();
        this.video = 1;
        this.getMediaData();
      } else if (callback == 2) {
        this.$refs.multipleTableMedia.clearSelection();
        this.video = 1;
        this.videoList();
      } else {
        this.video = 3;
      }
    },
    //条数
    handleSizeChange(val) {
      this.pageSize = val;
      localStorage.setItem("pageSize", val); //更新本地缓存pageSize的默认条数
      if (this.video == 1) {
        this.getMediaData();
      } else if (this.video == 2) {
        this.videoList();
      } else if (this.video == 5) {
        this.getYinData();
      }

      //      console.log(`每页 ${val} 条`);
    },
    //页数
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.video == 1) {
        this.getMediaData();
      } else if (this.video == 2) {
        this.videoList();
      } else if (this.video == 5) {
        this.getYinData();
      }
      //      console.log(`当前页: ${val}`);
    },
    //获取视频列表
    getMediaData(keyword = "") {
      this.mediaData = [];
      this.api.mediafile
        .getMediaData(this.currentPage - 1, this.pageSize, keyword)
        .then((res) => {
          //				console.log(res)
          this.mediaData = res.data.media_list.media_property_list;
          this.total = res.data.media_list.total;
        });
    },
    //获取音频列表
    getYinData(keyword = "") {
      this.yinData = [];
      this.api.mediafile
        .getYinData(this.currentPage - 1, this.pageSize, keyword)
        .then((res) => {
          //				console.log(res)
          this.yinData = res.data.media_list.media_property_list;
          this.total1 = res.data.media_list.total;
        });
    },
    //获取直播流列表
    videoList() {
      this.mediaData = [];
      this.api.videopreview
        .videoList(this.currentPage - 1, this.pageSize)
        .then((res) => {
          //				console.log(res)
          this.mediaData = res.data.rtmp_info_list.rtmp_property_list;
          this.total = res.data.rtmp_info_list.total;
          for (let item of this.mediaData) {
            item.type = `视频流`;
            if (item.publishing == true) {
              item.duration = `推流中`;
            } else {
              item.duration = `未推流`;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取地理位置
    getState() {
      this.api.operation
        .getState()
        .then((res) => {
          //				console.log(res)
          this.datas = res.data.place_info;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取同步控制列表
    getControl() {
      this.api.addcontrol
        .getInstructions(this.currentPage1 - 1, this.pageSize1)
        .then((res) => {
          //				console.log(res)
          this.tableInstruce = res.data.cmd_info_list.cmd_property_list;
          this.controltotal = res.data.cmd_info_list.total;
          if (this.devicesync.length > 0) {
            this.$nextTick(() => {
              //勾选
              for (let item of this.devicesync) {
                for (let dec of this.tableInstruce) {
                  if (item.id == dec.id) {
                    this.$refs.controlTable.toggleRowSelection(dec, true);
                    for (let atr of dec.options) {
                      if (atr.attr == item.attr) {
                        dec.select = atr.id;
                      }
                    }
                    dec.data = item.data;
                  }
                }
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取修改任务
    getModifyTask(id) {
      this.api.controltask
        .getModifyTask(id)
        .then((res) => {
          //				console.log(res)
          this.allgetControl(res.data.task_info_list.task_property_list[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取修改函数
    async allgetControl(rows) {
      this.taskStake = 1;
      this.title = `修改任务`;
      this.ruleForm.name = rows.name;
      if (rows.actions.audio_task) {
        this.ruleForm.broadcast = 1;
      } else {
        this.ruleForm.broadcast = 0;
      }
      this.ruleForm.priority = rows.actions.priority;
      this.ruleForm.layout = rows.actions.layout;
      this.layoutChange(rows.actions.layout);
      let tableyuan = rows.actions.source;
      let id = 1;
      for (let item of tableyuan) {
        item.id = id;
        id++;
      }
      this.tableyuan = tableyuan;
      this.checkKeys = rows.actions.place;
      for (let ple of this.checkKeys) {
        this.checktree.push(ple);
      }

      let hasInstruces = rows.actions.device_sync;
      let res = await this.api.addcontrol.getInstructions(0, 999);
      this.tableInstruces = res.data.cmd_info_list.cmd_property_list; //所有指令
      for (let tbes of this.tableInstruces) {
        for (let has of hasInstruces) {
          if (tbes.name == has.method) {
            tbes.attr = has.attr;
            tbes.data = has.data;
            this.devicesync.push(tbes);
          }
        }
      }
      //			this.$nextTick(() =>{
      //				if(this.devicesync.length > 0) { //勾选
      //					console.log(this.tableInstruce)
      //					this.tableInstruce.forEach(item => {
      //						console.log(item)
      //						for(let dec of this.devicesync) {
      //							if(item.id = dec.id) {
      //								this.$refs.controlTable.toggleRowSelection(item, true)
      //							}
      //						}
      //
      //					})
      //				}
      //			})

      //			for(let item of this.hastableInstruce) {
      //				for(let opt of item.options) {
      //					if(item.select == opt.id) {
      //						this.device_sync.push({mode:0,method:item.name,attr:parseInt(opt.attr),data:item.additional})
      //					}
      //				}
      //			}
      this.ruleForm.repeatMode = rows.repeat_mode;

      if (this.ruleForm.repeatMode == 2) {
        this.selectionType(rows.repeat_mode);
        this.arrDays = [];
        let days = rows.repeat_prop.toString();
        this.arrDays.push({ value: days });
        //				console.log(this.arrDays)
      } else if (this.ruleForm.repeatMode == 3) {
        this.ruleForm.repeatWeeks = rows.repeat_prop;
        this.selectionType(rows.repeat_mode);
      } else {
        this.selectionType(rows.repeat_mode);
      }
      this.ruleForm.datatime = [];
      if (rows.clock) {
        for (let item of rows.clock) {
          this.ruleForm.datatime.push({ value: item });
        }
      }
      this.getControl();
    },
    //条数
    handleSizeChange1(val) {
      this.pageSize1 = val;
      localStorage.setItem("pageSize", val); //更新本地缓存pageSize的默认条数
      this.getControl();
      //      console.log(`每页 ${val} 条`);
    },
    //页数
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getControl();
      //      console.log(`当前页: ${val}`);
    },
    //广播类型选择
    changeBroadcast(value) {
      if (value == 1) {
        //音频
        this.getYinData();
        this.layoutChange(1);
        this.videolayout = false;
        this.audio_task = true;
        this.video = 5;
      } else {
        //视频
        this.getMediaData();
        this.ruleForm.layout = 1;
        this.layoutChange(1);
        this.videolayout = true;
        this.audio_task = false;
      }
    },
    //播放位置选择
    handleCheckChange() {
      //			console.log(this.$refs.tree.getCheckedKeys())
      let checkData = this.$refs.tree.getCheckedNodes();
      this.checktree = [];
      checkData.forEach((item) => {
        this.checktree.push(item.id);
        //				if (!item.hasOwnProperty("items")) {
        //				  this.checktree.push(item.id)
        //				}
      });
      //			console.log(this.checktree)
    },
    //录像位置选择
    videotapeCheckChange() {
      let checkData = this.$refs.trees.getCheckedNodes();
      this.videotapetree = [];
      this.target4 = "";
      checkData.forEach((item) => {
        // if (!item.hasOwnProperty("items")) {
		if (!item.items) {
          this.videotapetree.push(item.id);
          this.target4 += item.id + ":" + this.ruleForm.yuan;
        }
      });
      this.target = this.target4;
      if (this.videotapetree.length > 1) {
        this.$message.error(
          "只能选择一个录像位置，已经选择了" +
            this.videotapetree.length +
            "个位置"
        );
      }
    },
    //选择表格类目
    handleSelectionChange(val) {
      //			console.log(val)
      this.newdevicesync = val;
    },
    //url地址
    changeUrl() {
      this.target = this.categoryurl;
    },
    //选择视频文件或直播流文件
    categorySelectionChange(val) {
      //			console.log(val)
      if (val != "") {
        if (val.length > 1) {
          this.$message.error(
            "最多只能选择1个源文件！你已选择了" + val.length + "个文件"
          );
          this.target = val[0].id;
        } else if ((val.length == 1)) {
           this.target = val[0].id;
        }
      }
    },
    //选择音频文件
    categorySelectionChange1(val) {
      //			console.log(val)
      if (val != "") {
        if (val.length > 1) {
          this.$message.error(
            "最多只能选择1个源文件！你已选择了" + val.length + "个文件"
          );
          this.target = val[0].id;
        } else if ((val.length == 1)) {
          this.target = val[0].id;
        }
      }
    },
    //选择执行时间的类型
    selectionType(callback) {
      if (callback == -1) {
        this.cur = -1;
      } else if (callback == 0) {
        this.cur = 0;
      } else if (callback == 1) {
        this.cur = 1;
      } else if (callback == 2) {
        this.cur = 2;
      } else if (callback == 3) {
        this.cur = 3;
      } else if (callback == 4) {
        this.cur = 4;
      } else if (callback == 5) {
        this.cur = 5;
      }
    },
    //添加时间
    add() {
      this.ruleForm.datatime.push({});
    },
    //删除时间
    deleteTimes(index) {
      this.ruleForm.datatime.splice(index, 1);
    },
    //增加日期
    addDays() {
      this.arrDays.push({});
    },
    //删除日期
    deleteDays(index) {
      this.arrDays.splice(index, 1);
    },
    //选择周几
    changeweek(value) {
      this.ruleForm.repeatWeeks = value;
    },
    handleTimestamp() {
      //			console.log(value)
    },
    //运行时间改变
    timeChange() {
      //			console.log(this.ruleForm.datatime, value)
    },
    //选择布局
    layoutChange(value) {
      //			console.log(value)
      if (value == 1) {
        let tableyuan = this.tableyuan.slice(0, 1);
        this.tableyuan = tableyuan;
      } else if (value == 2 || value == 3) {
        let tableyuan = [];
        if (this.tableyuan.length > 1) {
          tableyuan = this.tableyuan.slice(0, 2);
          this.tableyuan = tableyuan;
        } else {
          this.tableyuan.push({
            id: 2,
            category: "",
            target: "",
            audio_enabled: false,
          });
        }
      } else if (value == 4 || value == 5 || value == 6) {
        let tableyuan = [];
        if (this.tableyuan.length < 2) {
          this.tableyuan.push(
            { id: 2, category: "", target: "", audio_enabled: false },
            { id: 3, category: "", target: "", audio_enabled: false }
          );
        } else if (this.tableyuan.length < 3 && this.tableyuan.length >= 2) {
          this.tableyuan.push({
            id: 3,
            category: "",
            target: "",
            audio_enabled: false,
          });
        } else {
          tableyuan = this.tableyuan.slice(0, 3);
          this.tableyuan = tableyuan;
        }
      } else {
        let tableyuan = [];
        if (this.tableyuan.length < 2) {
          this.tableyuan.push(
            { id: 2, category: "", target: "", audio_enabled: false },
            { id: 3, category: "", target: "", audio_enabled: false },
            { id: 4, category: "", target: "", audio_enabled: false }
          );
        } else if (this.tableyuan.length >= 2 && this.tableyuan.length < 3) {
          this.tableyuan.push(
            { id: 3, category: "", target: "", audio_enabled: false },
            { id: 4, category: "", target: "", audio_enabled: false }
          );
        } else if (this.tableyuan.length >= 3 && this.tableyuan.length < 4) {
          this.tableyuan.push({
            id: 4,
            category: "",
            target: "",
            audio_enabled: false,
          });
        } else {
          tableyuan = this.tableyuan.slice(0, 4);
          this.tableyuan = tableyuan;
        }
      }
    },
    //指令选择
    optionsChange() {
      //			console.log(value)
    },
    //选择源
    selectYuan(row) {
      //			console.log(row)
      if (this.audio_task == true) {
        this.dialogYin = true;
        this.yuanid = row.id;
        this.category = 1;
      } else {
        this.dialogYuan = true;
        this.yuanid = row.id;
      }
    },
    //确定选择视频源
    trueYuan() {
      //			console.log(this.category, this.target)
      for (let item of this.tableyuan) {
        if (item.id == this.yuanid) {
          item.category = this.category;
          item.target = this.target;
        }
      }
      this.dialogYuan = false;
      this.$refs.multipleTableMedia.clearSelection();
    },
    //确认选择音频源
    trueYin() {
      for (let item of this.tableyuan) {
        if (item.id == this.yuanid) {
          item.category = this.category;
          item.target = this.target;
        }
      }
      this.dialogYin = false;
      this.$refs.multipleTableYin.clearSelection();
    },
  },
};
</script>

<style scoped>
.is-required {
  margin: 20px 0 20px 5px;
}
.n-p {
  height: 42px;
  width: 100%;
  line-height: 42px;
  background: #ecf0f6;
  padding-left: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 15px;
}
.radoes {
  margin-left: 20px;
}
.el-input__inner {
  width: 150px;
}
.add-col {
  width: 27px;
  height: 27px;
  background: #7176b7;
  border-radius: 5px;
  margin-top: 25px;
  color: #fff;
  text-align: center;
  line-height: 27px;
  font-size: 16px;
  cursor: pointer;
}
.remove {
  color: #f56c6c;
  cursor: pointer;
}
.title {
  margin-bottom: 20px;
}
.title_t {
  margin-bottom: 20px;
  text-align: center;
}
.ztbj {
  width: 100%;
  font-size: 12px;
}
.layout {
  display: block;
  text-align: center;
  margin: 10px 0;
}
.bordercontent1 {
  margin: auto;
  width: 120px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent2_1 {
  margin: auto;
  width: 120px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent2_2 {
  margin: auto;
  width: 120px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent3 {
  margin: auto;
  width: 120px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent3_1 {
  margin: auto;
  width: 60px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent3_2 {
  margin: auto;
  width: 60px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent4 {
  margin: auto;
  width: 120px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent4_1 {
  margin: auto;
  width: 40px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent4_2 {
  margin: auto;
  width: 40px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent4_3 {
  margin: auto;
  width: 40px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent5_1 {
  margin: auto;
  width: 120px;
  height: 33.3px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent5_2 {
  margin: auto;
  width: 120px;
  height: 33.3px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent5_3 {
  margin: auto;
  width: 120px;
  height: 33.3px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent6 {
  margin: auto;
  width: 120px;
  height: 100px;
  display: flex;
}
.bordercontent6_1 {
  margin: auto;
  width: 60px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent6_2 {
  margin: auto;
  width: 60px;
  height: 100px;
  display: block;
}
.bordercontent6_3 {
  margin: auto;
  width: 60px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent6_4 {
  margin: auto;
  width: 60px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent7 {
  margin: auto;
  width: 120px;
  height: 100px;
  display: flex;
}
.bordercontent7_1 {
  margin: auto;
  width: 80px;
  height: 100px;
  display: block;
}
.bordercontent7_2 {
  margin: auto;
  width: 80px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent7_3 {
  margin: auto;
  width: 80px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent7_4 {
  margin: auto;
  width: 40px;
  height: 100px;
  display: block;
}
.bordercontent7_5 {
  margin: auto;
  width: 40px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent7_6 {
  margin: auto;
  width: 40px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent8 {
  margin: auto;
  width: 120px;
  height: 100px;
  display: flex;
}
.bordercontent88 {
  width: 120px;
  height: 100px;
  display: flex;
  margin: 10px 0 30px;
}
.bordercontent8_1 {
  margin: auto;
  width: 60px;
  height: 100px;
  display: block;
}
.bordercontent8_2 {
  margin: auto;
  width: 60px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent8_3 {
  margin: auto;
  width: 60px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent8_4 {
  margin: auto;
  width: 60px;
  height: 100px;
  display: block;
}
.bordercontent8_5 {
  margin: auto;
  width: 60px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent8_6 {
  margin: auto;
  width: 60px;
  height: 50px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent9 {
  margin: auto;
  width: 120px;
  height: 100px;
  display: flex;
}
.bordercontent9_1 {
  margin: auto;
  width: 80px;
  height: 100px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent9_2 {
  margin: auto;
  width: 40px;
  height: 100px;
  display: block;
}
.bordercontent9_3 {
  margin: auto;
  width: 40px;
  height: 33.3px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent9_4 {
  margin: auto;
  width: 40px;
  height: 33.3px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bordercontent9_5 {
  margin: auto;
  width: 40px;
  height: 33.3px;
  border: 1px solid #080e0e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mdl {
  margin-left: 40px;
  margin-bottom: 30px;
}
.mdb {
  margin-bottom: 30px;
}
.shenyin {
  text-align: left;
  font-weight: 900;
  margin: 20px;
}
.categorycontent {
  display: block;
  margin: 20px 0;
  line-height: 35px;
}
.categoryinput {
  width: 20%;
  margin: 0 10px;
}
.pagination {
  margin: 30px 40% 30px;
}
.tip {
  margin: 20px 0 20px 20px;
}
.bordercolor {
  background: #cf9236;
}
.runing {
  text-align: center;
}
.xuanzhe {
  margin-bottom: 10px;
  border-bottom: 1px solid #5a6883;
  padding-bottom: 10px;
}
.urlinput {
  width: 50%;
  margin: 20px 0;
}
.pagin {
  margin: 0 0 50px 40%;
}
.tongbu {
  margin: 10px 0 10px 20px;
}
.miaoshu {
  width: 150px;
  margin-left: 20px;
}
.mgl {
  margin-left: 30px;
}
.color {
  color: red;
  margin-left: 10px;
}
.yuan {
  width: 100%;
  text-align: center;
}
.mb {
  margin-bottom: 20px;
}
.mgr-a {
  text-align: center;
}
.mgr-con {
  display: inline-block;
}
</style>