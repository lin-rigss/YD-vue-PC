<template>
	<BasePage>
		<div class="inventory-info">
			
			<div class="category" style="margin-top: 0;">入库单号</div>
			<div class="aside">{{ detail.billCode }}</div>
			
			<div class="category" style="margin-top: 0;">入库类型</div>
			<div class="aside">{{ $g.dic.exp('storage', detail.type).name }}</div>
			
			<div class="category">入库明细</div>
			<el-table :data="detailList" border style="width: 100%;" :row-class-name="rowClass">
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="brandName" label="品牌" :align="config.align"></el-table-column>
				<el-table-column prop="goodsName" label="分类" :align="config.align"></el-table-column>
				<el-table-column prop="repositoryNames" label="仓位" :align="config.align"></el-table-column>
				<el-table-column prop="model" label="型号" :align="config.align"></el-table-column>
				<el-table-column prop="num" label="数量" :align="config.align"></el-table-column>
				<el-table-column prop="price" label="单价" :align="config.align"></el-table-column>
				<el-table-column prop="sourceName" label="来源" :align="config.align"></el-table-column>
			</el-table>
			
			<div class="category">备注</div>
			<div class="aside">{{ detail.remarks }}</div>
			
			<div class="category">应收金额</div>
			<div>
				<span class="money">
					{{ money }}
				</span>
				元
			</div>
			
			<div class="category">支付状态</div>
			<div class="aside">{{ $g.dic.exp('payStatus', detail.payStatus).name }}</div>
			
			<div class="category">支付方式</div>
			<div class="aside">{{ $g.dic.exp('payType', detail.payWay).name }}</div>
			
			<div class="category">实收金额</div>
			<div>
				<span class="money">
					{{ detail.amountPaid }}
				</span>
				元
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
				detail: {},
				detailList: [],
			}
		},
		computed: {
			money() {
				if(!this.detailList.length){
					return 0;
				}
				return this.detailList.map(item => item.num * item.price).reduce((a, b) => a + b) || 0;
			}
		},
		methods: {
			rowClass({row, rowIndex}){
				return row._error ? 'row-error' : '';
			},
			showUnit(unit){
				let dt = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${dt.cname}(${dt.ename})`
			},
		},
		mounted(){
			let { item, id } = this.$route.params;
			if(!item){
				this.$router.push({
					name: 'inventory-put',
				})
				return ;
			}
			
			this.detail = item;
			
			this.$api.stock.putDetail(id).then(res => {
				this.detailList = res.data;
			});
		}
	}
</script>

<style lang="scss">
	.inventory-info{
		
		.category {
			padding: 0 20px;
			margin: 20px 0 10px 0;
			border-left: 3px solid coral;
		}
		
		.money{
			font-size: 40px;
			color: var(--red);
		}
		
		.aside{
			// display: inline-block;
			font-weight: bold;
			font-style: oblique;
		}
	}
</style>
