import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 公共接口 ，优惠券接口 , 行业此讯 , 手机号码注册
 *
 */

/**
 * 获取主页数据 无需授权
 *
 */
export function getIndexData() {
  return VuePro.$http.get("index", {}, { noAuth: true })
}

/**
 * 获取登录授权login
 *
 */
export function getLogo() {
  return VuePro.$http.get("wechat/getLogo", {}, { noAuth: true })
}

/**
 * 保存form_id
 * @param string formId
 */
export function setFormId(formId) {
  return VuePro.$http.post("wechat/set_form_id", { formId: formId })
}

/**
 * 领取优惠卷
 * @param int couponId
 *
 */
//项目中已经使用
export function setCouponReceive(couponId) {
  return VuePro.$http.post({
    url: "/mall/api/front/coupon/receive",
    data: { couponId: couponId }
  })
  // return VuePro.$http.post("coupon/receive", { couponId: couponId })
}
/**
 * 优惠券列表
 * @param object data
 */
//项目中已经使用
export function getCoupons(data) {
  return VuePro.$http.get({
    url: "/mall/api/front/coupons",
    params: data,
    isNeedAccessToken: false
  })
  // return VuePro.$http.get("coupons", data, { noAuth: true })
}

/**
 * 我的优惠券
 * @param int types 0全部  1未使用 2已使用
 */
export function getUserCoupons(data) {
  return VuePro.$http.get("coupon/list", data)
}

/**
 * 文章分类列表
 *
 */
export function getArticleCategoryList() {
  return VuePro.$http.get("article/category/list", {}, { noAuth: true })
}

/**
 * 文章列表
 * @param int cid
 *
 */
export function getArticleList(cid, data) {
  return VuePro.$http.get("article/list/" + cid, data, { noAuth: true })
}

/**
 * 文章 热门列表
 *
 */
export function getArticleHotList() {
  return VuePro.$http.get("article/hot/list", {}, { noAuth: true })
}

/**
 * 文章 轮播列表
 *
 */
export function getArticleBannerList() {
  return VuePro.$http.get("article/banner/list", {}, { noAuth: true })
}

/**
 * 文章详情
 * @param int id
 *
 */
export function getArticleDetails(id) {
  return VuePro.$http.get("article/info", id, { noAuth: true })
}

/**
 * 手机号+验证码登录接口
 * @param object data
 */
export function loginMobile(data) {
  return VuePro.$http.post("login/mobile", data, { noAuth: true })
}

/**
 * 获取短信KEY
 * @param object phone
 */
export function verifyCode() {
  return VuePro.$http.get("verify_code", {}, { noAuth: true })
}

/**
 * 验证码发送
 * @param object phone
 */
export function registerVerify(phone) {
  return VuePro.$http.post("sendCode", { phone: phone }, { noAuth: true }, 1)
}

/**
 * 手机号注册
 * @param object data
 *
 */
export function phoneRegister(data) {
  return VuePro.$http.post("register", data, { noAuth: true })
}

/**
 * 手机号修改密码
 * @param object data
 *
 */
export function phoneRegisterReset(data) {
  return VuePro.$http.post("register/reset", data, { noAuth: true })
}

/**
 * 手机号+密码登录
 * @param object data
 *
 */
export function phoneLogin(data) {
  return VuePro.$http.post("login", data, { noAuth: true })
}

/**
 * 切换H5登录
 * @param object data
 */
// #ifdef MP
export function switchH5Login() {
  return VuePro.$http.post("switch_h5", { from: "routine" })
}
// #endif

/*
 * h5切换公众号登录
 * */
// #ifdef H5
export function switchH5Login() {
  return VuePro.$http.post("switch_h5", { from: "wechat" })
}
// #endif

/**
 * 换绑手机号
 *
 */
export function bindingPhone(data) {
  return VuePro.$http.post("update/binding", data)
}

/**
 * 换绑手机号校验
 *
 */
export function bindingVerify(data) {
  return VuePro.$http.post("update/binding/verify", data)
}

/**
 * 退出登錄
 *
 */
export function logout() {
  return VuePro.$http.get("logout")
}

/**
 * 获取订阅消息id
 */
export function getTemlIds(data) {
  return VuePro.$http.get("wechat/program/my/temp/list", data, { noAuth: true })
}

/**
 * 首页拼团数据
 */
export function pink() {
  return VuePro.$http.get("pink", {}, { noAuth: true })
}

/**
 * 获取城市信息
 */
export function getCity() {
  return VuePro.$http.get({
    url: "/mall/api/front/city/list",
    isNeedAccessToken: false
  })
  // return VuePro.$http.get("city/list", {}, { noAuth: true })
}

/**
 * 获取小程序直播列表
 */
export function getLiveList(page, limit) {
  return VuePro.$http.get("wechat/live", { page, limit }, { noAuth: true })
}

/**
 * 获取小程序二维码
 */
//项目中已经使用(暂时不用)
export function getQrcode(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/qrcode/get",
    data,
    isNeedAccessToken: false
  })
  // return VuePro.$http.post("qrcode/get", data, { noAuth: true })
}
