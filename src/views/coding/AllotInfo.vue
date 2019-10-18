<template>
	<div class="buy-info">
		<el-dialog :title="title" :visible="true" width="50%" :before-close="handleClose" top="5vh">
			<span slot="footer" class="dialog-footer">
				<div class="show-count">分配数量: {{ count }}</div>
				<div v-if="!history">
					<el-button @click="handleClose">取 消</el-button>
					<el-button type="primary" @click="submit">提 交</el-button>
				</div>
				<div v-else="">
					<el-button @click="handleClose">关 闭</el-button>
				</div>
			</span>
			
			<el-form label-position="left" class="table-expand">
				<el-form-item label="员工ID">
					<div class="el-input" v-if="detail.id">{{ detail.assignId }}</div>
					<div v-else="">
						<el-select v-model="info.assignId" :style="{width: '100%'}" @change="changeEmployee" placeholder="请选择员工">
							<el-option v-for="(e, index) in employees" :key="index" :value="e.userCode" :label="e.userCode" >
								<span style="float: left">{{ e.userCode }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ e.name }}</span>
							</el-option>
						</el-select>
					</div>
				</el-form-item>
				<el-form-item label="联系人姓名">
					<div class="el-input" v-if="history">{{ info.assignName }}</div>
					<el-input v-else="" v-model="info.assignName" placeholder="请输入联系人姓名"></el-input>
				</el-form-item>
				<el-form-item label="联系人手机">
					<div class="el-input" v-if="history">{{ info.assignCall }}</div>
					<el-input v-else="" v-model="info.assignCall" placeholder="请输入联系人手机"></el-input>
				</el-form-item>
				<el-form-item label="收货地址">
					<div class="el-input" v-if="history">{{ info.addr }}</div>
					<el-input v-else="" v-model="info.addr" placeholder="请输入收货地址"></el-input>
				</el-form-item>
				<el-form-item label="分配明细">
					<el-table :data="tableData" style="width: 100%" size="mini" border :span-method="arraySpanMethod">
						<el-table-column label="类型" width="80" :align="config.align">
							<template slot-scope="scope">
								{{ scope.row.type == 1 ? '严选' : '统货' }}
							</template>
						</el-table-column>
						<el-table-column label="颜色" width="80" :align="config.align">
							<template slot-scope="scope">
								<el-tag size="small" :type="$g.dic.exp('colors', scope.row.color).type">{{ $g.dic.exp('colors', scope.row.color).name }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="申请数量" width="100" :align="config.align">
							<template slot-scope="scope">
								{{ scope.row.assignNum }}
							</template>
						</el-table-column>
						<el-table-column label="分配详情" min-width="100" :align="config.align" v-if="history">
							<template slot-scope="scope">
								<div>
									{{ scope.row.coding }}
								</div>
							</template>
						</el-table-column>
						<el-table-column label="已分配" width="80" :align="config.align" v-if="!history">
							<template slot-scope="scope">
								{{ scope.row.data.length * 100 }}
							</template>
						</el-table-column>
						<el-table-column label="分配" :align="config.align" v-if="!history">
							<template slot-scope="scope">
								<el-select style="width: 100%;"
									v-model="scope.row.data"
									size="small"
									multiple
									filterable
									remote
									reserve-keyword
									placeholder="请输入编码组关键词"
									:remote-method="query => remoteMethod(query, scope.row)"
									:loading="loading"
									@focus="focus(scope.row)"
								>
									<el-option
										v-for="item in scope.row.options"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			
			
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: ['detail'],
		data() {
			return {
				loading: false,
				info: {
					assignName: '',
					assignCall: '',
					addr: '',
				},
				tableData: [
					{type: 1, color: 'G', colorName: '绿色', assignNum: 0, data: [], options: []},
					{type: 2, color: 'W', colorName: '白色', assignNum: 0, data: [], options: []},
				],
				config: {
					align: 'center'
				},
				options: [],
				title: '',
				employees: [],
			}
		},
		computed: {
			count() {
				return this.history ? this.info.totalNum : this.tableData.map(a => a.data.length * 100).reduce((a, b) => (a - 0) + (b - 0));
			},
			history(){
				return !!this.detail.id && this.detail.status == 1;
			}
		},
		methods: {
			remoteMethod(query, row){
				this.loading = true;
				this.$api.allot.group({
					color: row.color,
					code: query,
					type: row.type,
				}, false).then(res => {
					this.loading = false;
					row.options = res.data;
				});
			},
			focus(row){
				if(!row.options.length){
					this.remoteMethod('', row);
				}
			},
			handleClose() {
				this.$emit('close');
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }){
				// if(columnIndex == 0){
				// 	if (rowIndex % 2 === 0) {
				// 		return [2, 1];
				// 	}
				// 	return [0, 0];
				// }
			},
			inputNum(val, row){
				val = val - 0;
				if(isNaN(val)){
					val = 0;
				}
				row.num = val;
			},
			changeEmployee(e){
				let dt = this.employees.find(i => i.userCode == e);
				this.info.assignName = dt.name;
			},
			submit(){
				this.update();
			},
			update(){
				
				this.$api.allot.distribute({
					...this.info,
					detailList: this.tableData.map(item => ({
						type: item.type,
						assignNum: item.data.length * 100,
						color: item.color,
						codingList: item.data
					})),
					totalNum: this.count,
				}).then(res => {
					this.refresh();
					this.handleClose();
				})
			}
		},
		mounted() {
			
			this.detail.id && this.$api.allot.detail(this.detail.id).then(res => {
				this.info = res.data;
				this.tableData = res.data.detailList.map(item => ({...item, data: [], options: []}));
			});
			
			if(this.history){
				this.title = '查看编码';
			}else{
				this.$api.employee.employees().then(res => {
					this.employees = res.data;
				});
				
				this.title = '分配编码';
			}
		}
	}
</script>

<style lang="scss">
	.buy-info {
		.el-dialog__body{
			max-height: calc(90vh - 124px);
			overflow: auto;
		}
		.el-form-item__content{
			line-height: 20px;
		}
		.show-count{
			float: left;
			color: red;
			font-size: 24px;
		}
		.el-radio-group{
			height: 40px;
			line-height: 50px;
			vertical-align: middle;
			width: 100%;
		}
	}
</style>
