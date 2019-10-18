<template>
	<div class="order-detail-table" >
		<el-table :data="tableData" height="100%" size="small">
			<el-table-column label="零件名称">
				<template slot-scope="scope">
					{{ scope.row.nameZn }}
				</template>
			</el-table-column>
			<el-table-column label="参考价">
				<template slot-scope="scope">
					{{ scope.row.label }}
				</template>
			</el-table-column>
			<el-table-column label="单价">
				<template slot-scope="scope">
					<el-input size="mini" :min='1' type="number" v-model="scope.row.remarks"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="数量">
				<template slot-scope="scope">
					<el-input size="mini" :min='1' type="number" v-model="scope.row.minOrder"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="索要图片">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :disabled="switchdis" @change="askPic(scope.row.id,scope.row.nameZn)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="查看图片">
				<template slot-scope="scope">
					<el-switch @change="viewPic(scope.row.id,scope.row.nameZn)"></el-switch>
				</template>
			</el-table-column>
		</el-table>
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
				default: ''
			}
		},
		data() {
			return {
				tableData: [],
				switchdis:false,
			}
		},
		methods: {
			askPic(id,name){
				console.log(this.orderid+id)
				this.$api.order.askPictures({orderId: this.orderid, partsDetaId: id, partsDetaValue:name}).then(res => 
				{	
					this.$message({
						showClose: true,
						message: '索要成功',
						type: 'success',
						duration: 1000
					});
					this.switchdis = true
				})
				
			},
			viewPic(id){
				console.log(this.orderid+id)
				this.$api.order.checkAskPictures({orderId: this.orderid, partsDetaId: id, partsDetaValue:name}).then(res => 
				{	
					// debugger
				})
				
			},
		},
		watch: {
			info(o, n){
				// debugger
				this.tableData = o;
				
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
