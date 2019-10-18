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
				<el-form label-width="170px" :model="form" ref="form" :rules="$g.rules.factory">
					<el-form-item label="登录账号(手机号)：" prop="account">
						<el-input v-model="form.account" placeholder="请输入手机号" :disabled="type === 'detail'"></el-input>
					</el-form-item>
					<el-form-item label="拆解厂名称：" prop="extendProperty.comName">
						<el-input v-model="form.extendProperty.comName" placeholder="请输入企业名称"></el-input>
					</el-form-item>
					<el-form-item label="拆解厂描述：" prop="extendProperty.comDesc">
						<el-input type="textarea" v-model="form.extendProperty.comDesc" placeholder="请输入企业描述"></el-input>
					</el-form-item>
					<el-form-item label="门店地址：" prop="extendProperty.comAddress">
						<el-input type="textarea" v-model="form.extendProperty.comAddress" placeholder="请输入企业地址"></el-input>
					</el-form-item>
					<el-form-item label="联系人：" prop="extendProperty.comConcat">
						<el-input v-model="form.extendProperty.comConcat" placeholder="请输入企业联系人"></el-input>
					</el-form-item>
					<el-form-item label="联系人电话：" prop="extendProperty.comPhone">
						<el-input v-model="form.extendProperty.comPhone" placeholder="请输入企业联系人电话"></el-input>
					</el-form-item>
					<el-form-item label="开发负责人：" prop="extendProperty.agent" style="text-align: left;">
						<!-- <template v-if="type === 'detail'">
							{{ showAgent(form.extendProperty.agent) }}
						</template> -->
						<template>
							<el-select v-model="form.extendProperty.agent" :style="{width: '100%'}" placeholder="请选择开发负责人">
								<el-option v-for="(e, index) in employees" :key="index" :value="e.userCode" :label="e.name" >
									<span style="float: left">{{ e.userCode }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ e.name }}</span>
								</el-option>
							</el-select>
						</template>
					</el-form-item>
					<el-form-item label="业务负责人：" prop="extendProperty.salesman" style="text-align: left;">
						<el-select v-model="form.extendProperty.salesman" :style="{width: '100%'}" placeholder="请选择业务负责人">
							<el-option v-for="(e, index) in employees" :key="index" :value="e.userCode" :label="e.name" >
								<span style="float: left">{{ e.userCode }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ e.name }}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="注册时间：" v-if="type === 'detail'" style="text-align: left; color: #606266;">
						{{ form.createTime }}
					</el-form-item>
					<el-form-item label="状态：" style="text-align: left;">
						<el-radio-group v-model="form.status">
							<el-radio v-for="(item, index) in $g.dic.status" :key="index" :label="item.value">{{ item.name }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</div>
			

		</div>
	</BasePage>
</template>

<script>
	import EmployeeSelect from '@/components/EmployeeSelect'
	export default {
		components: {
			EmployeeSelect
		},
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
				type: '',
				btns: [
					{text: '提交', color: '#409EFF', method:'submit'},
					{text: '修改', color: '#67C23A', method: 'submit'},
					{text: '取消', color: '#909399', method: 'cancel'},
				],
				form: {
					extendProperty: {},
					status: '1',
				},
				employees: [],
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
			save(){
				
			},
			cancel(){
				this.$router.go(-1);
			},
			showAgent(agent){
				let dt = this.employees.find(item => item.userCode === agent) || {};
				return `${dt.name} ( ${agent} )` ;
			}
			
		},
		mounted(){
			this.$api.employee.employees().then(res => {
				this.employees = res.data;
			});
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
