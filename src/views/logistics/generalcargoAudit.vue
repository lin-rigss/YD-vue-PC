<template>
	<BasePage>
		<div class="factory-list">

			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="clueContacts" label="线索联系人" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="clueContactsPhone" label="线索联系人电话" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="creater" label="创建人" min-width="100" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="dismantlingPlantName" label="拆解厂名称" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="100" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<span v-html="$g.dic.exp('clueStatus', scope.row.status).name"></span>
					</template>
				</el-table-column>
				<el-table-column prop="weight" label="重量(kg)" min-width="100" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
			    <el-table-column label="操作" min-width="120" fixed="right" :align="config.align" >
					<template slot-scope="scope">
						<el-button type="text" @click="toDetail(scope.row,'xiang')">详情</el-button>
						<span v-if="scope.row.status == 0" class="line">|</span>
						<el-button v-if="scope.row.status == 0" type="text" @click="toDetail(scope.row,'shen')">审核</el-button>
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
					name: 'audit-detail',
					params: {
						id: row.id
					},
					query: {
						name: name
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
				this.$api.clue.getList(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				})
			}
		},
		mounted(){
			this.list()
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
