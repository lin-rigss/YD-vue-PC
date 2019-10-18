<template>
	<div class="inventory-report">
		<el-row :gutter="10">
			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div slot="header" class="clearfix">
						<span><svg-icon icon-class="inventory-create" /> 入库Top 10</span>
						
						<el-input-number v-model="inLevel" @change="changeLevel('in')" :min="1" :max="5" size="mini" style="float: right; margin-top: -3px; margin-left: 10px;"></el-input-number>
						<el-breadcrumb separator="/" style="float: right;">
							<el-breadcrumb-item v-for="(t, index) in types" :key="index">
								<span v-if="t.model == inType.model" style="padding: 3px 0; height: 22px; line-height: 22px;">{{ t.name }}</span>
								<el-button v-else style="padding: 3px 0" type="text" @click="changeType(t, 'in')">{{ t.name }}</el-button>
							</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
					<el-table :data="inTableData" style="width: 100%">
						<el-table-column width="60" align="center">
							<template slot-scope="scope">
								<div style="color: var(--red); font-weight: bold;">No.{{ scope.$index + 1 }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="name" :label="inType.name" show-overflow-tooltip></el-table-column>
						<el-table-column label="数量" width="80" align="right">
							<template slot-scope="scope">
								{{ scope.row.number }} 
								<span class="tips">件</span>
							</template>
						</el-table-column>
						<el-table-column label="金额" align="right" width="120">
							<template slot-scope="scope">
								{{ $g.util.formatNumber(scope.row.amount) }} 
								<span class="tips">元</span>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>

			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div slot="header" class="clearfix">
						<span><svg-icon icon-class="inventory-outbound" /> 出库Top 10</span>
						
						<el-input-number v-model="outLevel" @change="changeLevel('out')" :min="1" :max="5" size="mini" style="float: right; margin-top: -3px; margin-left: 10px;"></el-input-number>
						<el-breadcrumb separator="/" style="float: right;">
							<el-breadcrumb-item v-for="(t, index) in types" :key="index">
								<span v-if="t.model == outType.model" style="padding: 3px 0; height: 22px; line-height: 22px;">{{ t.name }}</span>
								<el-button v-else style="padding: 3px 0" type="text" @click="changeType(t, 'out')">{{ t.name }}</el-button>
							</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
					<el-table :data="outTableData" style="width: 100%">
						<el-table-column width="60" align="center">
							<template slot-scope="scope">
								<div style="color: var(--red); font-weight: bold;">No.{{ scope.$index + 1 }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="name" :label="outType.name" show-overflow-tooltip></el-table-column>
						<el-table-column label="数量" width="80" align="right">
							<template slot-scope="scope">
								{{ scope.row.number }} 
								<span class="tips">件</span>
							</template>
						</el-table-column>
						<el-table-column label="金额" align="right" width="120">
							<template slot-scope="scope">
								{{ $g.util.formatNumber(scope.row.amount) }} 
								<span class="tips">元</span>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>

			<!-- <el-col :span="12" v-for="(o, index) in 2" :key="o" style="margin-top: 10px;">
				<el-card :body-style="{ padding: '0px' }">
					<img preview src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
					 class="image">
					<div style="padding: 14px;">
						<span>好吃的汉堡</span>
						<div class="bottom clearfix">
							<time class="time">currentDate</time>
							<el-button type="text" class="button">操作按钮</el-button>
						</div>
					</div>
				</el-card>
			</el-col> -->

		</el-row>

	</div>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				inLevel: 1,
				outLevel: 1,
				inType: { name: '品牌', model: 'brand_name' },
				outType: { name: '品牌', model: 'brand_name' },
				types: [{
						name: '品牌',
						model: 'brand_name',
						prop: 'name',
					},
					{
						name: '分类',
						model: 'goods_name'
					},
					{
						name: '大仓',
						model: 'repository'
					},
				],
				inTableData: [],
				outTableData: [],
			}
		},
		methods: {
			changeType(row, type){
				this[type + 'Type'] = row;
				this[type + 'Report']();
			},
			changeLevel(type){
				this[type + 'Report']();
			},
			inReport(loading = true){
				this.$api.stock.inReport(this.inType.model, this.inLevel, loading).then(res => {
					this.inTableData = res.data;
				});
			},
			outReport(loading = true){
				this.$api.stock.outReport(this.outType.model, this.outLevel, loading).then(res => {
					this.outTableData = res.data;
				});
			}
		},
		mounted() {
			this.$previewRefresh();
			
			this.inReport(false);
			this.outReport(false);
		}
	}
</script>

<style lang="scss">
	.inventory-report {
		height: 100%;
		overflow: auto;
		padding: 20px;
		
		.el-table__header-wrapper{
			display: none;
		}
		
		.el-input-number--mini{
			width: 90px;
		}

		.bottom {
			margin-top: 13px;
			line-height: 12px;
		}

		.button {
			padding: 0;
			float: right;
		}

		.image {
			width: 100%;
			display: block;
		}

		.clearfix:before,
		.clearfix:after {
			display: table;
			content: "";
		}

		.clearfix:after {
			clear: both
		}
		
		.tips{
			font-size: 12px;
			margin-left: 5px;
			color: var(--grey);
		}
	}
</style>
