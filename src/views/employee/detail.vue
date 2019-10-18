<script>
	import Info from './component/Info'
	export default {
		extends: Info,
		data() {
			return {
				type: 'detail',
			}
		},
		methods: {
			getDetail(){
				this.$api.employee.detail(this.$route.params.id).then(res => {
					if(!res.data.extendProperty.department){
						res.data.extendProperty.department = [];
						res.data.extendProperty.departmentName = [];
					}
					this.form = res.data;
				})
			},
			save(){
				this.$api.employee.save(this.form).then(res => {
					this.$message.success('修改成功');
					this.$router.go(-1);
				});
			}
		},
		mounted(){
			this.getDetail();
		}
	}
</script>