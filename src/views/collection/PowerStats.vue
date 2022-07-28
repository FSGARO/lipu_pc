<template>
	<el-container>
		<el-header style="height: auto;margin-bottom: -20px;">
			<div class="bcrumb">
		        <span class="back" @click="prev"><i class="el-icon-top-left"></i>返回</span>
		        <el-breadcrumb separator="/">
				  <el-breadcrumb-item>数据采集</el-breadcrumb-item>
				  <el-breadcrumb-item>能耗统计</el-breadcrumb-item>
				</el-breadcrumb>
		    </div>
    		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="power_search">
    			<el-form-item label="位置" style="width: 250px;">
    				<el-select v-model="ruleForm.position" placeholder="为空时表示查看所有设备" size="mini" clearable >
					    <el-option
					      v-for="item in options"
					      :key="item.areaid"
					      :label="item.location"
					      :value="item.areaid">
					    </el-option>
					</el-select>
    			</el-form-item>
    			<el-form-item label="时间" prop="checkTime" style="width: 250px;">
    			  <el-select v-model="ruleForm.checkTime" clearable placeholder="请选择" size="mini" >
				    <el-option
				      v-for="item in optionsMonth"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
    			</el-form-item>
    			<el-form-item>
    				<el-button type="success" icon="el-icon-search" size="mini" @click="checkMonth('ruleForm')">查询</el-button>
    				<el-button type="primary" icon="el-icon-top-left" size="mini" @click="exportExcel">导出数据</el-button>
    				<el-button type="success" icon="el-icon-refresh" size="mini" @click="energyList(0,1)">刷新列表</el-button>
    			</el-form-item>
    		</el-form>
	    </el-header>
    	<el-main>
		  <el-table border id="outTable"
		    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
		    style="width: 50%">
		    <el-table-column type="index" width="50" align="center">
		    </el-table-column>
		    <el-table-column align="center"
		      prop="location"
		      label="位置"
		      width="180">
		    </el-table-column>
		    <el-table-column align="center"
		      prop="month"
		      label="时间"
		      width="150">
		    </el-table-column>
		    <el-table-column align="center"
		      prop="device"
		      label="设备耗能(kw/h)"
		      width="120">
			  <template slot-scope="scope">
				  {{ scope.row.device | devicefixed }}
			  </template>
		    </el-table-column>
		    <el-table-column align="center"
		      prop="total"
		      label="总耗能(kw/h)">
			  <template slot-scope="scope">
				  {{ scope.row.total | devicefixed }}
			  </template>
		    </el-table-column>
		  </el-table>
		  <el-pagination class="pagination"
		    @size-change="handleSizeChange"
		    @current-change="handleCurrentChange"
		    :current-page="currentPage"
		    :page-sizes="[10, 20, 50, 100]"
		    :page-size="pageSize"
		    layout="total, sizes, prev, pager, next, jumper"
		    :total="tableData.length">
		  </el-pagination>
		</el-main>
	</el-container>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
	export default{
		data(){
			return{
				ruleForm: {
					position: "",
					checkTime: ""
				},
				rules: {
					position:[{ required: true, message: '请选择位置', trigger: 'change' }],
					checkTime:[{ required: true, message: '请选择时间点', trigger: 'change' }]
				},
	          tableData: [],
	      	  currentPage: 1,
	      	  pageSize: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
	      	  options: [],
	      	  optionsMonth:[{
	      	  	value: '1',
	      	  	label: '本月'
	      	  },{
	      	  	value: '2',
	      	  	label: '上个月'
	      	  },{
	      	  	value: '3',
	      	  	label: '最近三个月'
	      	  },{
	      	  	value: '6',
	      	  	label: '最近六个月'
	      	  },{
	      	  	value: '12',
	      	  	label: '最近一年'
	      	  }]
			}
		},
		created:function() {
			this.energyList(0,1)
			this.positionList()
		},
		methods:{
			//返回上一次浏览的页面
			prev(){
			  this.$router.go(-1)
			},
			//位置
			positionList() {
				this.api.powerstats.energyList(0, 1)
				.then(res =>{
					this.options = res.data.billing
				})
				.catch(err=>{console.log(err)})
			},
			//能耗列表
			energyList(areaid=0,month=1) {
				this.api.powerstats.energyList(areaid, month)
				.then(res => {
//					console.log(res)
					this.tableData = []
					let optionsArr = res.data.billing
					if(month == 2) {
						for(let item of optionsArr) {
							let res = item.list.list[0]
							let day = new Date((res.timestamp)*1000)
							let month = day.getMonth() + 1
							let year = day.getFullYear()
							this.tableData.push({location:item.location,month:year+'年'+month+'月',device:res.energy_device,total:res.energy_total})
						}
					} else {
						for(let item of optionsArr) {
							if(item.list.list == null){continue}
							for(let items of item.list.list) {
								let day = new Date((items.timestamp)*1000)
								let month = day.getMonth() + 1
								let year = day.getFullYear()
								this.tableData.push({location:item.location,month:year+'年'+month+'月',device:items.energy_device,total:items.energy_total})
							}
						}
					}
				})
			},
			//条数
		    handleSizeChange(val) {
		    	this.pageSize = val
				localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
		    	this.energyList()
	//	        console.log(`每页 ${val} 条`)
		    },
		    //页数
		    handleCurrentChange(val) {
		    	this.currentPage = val
		    	this.energyList()
	//	        console.log(`当前页: ${val}`)
		    },
		    //查询
	        checkMonth(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	let areaid = this.ruleForm.position
		          	let month = this.ruleForm.checkTime
		          	if(areaid=="") {
		          		areaid = 0
		          	}
		          	this.energyList(areaid,month) 
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
		    },
		    //导出数据
		    exportExcel() {
	            var xlsxParam = { raw: true }//转换成excel时，使用原始的格式
	            var wb = XLSX.utils.table_to_book(document.querySelector("#outTable"),xlsxParam)//outTable为列表id
	            var wbout = XLSX.write(wb, {
	                bookType: "xlsx",
	                bookSST: true,
	                type: "array"
	            })
	            try {
	                FileSaver.saveAs(
	                new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
	                "用电统计总览.xlsx"
	                )
	            } catch (e) {
	                if (typeof console !== "undefined") console.log(e, wbout)
	            }
	            return wbout;
	        }

		},
		filters: {
			//保留两位有效数字
			devicefixed(value) {
				return (value/1000).toFixed(2);
			}
		}
	}
</script>

<style scoped="">
	.toolsbar{
		overflow: hidden;
	}
	.el-form-item{
		display: inline-block;
	    margin-right: 10px;
	    vertical-align: top;
	    line-height: 28px;
	}
	.wzinput{
		width:200px;
	}
	.pagination{
		margin: 30px 30% 0 0;
	}
</style>