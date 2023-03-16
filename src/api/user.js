import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 修改个人信息
 *
 */
export function userInfoEdit(data) {
  return VuePro.$http.put({
    url: "/auth/token/user/edit",
    data
  })
}

/**
 * 退出登录
 *
 */
export function logout() {
  return VuePro.$http.post({
    url: "/auth/token/logout"
  })
}

/**
 * 获取用户信息
 *
 */
export function getUserInfo() {
  return VuePro.$http.get("user")
}

/**
 * 设置用户分享
 *
 */
export function userShare() {
  return VuePro.$http.post("user/share")
}

/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
  return VuePro.$http.post("login", data, { noAuth: true })
}

/**
 * h5用户手机号登录
 * @param data object 用户手机号 也只能
 */
export function loginMobile(data) {
  return VuePro.$http.post("login/mobile", data, { noAuth: true })
}

/**
 * 验证码key
 */
export function getCodeApi() {
  return VuePro.$http.get("verify_code", {}, { noAuth: true })
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function registerVerify(phone) {
  return VuePro.$http.post("sendCode", { phone: phone }, { noAuth: true }, 1)
}

/**
 * h5用户手机号注册
 * @param data object 用户手机号 验证码 密码
 */
export function register(data) {
  return VuePro.$http.post("register", data, { noAuth: true })
}

/**
 * 用户手机号修改密码
 * @param data object 用户手机号 验证码 密码
 */
export function registerReset(data) {
  return VuePro.$http.post("register/reset", data, { noAuth: true })
}

/**
 * 获取用户中心菜单
 *
 */
export function getMenuList() {
  return VuePro.$http.get("menu/user")
}

/*
 * 签到用户信息
 * */
export function postSignUser(sign) {
  return VuePro.$http.post("user/sign/user", sign)
}

/**
 * 获取签到配置
 *
 */
export function getSignConfig() {
  return VuePro.$http.get("user/sign/config")
}

/**
 * 获取签到列表
 * @param object data
 */
export function getSignList(data) {
  return VuePro.$http.get("user/sign/list", data)
}

/**
 * 用户签到
 */
export function setSignIntegral() {
  return VuePro.$http.get("user/sign/integral")
}

/**
 * 签到列表(年月)
 * @param object data
 *
 */
export function getSignMonthList(data) {
  return VuePro.$http.get("user/sign/month", data)
}

/**
 * 活动状态
 *
 */
export function userActivity() {
  return VuePro.$http.get("user/activity")
}

/*
 * 核联医明细（types|2=全部,1=支出,2=收入）
 * */
//项目中使用
export function getCommissionInfo(data) {
  return VuePro.$http.get({
    url: "/mall/api/front/spread/commission/detail",
    params: data
  })
  // return VuePro.$http.get("spread/commission/detail", data)
}

/*
 * 提现记录 getCountApi
 * */
export function getRecordApi(q) {
  return VuePro.$http.get("extract/record", q)
}

/*
 * 提现总金额
 * */
export function getCountApi() {
  return VuePro.$http.get("extract/totalMoney")
}

/*
 * 积分记录
 * */
export function getIntegralList(q) {
  return VuePro.$http.get("integral/list", q)
}

/**
 * 获取分销海报图片
 *
 */
export function spreadBanner(data) {
  return VuePro.$http.get("user/spread/banner", data)
}

/**
 *
 * 获取推广用户一级和二级
 * @param object data
 */
export function spreadPeople(data) {
  return VuePro.$http.get("spread/people", data)
}

/**
 *
 * 推广佣金/提现总和
 * @param int type
 */
export function spreadCount(type) {
  return VuePro.$http.get("spread/count/" + type)
}

/*
 * 推广数据 当前佣金 提现总金额
 * */
export function getSpreadInfo() {
  return VuePro.$http.get("commission")
}

/**
 *
 * 推广订单
 * @param object data
 */
export function spreadOrder(data) {
  return VuePro.$http.get("spread/order", data)
}

/*
 * 获取推广人排行
 * */
export function getRankList(q) {
  return VuePro.$http.get("rank", q)
}

/*
 * 获取佣金排名
 * */
export function getBrokerageRank(q) {
  return VuePro.$http.get("brokerage_rank", q)
}

/**
 * 提现申请
 * @param object data
 */
export function extractCash(data) {
  return VuePro.$http.post("extract/cash", data)
}

/**
 * 提现银行/提现最低金额
 *
 */
export function extractBank() {
  return VuePro.$http.get("extract/bank")
}

/**
 * 会员等级列表
 *
 */
export function userLevelGrade() {
  return VuePro.$http.get("user/level/grade")
}

/**
 * 获取某个等级任务
 * @param int id 任务id
 */
export function userLevelTask(id) {
  return VuePro.$http.get("user/level/task/" + id)
}

/**
 * 检查用户是否可以成为会员
 *
 */
export function userLevelDetection() {
  return VuePro.$http.get("user/level/detection")
}

/**
 *
 * 地址列表
 * @param object data
 */
//项目中已经使用
export function getAddressList(data) {
  return VuePro.$http.get({
    url: "/mall/api/front/address/list",
    params: data
  })
  // return VuePro.$http.get("address/list", data)
}

/**
 * 设置默认地址
 * @param int id
 */
//项目中已经使用
export function setAddressDefault(id) {
  return VuePro.$http.post({
    url: "/mall/api/front/address/default/set",
    data: {
      id
    }
  })
  // return VuePro.$http.post("address/default/set", { id: id })
}

/**
 * 修改 添加地址
 * @param object data
 */
export function editAddress(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/address/edit",
    data
  })
  // return VuePro.$http.post("address/edit", data)
}

