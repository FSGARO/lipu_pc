<!--
 * @Description: 
 * @Author: 
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-11-19 14:23:49
 * El Psy Congroo
-->
<template>
	<el-container>
		<el-header style="height: auto">
			<div class="bcrumb">
				<span class="back" @click="prev"
					><i class="el-icon-top-left"></i>返回</span
				>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item>主面板</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-header>
		<el-main>
			<el-row :gutter="20">
				<el-col
					:span="4"
					:offset="1"
					v-for="(item, index) of allUrl"
					:key="index"
				>
					<div
						class="mainlist"
						:style="{ background: item.data.bgcolor }"
						@click="goLink(item)"
					>
						<img
							class="icomimg"
							v-if="item.data.icon.indexOf('/') > -1"
							:src="item.data.icon"
							min-width="70"
							height="70"
						/>
						<i
							v-else
							:class="item.data.icon ? item.data.icon : bgimg"
						></i>
						<p>{{ item.data.name }}</p>
					</div>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			currentPage: 0,
			pageSize: 10,
			allUrl: [],
			deviceTotal: 0,
			pagetotal: 1,
			bgimg: 'el-icon-circle-close'
		}
	},
	created: function () {
		this.getLink()
		this.allUrl = []
	},
	methods: {
		goterminal() {
			this.$router.push({ name: 'terminal' })
		},

		gocontrolTask() {
			this.$router.replace({ name: 'controlTask' })
		},
		//返回上一次浏览的页面
		prev() {
			this.$router.go(-1)
		},
		//跳转url
		jumpUrl(row) {
			window.open(row.data.url)
		},
		//获取url列表
		getLink() {
			this.api.config
				.getLink(this.currentPage, this.pageSize)
				.then(res => {
					if (res.data.link_list.list) {
						for (let item of res.data.link_list.list) {
							item.data.icon = item.data.icon || ''
							item.data.name = item.data.name || ''
							this.allUrl.push(item)
						}
						this.deviceTotal = res.data.link_list.total //总条数
						this.pagetotal =
							Math.ceil(this.deviceTotal / this.pageSize) - 1 //分多少页
						// console.log(this.currentPage, this.pagetotal)
						if (this.currentPage < this.pagetotal) {
							this.currentPage += 1
							this.getLink(this.currentPage, this.pageSize)
						} else {
							this.currentPage = 0
						}
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		//跳转外部链接
		goLink(row) {
			window.open(row.data.url)
		}
	}
}
</script>

<style>
.mainlist {
	text-align: center;
	display: block;
	height: 150px;
	background: rgb(243, 152, 1);
	border-radius: 10px;
	margin: 20px 0;
	cursor: pointer;
}
.mainlist p {
	line-height: 10px;
	color: #fff;
	font-size: 16px;
}
.mainlist i {
	line-height: 100px;
	color: #fff;
	font-size: 38px;
}
.el-col-4 :hover {
	transform: scale(1.1);
}
.icomimg {
	margin: 15px;
}
</style>
