/*
动态注册路由
页面全在views文件夹下
如：
import page1 from './views/page1.vue'
import page2 from './views/page/page2.vue'
*/
export default (name) => () => import(`@/views/${name}.vue`)