import Vue from "vue"
let VuePro = Vue.prototype
// 获取首页banner的图片
export function getBannerList(teamId, isNeedTenantId) {
  return VuePro.$http.get({
    url: "/mall/banner/front/list",
    isNeedAccessToken: false,
    isNeedTenantId: isNeedTenantId,
    params: {
      teamId
    }
  })
}
// 首页中banner中的详情

export function getBannerDetails(id) {
  return VuePro.$http.get({
    url: "/mall/banner/front/info/" + id,
    isNeedAccessToken: false
  })
}

// 首页中banner跳转前查询服务包信息

export function getBannerSeverPageInfo(id) {
  return VuePro.$http.get({
    url: "/mall/api/front/getProductOrderInfo/" + id,
    isNeedAccessToken: false
  })
}

//最外层首页推荐机构
export function getTenantRecommend() {
  return VuePro.$http.get({
    url: "/system/user/tenant/recommend",
    isNeedAccessToken: false,
    isNeedTenantId: false
  })
}

//搜索机构tenantName
export function getAllTenant(params) {
  return VuePro.$http.get({
    url: "/system/user/tenant/activeList",
    params,
    isNeedAccessToken: false,
    isNeedTenantId: false
  })
}
