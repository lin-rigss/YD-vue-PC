<template>
	<!-- 配件列表 -->
	<BasePage>
		<div class="parts-list"> 
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column min-width="120" label="一级分类编号" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ scope.row.code }}
					</template>
				</el-table-column>
				<el-table-column label="一级分类名称" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toDefault(scope.row)">{{ scope.row.nameZn }}</el-button>
					</template>
				</el-table-column>
				<el-table-column label="单位" min-width="60" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ showUnit(scope.row.unit) }}
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="120" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toEdit(scope)">编辑</el-button>
						<span class="line">|</span>
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
					新增一级分类
				</el-button>
			</div>
			
			<el-dialog v-if="dialog.show" :title="dialog.title" :visible="dialog.show" append-to-body @close="() => {
				dialog.show = false;
				dialog.title = '';
				dialog.info = {};
				dialog.index = '';
			}">
				<el-form :model="dialog.info" ref="form" :rules="$g.rules.parts">
					<el-form-item prop="nameZn" label="一级分类名称:" :label-width="dialog.width">
						<el-input v-model="dialog.info.nameZn" placeholder="请输入一级分类名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item prop="unit" label="单位：" :label-width="dialog.width">
						<el-select v-model="dialog.info.unit" placeholder="请选择单位" style="width: 100%;">
							<el-option v-for="(item, index) in $g.dic.unit" :key="index" :label="`${item.cname} ( ${item.ename} )`" :value="item.value">
								<span style="float: left">{{ item.cname }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.ename }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialog.show = false">取 消</el-button>
					<el-button type="primary" @click="toUpdate">确 定</el-button>
				</div>
			</el-dialog>
			
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
				total: 0,
				dialog: {
					width: '160px',
					show: false,
					title: '',
					index: '',
					info: {
						
					},
				}
			}
		},
		methods: {
			showUnit(unit){
				let row = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${row.cname} ( ${row.ename} )`
			},
			changeStatus(row, status, method){
				this.$api.parts[method](row.id).then(res => {
					row.status = status;
				})
			},
			toCreate(){
				this.dialog.title = `新增一级分类`;
				this.dialog.info = {};
				this.dialog.index = '';
				this.dialog.show = true;
				
			},
			toEdit({row, $index}){
				this.dialog.title = `更改一级分类【${row.nameZn}】`;
				this.dialog.info = Object.assign({}, row);
				this.dialog.index = $index;
				this.dialog.show = true;
			},
			toDefault(row){
				this.$router.push({
					name: 'unifiedParts-list',
					params: {
						id: row.id,
					},
					query: {
						name:row.nameZn
					}
				})
			},
			changeStatus(btn){
				this.form.status = btn.value;
				this.list()
			},
			toDelete(row){
				this.$confirm(`此操作将永久删除【${row.nameZn}】, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.parts.generalCargoDel(row.id).then(res => {
						this.$message.success('删除成功');
						this.list();
					})
				}).catch(() => {
				          
				});
			},
			toUpdate(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						let params = {
							id: this.dialog.info.id,
							nameZn: this.dialog.info.nameZn,
							unit: this.dialog.info.unit,
						}
						this.$api.parts.generalCargoSave(params).then(res => {
							if(res.code == 0){
								if(this.dialog.index != ''){
									this.$message.success('修改成功');
									this.$set(this.tableData, this.dialog.index, res.data);
								}else{
									this.$message.success('保存成功');
									this.list();
								}
							}
							this.dialog.show = false;
						})
					} else {
						return false;
					}
				});
			},
			list(){
				this.$api.parts.generalCargoList(this.form).then(res => {
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
