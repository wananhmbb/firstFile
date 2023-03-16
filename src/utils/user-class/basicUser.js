// import frequentlyUsedPageJump from "@/utils/frequently-used-page-jump/frequently-used-page-jump"
import {
  ACCESS_TOKEN,
  USER_INFO,
  EXPIRES_IN,
  REFRESH_TOKEN,
  WeChat_INFO
} from "@/const/storage-key"
import store from "@/store"
import { getUserInfo, loginUserOrWork } from "@/api/login.js"
import { getDoctorMessage } from "@/utils/getWebSocketMessage.js"
class basicUser {
  // 登出
  static logoutRemoveStorageSync() {
    // uni.removeStorageSync(USER_INFO, "")
    uni.removeStorageSync("open-id")
    uni.removeStorageSync(ACCESS_TOKEN)
    uni.removeStorageSync(EXPIRES_IN)
    uni.removeStorageSync(REFRESH_TOKEN)
    uni.removeStorageSync(USER_INFO)
    uni.removeStorageSync(WeChat_INFO)
    // uni.removeStorageSync(TEAM_ID, "")
    // uni.removeStorageSync(OPEN_ID)
  }
  static refreshFailRemoveStorageSync() {
    uni.removeStorageSync(ACCESS_TOKEN)
    uni.removeStorageSync(EXPIRES_IN)
    uni.removeStorageSync(REFRESH_TOKEN)
  }
  // 用户名密码或者是手机号的方式进行登录
  static UserPasswordOrPhoneLogin(userInfo, method) {
    return new Promise((resolve, reject) => {
      store.commit("SET_SPECIAL_PARAMS_SOME_REQUEST_TO_GRANT_TYPE", method)
      loginUserOrWork(userInfo)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  // 获取token
  static setUserToken(err, that) {
    uni.setStorageSync(ACCESS_TOKEN, err.access_token)
    uni.setStorageSync(REFRESH_TOKEN, err.refresh_token)

    uni.setStorageSync(
      EXPIRES_IN,
      Number((new Date().getTime() / 1000).toFixed(0)) +
        Number(err.expires_in) -
        300
    )

    let Obj = {
      lastLoginUserType: err.lastLoginUserType,
      userType: err.userType,
      loginMode: store.state.user.SpecialParamsSomeRequestsObj.grant_type,
      user_id: err.user_id
    }

    // this.loadingShow = false
    let arr = err.userType.split(",")

    if (arr && arr.length > 1) {
      that.$Router.replaceAll({ path: "/selectUserType" })
    } else {
      Obj.lastLoginUserType = arr[0]
    }
    uni.setStorageSync(USER_INFO, Obj)
  }
  // 获取用户信息
  static getLoginUserInfo() {
    store.commit("SET_IS_Order_LOGIN_PAGE", false)
    return new Promise(reject => {
      getUserInfo(uni.getStorageSync(USER_INFO).lastLoginUserType)
        .then(res => {
          if (res.code === 200) {
            // let obj = {
            //   id: res.data.id,
            //   phone: res.data.mobile
            // }
            let obj = res.data
            let storageUserInfo = uni.getStorageSync(USER_INFO)

            uni.setStorageSync(USER_INFO, Object.assign(obj, storageUserInfo))
            getDoctorMessage(false)
            store.dispatch('GET_IMPROVE_LIST')
            // if (that.$store.state.user.currentJumpTabbarPage) {
            //   that.$store.commit("IS_LOGIN")
            //   return
            // }
            // that.$store.commit("IS_LOGIN")

            let pageNumber = getCurrentPages().length
            // console.log(
            //   pageNumber,
            //   getCurrentPages(),
            //   " getCurrentPages()[0].route"
            // )
            if (pageNumber > 1) {
              if (
                getCurrentPages()[pageNumber - 1].route ===
                "pages/shopping-mall/order_list/index"
              ) {
                // console.log("订单页登录")
                store.commit("SET_IS_Order_LOGIN_PAGE", true)
              } else {
                uni.navigateBack({
                  delta: 1
                })
              }
            } else if (
              pageNumber > 0 &&
              getCurrentPages()[0].route != "pages/tabbar/index/index"
            ) {
              uni.switchTab({
                url: "pages/tabbar/index/index"
              })
            }
          } else {
            reject(res)
            // uni.$u.toast(res.msg)
          }
        })
        .catch(err => {
          reject(err)
          // console.log(err)
        })
    })
  }
}

export { basicUser }
