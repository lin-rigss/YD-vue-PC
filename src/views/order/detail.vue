<template>
	<BasePage>
		<div class="order-detail">
			
			<div class="aside" ref="aside">
				<OrderTitle :info="info" type="order-detail" gutter="20px"></OrderTitle>
			</div>
			
			<!-- :load="partloadNode" -->
			<div class="order-content" :style="{height: 'calc(100% - 45px - ' + this.asideHeight + ')'}">
				<el-row :gutter="10" style="height: 100%;">
					<el-col :span="10" style="height: 100%;">
						<div style="height:47%;overflow:auto;margin-bottom:10px;border:1px solid #e6a23c59;">
							 <el-tree
								ref="tree"
								node-key="id"
								:data="partsTree"
								:props="{ label: 'nameZn', children: 'children', isLeaf: 'leave' }"
								@check="handleCheckChange"
								show-checkbox>
								<span slot-scope="{ node, data }">
									<span>
										<span>
											<el-tag size="mini" :type="levelData[node.level].type">{{ levelData[node.level].name }}</el-tag>
											{{ data.nameZn }}
										</span>
										<StatusLabel type="status" :showText="false" value="1"></StatusLabel>
									</span>
								</span>
							</el-tree>
							<!-- <el-tree
							    :data="data"
								:props="props"
								show-checkbox
								@node-click="handleNodeClick"
								@check-change="handleCheckChange">
							</el-tree>  -->
						</div>
						<div style="height:45%;">
							<el-carousel arrow="always" :autoplay="false" :loop="false" height="100%">
								<el-carousel-item v-for="(img, index) in info.urls" :key="index">
									<div class="image-content">
										<img
											preview
											style="width: 100%;height:100%;"
											:src="img"
										/>
									</div>
								</el-carousel-item>
							</el-carousel>
						</div>
						
					</el-col>
					<el-col :offset="1" :span="13" class="content-right">
						<div class="order-detail-table" >
							<el-table :data="tableData" height="90%" size="small">
								<el-table-column label="零件名称">
									<template slot-scope="scope">
										{{ scope.row.partsDetaValue?scope.row.partsDetaValue:scope.row.partsCategoryValue }}
									</template>
								</el-table-column>
								<!-- <el-table-column label="参考价">
									<template slot-scope="scope">
										{{ scope.row.label }}
									</template>
								</el-table-column> -->
								<el-table-column label="单价" min-width="100px">
									<template slot-scope="scope">
										<el-input size="mini" :min='1' type="number" v-model="scope.row.offer"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="数量" min-width="100px">
									<template slot-scope="scope">
										<el-input size="mini" :min='1' type="number" v-model="scope.row.quantity" ></el-input>
									</template>
								</el-table-column>
								<el-table-column label="索要图片">
									<template slot-scope="scope">
										<el-button size="mini" type="primary" round @click="askPic(scope.row)">查看</el-button>
										<!-- <el-switch v-model="scope.row.status" :disabled="scope.row.disabled" @change="askPic(scope.row)"></el-switch> -->
									</template>
								</el-table-column>
								<!-- <el-table-column label="查看图片">
									<template slot-scope="scope">
										<el-button size="mini" type="primary" round @click="viewPic(scope.row)">查看</el-button>
									</template>
								</el-table-column> -->
								<el-table-column label="操作">
									<template slot-scope="scope">
										<el-button size="mini" type="danger" round @click="del(scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<!-- .splice(index, 1) -->
						<div class="handler">
							<el-button-group>
								<el-button type="warning" @click="quoterOperationalRecord"><svg-icon icon-class="skip"></svg-icon>跳过</el-button>
								<el-button type="success" @click="submitOffer(4)"><svg-icon icon-class="next"></svg-icon> 继续报价</el-button>
								<el-button type="primary" @click="submitOffer(3)"><svg-icon icon-class="submit"></svg-icon> 提交</el-button>
							</el-button-group>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<el-dialog :title="'零件图片——'+picTitle" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
			<el-carousel height="400px" :autoplay="false" style="text-align:center;">
				<el-carousel-item v-for="item in picList" :key="item">
					<img :src="item" alt="" style="width: 100%;height:100%;">
				</el-carousel-item>
			</el-carousel>
		</el-dialog>
	</BasePage>
</template>

