<template>
	<div class="login-container">
		<el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">

			<div class="title-container">
				<h3 class="title">{{ loginTitle }}</h3>
			</div>

			<div class="login-type">
				<!-- 一行  间距 -->
				<el-row :gutter="20">
					<!-- 一列   一行24，每列占12份  -->
					<el-col :span="12" :class="loginForm.type == 1 ? 'bottom-color' : ''">
						<div class="b20" @click="changeLoginType(1)">账户密码登录</div>
					</el-col>
					<el-col :span="12" :class="loginForm.type == 2 ? 'bottom-color' : ''">
						<div class="b20" @click="() => {
							changeLoginType(2);
							loginForm.auto = false;
						}">手机号登录</div>
					</el-col>
				</el-row>
			</div>

			<!-- 账号密码进行登录 -->
			<div v-if="loginForm.type == 1">
				<el-form-item prop="username">
					<span class="svg-container">
						<svg-icon icon-class="user" />
					</span>
					<el-input ref="username" v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" tabindex="1" auto-complete="off" />
				</el-form-item>
				
				<el-form-item prop="validate">
					<span class="svg-container">
						<svg-icon icon-class="password" />
					</span>
					<el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="off" @keyup.enter.native="handleLogin" />
					<!-- .native 给组件绑定原生事件 ,(使用第三方库的时候 可以使用)  按回车的时候也可以登录 -->
					<span class="show-pwd" @click="showPwd">
						<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
					</span>
					<!-- 这个是密码的小眼睛 -->
				</el-form-item>
			</div>
			
			<!-- 手机验证码进行登录 -->
			<div v-if="loginForm.type == 2">
				<el-form-item prop="phone">
					<span class="svg-container">
						<svg-icon icon-class="phone" />
					</span>
					<el-input ref="username" v-model="loginForm.phone" placeholder="请输入手机号" name="phone" type="text" tabindex="1" auto-complete="off" />
				</el-form-item>
				
				<el-row :gutter="10">
					<el-col :span="16">
						<el-form-item prop="password">
							<span class="svg-container">
								<svg-icon icon-class="message" />
							</span>
							<el-input ref="validate" v-model="loginForm.validate" placeholder="请输入验证码" name="validate" type="text" tabindex="2" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item>
							<el-button @click="getCode" :disabled="sendSmsDis" class="validate">{{ validate }}</el-button>
							<span class="show-pwd" v-show="validate != '获取验证码'">
								<svg-icon icon-class="yes" />
							</span>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
			
			<div class="handler">
				<el-row>
					<el-col :span="12">
						<el-checkbox :disabled="loginForm.type != 1" v-model="loginForm.auto">自动登录</el-checkbox>	 
					</el-col>
					<el-col :span="12" class="reset-password">
						<span>忘记密码?</span>
					</el-col>
				</el-row>
			</div>
			

			<div class="login">
				<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>
			</div>
            
			<!-- 提示 -->
			<div class="tips">
				<span>{{ loginTips }}</span>
			</div>

			
			
			
		</el-form>
		<Footer type="login-bottom"></Footer>
		
	</div>
</template>

