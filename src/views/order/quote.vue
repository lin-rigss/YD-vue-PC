<template>
	<div class="order-quote">
		<el-card class="box-card">
			<div slot="header">
				<span>
					<svg-icon icon-class="order"></svg-icon>
					待报价订单
				</span>
				
				<el-button @click="quoterOperationalRecord(1)" style="float: right; padding: 5px 10px; margin-top: -4px;" type="primary" v-if="!Object.keys(this.list.history).length">开始接单</el-button>
				<el-button @click="quoterOperationalRecord(5)" style="float: right; padding: 5px 10px; margin-top: -4px;" type="danger" v-if="Object.keys(this.list.history).length" :disabled='!waitshow'>关闭订单</el-button>
			</div>
			<div style="min-height: 500px;">
				<!-- 空数据的时候展示 -->
				<div style="text-align: center;" v-if="orderEmpty">
					<svg-icon icon-class="no-data" style="font-size: 150px;margin-top:8s0px; color: var(--grey);"></svg-icon>
				</div>
				
				<!-- 历史数据展示 -->
				<div v-else>
					<el-row :gutter="20">
						<el-col :span="14">
							<el-carousel arrow="always" :autoplay="false" :loop="false">
								<el-carousel-item v-for="(img, idx) in list.history.urls" :key="idx" style="height:420px !important;">
									<div class="image-content" style="height:420px !important;">
										<img
											preview
											style="width: 100%;"
											:src="img"
										/>
									</div>
								</el-carousel-item>
							</el-carousel>
						</el-col>
						<el-col :span="10">
							<el-form label-position="left" class="demo-table-expand">
								<el-form-item v-for="(prop, idx) in orderProps" :key="idx" :label="prop.name">
									<span>{{ list.history[prop.model]?list.history[prop.model]:'空' }}</span>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
					<div style="margin-top: 10px; text-align: right;">
						<el-button type="primary" @click="validateOrder(list.history)">去报价</el-button>
					</div>
				</div>
				
				<!-- 开始接单实时数据展示 -->
				<div v-for="(item, index) in list.real" :key="index">
					
				</div>
				
			</div>
		</el-card>
		
		<!-- <el-card class="box-card">
			<div slot="header">
				<span>
					<svg-icon icon-class="parts"></svg-icon>
					待报价零件
				</span>
				<el-button style="float: right; padding: 5px 10px; margin-top: -4px;" type="primary">开始接单</el-button> 
			</div>
			<div style="min-height: 150px;">
				<div style="text-align: center;" v-if="!list.parts.length">
					<svg-icon icon-class="no-data" style="font-size: 150px; color: var(--grey);"></svg-icon>
				</div>
				<div>
					<el-collapse @change="partsChange">
						<el-collapse-item v-for="(item, index) in list.parts" :key="index" :name="item.id">
							<template slot="title">
								<span class="parts-props" v-for="(prop, idx) in partsOptions" :key="idx">
									<span class="parts-props-title">{{ prop.name }}</span>
									<span class="parts-props-info">{{ item[prop.model] }}</span>
								</span>
							</template>
							<el-table :data="list.parts" border>
								<el-table-column prop="id" label="零件订单号" align="center" ></el-table-column>
								<el-table-column prop="id" label="零件图" align="center" ></el-table-column>
								<el-table-column prop="id" label="零件类型" align="center" ></el-table-column>
								<el-table-column prop="id" label="参考价" align="center" ></el-table-column>
								<el-table-column prop="id" label="报价" align="center" ></el-table-column>
								<el-table-column prop="id" label="零件数量" align="center" ></el-table-column>
								<el-table-column label="操作" fixed="right" width="100" align="center" >
									<template>
										<el-button type="text">去报价</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-collapse-item>
					</el-collapse>
					
					
				</div>
			</div> 
		</el-card>-->


	</div>
</template>

