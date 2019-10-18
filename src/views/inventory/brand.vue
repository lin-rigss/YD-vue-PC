<template>
	<BasePage>
		<div class="inventory-list">
			
			<el-table 
				:data="tableData" 
				style="width: 100%" 
				:size="config.size" 
				:height="tableHeight" 
				border 
				:row-class-name="rowClass"
				lazy
				:load="load"
				row-key="code"
				:tree-props="{children: '_children', hasChildren: 'hasChildren'}"
			>
				<el-table-column width="80" fixed="left" :align="config.align">
					<template slot="header" slot-scope="scope">
						<svg-icon icon-class="handler"></svg-icon>
					</template>
					<template slot-scope="scope"></template>
				</el-table-column>
				<el-table-column label="编号" width="120" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.code }}
					</template>
				</el-table-column>
				<el-table-column label="类型" width="60" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row._brand ? '品牌' : scope.row._series ? '车系' : '车型' }}
					</template>
				</el-table-column>
				<el-table-column label="名称" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.name }}
					</template>
				</el-table-column>
				<el-table-column label="库存数量" width="100" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.number }}
						<span v-if="scope.row.unit">
							{{ showUnit(scope.row.unit) }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="库存总额" width="100" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.amount }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<span style="cursor: pointer;" @click="toDetail(scope)">详情</span>
					</template>
				</el-table-column>
			</el-table>
			
			
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
				return 'calc(100vh - 105px)';
			}
		},
		data() {
			return {
				tableData: [],
			}
		},
		methods: {
			showUnit(unit){
				let row = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${row.cname} ( ${row.ename} )`
			},
			rowClass({row, rowIndex}){
				return row._brand ? 'row-brand' : row._series ? 'row-series' : 'row-model'
			},
			load(tree, treeNode, resolve) {
				let brand = this.deep(tree);
				this.$api.stock.brandList(brand.map(a => a.id).join('/')).then(res => {
					resolve(res.data.map(item => {
						if(tree._brand){
							return {
								...item, 
								_series: true,
								hasChildren: true, 
								parentData: tree
							}
						}
						if(tree._series){
							return {
								...item, 
								_model: true,
								hasChildren: false, 
								parentData: tree
							}
						}
						return item;
					}));
				});
			},
			toDetail({ row }){
				let brand = this.deep(row);
				
				this.$router.push({
					name: 'inventory-list-goods',
					params: { brand }
				})
			},
			deep(row){
				let dt = row, brand = [];
				do{
					brand.push({
						id: dt.id,
						name: dt.name
					});
					dt = dt.parentData;
				}while(dt);
				
				brand.reverse();
				return brand;
			}
		},
		mounted() {
			this.$api.stock.brandList().then(res => {
				this.tableData = res.data.map(item => ({
					...item, 
					_brand: true,
					hasChildren: true, 
				}))
			});
		}
	}
</script>

<style lang="scss">
	.inventory-list{
		.row-brand{
			color: var(--blue);
		}
		.row-series{
			color: var(--orange);
		}
		.row-model{
			font-size: 12px;
			color: var(--grey);
		}
	}
</style>
