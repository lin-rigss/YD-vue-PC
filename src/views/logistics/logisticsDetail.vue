<!--待审核页面-->
<template>
	<BasePage>
		<div class="order-detail">
			<div class="order-content">
				<el-row class="rowmargin">
					<el-col :span="6">
						<span>拆解厂名称：{{info.dismantlingPlantName?info.dismantlingPlantName: '空'}}</span>
					</el-col>
					<el-col :span="6">
						<span>联系人：{{info.contactName?info.contactName: '空'}}</span>
					</el-col>
					<el-col :span="6">
						<span>联系电话：{{info.contactCall?info.contactCall: '空'}}</span>
					</el-col>
					<el-col :span="6">
						<span>用车时间：{{info.carStartTime?info.carStartTime: '空'}}</span>
					</el-col>
				</el-row>
				<el-row class="rowmargin">
					<el-col :span="6">
						<span>发货地址：{{info.destination?info.destination: '空'}}</span>
					</el-col>	
					<el-col :span="6">
						<span>目的地：{{info.loadAddr?info.loadAddr: '空'}}</span>
					</el-col>
					<el-col :span="6">
						<span>货车类型：{{info.carType?info.carType: '空'}}</span>
					</el-col>
					<el-col :span="6">
						<span>吨位（吨）：{{info.carTonnage?info.carTonnage: '空'}}</span>
					</el-col>
				</el-row>
				<el-row class="rowmargin">
					<el-col :span="6">
						<span>长度（米）：{{info.carLength?info.carLength: '空'}}</span>
					</el-col>
					<el-col :span="6">
						<span>用车数量（辆）：{{info.carNum?info.carNum: '空'}}</span>
					</el-col>
				</el-row>
			</div>
			<el-table
				style="width: 100%;margin-top:30px;"
				border
				:data="info.driverList"
				:size="config.size"
				:height="tableHeight"
			>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="driverName" width="100" label="司机" :align="config.align"></el-table-column>
				<el-table-column prop="driverPhone" label="电话" min-width="100" :align="config.align" ></el-table-column>
				<el-table-column prop="license" label="车牌" min-width="100" :align="config.align" ></el-table-column>
				<el-table-column prop="carLength" label="车长（米）" min-width="100" :align="config.align"></el-table-column>
				<el-table-column prop="tonnage" width="100" label="吨位" :align="config.align"></el-table-column>
				<el-table-column prop="carType" width="100" label="车类型" :align="config.align"></el-table-column>
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
		data() {
			return {
				count: 1,
				idMap: {},
				idList: [],
				driver: [],
				driverList: [],
				info: {
					urls: [],
				},
				asideHeight: '',
				parts: [],
				id: '',    //订单ID
				orderId: '',
				levelData: [
					null,
					{name: '一级', type: 'warning', color: '#E6A23C'},
					{name: '二级', type: 'primary', color: '#409EFF'},
					{name: '三级', type: 'success', color: '#67C23A'},
				],
			}
		},
		computed: {
			tableHeight(){
				return 'calc(80vh - 115px)';
			}
		},
		methods: {
			changeDriver(val, index){
		
				let newDriver = JSON.parse(JSON.stringify(this.driver));
				if(this.idList.indexOf(val) == -1){
					this.driverList[index] = {
						driverName: '',
						driverPhone: '',
						license: '',
						carLength: '',
						tonnage: '',
						carType: ''
					};
					let temp = newDriver.filter( item => {
						return item.id == val
					})
					this.driverList.splice(index,1)
					this.driverList.splice(index,0,temp.length==1?temp[0]:{}) ;
					this.idList = this.driverList.map(item => {
						return item.id
					})
				}else{
					// if(!this.driverList[index].id){
						this.driverList.splice(index,1)
					    this.driverList.splice(index,0,{
							driverName: '',
							driverPhone: '',
							license: '',
							carLength: '',
							tonnage: '',
							carType: ''
						});
					// }else{
					// 	let obj = Object.assign({},this.driverList[index]) 
						
					// 	this.driverList.splice(index,1)
					// 	this.driverList.splice(index,0,obj);
					// 	// console.log(this.driverList)
					// }
					// console.log(this.driverList[index])
					this.idList = this.driverList.map(item => {
						if(!!item.id){
							return  item.id
						}
					})
					console.log(this.idList)
					this.$message.warning("该司机已被选择");
					return;
				}
				// if(!this.idMap[val]){
				// 	console.log(this.driver)
				// 	// debugger
				// 	let temp = this.driver.filter( item => {
				// 		return item.id == val
				// 	})
				// 	this.driverList[index] = temp.length==1?temp[0]:{};
				// 	this.idMap[val] = 1;
				// 	this.idList.push(this.driverList[index].id)
				// 	console.log(this.idMap)
				// }else{
				// 	this.$message.warning("该司机已被选择");
				// 	return;
				// }
			},
			//分配
			submitOffer(){
				console.log(this.idList)
				this.idList.map(item => {
					if(!item){
						this.$message.warning("请选择司机");
					}
				})
				this.$api.clue.sendCar({logisticId:this.id, idList:this.idList,orderId:this.orderId}).then(res => {
					if(res.code == 0){
						this.$message({
							showClose: true,
							message: '审核通过',
							type: 'success',
							duration: 1000
						});
						this.$router.push({
							name: 'generalcargoOrders-list',
						})
					}
				});
			},
			
		},
		mounted() {
			this.id = this.$route.params.id
			this.orderId = this.$route.query.orderId
			// 获取订单详情
			this.$api.clue.sendDetail({logisticId:this.id}).then(res => {
				this.info = res.data;
				for(var i=0;i<this.info.carNum;i++){
					let driverForm = {
						driverName: '',
						driverPhone: '',
						license: '',
						carLength: '',
						tonnage: '',
						carType: ''
					}
					this.driverList.push(driverForm);
				}
			});
			this.$api.clue.paramList().then(res => this.driver = JSON.parse(JSON.stringify(res.data)));
		}
	}
</script>

<style lang="scss">
	$bColor: #d3dce6; //#d3dce6
	.order-detail{
		height: 95%;
		.order-content{
			.rowmargin{
				margin: 10px;
			}
			.el-tabs__item.is-active{
				background-color: #EBF4FE;
			}
			 .el-table__body-wrapper{
				height: 100% !important;
			}
			.demo-table-expand{
				padding: 30px;
				height: 100%;
				border: 1px solid #e6a23c59;
			}
			.content-right{
				padding: 10px 0 30px;
				overflow: auto;
				border: 1px solid #e6a23c59;
				.el-tabs__header{
					margin-right: 0;
				}
				.el-tabs{
					outline: 1px solid #eef1f6;
					background-color: #eef1f6;
				}
				.el-tabs__content{
					height: 80%;
					overflow: auto;
					
					.el-tab-pane{
						height:50%;
					}
				}
				
				.handler{
					background-color: $bColor;
					margin-top: 10px;
					border-radius: 4px;
					position: relative;
    				top: 10px;
					.el-button-group{
						width: 100%;
						display: flex;
						
						button{
							flex: 1;
						}
					}
				}
				
			}
		}
	}
  
  
</style>
