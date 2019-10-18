<template>
	<BasePage>
		<div class="inventory-list">
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border :row-class-name="rowClass">
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot="header" slot-scope="scope">
						<svg-icon icon-class="handler"></svg-icon>
					</template>
					<template slot-scope="scope">
						<div style="cursor: pointer;" @click="expand(scope)">
							<i v-if="scope.row._expand === true" class="el-icon-arrow-down"></i>
							<i v-else-if="scope.row._expand === false" class="el-icon-arrow-right"></i>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="编号" width="120" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.code }}
					</template>
				</el-table-column>
				<el-table-column label="名称" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.name }}
					</template>
				</el-table-column>
				<el-table-column label="库存数量" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.number }}
						<span v-if="scope.row.unit">
							{{ showUnit(scope.row.unit) }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="库存总额" :align="config.align">
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
				form: {
					pageSize: 10000,
				},
				tableData: [],
			}
		},
		methods: {
			showUnit(unit){
				let row = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${row.cname} ( ${row.ename} )`
			},
			rowClass({row, rowIndex}){
				return row._parts ? 'row-parts' : row._hidden ? 'row-spare dis-none' : 'row-spare'
			},
			expand({row, $index}){
				row._expand = !row._expand;
				
				if(row._expand && !row._loading){
					this.$api.stock.partsList(row.code).then(res => {
						this.tableData.splice($index + 1, 0, ...res.data.map(item => ({
							...item,
							_hidden: false,
							parentData: row
						})));
						row._loading = true;
					})
					return ;
				}
				
				this.tableData.filter(item => item.goodsTypeId === row.id).forEach(item => item._hidden = !row._expand)
			},
			toDetail({ row }){
				let parts = this.deep(row);//row.goodsTypeId ? [row.goodsTypeId, row.id] : [row.id];
				this.$router.push({
					name: 'inventory-list-goods',
					params: { parts }
				})
			},
			deep(row){
				let dt = row, parts = [];
				do{
					parts.push({
						id: dt.id,
						name: dt.name
					});
					dt = dt.parentData;
				}while(dt);
				
				parts.reverse();
				return parts;
			}
		},
		mounted() {
			this.$api.stock.partsList().then(res => this.tableData = res.data.map(item => ({
				...item, 
				_expand: false, 
				_loading: false,
				_parts: true,
			})));
		}
	}
</script>

<style lang="scss">
	.inventory-list{
		.row-parts{
			color: var(--blue);
		}
		.row-spare{
			font-size: 12px;
			color: var(--orange);
		}
		.dis-none{
			display: none;
		}
	}
</style>
