import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 问医生咨询服务
 *
 */
export function getMyConsultList() {
  return VuePro.$http.get({
    url: "/mall/api/front/products/consult"
  })
}
/**
 * 问医生咨询服务历史记录
 *
 */
export function getUsingList() {
  return VuePro.$http.get({
    url: "/product/consult/user/usingList"
    // params: {
    //   code: code
    // }
  })
}

/**
 * 推荐咨询服务
 *
 */
export function submitConsultation(data) {
  return VuePro.$http.post({
    url: "/product/consult/user/start",
    data
  })
}

/**
 * 问医生咨询服务
 *
 */
export function doctorDetail(userId) {
  return VuePro.$http.get({
    url: `/system/user/getBasicInfo?userId=${userId}`
  })
}

// system/user/getBasicInfo?userId={userId} 获取医生基本信息的
//获取聊天信息
export function getMessageList(consultId) {
  return VuePro.$http.get({
    url: `/product/consult/user/getConsultMessageList?consultId=${consultId}`
  })
}

//获取基本信息
export const getBasicDetailInfo = consultId => {
  return VuePro.$http.get({
    url: `/product/consult/user/getConsultDetail?consultId=${consultId}`
  })
}

//获取问题列表
export function getQuestionList(consultId) {
  return VuePro.$http.get({
    url: `/product/autoReplay/list?consultId=${consultId}`
  })
}
