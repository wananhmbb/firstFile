import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 常见问题type
 *
 */
export function getFrequentlyTypeList(params) {
  return VuePro.$http.get({
    url: "system/dict/data/list",
    params
  })
}

/**
 * 常见问题list
 *
 */
export function getFrequentlyAskedList(params) {
  return VuePro.$http.get({
    url: "system/hjt_common_problem/system/list",
    params
  })
}

/**
 * 客诉list
 *
 */
export function getComplaintList(id) {
  return VuePro.$http.get({
    url: "system/customerComplaint/hjt_customer_complaint/system/list",
    params: {
      id: id
    }
  })
}

/**
 * 客诉新增
 *
 */
export function addComplaint(data) {
  return VuePro.$http.post({
    url: "system/customerComplaint/hjt_customer_complaint/system/add",
    data
  })
}
