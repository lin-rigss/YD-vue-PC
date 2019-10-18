<template>
	<el-select v-model="model" :style="{width: width}" :placeholder="placeholder" @change="change">
		<el-option v-for="(e, index) in employees" :key="index" :value="e.userCode" :label="e.name" >
			<span style="float: left">{{ e.userCode }}</span>
			<span style="float: right; color: #8492a6; font-size: 13px">{{ e.name }}</span>
		</el-option>
	</el-select>
</template>

<script>
	export default {
		props: {
			value: {
				required: true,
			},
			width: {
				type: String, 
				default: '100%'
			},
			placeholder: {
				type: String, 
				default: '请选择'
			}
		},
		data() {
			return {
				employees: [],
				model: '',
			}
		},
		methods: {
			change(val) {
				console.log(val)
				this.$emit('changeVal', val);
			}
		},
		created() {
			this.model = this.value;
		},
		mounted() {
			this.$api.employee.employees().then(res => {
				this.employees = res.data;
			});
		}
	}
</script>

<style>
</style>
