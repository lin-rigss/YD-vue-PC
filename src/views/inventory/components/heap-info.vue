<template>
	<div class="inventory-list">
		<div class="aside">
			<el-date-picker style="width: 100%;"
			  v-model="form.date"
			  type="daterange"
			  range-separator="至"
			  start-placeholder="开始日期"
			  end-placeholder="结束日期"
			  value-format="yyyy-MM-dd"
			>
			</el-date-picker>
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
			<el-table-column prop="billCode" label="入库单号" min-width="130" :align="config.align">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="toDetail(scope.row)">{{scope.row.billCode}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="supplierName" width="150" label="供应商名称" :align="config.align"></el-table-column>
			<el-table-column prop="type" label="拆解类型" min-width="100" :align="config.align" >
				<template slot-scope="scope">
					{{ scope.row.type=='jingcai'?'精拆':'拆废' }}
				</template>
			</el-table-column>
			<el-table-column prop="totalWeight" label="入库重量（kg）" min-width="140" :align="config.align" ></el-table-column>
			<el-table-column prop="unitPrice" label="每吨价格（元）" min-width="140" :align="config.align"></el-table-column>
			<el-table-column prop="status" label="状态" width="80" :align="config.align">
				<template slot-scope="scope">
					{{ scope.row.status=='0'?'未入库':'已入库' }}
				</template>
			</el-table-column>
			<el-table-column prop="stockDate" width="170" label="入库时间" :align="config.align"></el-table-column>
		</el-table>

		<div class="pagination">
			<el-pagination
			  background
			  @size-change="sizeChange"
			  @current-change="currentChange"
			  :current-page="form.pageIndex"
			  :page-sizes="config.sizes"
			  :page-size="form.pageSize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
		</div>

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
					date: '',
				},
				total: 0,
				tableData: [],
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 245px)';
			}
		},
		methods: {
			partsChange(val){
				this.list();
			},
			list(){
				this.$api.stock.stockList(this.form).then(res => {
					console.log(res.data)
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				});
			},
			toDetail(row){
				this.$router.push({
					name: 'inventory-listInfoDetail',
					query: {
						row: JSON.stringify(row)
					}
				})
			}
		},
		mounted() {
			this.params = this.$route.params;
			this.form.parts = (this.params.parts || []).map(item => item.id);
			this.list();
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
