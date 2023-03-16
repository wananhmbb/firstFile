import Vue from "vue"
import Vuex from "vuex"
import theme from "@/store/modules/theme.js"
import user from "./modules/user.js"
import server from "./modules/server.js"
import heartRate from "@/store/modules/heartRate.js"
import app from "./modules/app.js"
import getters from "./getters"
import improve from "@/store/modules/medicalCardsImprove";
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    theme,
    improve,
    user,
    app,
    server,
    heartRate
  },
  getters
})

export default store
