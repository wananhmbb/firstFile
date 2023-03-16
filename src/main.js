import Vue from "vue"
import App from "./App"
import store from "./store"
import uView from "uview-ui"
import theme from "@/components/diy-theme/index"
import Header from "@/components/Header.vue"
// import BasicComponents from "@/components/basic-components"
import xIcon from "@/components/basic-components/x-icon/x-icon.vue"
import xWaterfall from '@/components/basic-components/x-waterfall/x-waterfall.vue'
import { router, RouterMount } from "@/router"
import util from "utils/util"
import utils from "@/utils"
import * as Order from "./libs/order"
import MescrollUni from "mescroll-uni/mescroll-uni.vue"
import richTextComponent from "@/components/components/rich-text-component.vue"
Vue.prototype.$util = util
Vue.prototype.$Order = Order
Vue.component("house-header", Header)
Vue.component("richTextComponent", richTextComponent)
Vue.component("theme", theme)
/**
 * 挂载组件
 * start
 */
Vue.component("x-icon", xIcon)
Vue.component("x-waterfall", xWaterfall)
/**end**/
Vue.prototype.$bus = new Vue()

Vue.use(uView)
Vue.use(utils)
// Vue.use(BasicComponents)
Vue.component("mescroll-uni", MescrollUni)
Vue.config.productionTip = false
Vue.use(router)

App.mpType = "app"
const app = new Vue({
  store,
  ...App
})
// #ifdef H5
RouterMount(app, router, "#app")
// #endif

// #ifndef H5
app.$mount() //为了兼容小程序及app端必须这样写才有效果
// #endif
