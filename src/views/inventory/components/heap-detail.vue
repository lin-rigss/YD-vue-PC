<template>
	<el-dialog
		class="inventory-list"
		title="入库单详情"
		:visible.sync="visible"
		width="50%"
		height="60%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		top="5vh"
	>

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
			<el-table-column prop="goodsName" label="拆解产品" :align="config.align"></el-table-column>
			<el-table-column prop="pullWeight" label="重量" width="80" :align="config.align"></el-table-column>
			<el-table-column prop="num" label="入库数量" :align="config.align" ></el-table-column>
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

		<span slot="footer" class="dialog-footer">
		    <el-button @click="close">取 消</el-button>
		    <el-button type="primary" @click="close">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		props: ['info', 'show'],
		model: {
			prop: 'show',
			event: 'change',
		},
		watch: {
			show(newValue, oldValue) {
				newValue && (this.visible = true);
			},
			info(o, n){
				// debugger
				console.log(o)
				let id = o.id
				this.loadDetailList(id);
			}
		},
		data() {
			return {
				params: {},
				form: {
					date: '',
				},
				total: 0,
				tableData: [],
				partsOptions: [],
				visible: false,
			}
		},
		computed: {
			tableHeight(){
				return 'calc(80vh - 290px)';
			}
		},
		methods: {
			loadDetailList(id){
				this.$api.stock.pullDetail(id).then(res => {
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
			
			this.params = this.$route.params;
			this.form.parts = (this.params.parts || []).map(item => item.id);

			// this.loadDetailList();
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
			span{margin-right: 10px;}
		}

		.el-dialog__body{
			padding-top: 0;
		}
	}
</style>
