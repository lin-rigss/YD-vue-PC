<template>
	<BasePage>
		<div class="warehouse-index">
			<el-row :gutter="20">
				<el-col :span="12">
					<div class="title">
						列表
						<!-- <div style="float: right;">
							<el-button type="text" style="padding: 1px 0;">全部展开</el-button>
						</div> -->
					</div>
					<el-tree 
						:expand-on-click-node="false"
						:highlight-current="true"
						:data="treeData" 
						:node-key="'id'"
						:props="{label: 'name', children: 'children'}" 
						:default-expanded-keys="[0]"
						@node-click="handleNodeClick"
					>
						<span slot-scope="{ node, data }">
							<span>
								<span>
									<el-tag size="mini" :type="levelData[node.level].type">{{ levelData[node.level].name }}</el-tag>
									{{ data.name }}
								</span>
								<StatusLabel type="status" :showText="false" :value="data.status"></StatusLabel>
							</span>
						</span>
					</el-tree>
				</el-col>
				<el-col :span="12">
					<!-- <div class="title">详情</div> -->
					<div class="xm-panel" v-if="checkNode.level && checkNode.level != 6">
						<div class="xm-panel-title">
							<el-breadcrumb separator="/" class="title" :style="{borderLeftColor: title.color}">
								<el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">{{ item }}</el-breadcrumb-item>
							</el-breadcrumb>
						</div>
						<div class="xm-panel-body">
							<div v-if="!checkData.children || !checkData.children.length" style="text-align: center; color: var(--grey);">暂无数据</div>
							<div v-for="(item, index) in checkData.children" :key="index" style="position: relative;">
								<span>{{ item.name }}</span>
								<div class="divider" v-if="index != checkData.children.length - 1"></div>
								<span style="position: absolute;right: 0; top: 0;">
									<el-button size="mini" type="text" @click="edit(item, index)">编辑</el-button>
									<el-button size="mini" type="text" @click="del(item, index)" style="color: var(--red);">删除</el-button>
								</span>
							</div>
						</div>
						<div class="xm-panel-footer" style="text-align: right;">
							<el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="add">新增</el-button>
						</div>
					</div>
				</el-col>
			</el-row>

		</div>
		
		<el-dialog
			v-if="dialog.show"
			:title="dialog.title"
			:visible="true"
			:show-close="false"
			width="50%"
		>
			<el-form :model="form" ref="form" :rules="$g.rules.warehouse">
				<el-form-item label="名称：" :label-width="dialog.labelWidth" prop="name">
					<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注：" :label-width="dialog.labelWidth" prop="remarks">
					<el-input v-model="form.remarks" autocomplete="off" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="状态：" :label-width="dialog.labelWidth" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio v-for="(item, index) in $g.dic.status" :key="index" :label="item.value">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialog.show = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
		
		
	</BasePage>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				checkData: {},
				checkNode: {},
				levelData: [
					null,
					{name: '公司', type: 'warning', color: '#E6A23C'},
					{name: '仓库', type: 'primary', color: '#409EFF'},
					{name: '区域', type: 'success', color: '#67C23A'},
					{name: '货架', type: 'info', color: '#909399'},
					{name: '层', type: 'danger', color: ''},
					{name: '位置', type: 'danger', color: ''},
				],
				dialog: {
					show: false,
					title: '',
					labelWidth: '100px',
					type: 0,//1:新增, 2:更新
					index: 0,
				},
				form: {}
			}
		},
		computed: {
			treeData() {
				return [{
					id: 0,
					name: this.$store.state.settings.root,
					children: this.data,
					status: '1',
				}]
			},
			title(){
				return this.levelData[this.checkNode.level] || {};
			},
			next(){
				return this.levelData[this.checkNode.level + 1] || {};
			},
			breadcrumb(){
				
				let arr = [], n = this.checkNode;
				do{
					if(n.label){
						arr.push(n.label);
					}
					n = n.parent;
				}while(n)
				if(arr.length > 1){
					arr.splice(arr.length - 1, 1);
				}
				return arr.reverse();
			}
		},
		methods: {
			handleNodeClick(data, node) {
				this.checkData = data;
				this.checkNode = node;
				
			},
			add(){
				this.dialog.title = `【${this.checkData.name}】新增${this.next.name}`;
				this.form = {
					status: '1',
				}
				this.dialog.type = 1;
				this.dialog.show = true;
			},
			edit(item, index){
				this.dialog.title = `编辑【${item.name}】`;
				this.form = JSON.parse(JSON.stringify(item));
				this.dialog.index = index;
				this.dialog.type = 2;
				this.dialog.show = true;
			},
			del(item, index){
				this.$confirm(`此操作将永久删除该${this.next.name}, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.warehouse.del(item.id).then(res => {
						this.$message.success('删除成功!');
						this.checkData.children.splice(index, 1);
					})
				}).catch(() => { });
			},
			submit(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						if(this.dialog.type == 1){
							this.create();
						}else if(this.dialog.type == 2){
							this.update();
						}
					} else {
						return false;
					}
				});
			},
			create(){
				this.$api.warehouse.save({
					...this.form,
					parentId: this.checkData.id == 0 ? null : this.checkData.id
				}).then(res => {
					this.$message.success('新增成功!');
					this.checkData.children.push(res.data)
					this.dialog.show = false;
				})
			},
			update(){
				this.$api.warehouse.save({
					...this.form,
					parentId: this.checkData.id == 0 ? null : this.checkData.id
				}).then(res => {
					this.$message.success('更新成功!');
					this.$set(this.checkData.children, this.dialog.index, res.data);
					this.dialog.show = false;
				})
			}
		},
		mounted() {
			this.$api.warehouse.tree().then(res => {
				this.data = res.data;
			})
		}
	}
</script>

<style lang="scss">
	.warehouse-index {
		.title{padding: 0 20px; margin: 10px 0; border-left: 3px solid coral;}
		
		.divider{
			height: 1px;
			width: 100%;
			margin: 10px 0;
			background-color: #dcdfe6;
			position: relative;
		}
	}
</style>
