import Vue from "vue"
let VuePro = Vue.prototype
/**
 * 查询报告解读列表
 *
 */
export function getReportInterpretationListApi(params) {
  return VuePro.$http.get({
    url: "/product/report/user/getList",
    params: params
  })
}
/**
 * 创建报告
 *
 */
export function createReportApi(data) {
  return VuePro.$http.post({
    url: "/product/report/user/create",
    data: data
  })
}
/**
 * 查询报告详情
 *
 */
export function getReportDetailsApi(params) {
  return VuePro.$http.get({
    url: "/product/report/user/getOneReport",
    params: params
  })
}
export function IAlreadyKnowApi(params) {
  return VuePro.$http.get({
    url: "/product/report/user/already/identified",
    params: params
  })
}


