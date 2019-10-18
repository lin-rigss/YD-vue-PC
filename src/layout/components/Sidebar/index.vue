<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
			'menus'
    ]),
    // routes() {
    //   return this.$router.options.routes;
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
	data() {
		return {
			routes: []
		}
	},
	methods: {
		filterAsyncRoutes(routes, roles) {
			const res = []
			routes.forEach(route => {
				const tmp = { ...route }
				if (this.hasPermission(roles, tmp)) {
					if (tmp.children) {
						tmp.children = this.filterAsyncRoutes(tmp.children, roles)
						if(!tmp.children.length){
							return ;
						}
					}
					res.push(tmp)
				}
			})
			return res
		},
		hasPermission(roles, route){
			if(route.alwaysShow || !route.name){
				return true;
			}
			return roles.some(role => route.name === role);
		}
	},
	mounted() {
		this.routes = this.filterAsyncRoutes(this.$router.options.routes, this.menus);
		this.$store.dispatch('user/setRoutes', this.routes)
	}
}
</script>
