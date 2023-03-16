import Vue from "vue"
let VuePro = Vue.prototype
/**
 * 查询就诊卡列表
 *
 */
export function getMedicalCardListApi(params) {
  return VuePro.$http.get({
    url: "/front/medicalCard/user/list",
    params: params
  })
}
// 完善就诊卡的信息
export function perfectMedicalCardInfoApi(data) {
  return VuePro.$http.put({
    url: "/front/medicalCard/user/fillIn",
    data: data
  })
}