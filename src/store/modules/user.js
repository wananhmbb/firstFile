import { ACCESS_TOKEN, USER_INFO, EXPIRES_IN } from "@/const/storage-key"

const user = {
  state: {
    isLogin: false, // 判断是否登录，

    // identityType: 1, //(0：就是第三方登录（注册）， 1：手机（登录）登录， 2： 账户密码进行注册（登录） )
    // userType: 1, // (0:老师， 1：学生) 用户的登录的角色
    // hadRegister: false, // 是否使用微信登录过， 默认是没有登录过
    // code: "",
    SpecialParamsSomeRequestsObj: {
      client_id: "app",
      client_secret: "123456",
      scope: "server",
      grant_type: "password"
    },
    openId: "",
    currentJumpTabbarPage: "",
    isLoginPage: false,
    isOrderLoginPage: false // 判断是否是订单登录页,默认不是
  },

  mutations: {
    // 确定是否登录
    IS_LOGIN(state) {
      if (
        uni.getStorageSync(ACCESS_TOKEN) &&
        uni.getStorageSync(USER_INFO).phone &&
        Number(uni.getStorageSync(EXPIRES_IN))
      ) {
        state.isLogin = true

      } else {
        state.isLogin = false
      }
    },

    // 设置不同用户的登录角色
    // SET_USER_TYPE(state, data) {
    //   state.userType = data
    // },
    // 设置登录或者是注册的方式
    // SET_REGISTER_OR_LOGIN_MODE(state, data) {
    //   state.identityType = data
    // },
    SET_SPECIAL_PARAMS_SOME_REQUEST_TO_GRANT_TYPE(state, data) {
      state.SpecialParamsSomeRequestsObj.grant_type = data
    },
    // 拿到openId 方便在注册电话号码的时候使用openId
    PHONE_NUMBER_REGISTRATION_SET_OPENID(state, data) {
      state.openId = data
    },
    // SET_IS_REGISTER_FOR_WX(state, data) {
    //   state.hadRegister = data
    // },
    SET_TEMPORARY_VOUCHER_CODE(state, data) {
      state.code = data
    },
    SET_CURRENT_JUMP_TABBAR_PAGE(state, data) {
      state.currentJumpTabbarPage = data
    },
    SET_IS_LOGIN_PAGE(state, data) {
      state.isLoginPage = data
    },
    SET_IS_Order_LOGIN_PAGE(state, data) {
      state.isOrderLoginPage = data
    }
  }
}
export default user
