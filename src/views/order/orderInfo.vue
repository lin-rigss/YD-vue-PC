<template>
	<BasePage>
		<div class="orderInfo-list">
            <div class="aside">
				<el-row>
                    <el-col :span="8">
                        <div>订单号：{{order.id}}</div>
                    </el-col>
					<el-col :span="10">
                        <div>拆解厂名称：{{order.dismantlingPlantName}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div>报价员：{{order.quoterName}}</div>
                    </el-col>
                </el-row>
				<el-row>
					<el-col :span="8">
                        <div>车型/品牌：{{order.brandName}}</div>
                    </el-col>
					<el-col :span="10">
                        <div>车架号：{{order.vin}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div>下单时间：{{order.createTime}}</div>
                    </el-col>
					
                </el-row>
			</div>

			<el-table v-if='partsHas' :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" type="index" width="50" fixed="left" :align="config.align"></el-table-column>
				<el-table-column prop="partsCategoryValue" label="零件类别" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{scope.row.partsFrameValue}} / {{scope.row.partsCategoryValue}}					
					</template>
				</el-table-column>
				<el-table-column prop="partsDetaValue" label="零件名称" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{scope.row.partsDetaValue?scope.row.partsDetaValue:scope.row.partsCategoryValue}}					
					</template>
				</el-table-column>
				<el-table-column prop="qrCode" label="编码" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="offer" label="报价(元)" width="80" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="quantity" label="数量" min-width="80" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="status" label="零件订单状态" min-width="120" :align="config.align" >
					<template slot-scope="scope">
						{{scope.row.status}}
					</template>
				</el-table-column>
				<el-table-column label="分享地址" width="210" :align="config.align" >
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="toshare(scope.row,1)">带报价</el-button>	
						<span class="line">|</span>	
						<el-button type="primary" size="mini" @click="toshare(scope.row,2)">不带报价</el-button>						
					</template>
				</el-table-column>
			</el-table>
			<el-table v-if="!partsHas" :data="partsData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" type="index" width="50" fixed="left" :align="config.align"></el-table-column>
				<el-table-column prop="partsCategoryValue" label="零件类别" min-width="200" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{scope.row.partsFrameValue}} / {{scope.row.partsCategoryValue}}					
					</template>
				</el-table-column>
				<el-table-column prop="partsDetaValue" label="零件名称" min-width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{scope.row.partsDetaValue?scope.row.partsDetaValue:scope.row.partsCategoryValue}}					
					</template>
				</el-table-column>
				<el-table-column prop="qrCode" label="编码" width="180" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="offer" label="报价(元)" width="80" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="quantity" label="数量" min-width="80" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="status" label="零件订单状态" min-width="120" :align="config.align" >
					<template slot-scope="scope">
						{{scope.row.status}}
					</template>
				</el-table-column>
				<el-table-column label="分享" width="110" :align="config.align" >
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="toshare(scope.row,1)">带报价</el-button>	
						<span class="line">|</span>	
						<el-button size="mini" type="primary" @click="toshare(scope.row,2)">不带报价</el-button>					
					</template>
				</el-table-column>
			</el-table>
			<!-- <div class="pagination">
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
			</div> -->

		</div>
	</BasePage>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import Clipboard from 'clipboard';

	export default {
		extends: BaseTable,
		computed: {
			tableHeight(){
				return 'calc(100vh - 260px)';
			}
		},
		data() {
			return {
				copyValue: '',
				form: {},
				info: {
					urls: [],
					spare: []
				},
				partsHas: true,
				partsData: [],
				parts: [],
				tableData: [],
				order: {
					id: '',
					brandName: '',
					vin: '',
					dismantlingPlantName: '',
					quoterName: '',
					createTime: ''
				}
			}
		},
		methods: {
			//分享
			toshare(row,type){
				this.$api.order.partsShare({partsOrderId: row.id,costPrice: row.offer,type:type}).then(res => 
                {   
					if(res.code == 0){
						var copyValue = 'http://192.168.0.114:8080/?id='+res.data;
						const input = document.createElement('input');
						document.body.appendChild(input);
						input.setAttribute('value', copyValue);
						input.select();
						if (document.execCommand('copy')) {
						document.execCommand('copy');
						}else{
						console.log("不支持复制");
						}
						document.body.removeChild(input);
						this.$message.success('复制成功');
					}
                });
			},
			loadSpare(index){
				let info = this.parts[index] || {};
				if(info.spare && info.spare.length){
					return ;
				}
				this.$api.spare.getList({
					pageIndex: 1,
					pageSize: 100000,
					goodsTypeId: info.id,
				}, false).then(res => {
					res.data.filter(a => a.status === '1').forEach(a => {
						info.spare.push(a);
					})
					console.log(this.parts)
					this.allshpre()
				});
			},
			partsList(){
				this.$api.parts.getList({
					pageIndex: 1,
					pageSize: 100000,
				}, false).then(res => {
					this.parts = res.data.map(part => {
						return {
							...part,
							spare: [],
						}
					}).filter(part => part.status === '1');
					this.loadSpare(0);
				});
			},
			//全部零件
			allshpre(){
				let thisParts = this.parts;
				let newArray = [];
				thisParts.forEach((value,index) =>{
					newArray[index] = value;
					newArray[index].spare = value.spare
				});
				let newArray2 = [];
				newArray.forEach(item =>{
					if(item.spare.length>0){
						newArray2.push(item);
					}
				});
				newArray2.forEach(item =>{
					item.spare.forEach(it =>{
						let obj={
							partsCategoryValue:item.nameZn,
							partsDetaValue:it.nameZn,
							offer:it.remarks,
							quantity:it.minOrder,
							status: it.status
						}
						this.partsData.push(obj);
					})
				});
			},
            // 获取订单零件详情
			list(){
				let routeStatus = this.orderstatus;
				let status = '';
				if(routeStatus == '' || routeStatus == '1'){ 
					status = ''
				}else if(routeStatus == '3'){//订单状态已报价
					status = '1'//零件状态
				}else if(routeStatus == '4'){//待验货
					status = '2'
				}
				
                this.$api.order.offerDetail({id: this.orderid,status: status?status:this.partstatus}).then(res => 
                {   
					this.order.id = res.data.id;
					this.order.brandName = res.data.brandName;
					this.order.vin = res.data.vin;
                    this.order.dismantlingPlantName = res.data.dismantlingPlantName;
                    this.order.quoterName = res.data.quoterName;
					this.order.createTime = res.data.createTime;
					this.tableData = res.data.partsList;
					// if(status == '1' || status == '2' || status == '3' || status == '6' || status == '7'){
					// 	this.partsHas = false
					// 	this.partsList()
					// }
                });
			}
		},
		mounted(){
			this.orderid = this.$route.params.id;
			this.orderstatus = this.$route.query.status;
			this.partstatus = this.$route.query.partStatus;
			this.list();
		}
	}
</script>

<style lang="scss">
	.factory-list{
		.line{
			display: inline-block;
			width: 10px;
			margin-left: 2px;
			text-align: center;
			color: #CCC;
		}
		.create{
			position: absolute;
			bottom: 15px;
			left: 10px;
		}
	}
</style>