<script>
import {mapActions} from 'vuex'
	export default {
		components: {
		
		},
		data() {
			return {
				waitshow: true,
                timer: null,
				waitSecond: {},
				list: {
					history: {},
					real: [],
					parts: [
						{id: 'sdf'},
						{id: 'sdf'},
						{id: 'sdf'},
						{id: 'sdf'},
						{id: 'sdf'},
					],
				},
				orderProps: [
					{name: '拆解厂：', model: 'dismantlingPlantName'},
					{name: '拆解厂地址：', model: 'detailAddress'},
					{name: '订单编号：', model: 'id'},
					{name: '接单时间：', model: 'createTime'},
					{name: '车型/品牌：', model: 'brandName'},
					// {name: '车型', model: 'id'},
					{name: '车架号：', model: 'vin'},
				],
				partsOptions: [
					{name: '订单编号', model: 'id'},
					{name: '车型/品牌', model: 'id'},
					{name: '零件', model: 'id'},
					{name: '接单时间', model: 'id'},
				]
			}
		},
		computed: {
			orderEmpty() {
				return !Object.keys(this.list.history).length && !this.list.real.length;
			},
		},
		methods: {
			...mapActions({
				toggleCount:"app/toggleCount",
				toggleCheck:"app/toggleCheck"
			}),
			// toggleCount() {
			// 	this.$store.dispatch('app/toggleCount')
			// },
			getOperationsNumber(){
				// debugger
				this.$api.order.getOperationsNumber().then(res => {
					// debugger
					this.toggleCount(res.data.unquotedCount)
					this.toggleCheck(res.data.unchecked)
					// this.$store.commit('app/TOGGLE_COUNT', res.data.unquotedCount)
					// this.$store.commit('app/TOGGLE_CHECK', res.data.unchecked)
					// this.$store.dispatch('app/toggleCount',res.data.unquotedCount)
					// this.$store.dispatch('app/toggleCheck',res.data.unchecked)
				})
			},
			partsChange(){
				
			},
			//获取现有待报价订单
			getBindOrder(){ 
				this.$api.order.getBindOrder().then(res => {
					this.waitSecond = 60
					this.countdown()
					!!res.data?this.list.history = res.data:this.list.history = {};
				})
			},
			//开始接单结束接单
			quoterOperationalRecord(typeQuo){
				this.$api.order.quoterOperationalRecord({type: typeQuo}).then(res => 
				{	
					if(res.code === 0){
						this.waitSecond = 60
						this.countdown()
						!!res.data?this.list.history = res.data:this.list.history = {};
						this.getOperationsNumber()
					}
				})
			},
			//去报价
			validateOrder(listHistory){
				this.$api.order.validateOrder({id: listHistory.id}).then(res => {
					if(res.data){
						this.$router.push({
							name: 'order-quotedetail',
							params: {
								id: listHistory.id,
							}
						})
					}else{
						this.getBindOrder()
					}
				})
			},
			//倒计时
			countdown(){
                if (!this.timer) {
                    this.waitshow = false;
                    this.timer = setInterval(() => {
                    if (this.waitSecond > 0) {
                        this.waitSecond--;
                        } else {
                        this.waitshow = true;
                        clearInterval(this.timer);
                        this.timer = null;
                        }
                    }, 1000)
                }
			},
		},
		mounted() {
			this.getBindOrder()
			this.getOperationsNumber()
		}
	}
</script>

<style lang="scss">
	.order-quote {
		height: 100%;
		overflow: auto;
		
		padding: 10px;
		
		.box-card{
			margin-bottom: 10px;
		}
		
		.demo-table-expand {
			label {
				width: 120px;
				color: #99a9bf
			}
			.el-form-item {
				margin-right: 0;
				margin-bottom: 0;
			}
		}
		
		.parts-props{
			margin-right: 10px;
			
			&-title{
				color: #99a9bf
			}
			&-info{
				margin-left: 5px;
			}
		}
		
		.el-carousel__item{
			background-color: lightgray;
		}
		.el-carousel__container{
			height: 420px;
		}
	}
</style>
