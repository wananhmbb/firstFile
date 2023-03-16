import store from "@/store"
import { loginUserOrWork } from "@/api/login.js"

import { TEAM_ID } from "@/const/storage-key"
let provider = ""

export function getProvider() {
  uni.getProvider({
    service: "oauth",
    success: res => {
      if (res.provider) {
        provider = res.provider[0]
      }
    },
    fail: err => {
      console.log(err)
    }
  })
}
export function GetCodeForUseUniLogin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider,
      onlyAuthorize: true,
      success: loginRes => {
        if (loginRes.code) {
          store.commit("SET_TEMPORARY_VOUCHER_CODE", loginRes.code)

          resolve(loginRes.code)
        }
      },
      fail: err => {
        reject(err)
        console.log(err)
      }
    })
  })
}
export function loginByWX(openId, number) {
  return new Promise((reslove, reject) => {
    store.commit("SET_SPECIAL_PARAMS_SOME_REQUEST_TO_GRANT_TYPE", "third_plat")
    let Obj = {
      username: number,
      open_id: openId,
      teamId: uni.getStorageSync(TEAM_ID) || 1
    }
    loginUserOrWork(Obj)
      .then(res => {
        reslove(res)

        // console.log(res)
        // basicUser.getUserToken(err, that)
      })
      .catch(err => {
        reject(err)
      })
  })
}