<script>
	import { validUsername } from '@/utils/validate'

	export default {
		name: 'Login',
		components: {
			Footer: () => import("@/components/Footer")
		},
		data() {
			return {
				validate: '获取验证码',
				// 表单数据
				loginForm: {
					type: 1,  // 
					username: '',
					password: '',
					auto: false,
					phone: '',
					validate: '',
				},
				loading: false,
				passwordType: 'password',
				redirect: undefined,
				sendSmsDis: false
			}
		},
		computed: {
			loginTitle() {
				return this.$store.state.settings.loginTitle;
			},
			loginTips() {
				return this.$store.state.settings.loginTips;
			}
		},
		watch: {
			// 监听路由的变化 
			$route: {
				handler: function(route) {
					this.redirect = route.query && route.query.redirect
				},
				// 在选项参数中指定 immediate: true 将立即以表达式的当前值触发回调：
				immediate: true
				// immediate 此属性就是让当前监听的函数  立即执行！
			}
		},
		methods: {
			// 获取验证码的方法
			getCode(){
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginForm.phone))){ 
					this.$message.error('手机号码格式错误');
					return ;
				}
				
				
				this.$api.user.code({mobile: this.loginForm.phone}).then(res => {
					
					this.$notify({
						type: 'success',
						title: '提示',
						message: `验证码: ${res.data.code} 过期时间: ${res.data.expireTime}`,
						duration: 0
					});
					
					this.sendSmsDis = true;
					let time = 120;
					let id = setInterval(() => {
						this.validate = time --;
						if(time <= 0){
							clearInterval(id);
							this.validate = '获取验证码';
							this.sendSmsDis = false;
						}
					}, 1000);
					
				})
			},

			//  密码显示和隐藏的点击方法
			showPwd() {
				if (this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},


			async handleLogin() {
				if(this.loginForm.type == 1){
					if(!this.loginForm.username || this.loginForm.username.length < 4){
						this.$message.error('用户名必须大于4位');
						return ;
					}
					if(!this.loginForm.password || this.loginForm.password.length < 6){
						this.$message.error('密码必须大于4位');
						return ;
					}
				}else if(this.loginForm.type == 2){
					if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginForm.phone))){ 
						this.$message.error('手机号码格式错误');
						return ;
					}
					if(!(/^\d{4}$/.test(this.loginForm.validate))){ 
						this.$message.error('验证码格式错误');
						return ;
					}
				}else {
					return ;
				}
				
				//检查一下是否开启了自动登录
				if(this.loginForm.auto){
					localStorage.setItem('AUTO_LOGIN', JSON.stringify(this.loginForm));
				}
				
				this.loading = true
				let loginRes = await this.$store.dispatch('user/login', this.loginForm)
				if(loginRes){
					this.loading = false;
					return;
				}
				
				this.$store.dispatch('user/getInfo').then(res => {
					this.$router.push({ path: this.redirect || '/' })
					this.loading = false
				}).catch(error => {
					this.loading = false
					this.$message.error(error)
				})
				
			},

			// 根据选择的类型 传入的类型 ，让loginForm.type 等于几，然后根据这个判断 是哪种登录方式  并添加类名
			changeLoginType(type){
				this.loginForm.type = type;
			}
		}
	}
</script>

<style lang="scss">

	$bg:#283443;
	$light_gray:#fff;
	$cursor: #fff;

	@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
		.login-container .el-input input {
			color: $cursor;
		}
	}

	/* reset element-ui css */
	.login-container {
		background: url('./login-background.jpg');
		// background: url('./login-background2.jpeg');
		user-select: none;
		
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;
				caret-color: $cursor;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: $cursor !important;
				}
			}
		}

		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
		
		.el-form{
			.login button{
				height: 52px;
				background: url('./login-btn.jpg');
				// background: url('./login-btn2.jpg');
				border: none;
			}
			
			
		}
		
		.handler{
			margin-bottom: 20px;
			padding: 0 15px;
			
			.el-checkbox, .el-checkbox-button__inner{
				color: $cursor;
			}
		}
		
		.reset-password{
			text-align: right;
			color: $cursor;
			cursor: pointer;
			
			&:hover{
				color: #E0E0E0;
			}
		}
		
		.login-type{
			text-align: center;
			font-size: 16px;
			margin: 20px;
			
			.b20{
				padding-bottom: 20px;
				color: $cursor;
				cursor: pointer;
			}
			
			.bottom-color{
				border-bottom: 3px solid #409EFF;
			}
		}
		
		.validate{
			width: 100%;
			height: 52px;
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			color: $cursor;
			
			&:hover{
				background: transparent;
			}
		}
	}
</style>

<style lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;

	.login-container {
		min-height: 100%;
		width: 100%;
		background-color: $bg;
		overflow: hidden;

		.login-form {
			position: relative;
			width: 520px;
			max-width: 100%;
			padding: 160px 35px 0;
			margin: 0 auto;
			overflow: hidden;
		}

		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}

		.title-container {
			position: relative;

			.title {
				font-size: 26px;
				color: $light_gray;
				margin: 0px auto 60px auto;
				text-align: center;
				font-weight: bold;
			}
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}
	}
</style>
