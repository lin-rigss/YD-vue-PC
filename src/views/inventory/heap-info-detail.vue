<template>
  <BasePage>
	<div class="inventory-list">
		<div class="aside" >
			<el-row>
				<el-col :span="8">
					<span>订单号: {{confirmShipment.id?confirmShipment.id: '空'}}</span>
				</el-col>
				<el-col :span="8">
					<span>来源: {{confirmShipment.dismantlingPlantName?confirmShipment.dismantlingPlantName : '空'}}</span>
				</el-col>
				<el-col :span="4">
					<span>重量（kg）: {{confirmShipment.weight?confirmShipment.weight : '空'}}</span>
				</el-col>
				<el-col :span="4">
					<span>车型: {{confirmShipment.carType?confirmShipment.carType : '空'}}</span>
				</el-col>
				
			</el-row>
			<el-row>
				<el-col :span="8">
					<span>起始地: {{confirmShipment.destination?confirmShipment.destination : '空'}}</span>
				</el-col>
				<el-col :span="8">
					<span>目的地: {{confirmShipment.loadAddr?confirmShipment.loadAddr : '空'}}</span>
				</el-col>
				<el-col :span="8">
					<span>用车开始时间: {{confirmShipment.carStartTime?confirmShipment.carStartTime : '空'}}</span>
				</el-col>
			</el-row>
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
			<el-table-column prop="goodsName" width="130" label="种类名称" :align="config.align">
				<template slot-scope="scope">
					<el-button type="text" @click="toInfo(scope)">{{scope.row.goodsName}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="code" label="编码" min-width="140" :align="config.align" ></el-table-column>
			<el-table-column prop="weight" label="入库重量（kg）" min-width="140" :align="config.align" >
				<template slot-scope="scope">
					{{ scope.row.code!=''?scope.row.pullWeight:scope.row.weight }}
				</template>
			</el-table-column>
			<el-table-column prop="num" label="入库数量" min-width="140" :align="config.align">
				<template slot-scope="scope">
					{{ scope.row.code!=''?scope.row.pullNum: 0 }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="80" :align="config.align">
				<template slot-scope="scope">
					{{ scope.row.status=='0'?'未入库':'已入库' }}
				</template>
			</el-table-column>
			<el-table-column prop="entryTime" width="170" label="入库时间" :align="config.align"></el-table-column>
		</el-table>

		<!-- <div class="pagination">
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
		</div> -->
		<HeapDeail v-model="detailShow" :info="detailInfo"></HeapDeail>
	</div>
  </BasePage>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		components: {
			HeapDeail: () => import('./components/heap-detail')
		},
		data() {
			return {
				confirmShipment: {
					creatime: ''
				},
				params: {},
				form: {
					date: '',
				},
				total: 0,
				tableData: [],
				partsOptions: [],
				visible: false,
				partsOptions: [],
				detailShow: false,
				detailInfo: null,
			}
		},
		computed: {
			tableHeight(){
				return 'calc(80vh - 215px)';
			}
		},
		methods: {
			toInfo({ row, $index }){
				this.detailShow = true;
				this.detailInfo = row;
			},
			partsChange(val){
				this.loadDetailList();
			},
			loadDetailList(){
				this.$api.stock.stockDetail(this.detailRow.id).then(res => {
					this.tableData = res.data;
					// this.total = res.pageInfo.total;
				});
			},
			close(){
				this.visible = false;
				this.$emit('change', false);
			}
		},
		mounted() {
			this.detailRow = JSON.parse(this.$route.query.row);
			
			this.form.parts = (this.params.parts || []).map(item => item.id);
			this.$api.clue.confirmShipmentDetail({id:this.detailRow.orderId}).then(res => {
					this.confirmShipment = res.data;
				});
			this.loadDetailList();
		}
	}
</script>

<style lang="scss">
	.inventory-list{
		.title-div{
			height: 40px;
			line-height: 40px;
		}

		.aside{
			// span{margin-right: 10px;}
		}

	}
</style>
