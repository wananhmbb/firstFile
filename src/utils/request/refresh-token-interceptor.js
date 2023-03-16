const { refreshAccessToken } = require("@/api/login")
const { basicUser } = require("@/utils/user-class/basicUser")
import store from "store"
const refreshAccessTokenUrl = "/auth/oauth/token"
const {
  EXPIRES_IN,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  USER_INFO,
  TEAM_ID,
  WeChat_INFO
} = require("@/const/storage-key")
let uid = 0

export default class RefreshTokenInterceptor {
  // 下次刷新access token的时间戳
  //  uni.getStorageSync(EXPIRES_IN)
  // 重新
  refreshingToken = false

  // 取消的凭证数组
  sourceTokenList = []
  // CancelToken（去掉了用于区分重复请求的uid部分）集合
  cancelTokenWithoutUidMap = {}

  /**
   * 生成请求标识。用于判定两个请求是否是重复的
   * @param config
   * @private
   */
  static createCancelTokenId(config) {
    uid++
    return `${uid}*${config.url}--${JSON.stringify(
      config.data
    )}--${JSON.stringify(config.params)}`
  }

  /**
   * 取消重复请求处理者
   * @param cancelKey
   * @private
   */
  cancelRepeatRequestHandler(cancelKey) {
    const array = cancelKey.split("*")
    const uuid = array[0]
    const token = array[1]

    if (this.cancelTokenWithoutUidMap[token]) {
      const removeIndex = []
      this.sourceTokenList.forEach((item, index) => {
        if (item.cancelKey === cancelKey) {
          item.cancelFn("cancel because of repeat")
          removeIndex.push(index)
        }
      })
      removeIndex.forEach(i => {
        this.sourceTokenList.splice(i, 1)
      })
    } else {
      // NProgress.start(); // 每次切换页面时，调用进度条
      this.cancelTokenWithoutUidMap[token] = uuid
    }
  }
  // 刷新token失败的时候取消全部的请求
  cancelAllRequestHandler() {
    const removeIndex = []
    if (this.sourceTokenList && this.sourceTokenList.length > 0) {
      this.sourceTokenList.forEach((item, index) => {
        item.cancelFn("取消全部请求")
        removeIndex.push(index)
      })
      removeIndex.forEach(i => {
        this.sourceTokenList.splice(i, 1)
      })
    }
    // let getCurrentPage = getCurrentPages()

    // console.log("走这", getCurrentPage)
    // if (getCurrentPage[0].route != "pages/login/index") {
    //   console.log("走这个地方没有b")
    //   uni.navigateTo({
    //     url: "pages/login/index"
    //   })
    // }
  }

  /** 刷新access token的处理器 */
  refreshAccessTokenHandler() {
    if (
      Number((new Date().getTime() / 1000).toFixed(0)) >
        Number(uni.getStorageSync(EXPIRES_IN)) &&
      !this.refreshingToken &&
      uni.getStorageSync(REFRESH_TOKEN) &&
      uni.getStorageSync(WeChat_INFO).openId
    ) {
      this.refreshingToken = true
      refreshAccessToken({
        refresh_token: uni.getStorageSync(REFRESH_TOKEN),
        plat_type: uni.getStorageSync(USER_INFO).loginMode,
        teamId: uni.getStorageSync(TEAM_ID),
        open_id: uni.getStorageSync(WeChat_INFO).openId
      })
        .then(res => {
          uni.setStorageSync(ACCESS_TOKEN, res.access_token)
          uni.setStorageSync(REFRESH_TOKEN, res.refresh_token)
          uni.setStorageSync(
            EXPIRES_IN,
            Number((new Date().getTime() / 1000).toFixed(0)) +
              Number(res.expires_in) -
              300
          )
          // TODO: 没有对接接口，模拟设置下次刷新的时间点
          //   this.nextFreshAccessTokenTimestamp = new Date().getTime() + 10000000
        })
        .catch(error => {
          console.log(error, "刷新失败")

          this.cancelAllRequestHandler()
          basicUser.refreshFailRemoveStorageSync()
          store.commit("IS_LOGIN")
          // uni.redirectTo({
          //   url: "pages/login/index"
          // })

          // TODO: access token 刷新失败的处理
          // console.log(error)
        })
    }
  }

  onSuccessRequest = (config, cancelFn) => {
    let $config = config

    if (
      $config.url === refreshAccessTokenUrl &&
      $config.isNeedAccessToken === true &&
      $config.params &&
      $config.params.grant_type == "refresh_token"
    ) {
      console.log("开始刷新access token")
      this.refreshingToken = true
    }
    const cancelKey = RefreshTokenInterceptor.createCancelTokenId($config)
    config.cancelKey = cancelKey
    this.sourceTokenList.push({
      cancelKey,
      cancelFn
    })
    this.refreshAccessTokenHandler()
    if ($config.isCancelRepeat) {
      this.cancelRepeatRequestHandler(cancelKey)
    }

    if ($config.url === refreshAccessTokenUrl) {
      return $config
    } else {
      return new Promise(resolve => {
        const intervalId = setInterval(() => {
          if (!this.refreshingToken) {
            clearInterval(intervalId)
            if (
              $config.header.Authorization &&
              $config.header.Authorization !=
                "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
            ) {
              $config.header.Authorization =
                "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
            }

            resolve($config)
          }
        }, 200)
      })
    }
  }

  onErrorRequest = error => {
    return Promise.reject(error)
  }

  /** 删除缓存的cancelToken相关数据 */
  deleteCacheCancelToken(cancelKey) {
    const array = cancelKey.split("*")
    const token = array[1]
    delete this.cancelTokenWithoutUidMap[token]
    this.sourceTokenList =
      this.sourceTokenList.length < 1
        ? this.sourceTokenList.filter(
            cancelToken => cancelToken.cancelKey !== cancelKey
          )
        : []

    if (token.split("--")[0] === refreshAccessTokenUrl) {
      console.log("access token刷新结束")
      this.refreshingToken = false
    }
  }

  onSuccessResponse = (response, config) => {
    // 请求每次成功一次就删除当前cancelToken标记
    // console.log(response, "asdasdsa")
    // this.cancelAllRequestHandler()

    const cancelKey = config.cancelKey
    this.deleteCacheCancelToken(cancelKey)
    return response
  }

  onErrorResponse = (error, config) => {
    const cancelKey = config.cancelKey

    this.deleteCacheCancelToken(cancelKey)
    return error
  }
}
