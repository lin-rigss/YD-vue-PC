<template>
	<BasePage>
		<div class="org-structure">

			<el-row :gutter="50">
				<el-col :span="12">

					<div class="title">部门列表</div>

					<TreeEditor 
						:data="tree.data" 
						:prop="{
							id: 'id',
							label: 'name',
							child: 'children',
							status: 'status',
						}"
						@addChild="addChild" 
						@add="add" 
						@update="update" 
						@delete="del" 
						@click="nodeClick" 
						label
					>
						<template slot="label" slot-scope="scope">
							<el-tag v-if="scope.data.id === -999" size="mini" type="warning">公司</el-tag>
							<el-tag v-else size="mini" type="info">部门</el-tag>
						</template>
					</TreeEditor>
				</el-col>
				<el-col :span="12">
					<div class="title">角色列表</div>

					<div class="xm-panel">
						<div class="xm-panel-body">
							<div v-if="tree.station.length">
								<div v-for="(item, index) in tree.station" :key="index" :class="index == 0? '': 'border-top'">
									<span style="font-size: 14px;" :style="item.status == '0' && 'text-decoration:line-through; color: #ccc'">{{item.name}}</span>
									<span style="float: right;">
										<el-button type="text" size="mini" @click="updateStationBtn(item)">编辑</el-button>
										<el-button type="text" size="mini" style="color: red;" @click="delStation(item, index)">删除</el-button>
									</span>
								</div>
							</div>
							<div v-else="" style="text-align: center;">
								暂无角色数据
							</div>
						</div>
						<div class="xm-panel-footer" style="text-align: right;">
							<el-button @click="addStation" size="mini" type="primary" plain :disabled="!tree.struct">
								<svg-icon icon-class="add"></svg-icon>
								添加角色
							</el-button>
						</div>
					</div>
				</el-col>
			</el-row>

			<el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="50%" @closed="dialogClosed">
				<el-form :model="dialog.form" label-width="80px" ref="form" :rules="$g.rules.role">
					<el-form-item :label="dialog.type <= 3 ? '部门名称': '角色名称'" prop="name">
						<el-input v-model="dialog.form.name"></el-input>
					</el-form-item>
					<el-form-item label="是否启用">
						<el-radio-group v-model="dialog.form.status" prop="status">
							<el-radio v-for="(item, index) in $g.dic.status" :key="index" :label="item.value">{{ item.name }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button @click="dialog.visible = false">取 消</el-button>
					<el-button type="primary" @click="dialogSubmit">确 定</el-button>
				</span>
			</el-dialog>

		</div>
	</BasePage>
	
</template>

<script>
	export default {
		components: {
			TreeEditor: () => import('@/components/TreeEditor')
		},
		data() {
			return {
				//树形结构数据
				tree: {
					data: [],
					station: [],
					struct: null,
				},
				//弹出框
				dialog: {
					id: null,
					title: '',
					visible: false,
					form: {

					},
					data: null,
					//1:update, 2:add, 3:addChild
					type: null,
					types: [
						'编辑', '新增同级', '新增子级',
						'角色编辑', '角色新增'
					]
				},
			}
		},
		methods: {
			//新增子节点
			addChild(node, data) {
				if (!data.children) {
					this.$set(data, 'children', []);
				}
				this.dialogShow(3, data.children, {
					name: data.name,
					id: data.id,
				}, {
					status: '1'
				});
			},
			//新增同级节点
			add(node, data) {
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				this.dialogShow(2, children, {
					name: data.name,
					id: parent.data.id || "",
				}, {
					status: '1'
				});
			},
			//编辑节点
			update(node, data) {
				this.dialogShow(1, data, {
					name: data.name,
					id: node.parent.data.id || "",
				}, {
					status: '1',
					...data
				});
			},
			//删除节点
			del(node, data) {
				this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.role.del(data.id).then(res => {
						this.$message.success('删除成功!');
						node.remove(data);
					})
				}).catch(() => { });
			},
			nodeClick(data, node) {
				if(data.id === -999){
					return ;
				}
				this.tree.struct = data;
				this.$api.role.getOrgStation(data.id).then(res => {
					this.tree.station = res.data;
				});
			},
			addStation() {
				this.dialogShow(5, {}, {
					name: this.tree.struct.name,
					id: this.tree.struct.id,
				}, {
					status: '1'
				});
			},
			updateStationBtn(item) {
				this.dialogShow(4, item, {
					name: this.tree.struct.name,
					id: this.tree.struct.id,
				}, {
					status: '1',
					...item
				});
			},
			delStation(item, index) {
				this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.role.delOrgStation(item.id).then(res => {
						this.$message.success('删除成功!');
						this.tree.station.splice(index, 1)
					})
				}).catch(() => {});
			},
			dialogShow(type, data, { name, id }, form, visible = true) {
				this.dialog.id = id;
				this.dialog.type = type;
				this.dialog.data = data;
				this.dialog.form = form;
				this.dialog.title = type ? `【 ${name} 】${this.dialog.types[type - 1]}` : '';
				this.dialog.visible = visible;
			},
			dialogClosed() {
				this.dialogShow(null, null, {}, {}, false);
			},
			dialogSubmit(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.submit();
					} else {
						return false;
					}
				});
			},
			submit() {
				if (this.dialog.type == 1) {
					// 修改编辑部门
					this.updateMenu('您确定要修改该部门吗？', res => {
						Object.assign(this.dialog.data, this.dialog.form)
					})
				} else if (this.dialog.type == 2 || this.dialog.type == 3) {
					// 新增下级 或 平级
					this.updateMenu('您确定要添加该部门吗？', res => {
						this.dialog.form = res.data;
						this.dialog.data.push(this.dialog.form);
					})
				} else if (this.dialog.type == 4) {
					// 修改编辑 角色
					this.updateStation(this.dialog.data, '您确定要修改该角色吗？', res => {
						Object.assign(this.dialog.data, this.dialog.form)
					})
				} else if (this.dialog.type == 5) {
					// 新增角色
					this.updateStation({
						orgId: this.tree.struct.id
					}, '您确定要添加该角色吗？', res => {
						this.tree.station.push({
							...this.dialog.form,
							id: res.data
						})
					})
				}
			},
			updateStation(data, tips, callback) {
				this.$confirm(tips, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.role.saveOrgStation({
						...data,
						...this.dialog.form,
					}).then(res => {
						this.$message.success('操作成功!');
						callback && callback(res);
						this.dialogClosed();
					})
				}).catch(() => {});
			},
			updateMenu(tips, callback) {
				this.$confirm(tips, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.role.save({
						parentId: this.dialog.id === -999 ? "" : this.dialog.id,
						...this.dialog.form,
					}).then(res => {
						this.$message.success('操作成功!');
						callback && callback(res);
						this.dialogClosed();
					})
				}).catch(() => {});
			},
			nodeDrop(menus) {
				saves({
					menus
				}).then(res => {});
			},
			createNewChild() {
				let newChild = {
					id: Date.now(),
					label: '12333',
					high: 'color: #4594D5; font-weight: bold;',
				};

				setTimeout(() => {
					newChild.high = '';
					delete newChild.high;
				}, 5000);

				return newChild;
			}
		},
		mounted() {
			this.$api.role.getTree().then(res => {
				this.tree.data = res.data;
			})
		}
	}
</script>

<style lang="scss">
	.org-structure {
		.title {
			padding: 0 20px;
			margin: 10px 0;
			border-left: 3px solid coral;
		}

		.border-top {
			border-top: 1px solid #f0f0f0;
		}
	}
</style>
