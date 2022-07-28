<template>
  <div>
    <el-form :model="cardForm" :rules="cardRules" ref="cardForm">
      <el-form-item label="请选择教室" label-width="140px" prop="classrooms">
        <!-- <el-select v-model="cardForm.classroom" placeholder="请选择教室">
          <el-option label="item.name" value="item.id" key="item.id" v-for="item of schoolList"></el-option>
        </el-select> -->
        <el-cascader
            style="width: 300px"
            v-model="cardForm.classrooms"
            :options="options"
            :props="positionProps"
            @change="handleChange"
            clearable
          ></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="diafool">
      <el-button @click="falseCard">取 消</el-button>
      <slot name="trueBtn"><el-button type="primary" @click="trueCard('cardForm')">确 定</el-button></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "classroom",
    props: {
      dialogCard: {type: Boolean}
    },
    data() {
      return {
        cardForm: {
          classrooms: ""
        },
        cardRules: {
          classrooms: [{ required: true, message: '请选择教室', trigger: 'change' }]
        },
        options: [],
        positionProps: {
          value: "id",
          label: "name",
          children: "items"
        }
      }
    },
    created: function() {
      this.getClassroom()
    },
    methods: {
      //获取教室
      getClassroom() {
        this.api.operation
        .getState()
        .then((res) => {
          //					console.log(res)
          this.options = res.data.place_info;
        })
        .catch((err) => {
          console.log(err);
        });
      },
      //选择教室
      handleChange(value) {
        console.log(value)
      },
      //取消
      falseCard() {
        // console.log(111)
        // this.$emit('defaultCard');
      },
      //确定
      trueCard(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            return true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
  }
</script>

<style scoped>
  .diafool{
    text-align: center;
  }
</style>