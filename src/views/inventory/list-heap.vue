<template>
	<BasePage>
		<el-row :gutter="20">
			<el-col :span="10">
				<HeapIn></HeapIn>
			</el-col>
			<el-col :span="14">
				<HeapInfo></HeapInfo>
			</el-col>
		</el-row>
	</BasePage>
</template>

<script>
	export default {
		components: {
			HeapIn: () => import('./components/heap-in'),
			HeapInfo: () => import('./components/heap-info'),
		},
		data() {
			return {
			}
		},
		methods: {
		},
		mounted() {
		}
	}
</script>

<style lang="scss">
	.inventory-list{

	}
</style>
