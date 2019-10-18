<template>
	<BasePage>
		<div class="user-list">
			
			<div class="aside" ref="aside">
				<el-button type="primary" :size="size" @click="toCreate">添加员工</el-button>
				
				<div class="right">
					<el-select :size="size" v-model="form.group">
						<el-option label="管理员" value="1"></el-option>
						<el-option label="报价员" value="2"></el-option>
						<el-option label="审核员" value="3"></el-option>
					</el-select>
					
					<el-input :size="size" placeholder="请搜索">
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
				</div>
			</div>
			
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="account" label="员工账号" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="mobile" label="手机号码" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="extendProperty.name" width="120" label="员工姓名" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column label="部门角色" width="150" :align="config.align">
					<template slot-scope="scope">
						<el-tag v-for="(role, index) in scope.row.extendProperty.departmentName" :key="index" size="mini" type="warning">{{ role }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="extendProperty.email" label="邮箱" min-width="220" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="createTime" label="添加时间" width="170" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column label="状态" width="80" :filters="statusFilters" :filter-method="statusFilterHandler"
					:align="config.align" :show-overflow-tooltip="config.hidden"
				>
					<template slot-scope="scope">
						<StatusLabel type="status" :value="scope.row.status"></StatusLabel>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toEdit(scope.row)">详情</el-button>
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
			
			
		</div>
	</BasePage>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		components: {
			
		},
		extends: BaseTable,
		data() {
			return {
				size: 'small',
				asideHeight: '',
				form: {
					group: '1',
				},
				tableData: [],
				dept: [],
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100% - 100px)';
			},
		},
		methods: {
			toCreate(){
				this.$router.push({
					name: 'employee-create',
				})
			},
			toEdit(row){
				this.$router.push({
					name: 'employee-detail',
					params: {
						id: row.id,
					}
				})
			},
			toDelete(row){
				this.$confirm(`此操作将永久删除用户【${row.extendProperty.comName}】, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.employee.del(row.id).then(res => {
						this.$message.success('删除成功');
						this.list();
					})
				}).catch(() => {
				          
				});
			},
			list(){
				this.$api.employee.getList(this.form).then(empRes => {
					this.tableData = empRes.data;
					this.total = empRes.pageInfo.total;
				})
			},
			resetSearchHeight(){
				setTimeout(() => {
					this.asideHeight = window.getComputedStyle(this.$refs.aside).height;
				}, 100);
			}
		},
		mounted() {
			this.resetSearchHeight();
			this.list();
		}
	}
</script>

<style lang="scss">
	.user-list{
		.aside{
			.right{
				position: absolute;
				right: 20px;
				top: 8px;
				
				.el-input{
					width: unset;
				}
			}
		}
	}
</style>