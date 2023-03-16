import Vue from "vue"
let VuePro = Vue.prototype

//商城的获取产品分类
export function getCategoryList() {
  return VuePro.$http.get(
    {
      url: "/mall/api/front/productCategory",
      isNeedAccessToken: false
      //   params:
    }

    // {
    //   noAuth: true
    // }
  )
}
