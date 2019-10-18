<template>
	<div class="navbar">

		<!-- 收缩面板 -->
		<hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />   

		<!-- 面包屑组件  实现  -->
		<breadcrumb class="breadcrumb-container" />

        <!-- 返回按钮 -->
		<el-button type="primary" size="mini" style="margin:10px 20px;" @click="goback">返回</el-button>
		<div class="right-menu">
			
			
			<!-- <span v-if='info.extendProperty.departmentName[0]=="管理员" || info.extendProperty.name=="报价专员"'>
				待报价总数{{unquotedCount}}
			</span>
			<span v-if='info.extendProperty.departmentName[0]=="管理员" || info.extendProperty.name=="审核专员"'>
				待审核总数{{unchecked}}
			</span> -->

			<!-- 小铃铛的实现   trigger 触发下拉的行为-->
			<el-dropdown trigger="hover">
				<div class="avatar-wrapper">
					<img style="width:30px;height:30px;position: relative;top: 10px;" src="../../assets/imgs/lingdang.png" alt="">
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<!-- slot="dropdown"  设置下拉菜单 -->
					<router-link to="/order/quote" v-if='info.extendProperty.departmentName[0]=="管理员" || info.extendProperty.name=="报价专员"'>
						<el-dropdown-item>
							待报价总数{{unquotedCount}}
						</el-dropdown-item>
					</router-link>
					<router-link to="/order/toaudited" v-if='info.extendProperty.departmentName[0]=="管理员" || info.extendProperty.name=="审核专员"'>
						<el-dropdown-item>
							待审核总数{{unchecked}}
						</el-dropdown-item>
					</router-link>
				</el-dropdown-menu>
			</el-dropdown>



			<el-dropdown class="avatar-container" trigger="hover">
				<!-- {"code":0,"data":{"id":1,"createTime":"2019-06-28 15:44:24","account":"ceshi","mobile":"188888888889","userCode":"Y15617078635860","status":"1","extendProperty":{"departmentName":["测试角色11","哈哈"],"name":"测试","department":[2,5],"email":"888999@qq.com"},"clientType":"employee"},"message":"","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidXNlciJdLCJ1c2VyX25hbWUiOiJjZXNoaSIsImp0aSI6ImUwMjBiNzdkLWY3YzgtNGZjZS04ZWQwLWNmNjcwNWQzMDE4OCIsInVzZXJEZXRhaWwiOnsiaWQiOjEsImNyZWF0ZVRpbWUiOnsibW9udGgiOiJKVU5FIiwieWVhciI6MjAxOSwiZGF5T2ZNb250aCI6MjgsImRheU9mV2VlayI6IkZSSURBWSIsImRheU9mWWVhciI6MTc5LCJtb250aFZhbHVlIjo2LCJob3VyIjoxNSwibWludXRlIjo0NCwibmFubyI6MCwic2Vjb25kIjoyNCwiY2hyb25vbG9neSI6eyJpZCI6IklTTyIsImNhbGVuZGFyVHlwZSI6Imlzbzg2MDEifX0sImFjY291bnQiOiJjZXNoaSIsIm1vYmlsZSI6IjE4ODg4ODg4ODg4OSIsInVzZXJDb2RlIjoiWTE1NjE3MDc4NjM1ODYwIiwic3RhdHVzIjoiMSIsImV4dGVuZFByb3BlcnR5Ijp7ImRlcGFydG1lbnROYW1lIjpbIua1i-ivleinkuiJsjExIiwi5ZOI5ZOIIl0sIm5hbWUiOiLmtYvor5UiLCJkZXBhcnRtZW50IjpbMiw1XSwiZW1haWwiOiI4ODg5OTlAcXEuY29tIn0sImNsaWVudFR5cGUiOiJlbXBsb3llZSJ9LCJjbGllbnRfaWQiOiJsb2dpbiIsInNjb3BlIjpbImFsbCJdfQ.wO4OBIi6A-zEXeYL7ClIPem0Qa6mpmmmEcGfNH7Cqis"} -->
				<!-- <div style="position: absolute; left: -50px;">{{ info.extendProperty.name }}</div> -->
				<div class="avatar-wrapper">
					<!-- 用户名登录   此info 是从vuex中获取的 -->
					{{info.extendProperty.name}}
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/">
						<el-dropdown-item>
							首页
						</el-dropdown-item>
					</router-link>
					<!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
						<el-dropdown-item>Github</el-dropdown-item>
					</a>
					<a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
						<el-dropdown-item>Docs</el-dropdown-item>
					</a> -->
					<el-dropdown-item divided>
						<span style="display:block;" @click="logout">退出</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import Breadcrumb from '@/components/Breadcrumb'
	import Hamburger from '@/components/Hamburger'

	export default {
		components: {
			Breadcrumb,
			Hamburger
		},
		computed: {
			...mapGetters([
				'sidebar',
				'avatar',
				'info'
			])
		},
		data() {
			return {
				unquotedCount: '',
				unchecked: '',
			}
		},
		watch:{
			'$store.getters.count':function(value){
				this.unquotedCount = value
			},
			'$store.getters.check':function(value){
				this.unchecked = value
			}
		},
		methods: {
			goback(){
				this.$router.go(-1)
			},
			//获取待报价总数
			getOperationsNumber(){
				// debugger
				this.$api.order.getOperationsNumber().then(res => {
					this.unquotedCount = res.data.unquotedCount
				    this.unchecked = res.data.unchecked
				})
			},

			toggleSideBar() {
				this.$store.dispatch('app/toggleSideBar')
			},
			async logout() {
				await this.$store.dispatch('user/logout')
				// this.$router.push(`/login?redirect=${this.$route.fullPath}`)

				// 刷新页面的方法
				location.reload();
			}
		},
		mounted() {
			this.getOperationsNumber()
		}
	}
</script>

<style lang="scss" scoped>
	.navbar {
		height: 50px;
		overflow: hidden;
		position: relative;
		background: #fff;
		box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

		.hamburger-container {
			line-height: 46px;
			height: 100%;
			float: left;
			cursor: pointer;
			transition: background .3s;
			-webkit-tap-highlight-color: transparent;

			&:hover {
				background: rgba(0, 0, 0, .025)
			}
		}

		.breadcrumb-container {
			float: left;
		}

		.right-menu {
			float: right;
			height: 100%;
			line-height: 50px;

			&:focus {
				outline: none;
			}

			.right-menu-item {
				display: inline-block;
				padding: 0 8px;
				height: 100%;
				font-size: 18px;
				color: #5a5e66;
				vertical-align: text-bottom;

				&.hover-effect {
					cursor: pointer;
					transition: background .3s;

					&:hover {
						background: rgba(0, 0, 0, .025)
					}
				}
			}

			.avatar-container {
				margin-right: 30px;

				.avatar-wrapper {
					margin-top: 5px;
					position: relative;

					.user-avatar {
						cursor: pointer;
						width: 40px;
						height: 40px;
						border-radius: 10px;
					}

					.el-icon-caret-bottom {
						cursor: pointer;
						position: absolute;
						right: -20px;
						top: 25px;
						font-size: 12px;
					}
				}
			}
		}
	}
</style>
