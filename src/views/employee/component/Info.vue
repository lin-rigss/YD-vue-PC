<template>
	<BasePage>
		<div class="user-info">
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
				<el-form label-width="140px" :model="form" ref="form" :rules="$g.rules.user">
					<el-form-item label="员工账号：" prop="account">
						<el-input v-model="form.account" placeholder="" disabled=""></el-input>
					</el-form-item>
					<el-form-item label="员工姓名：" prop="extendProperty.name">
						<el-input v-model="form.extendProperty.name" placeholder="请输入员工姓名"></el-input>
					</el-form-item>
					<el-form-item label="手机号码：" prop="mobile">
						<el-input v-model="form.mobile" placeholder="请输入员工手机号码" :blur="form.account=form.mobile"></el-input>
					</el-form-item>
					<el-form-item label="邮箱：" prop="extendProperty.email">
						<el-input v-model="form.extendProperty.email" placeholder="请输入邮箱"></el-input>
					</el-form-item>
					<el-form-item label="部门角色：" prop="extendProperty.department">
						<el-tree
							ref="dept"
							node-key="id"
							:props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
							show-checkbox
							:data="tree"
							default-expand-all
							@check="checkGroupNode"
							:default-checked-keys="form.extendProperty.department"
						>
							<!-- lazy -->
							<!-- :load="structureLoad" -->
							<span class="" slot-scope="{ node, data }">
								<span>
									<span>
										<span v-if="data.orgId">
											<el-tag size="mini" type="warning">角色</el-tag>
										</span>
										<span v-else="">
											<el-tag size="mini" type="info">部门</el-tag>
										</span>
									</span>
									<span>{{ node.label }}</span>
									<StatusLabel type="status" :value="data.status" :showText="false" ></StatusLabel>
								</span>
							</span>
						</el-tree>
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
				type: '',
				btns: [
					{text: '提交', color: '#409EFF', method:'submit'},
					{text: '修改', color: '#67C23A', method: 'submit'},
					{text: '取消', color: '#909399', method: 'cancel'},
				],
				form: {
					extendProperty: {
						department: [],
						departmentName: [],
					},
					status: '1',
				},
				dept: [],
				station: [],
				tree: [],
			}
		},
		methods: {
			execute(method){
				this[method]();
			},
			submit(){
				let sels = this.$refs.dept.getCheckedNodes();
				sels = sels.filter(item => item.orgId);
				console.log(sels)
				
				this.form.extendProperty.department = sels.map(item => item.id);
				this.form.extendProperty.departmentName = sels.map(item => item.name);
				
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
			checkGroupNode: function (a, b) {
				if (b.checkedKeys.length > 0) {
					this.$refs.dept.setCheckedKeys([a.id]);
				}
			},
			structureLoad(node, resolve){
				if(node.level === 0){
					this.$api.role.getTree().then(res => {
						this.dept = res.data.map(item => {
							return {
								...item,
								disabled: true
							}
						})
						resolve(this.dept);
					})
				}else{
					this.$api.role.getOrgStation(node.data.id, false).then(res => {
						let arr = node.data.children.map(item => {
							return {
								...item,
								disabled: true
							}
						}).concat(res.data.map(item => {
							return {
								...item,
								leaf: true
							}
						}));
						resolve(arr);
					})
				}
			},
			getTree(){
				this.$api.role.stationTree().then(res => {
					this.tree = res.data;
				});
			}
			
		},
		mounted(){
			this.getTree();
		}
	}
</script>

<style lang="scss">
	.user-info{
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
		
		.el-tree{
			margin-top: 8px;
		}
	}
</style>