/**
 * 删除地址
 * @param int id
 *
 */
//项目中已经使用
export function delAddress(id) {
  return VuePro.$http.post({
    url: "/mall/api/front/address/del",
    data: {
      id
    }
  })
  // return VuePro.$http.post("address/del", { id: id })
}

/**
 * 获取单个地址
 * @param int id
 */
//项目中已经使用
export function getAddressDetail(id) {
  return VuePro.$http.get({
    url: "/mall/api/front/address/detail/" + id
  })
  // return VuePro.$http.get("address/detail/" + id)
}

/**
 * 修改用户信息
 * @param object
 */
export function userEdit(data) {
  return VuePro.$http.post("user/edit", data)
}

/*
 * 退出登录
 * */
// export function getLogout() {
//   return VuePro.$http.get("logout")
// }
/**
 * 小程序充值
 *
 */
export function rechargeRoutine(data) {
  return VuePro.$http.post("recharge/routine", data)
}
/*
 * 公众号充值
 * */
export function rechargeWechat(data) {
  return VuePro.$http.post("recharge/wechat", data)
}

/*
 * app微信充值
 * */
export function appWechat(data) {
  return VuePro.$http.post("recharge/wechat/app", data)
}

/*
 * 余额充值
 * */
export function transferIn(data) {
  return VuePro.$http.post("recharge/transferIn", data, {}, 1)
}

/**
 * 获取默认地址
 *
 */
export function getAddressDefault() {
  return VuePro.$http.get("address/default")
}

/**
 * 充值金额选择
 */
export function getRechargeApi() {
  return VuePro.$http.get("recharge/index")
}

/**
 * 登录记录
 */
export function setVisit(data) {
  return VuePro.$http.post("user/set_visit", { ...data }, { noAuth: true })
}

/**
 * 客服列表
 */
export function serviceList() {
  return VuePro.$http.get("user/service/lst")
}
/**
 * 客服详情
 */
export function getChatRecord(to_uid, data) {
  return VuePro.$http.get("user/service/record/" + to_uid, data)
}

/**
 * 静默绑定推广人
 * @param {Object} puid
 */
export function spread(puid) {
  return VuePro.$http.get("user/bindSpread?spreadPid=" + puid)
}

/**
 * 当前用户在佣金排行第几名
 *
 */
export function brokerageRankNumber(data) {
  return VuePro.$http.get("user/brokerageRankNumber", data)
}

/**
 * 会员等级经验值；
 *
 */
export function getlevelInfo() {
  return VuePro.$http.get("user/level/grade")
}

/**
 * 经验值明细；
 *
 */
export function getlevelExpList(data) {
  return VuePro.$http.get("user/expList", data)
}

/**
 * 经验值明细；
 *
 */
export function getuserDalance() {
  return VuePro.$http.get("user/balance")
}

/**
 * 账单记录；
 *
 */
export function getBillList(data) {
  return VuePro.$http.get("recharge/bill/record", data)
}

/*
 * 积分中心详情
 * */
export function postIntegralUser() {
  return VuePro.$http.get("integral/user")
}

/*
 * 立即提现 冻结期、冻结佣金、可提现佣金、最低可提现金额
 * */
export function extractUser() {
  return VuePro.$http.get("extract/user")
}

/*
 * 推广人统计页 推广人数（一级+二级）、一级人数、二级人数
 * */
export function spreadPeoCount() {
  return VuePro.$http.get("spread/people/count")
}
//
// 修改订单地址
export function editOrderAddress(data) {
  return VuePro.$http.put({
    url:
      "/mall/api/front/order/edit/address?addressId=" +
      data.addressId +
      "&orderId=" +
      data.orderId
  })
}
