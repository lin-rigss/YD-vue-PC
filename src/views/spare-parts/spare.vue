<template>
	<!-- 零件列表 -->
	<BasePage>
		<div class="spare-list">
			
			<div class="aside">
				<span class="title">类别名称：{{ goodsTypeInfo.nameZn }}</span>
				<el-button type="primary" size="mini" @click="toCreate">新增零件</el-button>
				<div class="search">
					<el-input class="search-input" style="min-width: 300px;"
						placeholder="请输入搜索内容回车进行搜索" 
						size="small"
						clearable
						v-model="form.key"
						@keyup.native.enter="list"
						@clear="list"
					>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
				</div>
			</div>
			
			<el-table :data="tableData" style="width: 100%" :size="config.size" :height="tableHeight" border>
				<el-table-column label="序号" width="50" fixed="left" :align="config.align">
					<template slot-scope="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column width="80" label="零件编号" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ scope.row.code }}
					</template>
				</el-table-column>
				<el-table-column label="零件名称" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ scope.row.nameZn }} ( {{ scope.row.nameEn }} )
					</template>
				</el-table-column>
				<el-table-column label="单位" width="100" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ showUnit(scope.row.unit) }}
					</template>
				</el-table-column>
				<el-table-column label="最小起订量" width="120" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						{{ scope.row.minOrder }}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="200" :align="config.align" :show-overflow-tooltip="config.hidden"></el-table-column>
				<el-table-column prop="status" label="状态" width="80" :filters="statusFilters" :filter-method="statusFilterHandler"
					:align="config.align" :show-overflow-tooltip="config.hidden"
				>
					<template slot-scope="scope">
						<StatusLabel type="status" :value="scope.row.status"></StatusLabel>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120" fixed="right" :align="config.align" :show-overflow-tooltip="config.hidden">
					<template slot-scope="scope">
						<el-button type="text" @click="toEdit(scope)">编辑</el-button>
						<span class="line">|</span>
						<el-button type="text" @click="changeStatus(scope.row, '1', 'enable')" v-if="scope.row.status == '0'">
							<span style="color: #67C23A;">启用</span>
						</el-button>
						<el-button type="text" @click="changeStatus(scope.row, '0', 'disable')" v-if="scope.row.status == '1'">
							<span style="color: #F56C6C;">禁用</span>
						</el-button>
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
			
			
			<el-dialog v-if="dialog.show" :title="dialog.title" :visible="dialog.show" append-to-body @close="() => {
				dialog.show = false;
				dialog.title = '';
				dialog.info = {status: '1'};
			}">
				<el-form :model="dialog.info" ref="form" :rules="$g.rules.parts">
					<el-form-item prop="nameZn" label="中文名称" :label-width="dialog.width">
						<el-input v-model="dialog.info.nameZn" placeholder="请输入配件分组中文名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item prop="nameEn" label="英文名称" :label-width="dialog.width">
						<el-input v-model="dialog.info.nameEn" placeholder="请输入配件分组英文名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item prop="nameEn" label="最小起订量" :label-width="dialog.width">
						<el-input v-model="dialog.info.nameEn" placeholder="请输入最小起订量" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item prop="unit" label="单位" :label-width="dialog.width">
						<el-select v-model="dialog.info.unit" placeholder="请选择单位" style="width: 100%;">
							<el-option v-for="(item, index) in $g.dic.unit" :key="index" :label="`${item.cname} ( ${item.ename} )`" :value="item.value">
								<span style="float: left">{{ item.cname }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.ename }}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="status" label="状态" :label-width="dialog.width">
						<el-radio v-model="dialog.info.status" v-for="(item, index) in $g.dic.status" :key="index" :label="item.value">{{ item.name }}</el-radio>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialog.show = false">取 消</el-button>
					<el-button type="primary" @click="toUpdate">确 定</el-button>
				</div>
			</el-dialog>
			
		</div>
	</BasePage>
</template>

