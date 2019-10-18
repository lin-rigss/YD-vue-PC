<!--待审核页面-->
<template>
	<BasePage>
		<div class="order-detail">
			
			<div class="aside" ref="aside">
				<OrderTitle :info="info" type="order-detail" gutter="20px"></OrderTitle>
			</div>
			
			
			<div class="order-content" :style="{height: 'calc(100% - 45px - ' + this.asideHeight + ')'}">
				<el-row :gutter="10" style="height: 100%;">
					<el-col :span="10" style="height: 100%;">
						<div style="height:100%;">
							<el-carousel arrow="always" :autoplay="false" :loop="false" height="100%">
								<el-carousel-item v-for="(img, index) in info.urls" :key="index">
									<div class="image-content">
										<img
											preview
											style="width: 100%;"
											:src="img"
										/>
									</div>
								</el-carousel-item> 
							</el-carousel>
						</div>
					</el-col>
					<el-col :offset="1" :span="13" class="content-right">
						<!-- <el-tabs tab-position="left" style="height: calc(100% - 50px);" @tab-click="tabClick">
							<el-tab-pane v-for="(part, index) in parts" :key="index" :label="part.nameZn">
								<OrderDetailTable :orderid='id' :info="part.spare"></OrderDetailTable>
							</el-tab-pane>
						</el-tabs> -->
						<AuditDetailTable :span="10" :orderid='id' :info='info.partsList?info.partsList:[]'></AuditDetailTable>
						
						<div class="handler">
							<el-button-group>
								<!-- <el-button type="danger" @click="submitOffer(7)"><svg-icon icon-class="submit"></svg-icon> 审核拒绝</el-button> -->
								<el-button type="primary" @click="submitOffer(9)"><svg-icon icon-class="submit"></svg-icon> 审核通过</el-button>
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
			OrderTitle: () => import('./component/OrderTitle'),
			AuditDetailTable: () => import('./component/AuditDetailTable')
		},
		data() {
			return {
				count: 1,
				info: {
					urls: [],
				},
				asideHeight: '',
				parts: [],
				id: '',    //订单ID
				levelData: [
					null,
					{name: '一级', type: 'warning', color: '#E6A23C'},
					{name: '二级', type: 'primary', color: '#409EFF'},
					{name: '三级', type: 'success', color: '#67C23A'},
				],
			}
		},
		methods: {
			//继续报价获取随机订单
			//提交7拒绝9通过
			submitOffer(type){
				console.log(this.info.partsList)
				this.$api.order.auditOrders({id: this.id,partsList: this.info.partsList,status:type }).then(res => {
					if(res.code == 0){
						this.$message({
							showClose: true,
							message: '审核通过',
							type: 'success',
							duration: 1000
						});
						this.$router.push({
							name: 'toaudited-list',
						})
					}
				});
			},
			preview(url){
				console.log(url)
			},
			tabClick(e){
				this.loadSpare(e.index - 0);
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
					console.log(info)
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
			}
		},
		mounted() {
			setTimeout(() => {
				this.asideHeight = window.getComputedStyle(this.$refs.aside).height;
			}, 100);
			
			this.$previewRefresh();
			
			// 获取零部件列表
			// this.partsList();
			this.id = this.$route.params.id
			// 获取订单详情
			this.$api.order.offerDetail({id: this.id,status: ''}).then(res => this.info = res.data);
		}
	}
</script>

<style lang="scss">
	$bColor: #d3dce6; //#d3dce6
	.order-detail{
		.order-content{
			.el-carousel{
				height: 100%;
				border: 1px solid #e6a23c59;
			}
			.el-tabs__nav-scroll{
				background-color: $bColor;
			}
			.el-carousel__item{
				height: 100%;
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
				height: 80%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.content-right{
				height: 100%;
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
