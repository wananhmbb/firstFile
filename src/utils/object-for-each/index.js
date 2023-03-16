import objectForEach from "@/utils/object-for-each/object-for-each"

export default {
  install(Vue) {
    Vue.prototype.$objectForEach = objectForEach
  }
}
