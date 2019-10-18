<template>
	<BasePage>
		<div class="factory-list">

			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="dismantlingPlantName" label="拆解厂名称" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toDetail(scope.row)">{{scope.row.dismantlingPlantName}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="contactName" label="联系人姓名" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="contactCall" label="联系人电话" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="loadAddr" label="装货地址" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="destination" label="目的地址" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="carNum" label="用车数量" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="100" :align="config.align">
					<template slot-scope="scope">
						<span v-html="$g.dic.exp('logisStatus', scope.row.status).name"></span>
					</template>
				</el-table-column>
				<el-table-column prop="carType" label="货车类型" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="carTonnage" label="吨位" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="carLength" label="长度" min-width="120" :align="config.align"></el-table-column>
				<el-table-column prop="carStartTime" label="用车开始时间" min-width="180" :align="config.align"></el-table-column>
				<el-table-column label="操作" width="100" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button v-if="scope.row.status != 3" type="text" @click="toReview(scope.row)">分配</el-button>
					</template>
				</el-table-column>
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
				form: {
					dismantlingPlantName: '',
					status: ''
				},
				tableData: [],
				employees: [],
			}
		},
		methods: {
			showEmployee(id){
				let employee = this.employees.find(e => e.userCode === id) || {};
				return employee.name || '无';
			},
			toDetail(row,name){
				this.$router.push({
					name: 'logistics-detail',
					params: {
						id: row.id
					},
					query:  {
						orderId: row.orderId
					}
				})
			},
			toReview(row,name){
				this.$router.push({
					name: 'logistics-review',
					params: {
						id: row.id
					},
					query:  {
						orderId: row.orderId
					}
				})
			},
			toDelete(row){
				this.$confirm(`此操作将永久删除拆解厂【${row.extendProperty.comName}】, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.factory.del(row.id).then(res => {
						this.$message.success('删除成功');
						this.list();
					})
				}).catch(() => {
				          
				});
			},
			toCreate(){
				this.$router.push({
					name: 'factory-create',
				})
			},
			list(){
				this.$api.clue.logisticsList(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				})
			}
		},
		mounted(){
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