<script>
	import BaseTable from '@/components/BaseTable'
	export default {
		extends: BaseTable,
		computed: {
			tableHeight(){
				return 'calc(100vh - 210px)';
			}
		},
		data() {
			return {
				form: {
					goodsTypeId: '',
					key: '',
				},
				goodsTypeInfo: {},
				tableData: [],
				dialog: {
					width: '160px',
					show: false,
					title: '',
					index: '',
					info: {
						status: '1',
					},
				}
			}
		},
		methods: {
			showUnit(unit){
				let row = this.$g.dic.unit.find(item => item.value === unit) || {};
				return `${row.cname} ( ${row.ename} )`
			},
			changeStatus(row, status, method){
				this.$api.spare[method](row.id).then(res => {
					row.status = status;
				})
			},
			toCreate(){
				this.dialog.title = `新增零件`;
				this.dialog.show = true;
				this.dialog.info = {status: '1'};
				this.dialog.index = '';
			},
			toEdit({row, $index}){
				this.dialog.title = `更改零件【${row.nameZn}】`;
				this.dialog.show = true;
				this.dialog.info = Object.assign({}, row);
				this.dialog.index = $index;
			},
			toUpdate(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.dialog.info.goodsTypeId = this.form.goodsTypeId;
						this.$api.spare.save(this.dialog.info).then(res => {
							if(this.dialog.index != ''){
								this.$set(this.tableData, this.dialog.index, res.data);
							}else{
								this.list();
							}
							this.dialog.show = false;
						})
					} else {
						return false;
					}
				});
			},
			list(){
				this.$api.spare.getList(this.form).then(res => {
					this.tableData = res.data;
					this.total = res.pageInfo.total;
				})
			},
			getGoodsTypeDetail(){
				this.$api.parts.detail(this.form.goodsTypeId).then(res => {
					this.goodsTypeInfo = res.data;
				})
			}
		},
		mounted(){
			/***                                                                          
			 *          .,:,,,                                        .::,,,::.          
			 *        .::::,,;;,                                  .,;;:,,....:i:         
			 *        :i,.::::,;i:.      ....,,:::::::::,....   .;i:,.  ......;i.        
			 *        :;..:::;::::i;,,:::;:,,,,,,,,,,..,.,,:::iri:. .,:irsr:,.;i.        
			 *        ;;..,::::;;;;ri,,,.                    ..,,:;s1s1ssrr;,.;r,        
			 *        :;. ,::;ii;:,     . ...................     .;iirri;;;,,;i,        
			 *        ,i. .;ri:.   ... ............................  .,,:;:,,,;i:        
			 *        :s,.;r:... ....................................... .::;::s;        
			 *        ,1r::. .............,,,.,,:,,........................,;iir;        
			 *        ,s;...........     ..::.,;:,,.          ...............,;1s        
			 *       :i,..,.              .,:,,::,.          .......... .......;1,       
			 *      ir,....:rrssr;:,       ,,.,::.     .r5S9989398G95hr;. ....,.:s,      
			 *     ;r,..,s9855513XHAG3i   .,,,,,,,.  ,S931,.,,.;s;s&BHHA8s.,..,..:r:     
			 *    :r;..rGGh,  :SAG;;G@BS:.,,,,,,,,,.r83:      hHH1sXMBHHHM3..,,,,.ir.    
			 *   ,si,.1GS,   sBMAAX&MBMB5,,,,,,:,,.:&8       3@HXHBMBHBBH#X,.,,,,,,rr    
			 *   ;1:,,SH:   .A@&&B#&8H#BS,,,,,,,,,.,5XS,     3@MHABM&59M#As..,,,,:,is,   
			 *  .rr,,,;9&1   hBHHBB&8AMGr,,,,,,,,,,,:h&&9s;   r9&BMHBHMB9:  . .,,,,;ri.  
			 *  :1:....:5&XSi;r8BMBHHA9r:,......,,,,:ii19GG88899XHHH&GSr.      ...,:rs.  
			 *  ;s.     .:sS8G8GG889hi.        ....,,:;:,.:irssrriii:,.        ...,,i1,  
			 *  ;1,         ..,....,,isssi;,        .,,.                      ....,.i1,  
			 *  ;h:               i9HHBMBBHAX9:         .                     ...,,,rs,  
			 *  ,1i..            :A#MBBBBMHB##s                             ....,,,;si.  
			 *  .r1,..        ,..;3BMBBBHBB#Bh.     ..                    ....,,,,,i1;   
			 *   :h;..       .,..;,1XBMMMMBXs,.,, .. :: ,.               ....,,,,,,ss.   
			 *    ih: ..    .;;;, ;;:s58A3i,..    ,. ,.:,,.             ...,,,,,:,s1,    
			 *    .s1,....   .,;sh,  ,iSAXs;.    ,.  ,,.i85            ...,,,,,,:i1;     
			 *     .rh: ...     rXG9XBBM#M#MHAX3hss13&&HHXr         .....,,,,,,,ih;      
			 *      .s5: .....    i598X&&A&AAAAAA&XG851r:       ........,,,,:,,sh;       
			 *      . ihr, ...  .         ..                    ........,,,,,;11:.       
			 *         ,s1i. ...  ..,,,..,,,.,,.,,.,..       ........,,.,,.;s5i.         
			 *          .:s1r,......................       ..............;shs,           
			 *          . .:shr:.  ....                 ..............,ishs.             
			 *              .,issr;,... ...........................,is1s;.               
			 *                 .,is1si;:,....................,:;ir1sr;,                  
			 *                    ..:isssssrrii;::::::;;iirsssssr;:..                    
			 *                         .,::iiirsssssssssrri;;:.                      
			 */
			
			
			// 记录路由跳转参数
			this.form.goodsTypeId = this.$route.params.id;
			
			// 获取大类的详情
			this.getGoodsTypeDetail();
			
			// 获取列表数据
			this.list();
		}
	}
</script>

<style lang="scss">
	.spare-list{
		.line{
			display: inline-block;
			width: 10px;
			margin-left: 2px;
			text-align: center;
			color: #409EFF;
		}
		
		.create{
			position: absolute;
			bottom: 15px;
			left: 10px;
		}
		
		.aside{
			.title{
				margin-right: 50px;
			}
			
			.search{
				position: absolute;
				right: 20px;
				top: 8px;
				
				.el-input{
					width: 200px;
				}
			}
		}
	}
</style>
