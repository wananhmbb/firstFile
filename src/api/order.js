import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 获取购物车列表
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
//项目中已经使用（暂时注释）
export function getCartCounts(numType, type) {
  return VuePro.$http.get({
    url: "/mall/api/front/cart/count?numType=" + numType + "&type=" + type
  })
  // return VuePro.$http.get("cart/count?numType=" + numType + "&type=" + type)
}
/**
 * 获取购物车列表
 *
 */
export function getCartList(data) {
  return VuePro.$http.get("cart/list", data)
}


/**
 * 关联咨询id跟订单id（暂用）
 *
 */
export function fillInOrder(consultId,orderId) {
  return VuePro.$http.put({
    url: "/product/consult/user/fillInOrder",
    data: {
      consultId: consultId,
	  orderId: orderId
    }
  })
}

/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(cartId, number) {
  return VuePro.$http.post(
    "cart/num",
    {
      id: cartId,
      number: number
    },
    {},
    1
  )
}
/**
 * 清除购物车
 * @param object ids join(',') 切割成字符串
 */
export function cartDel(ids) {
  if (typeof ids === "object") ids = ids.join(",")
  return VuePro.$http.post(
    "cart/delete",
    {
      ids: ids
    },
    {},
    1
  )
}

/**
 * 购物车重选提交
 *
 */
export function getResetCart(data) {
  return VuePro.$http.post("cart/resetcart", data)
}

/**
 * 订单列表
 * @param object data
 */
//项目中已使用
export function getOrderList(data) {
  return VuePro.$http.get({
    url: "/mall/api/front/order/list",
    params: data,
    isCancelRepeat: false
  })
  // return VuePro.$http.get("order/list", data)
}

/**
 * 订单产品信息
 * @param string unique
 */
export function orderProduct(data) {
  return VuePro.$http.post("order/product", data)
}

/**
 * 订单评价
 * @param object data
 *
 */
export function orderComment(data) {
  return VuePro.$http.post("order/comment", data)
}

/**
 * 订单支付
 * @param object data
 */
export function orderPay(data) {
  return VuePro.$http.post("order/pay", data)
}

/**
 * 订单统计数据
 */
//项目中使用
export function orderData() {
  return VuePro.$http.get({
    url: "/mall/api/front/order/data"
  })
  // return VuePro.$http.get("order/data")
}

/**
 * 订单取消
 * @param string id
 *
 */
//项目中已经使用
export function orderCancel(id) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/cancel?id=" + id
    // data: {
    //   id: id
    // }
  })
  // return VuePro.$http.post(
  //   "order/cancel",
  //   {
  //     id: id
  //   },
  //   {},
  //   1
  // )
}

/**
 * 删除已完成订单
 * @param string uni
 *
 */
//项目中已经使用
export function orderDel(uni) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/del",
    data: {
      id: uni
    }
  })
  // return VuePro.$http.post(
  //   "order/del",
  //   {
  //     id: uni
  //   },
  //   {},
  //   1
  // )
}

/**
 * 订单详情
 * @param string uni
 */
export function getOrderDetail(uni) {
  return VuePro.$http.get({
    url: "/mall/api/front/order/detail/" + uni
  })
  // return VuePro.$http.get("order/detail/" + uni)
}

/**
 * 再次下单
 * @param string uni
 *
 */
export function orderAgain(uni) {
  return VuePro.$http.post("order/again", {
    orderNo: uni
  })
}

/**
 * 订单收货
 * @param string uni
 *
 */
export function orderTake(uni) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/take",
    data: {
      id: uni
    }
  })
  // return VuePro.$http.post(
  //   "order/take",
  //   {
  //     id: uni
  //   },
  //   {},
  //   1
  // )
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(uni) {
  return VuePro.$http.get("order/express/" + uni)
}

/**
 * 获取退款理由
 *
 */
export function ordeRefundReason() {
  return VuePro.$http.get("order/refund/reason")
}

/**
 * 订单退款审核
 * @param object data
 */
export function orderRefundVerify(data) {
  return VuePro.$http.post("order/refund", data)
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
 */
export function orderConfirm(
  cartId,
  isNew,
  addAgain,
  secKill,
  combination,
  bargain
) {
  return VuePro.$http.post("order/confirm", {
    cartIds: cartId,
    isNew: isNew,
    addAgain: addAgain,
    secKill: secKill,
    combination: combination,
    bargain: bargain
  })
}

/**
 * 获取当前金额能使用的优惠卷
 * @param string price
 *
 */
// 项目中已经使用
export function getCouponsOrderPrice(preOrderNo) {
  return VuePro.$http.get({
    url: `/mall/api/front/coupons/order/${preOrderNo}`
  })
  // return VuePro.$http.get(`coupons/order/${preOrderNo}`)
}

/**
 * 订单创建
 * @param string key
 * @param object data
 *
 */
//项目已经使用
export function orderCreate(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/create",
    data
  })
  // return VuePro.$http.post("order/create", data)
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
// 项目中已经使用
export function postOrderComputed(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/computed/price",
    data
  })
  // return VuePro.$http.post("order/computed/price", data)
}

/**
 * 将字符串 转base64
 * @param object data
 */
export function qrcodeApi(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/qrcode/str2base64",
    data
    // {},
    // 1
  })
  // return VuePro.$http.post("qrcode/str2base64", data, {}, 1)
}

/**
 * 微信订单支付
 * @param object data
 */
//项目中已经使用
export function wechatOrderPay(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/pay/payment",
    data
  })
  // return VuePro.$http.post("pay/payment", data)
}

/**
 * 微信查询支付结果
 * @param object data
 */
//项目已经使用
export function wechatQueryPayResult(data) {
  return VuePro.$http.get({
    url: "/mall/api/front/pay/queryPayResult?orderNo=" + data
  })
  // return VuePro.$http.get("pay/queryPayResult?orderNo=" + data)
}

/**
 * 申请退款商品详情
 * @param object data
 */
export function applyRefund(orderId) {
  return VuePro.$http.get(`order/apply/refund/${orderId}`)
}

/**
 * 预下单
 * @param object data
 */
//项目中已经使用
export function preOrderApi(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/pre/order",
    data
  })
}

/**
 * 加载预下单
 * @param object preOrderNo
 */
export function loadPreOrderApi(preOrderNo) {
  return VuePro.$http.get({
    url: `/mall/api/front/order/load/pre/${preOrderNo}`
  })
  // return VuePro.$http.get(`order/load/pre/${preOrderNo}`)
}
export function editOrderRemark(orderId, remark) {
  return VuePro.$http.put({
    url:
      `/mall/api/front/order/edit/remark?orderId=` +
      orderId +
      "&remark=" +
      remark +
      "&preOrderNo=123"
  })
}

/**
修改推荐人
 */
export function editEferrerId(orderId, referrerId) {
  return VuePro.$http.put({
    url:
      `/mall/api/front/order/edit/referrerId?orderId=` +
      orderId +
      "&referrerId=" +
      referrerId +
      "&preOrderNo=123"
  })
}
/**
获取订单详情
 */

export function getOrderInfoApi(orderId) {
  return VuePro.$http.get({
    url: `/mall/api/front/order/detail/${orderId}`
  })
}
/**
 * 订单收货
 */
export function receivingApi(id) {
  return VuePro.$http.post({
    url: `/mall/api/front/order/take?id=${id}`
  })
}
/**
 * 申请退款
 */
export function refundApi(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/order/refund",
    data: data
  })
}

/**
 申请开票
 */
export function goInvoice(data) {
  return VuePro.$http.post({
    url: "/mall/user_invoice/insert",
    data
  })
}
