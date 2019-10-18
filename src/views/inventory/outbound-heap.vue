<template>
	<BasePage>
		<div class="inventory-outbound">
			
			<div class="category" style="margin-top: 0;">出库类型</div>
			<el-radio-group v-model="form.type">
				<el-radio v-for="(k, i) in $g.dic.outbound" :key="i" :label="k.value">{{ k.name }}</el-radio>
			</el-radio-group>
			
			<div class="category">出库明细</div>
			<el-autocomplete 
				style="width: 100%; margin-bottom: 10px;" placeholder="请搜索后添加" 
				:fetch-suggestions="querySearchAsync"
				v-model="search" 
				@select="searchSelect"
			>
				
				<el-button slot="append" icon="el-icon-search"></el-button>
				<div slot-scope="scope">
					{{ scope.item.value }}
				</div>
			</el-autocomplete>
			<el-table :data="tableData" border style="width: 100%;" :row-class-name="rowClass">
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column min-width="180" label="分类 / 仓位" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<!-- <div><span>品牌：</span> <b>{{ scope.row.brandName }}</b> </div> -->
						<div><span>分类：</span> <b>{{ scope.row.goodsName }}</b> </div>
						<div><span>仓位：</span> <b>{{ scope.row.repositoryName }}</b> </div>
					</template>
				</el-table-column>
				<el-table-column width="260" label="库存数量 / 库存重量" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<div><span>价格：</span> <b>{{ scope.row.unitPrice }}</b> </div>
						<div><span>数量：</span> <b>{{ scope.row.num }}</b> </div>
						<div><span>重量：</span> <b>{{ scope.row.weight }}</b> </div>
						<!-- <div><span>单价：</span> <b>{{ scope.row.price }}</b> </div> -->
					</template>
				</el-table-column>
				<el-table-column width="260" label="出库价格 / 出库数量/重量" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<div>
							<el-input type="number" style="width: 100%;" placeholder="请选择出库价格" :min='0' v-model="scope.row.outprice">
								<template slot="prepend">单价</template>
								<template slot="append">元</template>
							</el-input>
						</div>
						<div style="margin-top: 5px;">
							<el-input v-if="scope.row.num != 0" type="number" style="width: 100%;" :min='0' placeholder="请选择出库数量" v-model="scope.row.outnum" @change="val => {
								scope.row.outnum = val > scope.row.num ? scope.row.num : val;
							}">
								<template slot="prepend">数量</template>
							</el-input>
						</div>
						<div style="margin-top: 5px;">
							<el-input v-if="scope.row.weight != 0" type="number" style="width: 100%;" :min='0' placeholder="请选择出库数量" v-model="scope.row.outweight" @change="val => {
								scope.row.outweight = val-0 > scope.row.weight ? scope.row.weight : val;
							}">
								<template slot="prepend">重量</template>
								<template slot="append">kg</template>
							</el-input>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<span style="font-size: 20px; cursor: pointer; color: var(--orange);" @click="delDetail(scope.$index)">
							<i class="el-icon-delete-solid"></i>
						</span>
					</template>
				</el-table-column>
			</el-table>
			
			<div class="category">备注</div>
			<el-input v-model="form.remarks" type="textarea" placeholder="请输入备注"></el-input>
			
			<div class="category">出库金额</div>
			<div>
				<span class="money">
					{{ money }}
				</span>
				元
			</div>
			
			<div class="category">支付方式</div>
			<el-radio-group v-model="form.payWay">
				<el-radio v-for="(k, i) in $g.dic.payType" 
							:key="i" 
							@change="k.value == '5'?form.payStatus = '5':form.payStatus = '1'"
							:label="k.value">{{ k.name }}</el-radio>
			</el-radio-group>

			<el-select 
				style="width:40%;margin-left:15px;"
				v-if="form.payWay == '5'"
				v-model="form.buyerId" 
				clearable 
				placeholder="请选择买家" 
				@change="val => change([val], 'purchase', res => {
				form.buyerName = res[res.length - 1].extendProperty.comName;})">
				<el-option v-for="(opt, index) in purchaseOptions" :key="index" :value="opt.id" :label="opt.extendProperty.comName"></el-option>
			</el-select>
			
			<div class="category">支付状态</div>
			<el-radio-group v-if="form.payWay == '5'" v-model="form.payStatus">
				<el-radio key="5" label="5">未支付</el-radio>
			</el-radio-group>
			<el-radio-group v-if="form.payWay != '5'" v-model="form.payStatus">
				<el-radio v-for="(k, i) in $g.dic.payStatus" :key="i" :label="k.value">{{ k.name }}</el-radio>
			</el-radio-group>
			
			<div class="handler">
				<el-button type="primary" @click="submit">提交</el-button>
				<el-button @click="cancel">取消</el-button>
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
				search: '',
				
				form: {
					type: '1',
					payWay: '1',
					payStatus: '1',
					remarks: '',
					amountPayable: 0, //应收金额
					amountPaid: 0,	  //实收金额
					buyerId: '',      //买家
					buyerName: ''
				},
				tableData: [],
				purchaseOptions:[]
			}
		},
		computed: {
			money() {
				if(!this.tableData.length){
					return 0;
				}
				return this.tableData.map(item => item.outnum?item.outnum:item.outweight * item.outprice).reduce((a, b) => a + b) || 0;
			}
		},
		methods: {
			querySearchAsync(queryString, cb){
				this.$api.stock.outHeapSearch(queryString, false).then(res => {
					cb(res.data.map(item => {
						return {
							...item,
							value: [item.goodsName, item.repositoryName, item.num?item.num:item.weight+'kg'].join(' , ')
						}
					}))
				});
			},
			searchSelect(row){
				if(!this.tableData.some(a => a.id === row.id)){
					let item = {
						...row,
						outnum: row.num || 0,
						outprice: row.price || 0,
					}
					this.tableData.push(item);
				}
				this.search = '';
			},
			rowClass({row, rowIndex}){
				return row._error ? 'row-error' : '';
			},
			delDetail(index){
				this.tableData.splice(index, 1);
			},
			change(val, type, callback){
				let arr = [], 
					children = 'children', 
					id = 'id';
				
				if(type === 'purchase'){
					arr = this.purchaseOptions;
				}
				
				let dt = {}, objs = [];
				dt[children] = arr;
				
				val.forEach(key => {
					dt = dt[children].find(item => item[id] === key);
					objs.push(Object.assign({}, dt));
				})
				
				callback && callback(objs);
			},
			submit(){
				console.log(this.tableData)
				console.log(this.form)
				//需要校验一下提交数据
				let msgArray = this.tableData.map(item => {
					if(!item.outprice || item.outprice <= 0){
						return '请输入单价';
					}
					if((!item.outnum || item.outnum <= 0) && (!item.outweight || item.outweight <= 0)){
						return '请填写';
					}
					
					return null;
				});
				
				let index = msgArray.findIndex(str => !!str);
				if(index != -1){
					this.showError(`第${index + 1}行: ${msgArray[index]}`);
					return ;
				}
				
				if(!this.form.remarks){
					this.showError('备注不能为空');
					return ;
				}

				if(this.form.payWay == 5 && this.form.buyerId == ''){
					this.showError('买家不能为空');
					return ;
				}
				
				this.form.amountPayable = this.money;
				
				this.save();
			},
			save(){
				this.$api.stock.outHeapSave({
					...this.form,
					goodsList: this.tableData.map(item => ({...item, num: item.outnum, unitPrice: item.outprice, weight: item.outweight}))
				}).then(res => {
					this.$router.push({
						name: 'inventory-outHeap',
						params: {
							id: res.data.id,
							item: res.data,
						}
					})
				});
			},
			showError(msg){
				this.$message.error(msg);
			},
			cancel(){
				this.$router.go(-1);
			},
		},
		mounted(){
			this.$api.purchase.getList().then(res => {
				this.purchaseOptions = res.data;
			})
		}
	}
</script>

<style lang="scss">
	.inventory-outbound{
		
		.category {
			padding: 0 20px;
			margin: 20px 0 10px 0;
			border-left: 3px solid coral;
		}
		
		.money{
			font-size: 40px;
			color: var(--red);
		}
		
		.handler{
			text-align: right;
			margin-top: 30px;
			margin-bottom: 20px;
		}
		
		.row-error{
			
		}
		
		b{
			color: var(--orange);
		}
	}
</style>
