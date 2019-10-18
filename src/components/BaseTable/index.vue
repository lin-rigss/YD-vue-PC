<script>
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters(['config']),
			tableHeight(){
				return 'calc(100vh - 300px)';
			}
		},
		data() {
			return {
				total: 100,
				form: {
					pageIndex: 1,
					pageSize: 10,
				},
				statusFilters: [{
					text: '全部',
					value: '-1',
				}, {
					text: '启用',
					value: '1',
				}, {
					text: '禁用',
					value: '0',
				}]
			}
		},
		methods: {
			statusFilterHandler(value, row, column) {
				const property = column['property'];
				return row[property] == value;
			},
			list(){
				
			},
			sizeChange(){
				this.list();
			},
			currentChange(currPage){
				this.form.pageIndex = currPage;
				this.list();
			}
		},
	}
</script>