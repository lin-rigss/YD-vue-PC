<!--待审核页面-->
<template>
	<BasePage>
		<div class="order-detail">
			
			<div class="aside" ref="aside">
				<OrderTitle :info="info" type="order-detail" gutter="20px"></OrderTitle>
			</div>
			
			<div class="order-content" :style="{height: 'calc(100% - 45px - ' + this.asideHeight + ')'}">
				<el-row :gutter="10" style="height: 100%;">
					<el-col :span="12" style="height: 100%;">
						<el-tabs v-model="activeName" style="height: 100%;">
							<el-tab-pane label="线索照片" name="first" style="height: 100%;">
								<div style="height: 100%;">
										<el-carousel arrow="always" :autoplay="false" :loop="false" height="100%">
											<el-carousel-item v-for="(img, index) in info.pictureUrlArr" :key="index">
												<div class="image-content">
													<img
														preview
														style="margin-top:10px;width: 100%;height:100%;"
														:src="img"
													/>
												</div>
											</el-carousel-item> 
										</el-carousel>
									</div>
							</el-tab-pane>
							<el-tab-pane label="线索视频" name="second" style="height: 100%;">
								<div style="height: 100%;">
										<el-carousel arrow="always" :autoplay="false" :loop="false" height="100%">
											<el-carousel-item v-for="(video, index) in info.videoUrlArr" :key="index">
												<div class="image-content">
													<video style="margin-top:10px;width:100%;height:100%;" controls="" autoplay="" name="media">
														<source :src="video" type="video/mp4">
													</video>
												</div>
											</el-carousel-item> 
										</el-carousel>
									</div>
							</el-tab-pane>
						</el-tabs>
						
					</el-col>
					<el-col :offset="1" :span="10" class="content-right" style="height: 100%;">
						<!-- <el-tabs tab-position="left" style="height: calc(100% - 50px);" @tab-click="tabClick">
							<el-tab-pane v-for="(part, index) in parts" :key="index" :label="part.nameZn">
								<OrderDetailTable :orderid='id' :info="part.spare"></OrderDetailTable>
							</el-tab-pane>
						</el-tabs> -->
						<div style="height: 45%;border: 1px solid #e6a23c59;margin-bottom:5%; text-align:right;">
							<el-button v-if="audit" type="primary" @click="addCgd()" size="mini"> 添加</el-button>
							<el-table :data="info.cgd" border size="small"  height="100%">
								<el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>
								<el-table-column label="种类">
									<template slot-scope="scope">
										{{ scope.row.goodsName }}
									</template>
								</el-table-column>
								<el-table-column label="重量(kg)">
									<template slot-scope="scope">
										<el-input size="mini" :min='0' type="number" :disabled="!audit" @change="weightChange" v-model="scope.row.goodsWeight"></el-input>
									</template>
								</el-table-column>
								<!-- <el-table-column label="单位" min-width="60">
									<template slot-scope="scope">
										{{ showUnit(scope.row.unit) }}
									</template>
								</el-table-column> -->
								<!-- <el-table-column label="查看图片">
									<template slot-scope="scope">
										<el-button size="mini" type="text" round  v-model="scope.row.img" @click="viewPic(scope.row)">查看</el-button>
									</template>
								</el-table-column> -->
								<el-table-column label="操作">
									<template slot-scope="scope">
										<el-button size="mini" type="text" :disabled="info.cgd.length == 1" style="color: var(--red);" @click="del(scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<el-form label-width="80px" :model="info" style="height: 45%;border: 1px solid #e6a23c59;margin-bottom:20px;padding: 40px 10px;">
							<el-form-item label="重量(kg):">
								<el-input type='number' :min="0" v-model="info.weight" disabled></el-input>
							</el-form-item>
							<el-form-item label="价格(元):">
								<el-input type='number' :min="0" v-model="info.unitPrice" :disabled="!audit"></el-input>
							</el-form-item>
						</el-form>
						
						<div class="handler">
							<el-button-group>
								<el-button v-if="audit" type="primary" @click="submitOffer()"><svg-icon icon-class="submit"></svg-icon> 审核通过</el-button>
							</el-button-group>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-dialog :title="'零件图片——'+picTitle" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
				<el-carousel height="400px" :autoplay="false" style="text-align:center;">
					<el-carousel-item v-for="item in picList" style="height:100%;" :key="item">
						<img :src="item" alt="">
					</el-carousel-item>
				</el-carousel>
			</el-dialog>
			<el-dialog title="添加种类" :visible.sync="dialogFormVisible" width="40%">
				<el-form :model="form">
					<el-form-item label="名称:" :label-width="formLabelWidth">
						<el-select v-model="form.goodsName" style="width: 100%;" placeholder="请选择零件" @change="changeGenner">
							<el-option v-for="(e, index) in generalCargoData" :key="index" :value="e.id" :label="e.nameZn" >{{e.nameZn}}</el-option>
						</el-select>
						<!-- <el-input v-model="form.goodsName" autocomplete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="重量(kg):" :label-width="formLabelWidth">
						<el-input type='number' :min="0" v-model="form.goodsWeight" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addBtn()">确 定</el-button>
				</div>
			</el-dialog>


			
		</div>
	</BasePage>
