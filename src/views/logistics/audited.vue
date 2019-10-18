<template>
	<BasePage>
		<div class="factory-list">

			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="dismantlingPlantName" label="拆解厂名称" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="creater" label="品质" min-width="100" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<span v-html="$g.dic.exp('quality', scope.row.quality).name"></span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" min-width="100" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<span v-html="$g.dic.exp('logisStatus', scope.row.status).name"></span>
					</template>
				</el-table-column>
				<el-table-column prop="weight" label="重量" min-width="100" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
			    <el-table-column label="操作" width="100" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toDetail(scope.row,'xiang')">详情</el-button>
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
					name: 'audited-detail',
					params: {
						id: row.id
					},
					query: {
						name: name
					}
				})
			},
			list(){
				this.$api.clue.orderList(this.form).then(res => {
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