<script>
	export default {
		components: {
			OrderTitle: () => import('./component/OrderTitle'),
			OrderDetailTable: () => import('./component/OrderDetailTable')
		},
		data() {
			return {
				info: {
					urls: [],
				},
				// switchIdMaps: {},
				// offerMaps: {},
				// quantityMaps: {},
				partsTree: [],
				tableData: [],
				checkNode: {},
				switchdis:false,
				dialogTableVisible: false,
				picList: [],
				picTitle: '',
				levelData: [
					null,
					{name: '一级', type: 'warning', color: '#E6A23C'},
					{name: '二级', type: 'primary', color: '#409EFF'},
					{name: '三级', type: 'success', color: '#67C23A'},
					{name: '四级', type: 'info', color: '#909399'},
					{name: '五级', type: 'danger', color: ''},
					{name: '六级', type: 'danger', color: ''},
				],
				asideHeight: '',
				parts: [],
				orderId: '',    //订单ID
				
			}
		},
		methods: {
			//节点被点击
			handleNodeClick(data, node) {
				// debugger
				// this.info.partsList = data;
				// this.checkNode = node;
			},
			handleCheckChange(data, node,) {
				
				// this.tableData = this.$refs.tree.getCheckedNodes(true);
				var nodes = this.$refs.tree.getCheckedNodes(true);
				var allNodes = node.checkedNodes.concat(node.halfCheckedNodes);
				this.buildData(nodes,allNodes);
				// this.checkNode = node;
				// this.tableData = node.checkedNodes.filter(i => !(i.children && i.children.length))
				
				// this.tableData = this.tableData.map(item => {
				// 	return {
				// 		partsDetaValue : item.nameZn,
				// 		partsDetaCode:item.code,
				// 		partsDetaId: item.id,
				// 		unit: item.unit,
				// 		offer: '',
				// 		quantity: '',
				// 	}
				// })
				console.log(this.tableData)
			},
			buildData(list1,list2){
				// debugger
				var obj={};
				for(var i=0;i<list2.length;i++){
				obj[list2[i]["id"]] = list2[i];
				};
				var list = this.build2Data(list1,obj);
				var orginTableMap = this.getOrginTableMap();
				this.setTableData(list,orginTableMap);
			},
			getOrginTableMap(){
				var obj={};
				for(var i=0;i<this.tableData.length;i++){
					obj[this.tableData[i].id] = this.tableData[i];
				}
				return obj;
			},
			build2Data(list,obj){
				// debugger
				for(var i=0;i<list.length;i++){
				if(obj[list[i].parentId]){
					list[i]["parent"] = obj[list[i].parentId];
					if(obj[list[i].parentId].parentId!="root"){
					var arr = [];
					arr.push(obj[list[i].parentId]);
					this.build2Data(arr,obj);
					}
				}
				}
				return list;
				console.log(this.tableData)
			},
			setTableData(list,orginTableMap){
				// debugger
				this.tableData=[];
				list.forEach((item)=>{
					 if(item.parent && !item.parent.parent){
						
						var obj={
							    id: item.id,
								unit: item.unit,
								partsCategoryCode: item.code,
								partsCategoryId: item.id,
								partsCategoryValue: item.nameZn,
								partsFrameCode:item.parent.code,
								partsFrameId:item.parent.id,
								partsFrameValue:item.parent.nameZn,
								// offer: this.offerMaps[item.id]?this.offerMaps[item.id]:0,
							  //   quantity: this.quantityMaps[item.id]?this.quantityMaps[item.id]:0,
								// status: this.switchIdMaps[item.id]?true:false,
								//   disabled: this.switchIdMaps[item.id]?true:false,
								offer:orginTableMap[item.id]?orginTableMap[item.id].offer:1,
								quantity:orginTableMap[item.id]?orginTableMap[item.id].quantity:1,
								status:orginTableMap[item.id]?orginTableMap[item.id].status:false,
								disabled:orginTableMap[item.id]?orginTableMap[item.id].disabled:false,
						}
						this.tableData.push(obj);
					}else if(item.parent && item.parent.parent){
						
						var obj={
							id: item.id,
							partsDetaValue : item.nameZn,
							partsDetaCode:item.code,
							partsDetaId: item.id,
							unit: item.unit,
							partsCategoryCode: item.parent.code,
							partsCategoryId: item.parent.id,
							partsCategoryValue: item.parent.nameZn,
							partsFrameCode:item.parent.parent.code,
							partsFrameId:item.parent.parent.id,
							partsFrameValue:item.parent.parent.nameZn,
							offer:orginTableMap[item.id]?orginTableMap[item.id].offer:1,
							quantity:orginTableMap[item.id]?orginTableMap[item.id].quantity:1,
							status:orginTableMap[item.id]?orginTableMap[item.id].status:false,
							disabled:orginTableMap[item.id]?orginTableMap[item.id].disabled:false
						}
						this.tableData.push(obj);
					}
				})
			},
			//跳过获取随机订单
			quoterOperationalRecord(){
				if(this.orderId == ''){
					this.orderId = this.$route.params.id
				}
				this.$api.order.quoterOperationalRecord({id: this.orderId,type: 2}).then(res => 
				{	
					if(res.code == 0){
						this.$message({
								showClose: true,
								message: '跳过成功',
								type: 'success',
								duration: 1000
								});
						!!res.data?this.info = res.data:this.info = {};
						this.orderId = res.data.id
						this.$router.push({
							name: 'order-quotedetail',
							params: {
								id: this.orderId,
							}
						})
					}else{
						this.$router.push({
							name: 'order-list',
						})
					}
				})
			},
			//继续报价获取随机订单
			//提交
			submitOffer(typede){
				console.log(this.tableData)
				for (let i = 0; i < this.tableData.length; i++) {
					if(this.tableData[i].offer !='' && this.tableData[i].quantity !=''){
						
					}else{
						this.$message({
						showClose: true,
						message: '请填写',
						type: 'warning',
						duration: 2000
						});
						return
					}
				}
				if(this.tableData.length == 0){
					this.$message({
						showClose: true,
						message: '请选择报价零件',
						duration: 2000
					});
					return
				}
				console.log(this.info)
				// return
				this.$api.order.submitOffer({id: this.info.id, roleType:'sale', inquirerId: this.info.inquirerId, type: typede, partsList: this.tableData}).then(res =>  {
					if(res.code === 0){
						//提交
						if(typede === 3){
							this.$message({
								showClose: true,
								message: '报价成功',
								type: 'success',
								duration: 1000
							});
							this.$router.push({
								name: 'order-quote',
							})
						}
						//继续报价
						if(typede === 4){
							this.$message({
							showClose: true,
							message: '报价成功，请继续填写下一单',
							type: 'success',
							duration: 2000
							});
							!!res.data?this.info = res.data:this.info = {};
							// this.partsList()
						}
					}else{
						this.$router.push({
							name: 'order-quote',
						})
					}
				})
			},
			preview(url){
				console.log(url)
			},
			// reInput(row){
			// 	this.offerMaps[row.id] = row.offer;
			// },
			// numInput(row){
			// 	this.quantityMaps[row.id] = row.quantity;
			// },
			askPic(row){
				this.$api.order.askPictures({orderId: this.orderId, partsDetaId: row.id, partsDetaValue:row.partsDetaValue, partsCategoryValue:row.partsCategoryValue, partsFrameValue:row.partsFrameValue}).then(res => 
				{	
					if(res.code == 0){
						this.$message({
							showClose: true,
							message: '索要成功',
							type: 'success',
							duration: 1000
						});
						row.disabled = true;
					}else{
						this.viewPic(row)
					}
					
					//this.switchIdMaps[row.id] = true;
				})
				
			},
			viewPic(row){
				this.$api.order.checkAskPictures({orderId: this.orderId, partsDetaId:row.id, partsDetaValue:row.partsDetaValue?row.partsDetaValue:row.partsCategoryValue}).then(res => 
				{	
					if(res.code == 0){
						this.picTitle = row.partsDetaValue?row.partsDetaValue:row.partsCategoryValue
						this.dialogTableVisible = true;
						this.picList = res.data;
					}

				})
				
			},
			del(index){
				this.tableData.splice(index, 1)
				let arr = [];
				for(var i=0;i<this.tableData.length;i++){
					arr.push(this.tableData[i].id)
				}
				this.$refs.tree.setCheckedKeys([])
				this.$refs.tree.setCheckedKeys(arr)
			}
		},
		mounted() {
			setTimeout(() => {
				this.asideHeight = window.getComputedStyle(this.$refs.aside).height;
			}, 100);
			this.$api.parts.getpartsList().then(res => {
				this.partsTree = res.data.filter(item => {
					return item.status=="1"
				})
			});
			this.$previewRefresh();
			this.orderId = this.$route.params.id
			// 获取订单详情
			this.$api.order.offerDetail({id: this.orderId,status: ''}).then(res => this.info = res.data);
		}
	}
</script>

<style lang="scss">
	$bColor: #d3dce6; //#d3dce6
	.order-detail{
		.order-content{
			.el-carousel{
				border:1px solid #e6a23c59;
				height: 100%;
			}
			.el-tabs__nav-scroll{
				background-color: $bColor;
			}
			.el-carousel__item{
				background-color: $bColor;
			}
			.el-tabs__item.is-active{
				background-color: #EBF4FE;
			}
		    .el-table__body-wrapper{
				height: 100% !important;
			}
			.order-detail-table{
				height: 90%;
			}
			
			.image-content{
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.content-right{
				height: 100%;
				border:1px solid #e6a23c59;
				.el-tabs__header{
					margin-right: 0;
				}
				.el-tabs{
					outline: 1px solid #eef1f6;
					background-color: #eef1f6;
				}
				.el-tabs__content{
					height: 100%;
					
					overflow: auto;
					
					.el-tab-pane{
						height: 100%;
					}
				}
				
				.handler{
					background-color: $bColor;
					margin-top: 10px;
					border-radius: 4px;
					
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
