<template>
	<div class="dashboard-container">
		<div class="dashboard-text">name: {{ info.extendProperty.name }}</div>
		<panel-group @handleSetLineChartData="handleSetLineChartData" />

		<!-- 调试显示图标使用, 上线后可删除 -->
		<!-- <ul class="icon-list">
			<li v-for="(item, index) in $icons" :key="index"
				@click="clickIcon(item)"
			>
				<span>
					<svg-icon :icon-class="item"></svg-icon>
					<span>{{ item }}</span>
				</span>
			</li>
		</ul> -->
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'

	export default {
		name: 'Dashboard',
		components: {
			PanelGroup: () => import('./component/PanelGroup')
		},
		computed: {
			...mapGetters([
				'info'
			])
		},
		methods: {
			handleSetLineChartData(type) {

			},
			clickIcon(item){
				this.$alert('<svg-icon icon-class="'+item+'"></svg-icon>', '图标');
			}
		},
	}
</script>

<style lang="scss" scoped>
	.dashboard {
		&-container {
			padding: 30px;
			overflow: auto;
			height: 100%;
		}

		&-text {
			font-size: 30px;
			line-height: 46px;
		}
	}

	ul.icon-list {
	    overflow: hidden;
	    list-style: none;
	    padding: 0!important;
	    border: 1px solid #eaeefb;
	    border-radius: 4px;
		background-color: #FFF;
	}

	.icon-list li {
	    float: left;
	    width: 16.66%;
	    text-align: center;
	    height: 120px;
	    line-height: 120px;
	    color: #666;
	    font-size: 13px;
	    border-right: 1px solid #eee;
	    border-bottom: 1px solid #eee;
	}

	.icon-list li:after {
	    content: "";
	    height: 100%
	}

	.icon-list li:after,.icon-list li span {
	    display: inline-block;
	    vertical-align: middle
	}

	.icon-list li span {
	    line-height: normal;
	    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
	    color: #99a9bf;
	    transition: color .15s linear
	}

	.icon-list li svg {
	    display: block;
	    font-size: 32px;
		margin: auto;
	    margin-bottom: 15px;
	    color: #606266;
	    transition: color .15s linear
	}

	.icon-list li .icon-name {
	    display: inline-block;
	    padding: 0 3px;
	    height: 1em
	}

	.icon-list li:hover svg,.icon-list li:hover span {
	    color: #5cb6ff
	}



</style>
