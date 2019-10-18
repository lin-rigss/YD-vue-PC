<template>
	<div class="footer">
		<div :class="type">{{ footerInfo }}</div>
	</div>
</template>

<script>
	export default {
		props: {
			type: {
				default: 'bottom'
			}
		},
		data() {
			return {

			}
		},
		computed: {
			footerInfo() {
				return this.$store.state.settings.footer;
			},
		},
		methods: {

		},
		mounted() {

		}
	}
</script>

<style lang="scss">
	.footer {
		
		.bottom {
			position: absolute;
			text-align: center;
			bottom: 0px;
			padding: 5px 0;
			left: 0;
			right: 0;
			color: #999;
			font-size: 12px;
		}
		
		.login-bottom {
			position: absolute;
			text-align: center;
			bottom: 50px;
			left: 0;
			right: 0;
			color: #FFF;
			font-size: 12px;
		}


	}
</style>
