<template>
	<div class="order-detail-table" >
		<el-table :data="tableData" height="100%" size="small">
			<el-table-column label="零件名称">
				<template slot-scope="scope">
					{{ scope.row.partsDetaValue ? scope.row.partsDetaValue:scope.row.partsCategoryValue }}
				</template>
			</el-table-column>
			<el-table-column label="参考价">
				<template slot-scope="scope">
					{{ scope.row.label }}
				</template>
			</el-table-column>
			<el-table-column label="单价">
				<template slot-scope="scope">
					<el-input size="mini" :min='0' type="number" disabled v-model="scope.row.offer"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="审核单价">
				<template slot-scope="scope">
					<el-input size="mini" :min='0' type="number" v-model="scope.row.auditQuotation"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="数量">
				<template slot-scope="scope">
					<el-input size="mini" :min='0' type="number" disabled v-model="scope.row.quantity"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="查看图片">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" round @click="viewPic(scope.row)">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" :disabled="tableData.length == 1" round @click="del(scope.$index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog :title="'零件图片——'+picTitle" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
			<el-carousel height="400px" :autoplay="false" style="text-align:center;">
				<el-carousel-item v-for="item in picList" style="height:100%;" :key="item">
					<img :src="item" alt="">
				</el-carousel-item>
			</el-carousel>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: {
			info: {
				type: Array,
				required: false,
				default: () => ({
					
				}),
			},
			orderid: {
				type: String, 
				default: '',
			}
		},
		data() {
			return {
				tableData: [],
				switchdis:false,
				dialogTableVisible: false,
				picList: [],
				picTitle: '',
			}
		},
		methods: {
			viewPic(row){
			
				this.$api.order.checkAskPictures({orderId: this.orderid, partsDetaId:row.partsDetaId?row.partsDetaId:row.partsCategoryId, partsDetaValue:row.partsDetaValue?row.partsDetaValue:row.partsCategoryValue}).then(res => 
				{	
					if(res.code == 0){
						this.picTitle = row.partsDetaValue?row.partsDetaValue:row.partsCategoryValue
						this.dialogTableVisible = true;
						this.picList = res.data;
					}
				})
				
			},
			del(index){
				if(this.tableData.length > 1){
					this.tableData.splice(index, 1)
				}
			}
		},
		watch: {
			info(o, n){
				this.tableData = o;
				this.tableData.map(item => {
					item.auditQuotation = item.offer
				})
				console.log(this.tableData)
			}
		},
	}
</script>

<style lang="scss">
	.order-detail-table{
		height: 90%;
		
	}
</style>
