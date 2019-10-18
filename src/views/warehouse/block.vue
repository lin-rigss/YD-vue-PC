<template>
	<BasePage>
		<div class="warehouse-block">
			
			<div class="aside">
				<span class="title">当前大区数量：{{ 6 }}</span>
				
				<div class="right">
					<el-button type="primary" size="mini">新增大仓</el-button>
				</div>
				
			</div>
			
			<el-row :gutter="20">
				<el-col :span="12" v-for="i in 6" :key="i">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>华北大区</span>
							<div style="float: right;" class="right">
								<el-button type="text"> 编辑 </el-button>
								<el-button type="text" @click="toInfo"> 管理 </el-button>
							</div>
						</div>
						<div v-for="o in 4" :key="o" class="text item">
							
							<el-button size="mini" type="text">
								区域 {{ o }}
							</el-button>
						</div>
					</el-card>
				</el-col>
			</el-row>
			
			
		</div>
	</BasePage>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toInfo() {
				this.$router.push({
					name: 'warehouse-partition',
					params: {
						id: 1,
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.warehouse-block{
		.box-card{
			margin-bottom: 20px;
			
			.right{
				.el-button{
					padding: 3px 0;
				}
			} 
		}
	}
</style>
