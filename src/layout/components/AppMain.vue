<template>
	<section class="app-main">
		<!--                              mode 控制离开的动画效果 -->
		<transition name="fade-transform" mode="out-in">  
			<router-view :key="key" />
		</transition>
	</section>
</template>

<script>
	export default {
		name: 'AppMain',
		computed: {
			// 
			key() {
				return this.$route.path
			}
		}
	}
</script>

<style scoped>
	.app-main {
		/*50 = navbar  */
		height: 100vh;
		width: 100%;
		position: relative;
		overflow: hidden;
		padding-bottom: 25px;
		/* background-color: #f0f1f4; */
		background-color: #F3F5F6;
	}

	.fixed-header+.app-main {
		padding-top: 50px;
	}
</style>

<style lang="scss">
	// fix css style bug in open el-dialog
	.el-popup-parent--hidden {
		.fixed-header {
			padding-right: 15px;
		}
	}
</style>
