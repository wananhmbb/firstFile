import request from "@/utils/request"
import dataType from "@/utils/data-type"
import objectForEach from "@/utils/object-for-each"

export default {
  install(Vue) {
    Vue.use(request)
    Vue.use(dataType)
    Vue.use(objectForEach)
  }
}
