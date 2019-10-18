<template>
	<div class="tree-editor">

		<div class="tree-search" v-show="search">
			<el-input :placeholder="placeholder" v-model="filterText"></el-input>
		</div>
		
		<!-- draggable -->
		<!-- @node-drop="nodeDrop" -->
		<el-tree ref="tree"
			:data="treeData"
			:node-key="prop.id"
			:props="{label: prop.label, children: prop.child}"
			default-expand-all
			
			
			:expand-on-click-node="false"
			:filter-node-method="filterNode"
			:highlight-current="true"
			@node-click="nodeClick"
		>
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>
					<span v-if="label">
						<slot name="label" :node="node" :data="data"></slot>
					</span>
					<span :style="data.high ? data.high:''" v-html="highSearch(node.label)"></span>
					<StatusLabel type="status" :showText="false" :value="data[prop.status]"></StatusLabel>
				</span>
				<span v-show="clickNode.id == data.id">
					<span v-if="data.id === treeData[0].id">
						<el-button type="text" size="mini" @click="() => $emit('addChild', node, data)">
							新增下级
						</el-button>
					</span>
					<span v-else="">
						<el-button type="text" size="mini"
							v-for="(item, index) in handler" :key="index"
							:style="item.style ? item.style: ''"
							@click="() => $emit(item.method, node, data)"
						>
							{{ item.label }}
						</el-button>
					</span>
				</span>
			</span>
		</el-tree>

	</div>
</template>

<script>
	import StatusLabel from '@/components/StatusLabel'
	export default {
		props: {
			//节点数据数组
			data: {
				type: Array,
				required: false,
				default: () => {
					return []
				}
			},
			//节点key的映射
			prop: {
				type: Object,
				required: false,
				default: () => {
					return {
						id: 'id',
						label: 'label',
						child: 'children',
						status: 'status',
					}
				},
			},
			//搜索框默认提示
			placeholder: {
				type: String,
				required: false,
				default: '输入关键字进行过滤',
			},
			//是否显示搜索框
			search: {
				type: Boolean,
				required: false,
				default: true,
			},
			handler: {
				type: Array,
				required: false,
				default: () => {
					return [
						{label: '编辑', method: 'update'},
						{label: '新增同级', method: 'add'},
						{label: '新增下级', method: 'addChild'},
						{label: '删除', method: 'delete', style: {color: 'red', }},
					]
				},
			},
			label: {
				type: Boolean,
				required: false,
				default: false,
			}
		},
		data() {
			return {
				filterText: '',
				clickNode: {},
			};
		},
		computed: {
			treeData() {
				let obj = {};
				obj[this.prop.id] = -999;
				obj[this.prop.label] = this.$store.state.settings.root;
				obj[this.prop.child] = this.data;
				obj[this.prop.status] = "1";
				
				return [obj]
			}
		},
		methods: {
			dealHandle(node){
				console.log(node)
				return ""
			},
			filterNode(value, data) {
				if (!value) return true;
				if(!data[this.prop.label]) return false;
				return data[this.prop.label].indexOf(value) !== -1;
			},
			nodeClick(data, node, component){
				this.clickNode = data;
				this.$emit('click', data, node);
			},
			highSearch(label){
				if(label && this.filterText){
					let has = label.indexOf(this.filterText);
					if(has != -1){
						let left = label.substr(0, has);
						let center = `<span style="color: #ff9500; font-weight: bold;">${this.filterText}</span>`
						let right = label.substr(has + this.filterText.length);
						return `${left}${center}${right}`;
					}
				}
				return label;
			},
			nodeDrop(thisNode, targetNode, method, e){
				this.$emit('nodeDrop', this.data);
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
	}
</script>

<style scoped="scoped" lang="scss">
.tree-editor{
	.tree-search{margin-bottom: 10px;}

	.custom-tree-node{-ms-flex:1;flex:1;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;font-size:14px;padding-right:8px}
}
</style>
