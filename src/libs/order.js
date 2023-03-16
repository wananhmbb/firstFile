import { preOrderApi } from "@/api/order.js"
import util from "utils/util"

/**
 * 去商品详情
 */
// export function goShopDetail(item, uid) {
//   return new Promise(resolve => {
//     if (item.activityH5 && item.activityH5.type === "1") {
//       uni.navigateTo({
//         url: `/pages/activity/goods_seckill_details/index?id=${item.activityH5.id}`
//       })
//     } else if (item.activityH5 && item.activityH5.type === "2") {
//       uni.navigateTo({
//         url: `/pages/activity/goods_bargain_details/index?id=${item.activityH5.id}&startBargainUid=${uid}`
//       })
//     } else if (item.activityH5 && item.activityH5.type === "3") {
//       uni.navigateTo({
//         url: `/pages/activity/goods_combination_details/index?id=${item.activityH5.id}`
//       })
//     } else {
//       resolve(item)
//     }
//   })
// }

/**
 * 活动商品、普通商品、购物车、再次购买预下单
 */
export function getPreOrder(
  preOrderType,
  orderDetails,
  getServicePackQuestionnaireInfo
) {
  return new Promise((resolve, reject) => {
    preOrderApi({
      preOrderType: preOrderType,
      orderDetails: orderDetails
    })
      .then(res => {
        if (res.code == 200) {
          resolve(res)
          uni.navigateTo({
            url:
              "/pages/shopping-mall/order_confirm/order_confirm?preOrderNo=" +
              res.data.preOrderNo +
              "&getServicePackQuestionnaireInfo=" +
              getServicePackQuestionnaireInfo
          })
        } else {
          reject(res)
          // return util.Tips({
          //   title: res.message
          // })
        }
      })
      .catch(err => {
        reject(err)
        // return util.Tips({
        //   title: err.message
        // })
      })
  })
}
/**
 * 商城的的预下单
 */
export function getProductPreOrder(preOrderType, orderDetails) {
  return new Promise((resolve, reject) => {
    preOrderApi({
      preOrderType: preOrderType,
      orderDetails: orderDetails
    })
      .then(res => {
        if (res.code == 200) {
          resolve(res)
          uni.navigateTo({
            url:
              "/pages/shopping-mall/index-shopping-mall/order_confirm/order_confirm?preOrderNo=" +
              res.data.preOrderNo
          })
        } else {
          reject(res)
          // return util.Tips({
          //   title: res.message
          // })
        }
      })
      .catch(err => {
        reject(err)
        // return util.Tips({
        //   title: err.message
        // })
      })
  })
}
