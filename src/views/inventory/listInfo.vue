<template>
	<BasePage>
		<div class="orderInfo-list">

			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="brandName" min-width="180" label="品牌" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<!-- <el-table-column prop="series" width="80" label="车系" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<!-- <el-table-column prop="model" width="180" label="车型" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<el-table-column prop="goodsName" label="零件分类" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<!-- <el-table-column prop="spare" label="零件" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<el-table-column prop="model" label="零件型号" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="num" label="数量" width="100" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="totalPrice" label="价格" width="100" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="sourceName" label="来源" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>				
				<el-table-column prop="repositoryName" label="仓位" min-width="180" :align="config.align"></el-table-column>
				<el-table-column prop="entryTime" label="入库时间" min-width="160" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<!-- <el-table-column prop="createTime" label="入库类型" width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
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
	</BasePage>
</template>

<script>
import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		computed: {
			tableHeight(){
				return 'calc(100vh - 210px)';
			}
		},
		data() {
			return {
				form:{

				},
				total: 0,
				tableData: [],
			}
		},
		methods: {
			
            // 获取入库零件详情
			list(){
                this.$api.stock.listDetail(this.goodsId).then(res => 
                {   
					this.tableData = res.data;
                });
			}
		},
		mounted(){
			this.goodsId = this.$route.params.id
			// this.orderstatus = this.$route.query.status
			this.list();
		}
	}
</script>

<style lang="scss">
	.factory-list{
		.create{
			position: absolute;
			bottom: 15px;
			left: 10px;
		}
	}
</style>
