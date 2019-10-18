<!--待审核页面-->
<template>
	<BasePage>
		<div class="order-detail">
		
			
			
			<div class="order-content">
				<el-row :gutter="10" style="height: 100%;">
					<el-col :offset="2" :span="9" style="height: 100%;">
						<el-form :model="info"  label-position="left" class="demo-table-expand">
							<el-form-item label="拆解厂名称：">
								<span>{{info.dismantlingPlantName}}</span>
							</el-form-item>
							<el-form-item label="联系人：">
								<span>{{info.contactName}}</span>
							</el-form-item>
							<el-form-item label="联系电话：">
								<span>{{info.contactCall}}</span>
							</el-form-item>
							<el-form-item label="发货地址：">
								<span>{{info.destination}}</span>
							</el-form-item>
							<el-form-item label="目的地：">
								<span>{{info.loadAddr}}</span>
							</el-form-item>
							<el-form-item label="用车时间：">
								<span>{{info.carStartTime}}</span>
							</el-form-item>
							<el-form-item label="货车类型：">
								<span>{{info.carType}}</span>
							</el-form-item>
							<el-form-item label="吨位（吨）：">
								<span>{{info.carTonnage}}</span>
							</el-form-item>
							<el-form-item label="长度（米）：">
								<span>{{info.carLength}}</span>
							</el-form-item>
							<el-form-item label="用车数量（辆）：">
								<span>{{info.carNum}}</span>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :offset="1" :span="9" class="content-right">
						<div style="height: calc(95vh - 200px);overflow: auto;">
							<el-form label-width="100px" :model="driverList[index]" v-for="(item, index) in info.carNum" :key="index" style="border: 1px solid #ddd;margin: 10px;padding: 10px;">
								<el-form-item label="司机：">
									<el-select v-model="driverList[index].driverName" :style="{width: '100%'}" placeholder="请选择司机" @change="((val) => {changeDriver(val,index)})">
										<el-option v-for="(e, idx) in driver" :key="idx" :value="e.id" :label="e.driverName" >
											<span style="float: left">{{ e.driverName }}</span>
      										<span style="float: right; color: #8492a6; font-size: 13px">{{ e.driverPhone }}</span>
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="电话：">
									<el-input disabled v-model="driverList[index].driverPhone"></el-input>
								</el-form-item>
								<el-form-item label="车牌：">
									<el-input disabled v-model="driverList[index].license"></el-input>
								</el-form-item>
								<el-form-item label="车长：">
									<el-input disabled v-model="driverList[index].carLength"></el-input>
								</el-form-item>
								<el-form-item label="吨位：">
									<el-input disabled v-model="driverList[index].tonnage"></el-input>
								</el-form-item>
								<el-form-item label="车类型：">
									<el-input disabled v-model="driverList[index].carType"></el-input>
								</el-form-item>
								
							</el-form>
						</div>
						
						
						<div class="handler">
							<el-button-group>
								<el-button type="primary" @click="submitOffer()"><svg-icon icon-class="submit"></svg-icon> 审核通过</el-button>
							</el-button-group>
						</div>
					</el-col>
				</el-row>
			</div>
			
			
		</div>
	</BasePage>
</template>

<script>
	export default {
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
		.order-content{
			
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
