<template>
	<BasePage>
		<div class="business-permissions">
			<el-row :gutter="50">
				<el-col :span="12">
					<div class="title">部门角色列表</div>
					<el-tree
						ref="structureTree"
						node-key="id"
						:props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
						show-checkbox
						lazy
						:load="structureLoad"
						@check-change="checkChange"
					>
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
								<span>{{ showName(node, data) }}</span>
								<StatusLabel type="status" :value="data.status" :showText="false" ></StatusLabel>
							</span>
						</span>
					</el-tree>
				</el-col>
				
				<el-col :span="12">
					<div class="title">权限列表</div>
					
					<el-collapse v-model="names">
						<el-collapse-item title="浏览权限" name="1">
							<div v-for="(r, index) in permissions.browse" :key="index">
								<h5>{{ r.meta.title }}</h5>
								<el-checkbox-group v-model="check.browse">
									<el-checkbox v-for="(c, idx) in r.children" :key="idx" v-if="!c.hidden" :label="c.name" size="mini">{{ c.meta.title }}</el-checkbox>
								</el-checkbox-group>
							</div>
						</el-collapse-item>
					</el-collapse>
				</el-col>
				
			</el-row>
			
			<div class="handler">
				<el-button-group style="width: 100%; margin-bottom: 20px;">
					<el-button 
						v-for="(item, index) in btns" 
						:key="index" 
						:type="item.type" 
						:style="{width: (100/btns.length) + '%'}"
						@click="execute(item.method)"
					>{{ item.text }}</el-button>
				</el-button-group>
			</div>
			
		</div>
	</BasePage>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { constantRoutes } from '@/router/index.js';
	export default {
		computed: {
			 ...mapGetters([
				'routes',
			]),
		},
		data() {
			return {
				btns: [
					{text: '修改', color: '#67C23A', type: 'primary', method: 'submit'},
					{text: '清空', color: '#909399', type: 'danger', method: 'clear'},
				],
				structure: {
					tree: []
				},
				permissions: {
					browse: [],
				},
				check: {
					orgs: [],
					browse: [],
				},
				names: ['1']
			};
		},
		methods: {
			execute(method){
				this[method]();
			},
			showName(node, data){
				return node.label;
			},
			checkChange(data, checked, indeterminate){
				const indexs = this.check.orgs.indexOf(data.id)

				if (indexs < 0 && this.check.orgs.length === 1 && checked) {
					this.check.orgs = [data.id];
					this.$refs.structureTree.setCheckedKeys(this.check.orgs);
					this.showPermissions(data);
				} else if (this.check.orgs.length === 0 && checked) {
					this.check.orgs = [data.id]
					this.showPermissions(data);
				} else if (indexs >= 0 && this.check.orgs.length === 1 && !checked) {
					this.check.orgs = []
				}
			},
			showPermissions(data){
				if(data.disabled){
					return ;
				}
				this.$api.permissions.search(data.id/-1).then(res => {
					this.check.browse = res.data;
				})
			},
			structureLoad(node, resolve){
				
				if(node.level === 0){
					this.$api.role.getTree().then(res => {
						this.structure.tree = res.data.map(item => {
							return {
								...item,
								disabled: true
							}
						})
						resolve(this.structure.tree);
					})
				}else{
					this.$api.role.getOrgStation(node.data.id).then(res => {
						let arr = node.data.children.map(item => {
							return {
								...item,
								disabled: true
							}
						}).concat(res.data.map(item => {
							return {
								...item,
								id: item.id / -1,
								leaf: true
							}
						}));
						resolve(arr);
					})
				}
			},
			clear() {
				this.$refs.structureTree.setCheckedKeys([]);
				this.check.browse = [];
			},
			submit(){
				let stationId = this.check.orgs[0];
				if(!stationId){
					this.$message.error('请选择角色后赋予权限!');
					return ;
				}
				
				this.$confirm('您确定要提交吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.permissions.grant({
						stationId: stationId / -1,
						resourceNames: this.check.browse
					}).then(res => {
						this.$message.success('处理成功!')
					})
				}).catch(() => {});
			}
		},
		mounted(){
			//获取组织架构列表
			this.$api.role.getTree().then(res => this.structure.tree = res.data)
			//浏览权限
			// this.permissions.browse = this.routes.filter(r => !r.hidden);//constantRoutes.filter(r => !r.hidden);
			this.permissions.browse = constantRoutes.filter(r => !r.hidden);
		}
	}
</script>

<style scoped="scoped" lang="scss">
.business-permissions{
	padding-bottom: 50px;
	height: 100%;
	
	.title{padding: 0 20px; margin: 10px 0; border-left: 3px solid coral;}
	.handler{text-align: center; margin-top: 20px;}
	// .handler{
	// 	position: absolute;
	// 	bottom: 0;
	// 	left: 0;
	// 	right: 0;
	// 	background-color: #5A9CF8;
	// 	height: 50px;
	// 	line-height: 50px;
	// 	text-align: center;
	// 	font-size: 20px;
	// 	color: #FFF;
	// 	user-select: none;
	// 	
	// 	.btn:hover{
	// 		font-weight: bold;
	// 		cursor: pointer;
	// 	}
	// 	.btn:active{
	// 		opacity: 0.8;
	// 	}
	// }

}
</style>
