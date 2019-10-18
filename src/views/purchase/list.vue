<template>
	<BasePage>
		<div class="purchase-list">

			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<!-- <el-table-column prop="account" label="登录账号" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<el-table-column prop="extendProperty.comName" label="买家姓名" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="extendProperty.comConcat" label="联系人" width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ scope.row.extendProperty.comConcat }} <br>
						{{ scope.row.extendProperty.comPhone }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="extendProperty.agent" label="开发负责人" width="130" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot="header" slot-scope="scope">
						负责人 <br>
						<span style="font-size: 12px;">( 开发者 / 业务员 )</span>
					</template>
					<template slot-scope="scope">
						{{ showEmployee(scope.row.extendProperty.agent) }} ( {{ showEmployee(scope.row.extendProperty.salesman) }} )
					</template>
				</el-table-column> -->
				<el-table-column prop="extendProperty.comAddress" label="买家地址" min-width="300" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column label="状态" width="80" :filters="statusFilters" :filter-method="statusFilterHandler"
					:align="config.align" :show-overflow-tooltip="config.hidden"
				>
					<template slot-scope="scope">
						<StatusLabel type="status" :value="scope.row.status"></StatusLabel>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="注册时间" width="160" sortable :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column label="操作" width="100" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toDetail(scope.row)">详情</el-button>
						<el-button type="text" @click="toDelete(scope.row)" style="color: var(--red);">删除</el-button>
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
			
			<div class="create">
				<el-button size="mini" type="primary" @click="toCreate">
					<svg-icon icon-class="create"></svg-icon>
					新建买家
				</el-button>
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
			toDetail(row){
				this.$router.push({
					name: 'purchase-detail',
					params: {
						id: row.id
					}
				})
			},
			toDelete(row){
				this.$confirm(`此操作将永久删除买家【${row.extendProperty.comName}】, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.purchase.del(row.id).then(res => {
						this.$message.success('删除成功');
						this.list();
					})
				}).catch(() => {
				          
				});
			},
			toCreate(){
				this.$router.push({
					name: 'purchase-create',
				})
			},
			list(){
				this.$api.purchase.getList(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				})
			}
		},
		mounted(){
			this.$api.employee.employees().then(res => {
				this.employees = res.data;
				this.list();
			});
		}
	}
</script>

<style lang="scss">
	.purchase-list{
		.create{
			position: absolute;
			bottom: 15px;
			left: 10px;
		}
	}
</style>
