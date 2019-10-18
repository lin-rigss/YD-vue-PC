<template>
	<div class="base-page">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		},
	}
</script>

<style lang="scss">
	.base-page {
		position: relative;
		// height: 100%;
		// width: 100%;
		height: calc(100% - 10px);
		width: calc(100% - 20px);
		overflow-x: hidden;
		overflow-y: auto;
		background-color: #FFF;
		margin: 10px;
		border-radius: 10px;
		padding: 10px;
		box-shadow: 0 8px 16px 0 rgba(28,31,33,.1);

		.el-table thead th {
			background-color: #f8f7f7;
		}
		
		.pagination{
			margin-top: 10px;
			text-align: right;
		}
		
		
		&>div{
			height: 100%;
		}
	}
</style>
