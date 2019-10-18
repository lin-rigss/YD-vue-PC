<template>
	<BasePage>
		<div class="warehouse-shelves">
			<div class="aside">
				<span class="title">当前大仓：</span>
				<el-dropdown trigger="click">
					<span class="el-dropdown-link">
						{{ pid }}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>仓库A</el-dropdown-item>
						<el-dropdown-item>仓库B</el-dropdown-item>
						<el-dropdown-item>仓库C</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				
				<span class="title" style="margin-left: 20px;">当前区域：</span>
				<el-dropdown trigger="click">
					<span class="el-dropdown-link">
						{{ id }}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>仓库A</el-dropdown-item>
						<el-dropdown-item>仓库B</el-dropdown-item>
						<el-dropdown-item>仓库C</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>

				<div class="right">
					<el-button type="primary" size="mini">新增区域</el-button>
				</div>
			</div>

			<el-card class="box-card" v-for="i in 6" :key="i">
				<div slot="header" class="clearfix">
					<span>货架{{i}}</span>
					<div style="float: right;" class="right">
						<el-button type="text"> 编辑 </el-button>
						<el-button type="text" @click="toInfo"> 管理 </el-button>
					</div>
				</div>
				<div v-for="o in 4" :key="o" class="text item">

					<el-button size="mini" type="text">
						层 {{ o }}
					</el-button>
				</div>
			</el-card>


		</div>
	</BasePage>
</template>

<script>
	export default {
		data() {
			return {
				pid: '',
				id: '',
			}
		},
		methods: {
			toInfo() {
				this.$router.push({
					name: 'warehouse-shelves',
					params: {
						id: 1,
					}
				})
			}
		},
		mounted() {
			this.pid = this.$route.params.id;
			this.id = this.$route.params.id;
		}
	}
</script>

<style lang="scss">
	.warehouse-shelves {
		.box-card {
			margin-bottom: 10px;

			.right {
				.el-button {
					padding: 3px 0;
				}
			}
		}

		.el-dropdown-link {
			cursor: pointer;
			color: #409eff;

			.el-icon-arrow-down {
				font-size: 12px
			}
		}

	}
</style>
