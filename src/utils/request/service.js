import { ACCESS_TOKEN } from "@/const/storage-key"
import Request from "@/utils/request/request"

const { basicUser } = require("@/utils/user-class/basicUser")
import store from "store"
const getTokenStorage = () => {
  let token = ""
  try {
    token = "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
  } catch (e) {
    //TODO handle the exception
    console.log("getTokenStorage", token)
  }
  return token
}

const serviceRequest = new Request()

serviceRequest.setConfig(config => {
  /* 设置全局配置 */
  // #ifdef H5
  config.baseUrl = process.env.VUE_APP_BASE_API
  // #endif

  // #ifndef H5
  config.baseUrl = process.env.VUE_APP_BASE_API_IP
  // #endif
  config.header = {
    ...config.header
  }
  return config
})
// 设置token
function setRequestHeadeAccessToken() {
  return { Authorization: getTokenStorage() }
}
// 设置请求头
function setReqestHeader(config) {
  config.header = Object.assign(
    {
      ...config.header
    },
    setRequestHeadeAccessToken()
  )
}

serviceRequest.interceptor.request(config => {
  if (config.isNeedTenantId) {
    config.header["tenant-id"] = uni.getStorageSync("tenantId") || 0
  } else {
    config.header["tenant-id"] = "9999"
  }
  if (config.isNeedAccessToken) {
    setReqestHeader(config)
  }
  return config
})

//对http的状态码进行拦截
function HTTPResponseInterception(response) {
  if (response.statusCode == 401 ) {
    basicUser.logoutRemoveStorageSync()
    store.commit("IS_LOGIN")
    if (!store.state.user.isLoginPage) {
      store.commit("SET_IS_LOGIN_PAGE", true)
      uni.navigateTo({
        url: "/page/login/index"
      })
    }
  }
  let res = {
    code: response.statusCode,
    message: ""
  }
  return res
}

//对后端返回的code的状态码进行拦截
function ResponseCodeInterception(response) {
  if (
    response.data &&
    Number(response.data.code) &&
    Number(response.data.code) !== 200
  ) {
    if (
      Number(response.data.code) === 401 ||
      Number(response.data.code) === 403
    ) {
      basicUser.logoutRemoveStorageSync()
      store.commit("IS_LOGIN")
      if (!store.state.user.isLoginPage) {
        store.commit("SET_IS_LOGIN_PAGE", true)
        uni.navigateTo({
          url: "/page/login/index"
        })
      }

      return response.data
    } else {
      return response.data
    }
  }
  return response.data
}

serviceRequest.interceptor.response(
  response => {
    if (response.statusCode == 200) {
      return ResponseCodeInterception(response)
    } else {
      return HTTPResponseInterception(response)
    }
  },
  response => {
    if (response) {
      let data = response.data

      if (data.code) {
        switch (data.code) {
          case 403:
            basicUser.logoutRemoveStorageSync()
            store.commit("IS_LOGIN")
            if (!store.state.user.isLoginPage) {
              store.commit("SET_IS_LOGIN_PAGE", true)
              uni.navigateTo({
                url: "/page/login/index"
              })
            }

            // goBackToNoAuthorizationPage()
            break
          case 500:
            break
          case 404:
            break
          case 504:
            break
          case 401:
            basicUser.logoutRemoveStorageSync()
            store.commit("IS_LOGIN")
            if (!store.state.user.isLoginPage) {
              store.commit("SET_IS_LOGIN_PAGE", true)
              uni.navigateTo({
                url: "/page/login/index"
              })
            }
            // isRefreshing = false
            // goBackToNoAuthorizationPage()
            // 回到登录页面
            break
          default:
            break
        }
      }
    }

    return response.data
  }
)

export default {
  // isNeedAccessToken 的作用就是判断是否需要带token 默认是需要token 所以是true
  // isNeedTenantId 的作用就是判断是否需要带租户id 默认是需要token 所以是true
  get: ({
    url,
    params,
    options = {},
    isNeedAccessToken = true,
    isNeedTenantId = true,
    isCancelRepeat = true
  }) => {
    return serviceRequest.request({
      url,
      method: "GET",
      params,
      ...options,
      isNeedAccessToken,
      isNeedTenantId,
      isCancelRepeat
    })
  },
  post: ({
    url,
    params,
    data,
    options = {},
    isNeedAccessToken = true,
    isNeedTenantId = true,
    isCancelRepeat = true
  }) => {
    return serviceRequest.request({
      url,
      method: "POST",
      params,
      data,
      isNeedAccessToken,
      isNeedTenantId,
      isCancelRepeat,
      ...options
    })
  },
  put: ({
    url,
    data,
    options = {},
    isNeedAccessToken = true,
    isNeedTenantId = true,
    isCancelRepeat = true
  }) => {
    return serviceRequest.request({
      url,
      method: "PUT",
      data,
      ...options,
      isCancelRepeat,
      isNeedAccessToken,
      isNeedTenantId
    })
  },
  delete: ({
    url,
    data,
    options = {},
    isNeedAccessToken = true,
    isNeedTenantId = true,
    isCancelRepeat = true
  }) => {
    return serviceRequest.request({
      url,
      method: "DELETE",
      data,
      ...options,
      isCancelRepeat,
      isNeedAccessToken,
      isNeedTenantId
    })
  }
}
