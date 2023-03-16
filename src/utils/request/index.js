import service from "@/utils/request/service"

export default {
  install(Vue) {
    Vue.prototype.$http = service
  }
}
