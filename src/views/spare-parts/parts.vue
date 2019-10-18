<template>
	<!-- 严选配件列表 -->
	<BasePage>
		<div class="parts-list">
			<el-row :gutter="20" style="height: 100%;">
				<el-col :span="10" style="height: 100%;overflow: auto;">
					<div class="title">
						严选列表
						<!-- <div style="float: right;">
							<el-button type="text" style="padding: 1px 0;">全部展开</el-button>
						</div> -->
					</div>
					<!-- <el-input
						placeholder="输入关键字进行过滤"
						v-model="filterText">
					</el-input> -->
					<div style="margin-bottom:10px;" @click="showTree">
						<span style="color:#409EFF;">公司</span> 油滴互联（北京）信息技术有限公司
					</div>
					<el-tree
					    v-if="isTree"
					    ref="tree"
						node-key="id"
  						:filter-node-method="filterNode"
						:props="{ label: 'nameZn',  isLeaf: 'leave' }"
						:load="partloadNode"
						lazy
						@node-click="handleNodeClick">
						<span slot-scope="{ node, data }">
							<span>
								<span>
									<el-tag size="mini" :type="levelData[node.level].type">{{ levelData[node.level].name }}</el-tag>
									{{ data.nameZn }}
								</span>
								<StatusLabel type="status" :showText="false" :value="data.status"></StatusLabel>
							</span>
						</span>
					</el-tree>
					
				</el-col>
				<el-col :span="10" :offset="2" style="height: 90%;">
					<div class="title">详情</div>
					<div class="xm-panel">
						<div class="xm-panel-title">
							<el-breadcrumb separator="/" class="title" style="border-left:3px solid #409efc;">
								<el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">{{ item }}</el-breadcrumb-item>
							</el-breadcrumb>
						</div>
						<div class="xm-panel-body">
							<div v-if="!checkData || !checkData.length" style="text-align: center; color: var(--grey);">暂无数据</div>
							<div v-for="(item, i) in checkData" :key="i" style="position: relative;">
								<span>{{ item.nameZn }}</span>
								<div class="divider" v-if="i != checkData.length - 1"></div>
								<span style="position: absolute;right: 0; top: 0;">
									<el-button size="mini" type="text" @click="edit(item, i)">编辑</el-button>
									<el-button size="mini" type="text" @click="del(item, i)" style="color: var(--red);">删除</el-button>
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
			<el-form :model="form" ref="form" :rules="$g.rules.parts">
				<el-form-item label="中文名称：" :label-width="dialog.labelWidth" prop="nameZn">
					<el-input v-model="form.nameZn" autofocus autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="英文名称：" :label-width="dialog.labelWidth" prop="nameEn">
					<el-input v-model="form.nameEn" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="unit" v-if="checkRightData.level >= 1" label="单位" :label-width="dialog.labelWidth">
					<el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%;">
						<el-option v-for="(item, index) in $g.dic.unit" :key="index" :label="`${item.cname} ( ${item.ename} )`" :value="item.value">
							<span style="float: left">{{ item.cname }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.ename }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item v-if="checkRightData.level >= 1" label="最小起订量" :label-width="dialog.labelWidth">
					<el-input :min="1" v-model="form.minOrder" type="number" placeholder="请输入最小起订量" autocomplete="off"></el-input>
				</el-form-item> -->
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
import StatusLabel from '@/components/StatusLabel'
	export default {
		data() {
			return {
				form: {
				
				},
				filterText: '',
				partsTree: [],
				checkData: {},
				checkRightData: {},
				checkNode: {},
				isTree: false,
				levelData: [
					null,
					{name: '一级', type: 'warning', color: '#E6A23C'},
					{name: '二级', type: 'primary', color: '#409EFF'},
					{name: '三级', type: 'success', color: '#67C23A'},
					{name: '四级', type: 'info', color: '#909399'},
					{name: '五级', type: 'danger', color: ''},
					{name: '六级', type: 'danger', color: ''},
				],
				dialog: {
					show: false,
					title: '',
					labelWidth: '100px',
					type: 0,//1:新增, 2:更新
					index: 0,
				},
				form: {
					minOrder: 1
				}
			}
		},
		watch: {
			filterText(val) {
				// debugger
				// this.$refs.tree.filter(val);
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
			showTree(){
				this.isTree = !this.isTree
				this.$api.parts.getList().then(res => {
					this.partsTree = []
					this.partsTree = res.data.map(item => {
						return {
								...item,
								children: [],
								leave:false
							}
					});	
					if(this.isTree){
						this.checkData = res.data
					}else{
						this.checkData=[]
					}
					this.checkNode = res.data
					this.checkRightData =[]
				})
				
			},
			//一级分类
			list(){
				
				
			},
			//过滤
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			//懒加载
			partloadNode(node, resolve) {
				
				this.partsTree = []
				if(node.level === 0){
					this.$api.parts.getList().then(res => {
						this.partsTree = res.data.map(item => {
							return {
								...item,
								children: [],
								leave:false
							}
						})
						resolve(this.partsTree);
					})
				}else{
					this.$api.parts.getSecondList(node.data.id).then(res => {
						this.checkData = res.data

						if(res.data.length == 0){
							return resolve([]);
						}
						let arr = node.data.children.map(item => {
							return {
								...item,
								children: [],
								leave:false
							}
						}).concat(res.data.map(item => {
							return {
								...item,
								children: [],
							}
						}));
						resolve(arr);
					})
				}
			},
			//节点被点击
			handleNodeClick(data, node) {
				// this.checkData = data;
				this.checkRightData = data;
				this.checkNode = node;
				console.log(this.checkData)
				this.$api.parts.getSecondList(node.data.id).then(res => {
					this.checkData = res.data
				})
			},
			add(){
			console.log(this.checkRightData.nameZn)
			console.log(this.next.name)
			if(!this.checkRightData.nameZn){
				this.checkRightData.nameZn = '油滴'
			}
			if(!this.next.name){
				this.next.name = '一级'
			}
				this.dialog.title = `【${this.checkRightData.nameZn}】新增${this.next.name}`;

				this.form = {
					status: '1',
				}
				this.dialog.type = 1;
				this.dialog.show = true;
			},
			edit(item, index){
				this.dialog.title = `编辑【${item.nameZn}】`;
				this.form = JSON.parse(JSON.stringify(item));
				this.dialog.index = index;
				this.dialog.type = 2;
				this.dialog.show = true;
			},
			del(item, index){
				this.$confirm(`此操作将永久删除该${item.nameZn}, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.parts.del(item.id).then(res => {
						this.$message.success('删除成功!');
						this.checkData.splice(index, 1);
						this.list()
						this.partloadNode()
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
						this.list()
					} else {
						return false;
					}
				});
			},
			create(){
				this.$api.parts.save({
					...this.form,
					parentId: this.checkRightData.id == 0 ? null : this.checkRightData.id,
					minOrder: 1
				}).then(res => {
					this.$message.success('新增成功!');
					if(this.checkRightData){
						this.checkData.push(res.data)
					}
					this.dialog.show = false;
				})
			},
			update(){
				this.$api.parts.save({	
                    id: this.form.id,
                    minOrder: 1,
                    nameZn: this.form.nameZn,
                    status: this.form.status,
					unit: this.form.unit,
					nameEn: this.form.nameEn,
					parentId: this.checkRightData.id == 0 ? null : this.checkRightData.id,
					minOrder: 1
				}).then(res => {
					this.$message.success('更新成功!');
					this.$set(this.checkData, this.dialog.index, res.data);
					this.dialog.show = false;
				})
			}
		},
		mounted(){
			// this.list();
		}
	}
</script>

<style lang="scss">
	.parts-list{
		.title{padding: 0 20px; margin: 10px 0; border-left: 3px solid coral;}
		
		.divider{
			height: 1px;
			width: 100%;
			margin: 10px 0;
			background-color: #dcdfe6;
			position: relative;
		}
		.xm-panel .xm-panel-body{
			height: 90%;
        	overflow: auto;
		}
		.xm-panel{
			height: 100%;
		}
	}
</style>
