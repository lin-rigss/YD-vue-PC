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
				this.$api.purchase.detail(this.$route.params.id).then(res => {
					this.form = res.data;
				})
			},
			save(){
				this.$api.purchase.save(this.form).then(res => {
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