</template>

<script>
	export default {
		components: {
			OrderTitle: () => import('./component/OrderTitle'),
		},
		data() {
			return {
				activeName: 'first',
				count: 1,
				info: {
					urls: [],
				},
				audit: true,
				asideHeight: '',
				parts: [],
				dialogTableVisible: false,
				picList: [],
				generalCargoData: [],
				picTitle: '',
				id: '',    //订单ID
				levelData: [
					null,
					{name: '一级', type: 'warning', color: '#E6A23C'},
					{name: '二级', type: 'primary', color: '#409EFF'},
					{name: '三级', type: 'success', color: '#67C23A'},
				],
				dialogFormVisible: false,
				form: {
					unit: '',
					goodsId: '',
					goodsCode: '',
					goodsName: '',
					goodsWeight: '',
				},
				formLabelWidth: '120px'
			}
		},
		methods: {
			showUnit(unit){
				let row = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${row.cname} ( ${row.ename} )`
			},
			//审核线索
			submitOffer(type){
				if(this.info.quality == 0||this.info.unitPrice == 0){
					this.$message.warning('请填写');
					return;
				}
				// console.log(this.info)
				// return
				this.info.quality = this.$g.dic.expval('quality', this.info.quality).value;
				this.info.status = '1';

				this.$api.clue.operateCheck(this.info).then(res => {
					if(res.code == 0){
						this.$message({
							showClose: true,
							message: '审核通过',
							type: 'success',
							duration: 1000
						});
						this.$router.push({
							name: 'generalcargoAudit-list',
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
			addBtn(){
				this.info.cgd.unshift(this.form);
				this.form = {
					unit: '',
					goodsId: '',
					goodsCode: '',
					goodsName: '',
					goodsWeight: '',
				}
				this.info.weight = this.info.cgd.map(item => Number(item.goodsWeight)).reduce((a, b) => a + b) || 0;
				this.dialogFormVisible = false;
			},
			weightChange(){
				this.info.weight = this.info.cgd.map(item => Number(item.goodsWeight)).reduce((a, b) => a + b) || 0;
			},
			changeGenner(val){
				let dt = this.generalCargoData.find(i => i.id == val);
				// console.log(dt);
				this.form.unit = dt.unit;
				this.form.goodsId = dt.id;
				this.form.goodsCode = dt.code;
				this.form.goodsName = dt.nameZn;
			},
			addCgd(){
				this.dialogFormVisible = true;
			},
			viewPic(row){
				if(row.img.lenth>0){
					this.picTitle = row.goodsName
					this.dialogTableVisible = true;
					this.picList = row.img;
				}else{
					this.$message.warning('暂无图片');
				}
			},
			del(index){
				if(this.info.cgd.length > 1){
					this.info.cgd.splice(index, 1)
				}
				this.info.weight = this.info.cgd.map(item => Number(item.goodsWeight)).reduce((a, b) => a + b) || 0;
			},
		},
		mounted() {
			setTimeout(() => {
				this.asideHeight = window.getComputedStyle(this.$refs.aside).height;
			}, 100);
			
			this.$previewRefresh();

			this.id = this.$route.params.id
			if(this.$route.query.name == 'shen'){
				this.audit = true;
			}else{
				this.audit = false;
			}
			// 获取订单详情
			this.$api.clue.operateDetail({id:this.id}).then(res => {
				this.info = res.data
				this.info.quality = this.$g.dic.exp('quality', this.info.quality).name;
				this.info.status = this.$g.dic.exp('clueStatus', this.info.status).name;
				// this.weightChange();
				// console.log(this.info)
			});
			this.$api.parts.generalCargoList({
					pageIndex: 1,
					pageSize: 10,}).then(res => {
						this.generalCargoData = res.data;
				})
			
		}
	}
</script>

<style lang="scss">
	$bColor: #d3dce6; //#d3dce6
	.order-detail{
		.order-content{
			.el-tabs__content{
				height: 90%;
			}
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
				// height: 100% !important;
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
