<script>
	import Info from './component/Info'
	export default {
		extends: Info,
		data() {
			return {
				type: 'create',
			}
		},
		methods: {
			save(){
				this.$api.factory.save(this.form).then(res => {
					this.$message.success('创建成功');
					this.$router.go(-1);
				});
			}
		},
		mounted(){
			
		}
	}
</script>