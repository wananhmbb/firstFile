import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 获取金刚区分类
 *
 */
// export function getAreaCategoryList() {
//   return VuePro.$http.get({
//     url: "/mall/front/category/areaCategory"
//   })
// }
export function getAreaCategoryList() {
  return VuePro.$http.get({
    url: "/system/wx/jingang/district/control/show/getListUser",
    isNeedAccessToken: false
  })
}
/**
 * 金刚区心理问卷list
 *
 */
export function getPsychologyList(idList) {
  return VuePro.$http.get({
    url: "/product/survey/getFreeList?" + idList
  })
}

/**
 * 字典
 *
 */
export function getDictionaries(type) {
  return VuePro.$http.get({
    url: "/system/dict/data/type/" + type,
    isNeedAccessToken: false
  })
}

/**
 * 金刚区详情
 *
 */
export function getJinGangDetail(id) {
  return VuePro.$http.get({
    url: "/system/wx/jingang/district/control/show/getUserDetail",
    params: {
      id: id
    },
    isNeedAccessToken: false
  })
}
