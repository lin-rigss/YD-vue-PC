<template>
	<BasePage>
		<div class="inventory-list">
			
			<div class="aside">
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="title-div" v-if="params.brand && params.brand.length">
							品牌： {{ params.brand.map(a => a.name).join('/') }}
						</div>
						<el-cascader
							v-else
							v-model="form.brand"
							filterable
							clearable
							style="width: 100%;"
							:options="brandOptions"
							@active-item-change="handleItemChange"
							@change="brandChange"
							:props="{
								label: 'name',
								value: 'id',
								children: 'children'
							}"
							placeholder="请选择品牌"
						></el-cascader>
					</el-col>
					<el-col :span="8">
						<div class="title-div" v-if="params.parts && params.parts.length">
							分类： {{ params.parts.map(a => a.name).join('/') }}
						</div>
						<!-- @active-item-change="handlePartsChange" -->
						<el-cascader
							v-else
							v-model="form.parts"
							filterable
							clearable
							style="width: 100%;"
							:options="partsOptions"
							@change="partsChange"
							:props="{
								label: 'nameZn',
								value: 'id',
								children: 'children'
							}"
							placeholder="请选择分类"
						></el-cascader>
					</el-col>
					<el-col :span="8">
						<el-cascader
							v-model="form.repository"
							filterable
							clearable
							style="width: 100%;"
							change-on-select
							:options="repositoryOptions"
							@change="repositoryChange"
							:props="{
								label: 'name',
								value: 'id',
								children: 'children'
							}"
							placeholder="请选择仓位"
						></el-cascader>
					</el-col>
				</el-row>
				<div class="search">
					
				</div>
			</div>
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="brandName" min-width="180" label="品牌" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<!-- <el-table-column prop="series" width="80" label="车系" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<!-- <el-table-column prop="model" width="180" label="车型" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<el-table-column prop="name" label="零件分类" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<!-- <el-table-column prop="spare" label="零件" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<el-table-column prop="model" label="零件型号" width="120" :align="config.align"></el-table-column>
				<el-table-column prop="num" label="数量" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="amount" label="价格" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<!-- <el-table-column prop="repositoryNames" label="仓位" width="120" :align="config.align"></el-table-column> -->
				<!-- <el-table-column prop="spare" label="来源" width="120" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="createTime" label="入库时间" width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="createTime" label="入库类型" width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column> -->
				<el-table-column label="操作" width="80" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="toInentDetail(scope.row.goodsId)">详情</el-button>
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
		data() {
			return {
				params: {},
				form: {
					brand: [],
					parts: [],
					repository: [],
				},
				total: 0,
				tableData: [],
				brandOptions: [],
				partsOptions: [],
				repositoryOptions: [],
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 210px)';
			}
		},
		methods: {
			//详情
			toInentDetail(goodsId){
				// this.$router.push({
				// 	name: 'inventory-listInfo',
				// 	params: {
				// 		goodsId: goodsId,
				// 	},
				// })
				this.$router.push({
					name: 'inventory-listInfo',
					params: {
						id: goodsId
					}
				})
			},
			handleItemChange(ids){
				let dt = { children: this.brandOptions };
				ids.forEach(key => {
					dt = dt.children.find(item => item.id === key);
				})
				if(dt.children.length){
					return ;
				}
				
				let id = ids[ids.length - 1];
				this.loadBrandList(id).then(res => {
					let result = res.data;
					if(ids.length > 1){
						result = result.map(item => {
							delete item.children;
							return item;
						})
					}
					dt.children = result;
				});
			},
			handlePartsChange(ids){
				let id = ids[ids.length - 1];
				let dt = this.partsOptions.find(item => item.id === id);
				if(dt.children.length){
					return ;
				}
				
				this.$api.spare.getList({
					pageSize: 10000,
					goodsTypeId: ids[0]
				}, false).then(res => {
					dt.children = res.data;
				})
			},
			brandChange(val){
				this.loadDetailList();
			},
			partsChange(val){
				this.loadDetailList();
			},
			repositoryChange(val){
				this.loadDetailList();
			},
			loadBrandList(id){
				return this.$api.brand.list(id, false);
			},
			loadDetailList(){
				this.$api.stock.detailList({
					pageIndex: this.form.pageIndex,
					pageSize: this.form.pageSize,
					brandCode: this.form.brand.join('/'),
					goodsCode: this.form.parts.join('/'),
					repositoryCode: this.form.repository.join('/'),
				}).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				});
			}
		},
		mounted() {
			this.params = this.$route.params;
			this.form.brand = (this.params.brand || []).map(item => item.id);
			this.form.parts = (this.params.parts || []).map(item => item.id);
			
			Promise.all([
				this.loadBrandList(), 
				this.$api.parts.getpartsList({}, false),
				this.$api.warehouse.tree({}, false),
			]).then(([brandRes, partsRes, repositoryRes]) => {
				this.brandOptions = brandRes.data;
				this.partsOptions = partsRes.data;//.map(item => ({...item, children: []}));
				this.$g.util.delEmptyChildren(repositoryRes.data);
				this.repositoryOptions = repositoryRes.data;
				return true;
			}).then(() => {
				this.loadDetailList();
			});
		}
	}
</script>

<style lang="scss">
	.inventory-list{
		.title-div{
			height: 40px;
			line-height: 40px;
		}
	}
</style>
