<template>
	<BasePage>
		<div class="inventory-info">
			
			<!-- <div class="blockquote tip" style="margin-top: 0;">
				<p>kkk</p>
			</div> -->
			
			<div class="category" style="margin-top: 0;">入库类型</div>
			<!-- <el-select v-model="form.storageType" style="width: 100%;">
				<el-option v-for="(opt, index) in $g.dic.storage" :key="index" :value="opt.value" :label="opt.name"></el-option>
			</el-select> -->
			<el-radio-group v-model="form.type">
				<el-radio v-for="(k, i) in $g.dic.storage" :key="i" :label="k.value">{{ k.name }}</el-radio>
			</el-radio-group>
			
			<div class="category">入库明细</div>
			<el-table :data="tableData" border style="width: 100%;" :row-class-name="rowClass">
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column min-width="180" label="分类 / 适应车型 / 制造商" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<!-- @active-item-change="handlePartsChange" -->
						<el-cascader 
							v-if="!scope.row.disabled"
							v-model="scope.row.goodsIds"
							filterable
							style="width: 100%;"
							:options="partsOptions"
							
							@change="val => change(val, 'goods', res => {
								scope.row.goodsCodes = res.map(item => item.code);
								scope.row.goodsNames = res.map(item => item.nameZn);
								scope.row.unit = res[res.length - 1].unit;
							})"
							:props="{
								label: 'nameZn',
								value: 'id',
								children: 'children'
							}"
							placeholder="请选择分类"
						></el-cascader>
						<el-input placeholder="请选择分类" v-if="scope.row.disabled" disabled v-model="scope.row.goodsNameShow"></el-input>
						<div style="height: 5px;"></div>
						<!--  -->
						<el-cascader 
							v-if="!scope.row.disabled"
							v-model="scope.row.brandIds"
							filterable
							clearable
							ref="brandcas"
							style="width: 100%;"
							:options="brandOptions"
							@active-item-change="handleItemChange"
							@change="val => change(val, 'brand', res => {

								scope.row.brandNames = res.map(item => item.map(a => a.name));
								scope.row.brandCodes = res.map(item => item.map(a => a.id));
							})"
							:props="{
								label: 'name',
								value: 'id',
								children: 'children',
								multiple: true
							}"
							placeholder="请选择适应车型">
							
						</el-cascader>
						<el-input placeholder="请选择适应车型" v-if="scope.row.disabled" disabled v-model="scope.row.brandNameShow"></el-input>
						<div style="height: 5px;"></div>
						<el-input v-model="scope.row.manufacturer" placeholder="请输入制造商"></el-input>
					</template>
				</el-table-column>
				<el-table-column width="260" label="型号 / 数量 / 单价" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-input v-model="scope.row.model" placeholder="请输入零件型号"></el-input>
						<div style="height: 5px;"></div>
						<el-input v-model="scope.row.num" :disabled="scope.row.disabled == true?true:false" type="number" :min="0" placeholder="请输入数量">
							<template slot="append">{{ showUnit(scope.row.unit) }}</template>
						</el-input>
						<div style="height: 5px;"></div>
						<el-input v-model="scope.row.price" :disabled="scope.row.disabled == true?true:false" type="number" :min="0" placeholder="请输入价格">
							<template slot="append">元</template>
						</el-input>
					</template>
				</el-table-column>
				<el-table-column width="260" label="仓位 / 来源 / 编码" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-cascader collapse-tags
							v-if="!scope.row.disabled"
							v-model="scope.row.repositoryIds"
							filterable
							style="width: 100%;"
							:options="warehouseOptions"
							@change="val => change(val, 'repository', res => {
								scope.row.repositoryNames = res.map(item => item.name);
							})"
							:props="{
								label: 'name',
								value: 'id',
								children: 'children'
							}"
							placeholder="请选择仓位"
						></el-cascader>
						<el-input v-if="scope.row.disabled" disabled v-model="scope.row.repositoryNameShow"></el-input>
						<div style="height: 5px;"></div>
						<el-select v-if="!scope.row.disabled" v-model="scope.row.source" clearable style="width: 100%;" placeholder="请选择零件来源" @change="val => change([val], 'factory', res => {
							scope.row.sourceName = res[res.length - 1].extendProperty.comName;
						})">
							<el-option v-for="(opt, index) in factoryOptions" :key="index" :value="opt.id" :label="opt.extendProperty.comName"></el-option>
						</el-select>
						<el-input v-if="scope.row.disabled" disabled v-model="scope.row.sourceName"></el-input>
						<div style="height: 5px;"></div>
						<el-input v-model="scope.row.coding" :disabled="scope.row.disabled == true?true:false" placeholder="请输入编码"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<span style="font-size: 20px; cursor: pointer; color: var(--orange);" @click="delDetail(scope.$index)">
							<i class="el-icon-delete-solid"></i>
						</span>
					</template>
				</el-table-column>
				
				<template slot="append">
					<div style="padding: 10px;">
						<el-button size="mini" type="primary" @click="addDetail">
							<svg-icon icon-class="create"></svg-icon>
							新增明细
						</el-button>
					</div>
				</template>
			</el-table>
			
			<div class="category">备注</div>
			<el-input v-model="form.remarks" type="textarea" placeholder="请输入备注"></el-input>
			
			<div class="category">应付金额</div>
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
			
			<div class="category">实付金额</div>
			<div>
				<el-input v-model="form.amountPaid" type="number" placeholder="请输入实付金额">
					<template slot="append">元</template>
				</el-input>
			</div>
			
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
				form: {
					orderId: '',
					type: '1',
					payWay: '1',
					payStatus: '1',
					remarks: '',
					amountPayable: 0, //应付金额
					amountPaid: 0,	  //实付金额
					buyerId: '',      //买家
					buyerName: ''
				},
				tableData: [],
				brandOptions: [],
				partsOptions: [],
				warehouseOptions: [],
				factoryOptions: [],
				purchaseOptions: [],
				partsItems: [],
				
			}
		},
		computed: {
			money() {
				if(!this.tableData.length){
					return 0;
				}
				return this.tableData.map(item => item.num * item.price).reduce((a, b) => a + b) || 0;
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
			addDetail(){
				this.tableData.push({
					//品牌
					brandIds: [],
					brandCodes: [], 
					brandNames: [],
					//分类
					goodsIds: [],
					goodsCodes: [], 
					goodsNames: [],
					unit: '2',//个
					//仓位
					repositoryIds: [],
					repositoryNames: [],
					//型号
					model: '',
					//数量
					num: 0,
					//价格
					price: 0,
					//来源
					source: '',
					sourceName: '',
					//编码
					coding: 0,
					//制造商
					manufacturer: '',
					
					//保留属性, 如果出现错误 是否高亮提示
					_error: false,
				})
			},
			delDetail(index){
				this.tableData.splice(index, 1);
			},
			submit(){
				this.form.orderId = this.tableDataNew.id;
				console.log(this.tableData)
				console.log(this.form)
				// return
				//需要校验一下提交数据
				let msgArray = this.tableData.map(item => {
					if(!item.brandIds.length || !item.brandIds){
						return '请选择适应车型';
					}
					if(!item.goodsIds.length || !item.goodsIds){
						return '请选择分类';
					}
					if(!item.repositoryIds.length){
						return '请选择仓位';
					}
					if(!item.num){
						return '数量不能为0';
					}
					if(!item.model){
						return '零件型号不能为0';
					}
					if(!item.manufacturer){
						return '制造商不能为0';
					}
					if(!item.coding){
						return '编码不能为0';
					}
					// if(!item.price){
					// 	return '单价不能为0';
					// }
					if(!item.source){
						return '请选择来源';
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
				if(this.form.amountPaid < 0){
					this.showError('实付金额不能小于0');
					return;
				}
				
				this.form.amountPayable = this.money;
				this.save();
			},
			save(){
				this.$api.stock.save({
					...this.form,
					goodsList: this.tableData,
				}).then(res => {
					// this.$router.push({
					// 	name: 'inventory-list'
					// })
					this.$router.push({
						name: 'inventory-put-info',
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
			handleItemChange(ids){
				// debugger
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
				
				// let id = ids[ids.length - 1];
				// let dt = this.partsOptions.find(item => item.id === id);
				// if(dt && dt.children && dt.children.length){
				// 	return ;
				// }
				let dt = { children: this.partsOptions };
				ids.forEach(key => {
					dt = dt.children.find(item => item.id === key);
				})
				if(dt.children.length){
					return ;
				}
				let id = ids[ids.length - 1];
				this.$api.parts.getSecondList(id).then(res => {
					let result = res.data;
					if(ids.length > 0){
						result = result.map(item => {
							delete item.children;
							return item;
						})
					}
					dt.children = result;
					
					// dt.children = res.data;
					// debugger
				})
			},
			loadBrandList(id){
				return this.$api.brand.list(id, false);
			},
			change(val, type, callback){
				// debugger
				let arr = [], 
					children = 'children', 
					id = 'id';
					
				if(type === 'brand'){
					arr = this.brandOptions;
					
					let objs = val.map(v => {
						return this.id2name(arr, v, id, children);
					});
				
					callback && callback(objs);
					return;
				}else 
				if(type === 'goods'){
					arr = this.partsOptions;
				}else 
				if(type === 'repository'){
					arr = this.warehouseOptions;
				}else
				if(type === 'factory'){
					arr = this.factoryOptions;
				}else
				if(type === 'purchase'){
					arr = this.purchaseOptions;
				}
				
				// let dt = {}, objs = [];
				// dt[children] = arr;
				
				// val.forEach(key => {
				// 	dt = dt[children].find(item => item[id] === key);
				// 	objs.push(Object.assign({}, dt));
				// })
				// console.log(objs)
				// callback && callback(objs);

				let objs = this.id2name(arr, val, id, children);
				callback && callback(objs);
			},
			id2name(arr, val, id, children){
				
				let dt = {}, objs = [];
				dt[children] = arr;
				
				val.forEach(key => {
					dt = dt[children].find(item => item[id] === key);
					objs.push(Object.assign({}, dt));
				})

				return objs;
				// callback && callback(objs);
			},
			toArr(str){
				// debugger
				var arr = str.split(',');
				var arr2 = [];
				arr.forEach(item => {
					arr2.push(item.split('/'))
				})
				return arr2
			},
			toArrNum(str){
				// debugger
				var arr = str.split(',');
				var arr2 = [];
				arr.forEach(item => {
					arr2.push(item.split('/').map(Number))
				})
				return arr2
			},
			//全部零件列表
			allshpre(){
				let thistables = this.tableDataNew;
				let thisparts = this.tableDataNew.partsList;
				this.tableData = []
				thisparts.forEach((value,index) =>{
					let obj={
							partId: value.pid,
							//车型
							brandIds: [thistables.brandId],
							brandCodes: [thistables.brandId],
							brandNames: [thistables.brandName.split(',')],
							brandNameShow: thistables.brandName,
							//零件
							goodsIds: value.partsDetaId!=''?(value.partsFrameId+'/'+value.partsCategoryId+'/'+value.partsDetaId).split('/'):(value.partsFrameId+'/'+value.partsCategoryId).split('/'),
							goodsCodes: value.partsDetaCode!=''?(value.partsFrameCode+'/'+value.partsCategoryCode+'/'+value.partsDetaCode).split('/'):(value.partsFrameCode+'/'+value.partsCategoryCode).split('/'),
							goodsNames: value.partsDetaValue!=''?(value.partsFrameValue+'/'+value.partsCategoryValue+'/'+value.partsDetaValue).split('/'):(value.partsFrameValue+'/'+value.partsCategoryValue).split('/'),
							goodsNameShow: value.partsDetaValue!=''?(value.partsFrameValue+'/'+value.partsCategoryValue+'/'+value.partsDetaValue).split('/'):(value.partsFrameValue+'/'+value.partsCategoryValue).split('/'),
						    unit: value.unit,

							repositoryIds: [value.storeId],
							repositoryNames: [value.storeName],
							repositoryNameShow: value.storeName,

							price: value.offer,
							num: value.quantity,
							coding: value.qrCode,
							model: '',

							source: thistables.dismantlingPlantId,
							sourceName:thistables.dismantlingPlantName,
							disabled:true,

						
						}
					
					this.tableData.push(obj);
				});
				console.log(this.tableData)
			},
            // 获取已发货零件详情   状态=5
			list(){
                this.$api.order.warehousingDetail({id: this.orderRow}).then(res => 
                {   
					this.tableDataNew = res.data
					this.allshpre()
                });
			}
		},
		mounted(){
			
			
			this.loadBrandList().then(res => this.brandOptions = res.data);
			this.$api.parts.getpartsList({}, false).then(res => {
				this.$g.util.delEmptyChildren(res.data);
				this.partsOptions = res.data
				});

				// this.partsItems = JSON.parse(JSON.stringify(res.data))
			this.$api.warehouse.tree().then(res => {
				//删除最后一级的children   
				this.$g.util.delEmptyChildren(res.data);
				
				this.warehouseOptions = res.data;
			})
			this.$api.factory.getList().then(res => {
				this.factoryOptions = res.data;
			})

			this.$api.purchase.getList().then(res => {
				this.purchaseOptions = res.data;
			})
			
			this.addDetail();
			this.orderRow = this.$route.query.orderRow
			if(this.orderRow){
				this.list()
			}
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
		
		.handler{
			text-align: right;
			margin-top: 30px;
			margin-bottom: 20px;
		}
		
		.row-error{
			
		}
	}
</style>
