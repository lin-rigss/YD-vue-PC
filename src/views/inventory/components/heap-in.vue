<template>
	<div class="inventory-list">
		<div class="aside">
			<el-cascader
				v-model="form.parts"
				filterable
				clearable
				style="width: 100%;"
				:options="partsOptions"
				@change="partsChange"
				:props="{
					label: 'nameZn',
					value: 'id',
					children: 'children'
				}"
				placeholder="请选择分类"
			></el-cascader>
		</div>

		<el-table
			style="width: 100%"
			border
			:data="tableData"
			:size="config.size"
			:height="tableHeight"
		>
			<el-table-column label="序号" width="50" fixed="left" :align="config.align">
				<template slot-scope="scope">{{ scope.$index + 1 }}</template>
			</el-table-column>
			<el-table-column prop="goodsName" label="零件分类" min-width="120" :align="config.align"></el-table-column>
			<el-table-column prop="weight" label="重量" :align="config.align"></el-table-column>
			<el-table-column prop="num" label="数量" :align="config.align" ></el-table-column>
		</el-table>

	</div>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		data() {
			return {
				params: {},
				form: {
					parts: [],
				},
				tableData: [],
				partsOptions: [],
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 215px)';
			}
		},
		methods: {
			partsChange(val){
				this.loadDetailList();
			},
			loadDetailList(){
				this.$api.stock.goodsList({
					pageIndex: this.form.pageIndex,
					pageSize: this.form.pageSize,
					goodsCode: this.form.parts.join('/'),
				}).then(res => {
					this.tableData = res.data;
				});
			},
		},
		mounted() {
			this.params = this.$route.params;
			this.form.parts = (this.params.parts || []).map(item => item.id);

			this.$api.parts.generalCargoList({pageIndex: 1, pageSize: 1000}, false).then(partsRes => {
				this.$g.util.delEmptyChildren(partsRes.data)
				this.partsOptions = partsRes.data;

				this.loadDetailList();
			})
		}
	}
</script>

<style lang="scss">
	.inventory-list{
		.title-div{
			height: 40px;
			line-height: 40px;
		}
	}
</style>
