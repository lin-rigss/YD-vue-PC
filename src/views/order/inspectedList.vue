
<template>
	<BasePage>
		<div class="order-list">
			
			<div class="aside">
				<el-row :gutter="20">
					<el-col :span="8">
						<span class="label">订单编号</span>
						<span class="info">
							<el-input :size="searchSize" v-model="formSea.id"></el-input>
						</span>
					</el-col>
					<el-col :span="8">
						<span class="label">车型/品牌</span>
						<span class="info">
							<el-input :size="searchSize" v-model="formSea.brandName"></el-input>
						</span>
					</el-col>
					<el-col :span="8">
						<div style="text-align: right; margin-right: 10px;">
							<el-button :size="searchSize" type="primary" @click="list(1)">搜索</el-button>
						</div>
					</el-col>
				</el-row>
				<transition name="el-fade-in-linear">
					<el-row :gutter="20">
						<el-col :span="16">
							<span class="label">下单时间</span>
							<span class="info">
								<el-date-picker
									style="width: 100%;"
									v-model="formSea.intervalTime"
									:size="searchSize"
									type="daterange"
									value-format="yyyy-MM-dd"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:picker-options="$g.options.daterange">
								</el-date-picker>
							</span>
						</el-col>
						<el-col :span="8">
							<div style="text-align: right; margin-right: 10px;">
								<el-button :size="searchSize" type="primary" @click="reset()">重置</el-button>
							</div>
						</el-col>
					</el-row>
				</transition>
				
				<!-- <div class="handler" @click="showMore = !showMore">
					<i v-if="showMore" class="el-icon-upload2"></i>
					<i v-else class="el-icon-download"></i>
				</div> -->
			</div>

			<el-table :data="tableData" style="width: 100%" :size="config.size" border 
			 :row-class-name="tableRowClassName"  :height="tableHeight"
				@cell-mouse-enter="mouseEnter" @cell-mouse-leave="mouseLeave"
			>
				<el-table-column fixed="left" width="50" :align="config.align" type="index" label="序号">
        		</el-table-column>
				<el-table-column prop="brandName" label="车型/品牌" min-width="200" :align="config.align" ></el-table-column>
				<el-table-column prop="vin" label="车架号" min-width="120" :align="config.align" ></el-table-column>
				<el-table-column prop="id" label="订单编号" min-width="120" :align="config.align" ></el-table-column>
				<el-table-column prop="dismantlingPlantName" label="拆解厂名称" min-width="200" :align="config.align"  :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="quoterName" label="报价员" min-width="100" :align="config.align" ></el-table-column>
				<el-table-column prop="status" label="订单状态" width="100" :align="config.align" >
					<template slot-scope="scope">
						{{scope.row.status | statusOrder}}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="下单时间" width="160" :align="config.align" ></el-table-column>
				<el-table-column label="订单操作" min-width="80" fixed="right" :align="config.align" >
					<template slot-scope="scope">
						<el-button v-if="scope.row.status != '8'" type="text" @click="toDetail(scope.row)">订单详情</el-button>
						<el-button v-if="scope.row.status == '8'" type="text" @click="toInventory(scope.row)">入库</el-button>
						<!-- <el-button type="text" @click="quoterOperationalRecord(scope.row)">关闭订单</el-button> -->
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
			OrderTitle: () => import('./component/OrderTitle')
		},
		extends: BaseTable,
		data() {
			return {
				
				params: {},
				//绑定数据
				formSea: {
					pageIndex: 1,
					pageSize: 10,
					id: '',
					status: '',
					partStatus: '3',
					brandName: '',
					intervalTime: [],
					pageIndex: 0,
				},
				//查询
				form: {
					pageIndex: 1,
					pageSize: 10,
					id: '',
					status: '',
					partStatus: '3',
					brandName: '',
					intervalTime: []
				},
				searchSize: 'mini',
				// showMore: false,
				columns: 9,
				tableData: [],
				curRow: null,
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 260px)';
			},
			tableRepeatData(){
				let arr = [];
				this.tableData.forEach(item => {
					arr.push(item);
					arr.push(item);
				})
				return arr;
			}
		},
		filters: {
			statusOrder(value){
				if(value == 0){
					return '未提交'
				}else if(value == 1){
					return '待报价'
				}else if(value == 2){
					return '报价中'
				}else if(value == 3){
					return '已报价'
				}else if(value == 4){
					return '待验货'
				}else if(value == 5){
					return '已验货'
				}else if(value == 6){
					return '已完成'
				}else if(value == 7){
					return '已拒绝'
				}else if(value == 8){
					return '已发货'
				}
			}
		},
		methods: {
			tableRowClassName({row, rowIndex}){
				if(this.curRow == row){
					return 'row-class';
				}
			},
			mouseEnter(row, column, cell, event){
				this.curRow = this.tableData.find(info => info == row);
			},
			mouseLeave(row, column, cell, event){
				this.curRow = null;
			},
			//详情
			toDetail(row){
				this.$router.push({
					name: 'order-orderInfo',
					params: {
						id: row.id,
					},
					query: {
						partStatus: this.formSea.partStatus
					}
				})
			},
			//去入库
			toInventory(row) {
				this.$router.push({
					name: 'inventory-create',
					query: {
						orderRow: row.id
					}
				})
			},
			//关闭订单
			//开始接单结束接单
			quoterOperationalRecord(typeQuo){
				return
				this.$api.order.quoterOperationalRecord({type: typeQuo}).then(res => 
				{	
					if(res.code === 0){
						this.waitSecond = 60
						this.countdown()
						!!res.data?this.list.history = res.data:this.list.history = {};
					}
				})
			},
			changeStatus(btn){
				this.formSea.status = btn.value;
				this.list(1)
			},
			reset(){
				this.formSea = {
					pageIndex: 1,
					pageSize: 10,
					id :'',
					status: '',
					partStatus: '3',
					brandName: '',
					intervalTime: []
				}
				this.list(1)
			},
			list(listParam){
				let time = this.formSea.intervalTime
				if( time&& time.length>0){
					this.formSea.intervalTime = time.join(',')
				}
				if (listParam === 1) {
					// 查询时把页面绑定数据赋值给查询
					this.form = Object.assign({}, this.formSea)
				}
				this.$api.order.getList(this.form).then(res => {
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
	.order-list{
		// padding-top: 60px;
		
		.row-class{
			background-color: #ECF5FF;
		}
		
		.aside{
			// z-index: 10;
			// position: absolute;
			// top: 10px;
			// left: 10px;
			// right: 10px;
			// min-height: 48px;
			
			.label{
				display: inline-block;
				width: 80px;
				text-align: right;
				color: #606266;
				font-weight: bold;
				font-size: 14px;
				margin-right: 10px;
			}
			
			.info{
				display: inline-block;
				width: calc(100% - 100px);
			}
			
			.handler{
				cursor: pointer;
				color: #96a1a7;
				border-radius: 2px;
				width: 48px;
				text-align: center;
				line-height: 12px;
				position: absolute;
				left: calc(50% - 10px);
				bottom: -8px;
				margin-left: -1px;
				background-color: #DDE0E5;
				font-size: 14px;
			}
		}
			
		.order-status-tab{
			position: relative;
			margin-bottom: 10px;
			
			.tips{
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>
