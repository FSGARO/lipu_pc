<template>
	<div>
		<el-table :data="tableData" v-if="this.isShow">
			<el-table-column type="index" width="50" align="center"></el-table-column>
			<el-table-column
				v-for="item in rules.column"
				:key="item.id"
				:prop="item.prop"
				:label="item.label"
				:align="item.align || 'center'"
				:formatter="item.formatter"
			>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
export default {
	props: {
		tableData: {
			type: Array,
			require: true
		},
		rules: {
			type: Object,
			require: true
		}
	},
	data() {
		//这里存放数据
		return { isShow: false }
	},
	//监听属性 类似于data概念
	computed: {},
	//监控data中的数据变化
	watch: {
		tableData: function (data) {
			if (data) this.isShow = true
		}
	},
	//方法集合
	methods: {},
	//生命周期 - 创建完成（可以访问当前this实例）
	created() {},
	//生命周期 - 挂载完成（可以访问DOM元素）
	mounted() {}
}
</script>
<style scoped></style>
