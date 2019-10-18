<template>
	<div class="order-title">
		<div class="group" v-for="(column, index) in columns" :key="index" :style="{marginRight: gutter}">
			<span class="title">{{ column.label }}</span>
			<span class="content">{{ info[column.prop]?info[column.prop]:'空' }}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: () => ({}),
			},
			type: {
				type: String,
				required: false,
				default: 'order-table',
			},
			gutter: {
				type: String,
				required: false,
				default: '50px',
			}
		},
		computed: {
			columns(){
				if(this.type === 'order-table'){
					return this.columns1;
				}
				if(this.type === 'order-detail'){
					return this.columns2;
				}
			}
		},
		data() {
			return {
				columns1: [
					{label: '创建日期：', prop: 'name'},
					{label: '询价单号：', prop: 'name'},
					{label: '订单号：', prop: 'name'},
					{label: '报价单号：', prop: 'name'},
				],
				columns2: [
					{label: '拆解厂名称：', prop: 'dismantlingPlantName'},
					{label: '拆解厂地址：', prop: 'detailAddress'},
					{label: '类型：', prop: 'status'},
					{label: '品质：', prop: 'quality'},
					// {label: '报价开始日期：', prop: 'stime'},
					// {label: '报价结束日期：', prop: 'etime'},
				]
			}
		},
	}
</script>

<style lang="scss">
	.order-title{
		text-align: left;
		
		.group{
			display: inline-block;
		}
		
		.title{
			font-weight: bold;
			color: #99a9bf;
		}
		
		
	}
</style>
