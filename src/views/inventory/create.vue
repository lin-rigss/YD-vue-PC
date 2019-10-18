<script>
	import Info from './components/Info'
	export default {
		extends: Info,
		data() {
			return {
				type: 'create',
			}
		},
		methods: {
			save(){
				this.$api.stock.save({
					...this.form,
					goodsList: this.tableData,
				}).then(res => {
					// this.$router.push({
					// 	name: 'inventory-list'
					// })
					this.$router.push({
						name: 'inventory-put-info',
						params: {
							id: res.data.id,
							item: res.data,
						}
					})
					
				});
			},
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.inventory-create{
		
	}
</style>
