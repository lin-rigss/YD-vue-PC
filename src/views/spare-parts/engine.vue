<template>
	<!-- 配件列表 -->
	<BasePage>
		<div class="parts-list">
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column min-width="120" label="油质种类" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ scope.row.oilyType }}
					</template>
				</el-table-column>
				<el-table-column prop="textureType" label="材质种类" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>				
				<el-table-column prop="brand" label="品牌" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="model" label="型号" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="atOrMt" label="AT/MT" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column label="操作" min-width="120" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toEdit(scope)">编辑</el-button>
						<span class="line">|</span>
						<el-button type="text" style="color: var(--red);" @click="toDelete(scope.row)">删除</el-button>
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
					新增发动机
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
				dialog: {
					width: '160px',
					show: false,
					title: '',
					index: '',
					info: {
						status: '1',
					},
				}
			}
		},
		methods: {
			changeStatus(row, status, method){
				this.$api.parts[method](row.id).then(res => {
					row.status = status;
				})
			},
			toCreate(){
				this.$router.push({
					name: 'engine-create',
				})
			},
			toEdit({row, $index}){
				this.$router.push({
					name: 'engine-detail',
					params: {
						id: row.id,
					}
				})
			},
			toDelete(row){
				this.$confirm(`此操作将永久删除当前行数据, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.parts.engineFactoryDel(row.id).then(res => {
						this.$message.success('删除成功');
						this.list();
					})
				}).catch(() => {
				          
				});
			},
			list(){
				this.$api.parts.engineFactoryList(this.form).then(res => {
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
	.parts-list{
		.line{
			display: inline-block;
			width: 10px;
			margin-left: 2px;
			text-align: center;
			color: #CCC;
		}
		
		.create{
			position: absolute;
			bottom: 15px;
			left: 10px;
		}
	}
</style>
