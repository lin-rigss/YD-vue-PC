<template>
	<div class="buy-info" v-if="show">
		<el-dialog title="订购编码" :visible="true" width="50%" :before-close="handleClose" top="5vh">
			<span slot="footer" class="dialog-footer">
				<div class="show-count">总数量: {{ count * 1000 }}</div>
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="submit">提 交</el-button>
			</span>
			
			<el-form label-position="left" class="table-expand" :model="info" ref="form" :rules="$g.rules.coding">
				<el-form-item label="收货地址" prop="address">
					<el-input v-model="info.address" placeholder="请输入收货地址"></el-input>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="applyUserName">
					<el-input v-model="info.applyUserName" placeholder="请输入联系人姓名"></el-input>
				</el-form-item>
				<el-form-item label="联系人手机" prop="applyCell">
					<el-input v-model="info.applyCell" placeholder="请输入联系人手机"></el-input>
				</el-form-item>
				<el-form-item label="是否开票">
					<el-radio-group v-model="info.invoiceFlag">
						<el-radio v-for="(item, index) in $g.dic.yesno" :key="index" :label="item.value">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="开票类型" v-if="info.invoiceFlag == 1">
					<el-radio-group v-model="info.invoiceType">
						<el-radio v-for="(item, index) in $g.dic.invoiceType" :key="index" :label="item.value">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="订购明细">
					<el-table :data="tableData" style="width: 100%" size="mini" border :span-method="arraySpanMethod">
						<el-table-column label="类型" :align="config.align">
							<template slot-scope="scope">{{ scope.row.name }}</template>
						</el-table-column>
						<el-table-column label="颜色" :align="config.align">
							<template slot-scope="scope">
								<el-tag size="small" :type="scope.row.color">{{ scope.row.colorName }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="数量(个)" :align="config.align">
							<template slot-scope="scope">
								<el-input v-model.number="scope.row.num" size="mini" @change="e => inputNum(e, scope.row)">
									<template slot="append"> x 1000</template>
								</el-input>
							</template>
						</el-table-column>
						<div slot="append" style="padding: 10px 20px; padding-bottom: 20px;">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="单价" prop="price">
										<el-input v-model.number="info.price" placeholder="请输入单价"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="总价" prop="totalAmount">
										<el-input v-model.number="info.totalAmount" @change="v => {
											v = v - 0;
											(isNaN(v) || v < 0) && (v = 0);
											info.totalAmount = v;
										}" placeholder="请输入总价"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-table>
				</el-form-item>
				<el-form-item>
					<span style="font-size: 12px; color: #AAA;">订购数量必须大于1000, 严选和统货颜色不能重复</span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: ['show'],
		data() {
			return {
				info: {},
				tableData: [],
				config: {
					align: 'center'
				}
			}
		},
		computed: {
			count() {
				return this.tableData.map(a => a.num).reduce((a, b) => (a - 0) + (b - 0));
			}
		},
		methods: {
			createNew(){
				this.info = {
					address: '',
					applyCell: '',
					// applyUserId: '',
					applyUserName: '',
					invoiceFlag: 0,
					invoiceType: 1,
					price: 0,
					totalAmount: 0,
					// detailList: [],
				};
				this.tableData = [
					{name: '严选', abbr: 'G', colorName: '绿色', color: 'success', num: 0},
					// {name: '严选', abbr: 'Y', colorName: '黄色', color: 'warning', num: 0},
					// {name: '统货', abbr: 'G', colorName: '绿色', color: 'success', num: 0},
					{name: '统货', abbr: 'W', colorName: '白色', color: 'info', num: 0},
				]
			},
			handleClose() {
				this.$emit('close');
				this.createNew();
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }){
				// if(columnIndex == 0){
				// 	if (rowIndex % 2 === 0) {
				// 		return [2, 1];
				// 	}
				// 	return [0, 0];
				// }
			},
			inputNum(val, row){
				val = val - 0;
				if(isNaN(val) || val < 0){
					val = 0;
				}
				row.num = val;
			},
			submit(){
				this.$refs.form.validate(v => {
					if(v){
						this.update();
					}else{
						return false;
					}
				});
			},
			update(){
				if(this.count == 0){
					this.$message.error("订购数量有误");
					return ;
				}
				
				this.$api.coding.purchase({
					...this.info,
					detailList: this.tableData.map(item => ({
						type: item.name == '严选' ? 1 : 2,
						color: item.abbr,
						number: item.num
					}))
				}).then(res => {
					this.$emit("refresh");
					this.handleClose();
				});
				
			}
		},
		mounted() {
			this.createNew();
		}
	}
</script>

<style lang="scss">
	.buy-info {
		.el-dialog__body{
			max-height: calc(90vh - 124px);
			overflow: auto;
		}
		.el-form-item__content{
			line-height: 20px;
		}
		.show-count{
			float: left;
			color: red;
			font-size: 24px;
		}
		.el-radio-group{
			height: 40px;
			line-height: 50px;
			vertical-align: middle;
			width: 100%;
		}
	}
</style>
