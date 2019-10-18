<template>
	<BasePage>
		<div class="factory-info">
			<div class="handler">
				<el-row>
					<el-col class='btn' :span="24 / handlerBtn.length" v-for="(item, index) in handlerBtn" :key="index"
						:style="{backgroundColor: item.color}"
					>
						<div @click="execute(item.method)">
							{{ item.text }}
						</div>
					</el-col>
				</el-row>
			</div>
			
			<div class="form">
				<el-form label-width="170px" :model="form" ref="form" :rules="$g.rules.engine">
					<el-form-item prop="oilyType" label="油质种类：">
						<el-select v-model="form.oilyType" placeholder="请选择油质种类" style="width: 100%;">
							<el-option value="汽油">汽油</el-option>
							<el-option value="柴油">柴油</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="textureType" label="材质种类：">
						<el-select v-model="form.textureType" placeholder="请选择材质种类" style="width: 100%;">
							<el-option value="全铝">全铝</el-option>
							<el-option value="铁铝">铁铝</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="品牌：" prop="brand">
						<el-input v-model="form.brand" placeholder="请输入品牌"></el-input>
					</el-form-item>
					<el-form-item label="型号：" prop="model">
						<el-input v-model="form.model" placeholder="请输入型号"></el-input>
					</el-form-item>
					<el-form-item prop="atOrMt" label="AT/MT：">
						<el-select v-model="form.atOrMt" placeholder="请选择AT/MT" style="width: 100%;">
							<el-option value="AT">AT</el-option>
							<el-option value="MT">MT</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			

		</div>
	</BasePage>
</template>

<script>
	export default {
		computed: {
			handlerBtn(){
				if(this.type === 'create'){
					return [this.btns[0], this.btns[2]];
				}
				return [this.btns[1], this.btns[2]];
			},
		},
		data() {
			return {
				type: 'detail',
				btns: [
					{text: '提交', color: '#409EFF', method:'submit'},
					{text: '修改', color: '#67C23A', method: 'submit'},
					{text: '取消', color: '#909399', method: 'cancel'},
				],
				form: {
					
				},
			}
		},
		methods: {
			execute(method){
				this[method]();
			},
			submit(){
				console.log(this.form)
				this.$refs.form.validate((valid) => {
					if(valid){
						this.save();
					}else{
						return false;
					}
				});
			},
			getDetail(){
				this.$api.parts.engineFactoryDetail(this.$route.params.id).then(res => {
					this.form = res.data;
				})
			},
			save(){
				this.$api.parts.engineFactorySave(this.form).then(res => {
					this.$message.success('修改成功');
					this.$router.go(-1);
				});
			},
			cancel(){
				this.$router.go(-1);
			},
			
		},
		mounted(){
			this.getDetail();
		}
	}
</script>

<style lang="scss">
	.factory-info{
		padding-bottom: 50px;
		padding: 20px 40px 50px 0;
		text-align: center;
		height: 100%;
		
		.handler{
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #5A9CF8;
			height: 50px;
			line-height: 50px;
			text-align: center;
			font-size: 20px;
			color: #FFF;
			user-select: none;
			
			.btn:hover{
				font-weight: bold;
				cursor: pointer;
			}
			.btn:active{
				opacity: 0.8;
			}
		}
		
		.form{
			width: 100%;
			display: inline-block;
			margin: 0 auto;
			height: 100%;
			overflow: auto;
		}
	}
</style>
