import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 获取产品详情
 * @param int id
 *
 */
//项目中已经使用
export function getProductDetail(id, type) {
  return VuePro.$http.get({
    url: "/mall/api/front/product/detail/" + id + "?type=" + type,
    isNeedAccessToken: false
  })
}

/**
 * 产品分享二维码 推广员
 * @param int id
 */
// #ifndef MP
export function getProductCode(id) {
  return VuePro.$http.get("product/code/" + id, {})
}
// #endif
// #ifdef MP
export function getProductCode(id) {
  return VuePro.$http.get("product/code/" + id, {
    user_type: "routine"
  })
}
// #endif

/**
 * 添加收藏
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
 */
export function collectAdd(id, category) {
  return VuePro.$http.post({
    url: "/mall/api/front/collect/add",
    data: {
      id: id,
      category: category === undefined ? "product" : category
    }
  })
}

/**
 * 取消收藏产品
 * @param int id
 */
// 项目中已经使用
export function collectDel(proId) {
  return VuePro.$http.post({
    url: `/mall/api/front/collect/cancel/${proId}`
  })
  //   return VuePro.$http.post(`collect/cancel/${proId}`)
}

/**
 * 删除收藏产品
 * @param string id
 */
export function collectDelete(ids) {
  return VuePro.$http.post(`collect/delete`, ids)
}

/**
 * 购车添加
 *
 */
//项目中已经使用
export function postCartAdd(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/cart/save",
    data
  })
  //   return VuePro.$http.post("cart/save", data, {})
}

/**
 * 获取分类列表
 *
 */
//项目已经使用
export function getCategoryList(isNeedTenantId) {
  return VuePro.$http.get(
    {
      url: "/mall/api/front/category",
      isNeedAccessToken: false,
      isNeedTenantId: isNeedTenantId
      //   params:
    }

    // {
    //   noAuth: true
    // }
  )
}

/**
 * 获取产品列表
 * @param object data
 */
// 项目已经使用
export function getProductslist(params) {
  return VuePro.$http.get({
    url: "/mall/api/front/products",
    params,
    isNeedAccessToken: false
  })
  //   return VuePro.$http.get("products", data, {
  //     noAuth: true
  //   })
}
// 项目已经使用推荐商品
export function getProductsHotlist(params) {
  return VuePro.$http.get({
    url: "/mall/wx/product/package/recommendation/list",
    params,
    isNeedAccessToken: false
  })
}

// 项目已经平台推荐商品列表
export function getProductsRecommendlist(params) {
  return VuePro.$http.get({
    url: "/mall/wx/product/platform/package/recommendation/list",
    params,
    isNeedAccessToken: false,
    isNeedTenantId: false
  })
}
/**
 * 获取推荐产品
 *
 */
export function getProductHot(page, limit) {
  return VuePro.$http.get(
    "product/hot",
    {
      page: page === undefined ? 1 : page,
      limit: limit === undefined ? 4 : limit
    },
    {
      noAuth: true
    }
  )
}
/**
 * 批量收藏
 *
 * @param object id  产品编号 join(',') 切割成字符串
 * @param string category
 */
export function collectAll(id, category) {
  return VuePro.$http.post("collect/all", {
    id: id,
    category: category === undefined ? "product" : category
  })
}

/**
 * 首页产品的轮播图和产品信息
 * @param int type
 *
 */
export function getGroomList(type, data) {
  return VuePro.$http.get("index/product/" + type, data, {
    noAuth: true
  })
}

/**
 * 获取收藏列表
 * @param object data
 */
export function getCollectUserList(data) {
  return VuePro.$http.get("collect/user", data)
}

/**
 * 获取产品评论
 * @param int id
 * @param object data
 *
 */
//项目已经使用
export function getReplyList(id, data) {
  return VuePro.$http.get({
    url: "/mall/api/front/reply/list/" + id,
    params: data,
    isNeedAccessToken: false
  })
  //   return VuePro.$http.get("reply/list/" + id, data, {
  //     noAuth: true
  //   })
}

/**
 * 产品评价数量和好评度
 * @param int id
 */
// 项目中已经使用（暂时不用）
export function getReplyConfig(id) {
  return VuePro.$http.get({
    url: "/mall/api/front/reply/config/" + id,
    isNeedAccessToken: false
  })
  //   return VuePro.$http.get(
  //     "reply/config/" + id,
  //     {},
  //     {
  //       noAuth: true
  //     }
  //   )
}

/**
 * 获取搜索关键字获取
 *
 */
export function getSearchKeyword() {
  return VuePro.$http.get(
    "search/keyword",
    {},
    {
      noAuth: true
    }
  )
}

/**
 * 门店列表
 * @returns {*}
 */
//项目中已经使用(可能存在问题)
export function storeListApi(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/store/list",
    data
  })
  // return VuePro.$http.post("store/list", data, {}, 1)
}

/**
 * 优品推荐
 * @param object data
 */
// 项目中已经使用(暂时不用)
export function getProductGood() {
  return VuePro.$http.get({
    url: "/mall/api/front/product/good",
    isNeedAccessToken: false
  })
}

/**
 * 详情页产品评论
 * @param int id
 * @param object data
 *
 */
//项目中已经使用
export function getReplyProduct(id) {
  return VuePro.$http.get({
    url: "/mall/api/front/reply/product/" + id,
    isNeedAccessToken: false
  })
  //   return VuePro.$http.get("reply/product/" + id, {
  //     noAuth: true
  //   })
}
// 查询详情同意书

export function getDetailedConsent(servicePackageId) {
  return VuePro.$http.get({
    url:
      "/product/hjt_informed_consent/getByServicePackageId/" + servicePackageId,
    isNeedAccessToken: false
  })
  //   return VuePro.$http.get("reply/product/" + id, {
  //     noAuth: true
  //   })
}
//签署详情同意书

export function signatureDetailsConsent(servicePackageId) {
  return VuePro.$http.post({
    url: "/mall/hjt_informed_consent_sign_record/sign/" + servicePackageId
    // isNeedAccessToken: false
  })
  //   return VuePro.$http.get("reply/product/" + id, {
  //     noAuth: true
  //   })
}

// 查询服务包问卷

export function getServicePackQuestionnaire(servicePackageId) {
  return VuePro.$http.get({
    url:
      "/product/hjt_service_package/user/getOrderPreInfo?id=" +
      servicePackageId,
    isNeedAccessToken: false
  })
  //   return VuePro.$http.get("reply/product/" + id, {
  //     noAuth: true
  //   })
}

/**
 * 提交服务包问卷
 */
export function checkCanCreateOrder(data) {
  return VuePro.$http.post({
    url: "product/user/orderPreSurveyAnswer/checkCanCreateOrder",
    data
  })
}

/**
 * 绑定推荐人id
 */
export function bindReferrerId(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/referrer/user/bind/referrer",
    data
  })
}
