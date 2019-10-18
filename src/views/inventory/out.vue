<template>
	<BasePage>
		<div class="inventory-out">
			<div class="aside">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-date-picker
							v-model="form.date"
							style="width: 100%;"
							type="daterange"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="yyyy-MM-dd"
							:picker-options="$g.options.daterange"
							@change="dateChange"
						>
						</el-date-picker>
					</el-col>
					<el-col :span="12">
						<el-input v-model="form.key" @keyup.enter.native="search" placeholder="请输入关键字回车进行搜索" style="width: 100%;"></el-input>
					</el-col>
				</el-row>
			</div>
			
			<div class="">
				<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
					<el-table-column label="序号" width="50" fixed="left" :align="config.align">
						<template slot-scope="scope">{{ scope.$index + 1 }}</template>
					</el-table-column>
					<el-table-column min-width="180" label="出库单号" :align="config.align">
						<template slot-scope="scope">
							<el-button type="text" @click="toDetail(scope)">
								{{ scope.row.billCode }}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column label="出库类型" width="120" :align="config.align">
						<template slot-scope="scope">
							<div v-html="$g.dic.html('outbound', scope.row.type)"></div>
						</template>
					</el-table-column>
					<el-table-column prop="amountPayable" label="应收金额" width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
						<template slot-scope="scope">
							{{ $g.util.formatNumber(scope.row.amountPayable) }}
						</template>
					</el-table-column>
					<!-- <el-table-column prop="amountPaid" label="实收金额" width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
						<template slot-scope="scope">
							{{ $g.util.formatNumber(scope.row.amountPaid) }}
						</template>
					</el-table-column> -->
					<el-table-column label="支付状态" width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
						<template slot-scope="scope">
							<div v-html="$g.dic.html('payStatus', scope.row.payStatus)"></div>
						</template>
					</el-table-column>
					<el-table-column label="支付方式" width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
						<template slot-scope="scope">
							<div v-html="$g.dic.html('payType', scope.row.payWay)"></div>
						</template>
					</el-table-column>
					<el-table-column label="出库时间" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
						<template slot-scope="scope">
							{{ scope.row.stockDate }}
						</template>
					</el-table-column>
					<el-table-column prop="remarks" label="备注" width="180" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
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
			
		</div>
	</BasePage>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		components: {
			
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 210px)';
			}
		},
		data() {
			return {
				form: {
					date: [],
					key: '',
				},
				tableData: [],
			}
		},
		methods: {
			dateChange(val){
				this.list();
			},
			search(){
				this.list();
			},
			toDetail({row, $index}){
				this.$router.push({
					name: 'inventory-out-info',
					params: {
						id: row.id,
						item: row,
					},
					query: {
						name: 'yanxuan'
					}
				})
			},
			list(){
				this.$api.stock.outList({
					pageIndex: this.form.pageIndex,
					pageSize: this.form.pageSize,
					begin: this.form.date[0],
					end: this.form.date[1],
					key: this.form.key,
				}).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				});
			}
		},
		mounted() {
			this.list();	
		}
	}
</script>

<style lang="scss">
	.inventory-out{
		
	}
</style>