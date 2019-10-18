<template>
	<div class="status-label">
		<span :style="{backgroundColor: info.color}" class="hot"></span>
		<span v-show="showText" :style="{color: info.color}">{{ info[name] }}</span>
	</div>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				required: true,
			},
			value: {
				type: String,
				default: '',
			},
			name: {
				type: String,
				default: 'name',
			},
			showText: {
				type: Boolean,
				default: true,
			}
		},
		computed: {
			info(){
				let arr = this.$g.dic[this.type] || [];
				return arr.find(item => item.value === this.value) || {};
			},
		},
	}
</script>

<style lang="scss">
	.status-label{
		display: inline-block;
		
		.hot{
			display: inline-block;
			width: 8px;
			height: 8px;
			border-radius: 100%;
		}
	}
</style>
