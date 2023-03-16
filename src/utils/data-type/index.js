import dataType from "@/utils/data-type/data-type"

export default {
  install(Vue) {
    Vue.prototype.$dataType = dataType
  }
}
