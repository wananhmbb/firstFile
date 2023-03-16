import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 我的卡劵
 *
 */
export function getMyToBeUsedCardList(page, limit, type) {
  return VuePro.$http.get({
    url: "/mall/api/front/coupon/list",
    params: {
      pageNum: page,
      pageSIZE: limit,
      type: type
    }
  })
}

/**
 * 兑换优惠劵
 *
 */
export function exchangeCoupon(code) {
  return VuePro.$http.post({
    url: "/mall/api/front/coupon/receiveByCode",
    params: {
      code: code
    }
  })
}
