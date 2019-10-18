<template>
	<BasePage>
		<div class="coding-buy">
			
			<div class="aside">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-input placeholder="请输入订购编号" v-model="form.orderId" :size="size" clearable>
							<template slot="prepend">编号</template>
						</el-input>
					</el-col>
					<el-col :span="6">
						<div class="el-input el-input--small el-input-group el-input-group--prepend">
							<div class="el-input-group__prepend">状态</div>
							<el-select :size="size" v-model="form.status" style="width: 100%;">
								<el-option label="全部" value=""></el-option>
								<el-option v-for="(item, index) in $g.dic.codingBuyStatus" :key="index" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="el-input el-input--small el-input-group el-input-group--prepend">
							<div class="el-input-group__prepend">是否开票</div>
							<el-select :size="size" v-model="form.invoiceFlag" style="width: 100%;" clearable>
								<el-option v-for="(item, index) in $g.dic.yesno" :key="index" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="6">
						<el-row :gutter="10">
							<el-col :span="8">
								<el-button :size="size" type="primary" style="width: 100%;" @click="list">提交</el-button>
							</el-col>
							<el-col :span="16">
								<el-button :size="size" type="primary" style="width: 100%;" @click="create">
									<svg-icon icon-class="create"></svg-icon>
									订购编码
								</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</div>
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border @expand-change="expandChange">
				<el-table-column type="expand"  fixed="left">
					<template slot-scope="scope">
						<el-form label-position="left" inline class="table-expand">
							<el-form-item label="订购详情">
								<!-- <div v-for="(item, index) in scope.row.details" :key="index">
									{{ item.type == 1 ? '严选' : '统货' }}
									{{ $g.dic.exp('colors', item.color).name }}
									<b>{{ item.number }}</b>
									件
								</div> -->
								<span v-html="scope.row.detailList.join('<br/>')"></span>
							</el-form-item>
							<el-form-item label="单价">
								<span>{{ scope.row.price }}</span>
							</el-form-item>
							<el-form-item label="总价">
								<span>{{ scope.row.totalAmount }}</span>
							</el-form-item>
							<el-form-item label="是否开票">
								<span>{{ $g.dic.exp('invoice', scope.row.invoiceFlag).name }}</span>
							</el-form-item>
							<el-form-item label="发票类型" v-if="scope.row.invoiceFlag == 1">
								<span>{{ $g.dic.exp('invoiceType', scope.row.invoiceType).name }}</span>
							</el-form-item>
							<el-form-item label="取消原因" v-if="scope.row.cancleReason">
								<span>{{ scope.row.cancleReason }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="orderNo" width="120" label="订单编号" :align="config.align"></el-table-column>
				<el-table-column width="120" label="申请人" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.applyUserName }} <br/>
						{{ scope.row.applyCell }}
					</template>
				</el-table-column>
				<el-table-column prop="address" min-width="150" label="收件地址" :align="config.align"></el-table-column>
				<el-table-column min-width="150" label="申请个数" :align="config.align">
					<template slot-scope="scope">
						<!-- <span v-html="bindCount(scope.row)"></span> -->
						<span v-html="scope.row.detailList.join('<br/>')"></span>
					</template>
				</el-table-column>
				<el-table-column width="120" label="状态" fixed="right" :align="config.align">
					<template slot-scope="scope">
						<span v-html="$g.dic.html('codingBuyStatus', scope.row.status)"></span>
					</template>
				</el-table-column>
				<el-table-column prop="orderTime" width="160" label="订购时间" :align="config.align"></el-table-column>
				<el-table-column label="操作" width="120" fixed="right" :align="config.align">
					<template slot-scope="scope">
						<span v-if="$g.dic.exp('codingBuyStatus', scope.row.status).name == '已订购'">
							<span><el-button type="text" :size="size" @click="making(scope.row)">制作</el-button></span>
							<span><el-button type="text" :size="size" @click="cancel(scope.row)">取消订购</el-button></span>
						</span>
						<span v-else-if="$g.dic.exp('codingBuyStatus', scope.row.status).name == '已取消'">
							<span style="font-size: 12px; color: #CCC;">
								<!-- 原因: {{ scope.row.cancleReason }} -->
								暂无操作
							</span>
						</span>
						<span v-else="">
							<el-button type="text" :size="size" @click="download(scope.row)">下载</el-button>
							<span v-if="$g.dic.exp('codingBuyStatus', scope.row.status).name == '制作中'">
								<el-button type="text" :size="size" @click="success(scope.row)">制作完成</el-button>
								<span><el-button type="text" :size="size" @click="cancel(scope.row)">取消制作</el-button></span>
							</span>
						</span>
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
			
			<BuyInfo :show="show" @close="show = false" @refresh="list"></BuyInfo>
			
		</div>
	</BasePage>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		components: {
			BuyInfo: () => import('./BuyInfo')
		},
		data() {
			return {
				params: {},
				form: {
					orderId: '',
					invoiceFlag: '',
					status: '',
				},
				tableData: [],
				size: 'small',
				show: false,
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 210px)';
			}
		},
		methods: {
			expandChange(row, expandRows){
				if(row.invoiceFlag != undefined){
					return ;
				}
				this.$api.coding.detail(row.id).then(res => {
					Object.assign(row, res.data, {detailList: row.detailList});
				});
			},
			create(){
				this.show = true;
			},
			cancel(row){
				this.$prompt('请输入取消原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /.+/,
					inputErrorMessage: '内容格式不正确'
				}).then(({ value }) => {
					
					this.$api.coding.cancel({
						id: row.id,
						cancleReason: value,
					}).then(res => {
						row.status = 4;
						this.$message.info('已取消, 取消原因: ' + value);
					});
				}).catch(() => { });
			},
			success(row){
				this.$confirm('是否确定制作完成', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.coding.complate(row.id).then(res => {
						row.status = 3;
						this.$message.success('制作成功');
					});
				}).catch(() => { });
			},
			making(row){
				this.$confirm('是否确定开始制作', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.coding.make(row.id).then(res => {
						row.status = 2;
						this.$message.success('开始制作');
					});
				}).catch(() => { });
			},
			download(row){
				this.$api.coding.download(row.id).then(res => {
					this.$message.success('提交成功, 正在下载...');
				});
			},
			list(){
				this.$api.coding.list(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				});
			}
		},
		mounted() {
			this.list();
		}
	}
</script>

<style lang="scss">
	.coding-buy{
		.title-div{
			height: 40px;
			line-height: 40px;
		}
		
		.aside{
			.el-input-group--append .el-select .el-input.is-focus .el-input__inner, .el-input-group--prepend .el-select .el-input.is-focus .el-input__inner{
				border-color: #409EFF;
			}
		}
		
		.table-expand {
			font-size: 0;
			label {
				width: 100px;
				color: #99a9bf;
			}
			.el-form-item {
				margin-right: 0;
				margin-bottom: 0;
				width: 100%;
			}
		}
		
		.el-dialog__body{
			padding: 10px 20px;
		}
	}
</style>
