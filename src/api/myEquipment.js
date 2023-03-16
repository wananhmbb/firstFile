import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 查询支持的设备列表
 *
 */
export function getFacilityList() {
  return VuePro.$http.get({
    url: "/datagateway/devicemetadata/user/getList"
  })
}

/**
 * 查询已绑定的设备列表
 *
 */
export function getBoundFacilityList(medicalCardId) {
  return VuePro.$http.get({
    url: "/datagateway/userDevice/user/getList?medicalCardId=" + medicalCardId
  })
}

/**
 * 查询设备详情
 *
 */
export function getEquipmentDetails(id) {
  return VuePro.$http.get({
    url: "/datagateway/devicemetadata/user/detail?id=" + id
  })
}

/**
 * 绑定设备
 *
 */
export function connectingEquipment(data) {
  return VuePro.$http.post({
    url: "/datagateway/userDevice/user/bind",
    data
  })
}
/**
 * 解绑设备
 */
export function unBindingEquipmentApi(data) {
  return VuePro.$http.post({
    url: "/datagateway/userDevice/user/unbind",
    data
  })
}
