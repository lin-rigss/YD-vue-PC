<template>
	<BasePage>
		<div class="coding-allot">
			
			<div class="aside">
				<el-row :gutter="20">
					<el-col :span="9">
						<el-input placeholder="请输入申请编号" v-model="form.code" :size="size">
							<template slot="prepend">编号</template>
						</el-input>
					</el-col>
					<el-col :span="9">
						<div class="el-input el-input--small el-input-group el-input-group--prepend">
							<div class="el-input-group__prepend">状态</div>
							<el-select :size="size" v-model="form.status" style="width: 100%;">
								<el-option label="全部" value=""></el-option>
								<el-option v-for="(item, index) in $g.dic.codingAllotStatus" :key="index" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="6">
						<el-row :gutter="10">
							<el-col :span="8">
								<el-button :size="size" type="primary" style="width: 100%;" @click="list">提交</el-button>
							</el-col>
							<el-col :span="16">
								<el-button :size="size" type="primary" style="width: 100%;" @click="toAllot({})">
									<svg-icon icon-class="create"></svg-icon>
									申请编码
								</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</div>
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="code" width="120" label="申请编号" :align="config.align"></el-table-column>
				<el-table-column width="120" label="申请人" :align="config.align">
					<template slot-scope="scope">
						{{ scope.row.assignName }} <br/>
						{{ scope.row.assignCall }}
					</template>
				</el-table-column>
				<el-table-column prop="addr" min-width="150" label="收件地址" :align="config.align"></el-table-column>
				<el-table-column min-width="150" label="申请个数" :align="config.align">
					<template slot-scope="scope">
						<span v-html="scope.row.detailList.join('<br/>')"></span>
					</template>
				</el-table-column>
				<el-table-column width="120" label="状态" fixed="right" :align="config.align">
					<template slot-scope="scope">
						<span v-html="$g.dic.html('codingAllotStatus', scope.row.status)"></span>
					</template>
				</el-table-column>
				<el-table-column prop="buyTime" width="160" label="申请时间" :align="config.align"></el-table-column>
				<el-table-column label="操作" width="120" fixed="right" :align="config.align">
					<template slot-scope="scope">
						<span v-if="$g.dic.exp('codingAllotStatus', scope.row.status).name == '待分配'">
							<span><el-button type="text" :size="size" @click="toAllot(scope.row)">分配</el-button></span>
						</span>
						<span v-else="">
							<el-button type="text" :size="size" @click="toDetail(scope.row)">查看编码</el-button>
						</span>
					</template>
				</el-table-column>
			</el-table>
			
			<div class="pagination">
				<el-pagination
				  background
				  @size-change="sizeChange"
				  @current-change="currentChange"
				  :current-page="form.pageIndex"
				  :page-sizes="config.sizes"
				  :page-size="form.pageSize"
				  layout="total, sizes, prev, pager, next, jumper"
				  :total="total">
				</el-pagination>
			</div>
			
			<AllotInfo v-if="show" :detail="info" @refresh="list" @close="show = false"></AllotInfo>
			
		</div>
	</BasePage>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		components: {
			AllotInfo: () => import('./AllotInfo')
		},
		data() {
			return {
				params: {},
				form: {
					code: '',
					status: '',
				},
				tableData: [],
				size: 'small',
				show: false,
				info: {},
			}
		},
		computed: {
			tableHeight(){
				return 'calc(100vh - 210px)';
			}
		},
		methods: {
			toDetail(row){
				this.info = row;
				this.show = true;
			},
			toAllot(row){
				this.info = row;
				this.show = true;
			},
			list(){
				this.$api.allot.list(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				});
			}
		},
		mounted() {
			this.list();
		}
	}
</script>

<style lang="scss">
	.coding-allot{
		.title-div{
			height: 40px;
			line-height: 40px;
		}
		
		.aside{
			.el-input-group--append .el-select .el-input.is-focus .el-input__inner, .el-input-group--prepend .el-select .el-input.is-focus .el-input__inner{
				border-color: #409EFF;
			}
		}
		
		.table-expand {
			font-size: 0;
			label {
				width: 90px;
				color: #99a9bf;
			}
			.el-form-item {
				margin-right: 0;
				margin-bottom: 0;
				width: 100%;
			}
		}
		
		.el-dialog__body{
			padding: 10px 20px;
		}
	}
</style>
