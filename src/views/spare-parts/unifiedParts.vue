<template>
	<!-- 配件列表 -->
	<BasePage>
		<div class="parts-list">
			<el-row>
				<el-col :span="11">
					<div class="order-status-tab">
						{{uniTitle}}——精拆
					</div> 
					<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border :key="1">
						<el-table-column label="序号" width="50" fixed="left" :align="config.align">
							<template slot-scope="scope">{{ scope.$index + 1 }}</template>
						</el-table-column>
						<el-table-column min-width="140" label="拆解产生产品编号" :align="config.align" :show-overflow-tooltip="config.hidden">
							<template slot-scope="scope">
								{{ scope.row.code }}
							</template>
						</el-table-column>
						<el-table-column min-width="140" label="拆解产生产品名称" :align="config.align" :show-overflow-tooltip="config.hidden">
							<template slot-scope="scope">
								{{ scope.row.nameZn }} 
							</template>
						</el-table-column>
						<el-table-column label="单位" min-width="60" :align="config.align" :show-overflow-tooltip="config.hidden">
							<template slot-scope="scope">
								{{ showUnit(scope.row.unit) }}
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="110" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
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
					<div class="">
						<el-button size="mini" type="primary" @click="toCreate('jingchai')">
							<svg-icon icon-class="create"></svg-icon>
							新增精拆产品
						</el-button>
					</div>
				</el-col>
				<el-col :offset="2" :span="11">
					<div class="order-status-tab">
						{{uniTitle}}——拆废
					</div> 
					<el-table :data="tableDataS" style="width: 100%" :size="config.size" :height="tableHeight" border :key="2">
						<el-table-column label="序号" width="50" fixed="left" :align="config.align">
							<template slot-scope="scope">{{ scope.$index + 1 }}</template>
						</el-table-column>
						<el-table-column min-width="140" label="拆解产生产品编号" :align="config.align" :show-overflow-tooltip="config.hidden">
							<template slot-scope="scope">
								{{ scope.row.code }}
							</template>
						</el-table-column>
						<el-table-column min-width="140" label="拆解产生产品名称" :align="config.align" :show-overflow-tooltip="config.hidden">
							<template slot-scope="scope">
								{{ scope.row.nameZn }} 
							</template>
						</el-table-column>
						<el-table-column label="单位" min-width="60" :align="config.align" :show-overflow-tooltip="config.hidden">
							<template slot-scope="scope">
								{{ showUnit(scope.row.unit) }}
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="110" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
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
						@size-change="sizeChangeS"
						@current-change="currentChangeS"
						:current-page="formS.pageIndex"
						:page-sizes="sizes"
						:page-size="formS.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="totalS">
						</el-pagination>
					</div>
					<div class="">
						<el-button size="mini" type="primary" @click="toCreate('chaifei')">
							<svg-icon icon-class="create"></svg-icon>
							新增拆废产品
						</el-button>
					</div>
				</el-col>
			</el-row>
			
			
			
			
			<el-dialog v-if="dialog.show" :title="dialog.title" :visible="dialog.show" append-to-body @close="() => {
				dialog.show = false;
				dialog.title = '';
				dialog.info = {parentId: '',type: ''};
				dialog.index = '';
			}">
				<el-form :model="dialog.info" ref="form" :rules="$g.rules.parts">
					<el-form-item prop="nameZn" label="产品名称：" :label-width="dialog.width">
						<el-input v-model="dialog.info.nameZn" placeholder="请输入产品名称" autocomplete="off"></el-input>
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
					parentId: '',
				},
				sizes:[10, 20, 30],
				formS: {
					pageIndex: 1,
					pageSize: 10,
					parentId: '',
				},
				tableData: [],
				tableDataS: [],
				total: 0,
				totalS: 0,
				uniTitle: '',
				dialog: {
					width: '160px',
					show: false,
					title: '',
					index: '',
					info: {
						parentId: '',
						type: ''
					},
				}
			}
		},
		methods: {
			showUnit(unit){
				let row = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${row.cname} ( ${row.ename} )`
			},
			toCreate(type){
				this.dialog.info = {};
				this.dialog.info.parentId = this.$route.params.id;
				if(type == 'jingchai'){
					this.dialog.title = `新增【精拆】拆解产生产品`;
					this.dialog.info.type = 'jingchai';
				}else if(type == 'chaifei'){
					this.dialog.title = `新增【拆废】拆解产生产品`;
					this.dialog.info.type = 'chaifei';
				}
				this.dialog.index = '';
				this.dialog.show = true;
			},
			toEdit({row, $index}){
				this.dialog.title = `更改拆解产生产品【${row.nameZn}】`;
				this.dialog.show = true;
				this.dialog.info = Object.assign({}, row);
				this.dialog.index = $index;
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
				console.log(this.dialog.info.type)
				// return
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$api.parts.generalCargoSave(this.dialog.info).then(res => {
							// debugger
							if(this.dialog.index != ''){
								this.$set(this.tableData, this.dialog.index, res.data);
							}else{
								if(this.dialog.info.type == 'jingchai'){
									this.list();
								}else{
									this.listS()
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
				this.form.type="jingchai"
				this.$api.parts.generalCargoList(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				})
			},
			listS(){
				this.formS.type="chaifei"
				this.$api.parts.generalCargoList(this.formS).then(res => {
					this.tableDataS = res.data;
					this.totalS = res.pageInfo.total;
				})
			},
			sizeChangeS(){
				this.listS();
			},
			currentChangeS(currPage){
				this.formS.pageIndex = currPage;
				this.listS();
			}
		},
		mounted(){
			// 记录路由跳转参数
			
			this.form.parentId = this.$route.params.id;
			this.formS.parentId = this.$route.params.id;
			this.uniTitle = this.$route.query.name;
			this.list();
			this.listS()
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
		
		// .create{
		// 	position: absolute;
		// 	bottom: 15px;
		// 	left: 10px;
		// }
		.order-status-tab{
			position: relative;
			margin-bottom: 10px;
			
		}
	}
</style>
