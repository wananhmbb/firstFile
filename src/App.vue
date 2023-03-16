<script>
import { getAllTeamList, changeTeam, refreshAccessToken } from "@/api/login.js"
import {
  EXPIRES_IN,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  USER_INFO,
  TEAM_ID,
  WeChat_INFO
} from "@/const/storage-key"
import { hadRegister } from "@/api/login.js"
import { basicUser } from "@/utils/user-class/basicUser"
import store from "store"
import {
  loginByWX,
  getProvider,
  GetCodeForUseUniLogin
} from "@/pages/login/wx-login.js"
export default {
  data() {
    return {
      TeamList: [], //团队列表
      id: "",
      code: ""
    }
  },
  onLaunch: function () {
    // uni.setTabBarBadge({
    //   index: 0,
    //   text: "7",
    //   success: sus => {
    //     console.log("sus", sus)
    //   },
    //   fail: err => {
    //     console.log("err", err)
    //   }
    // })
    uni.setTabBarBadge({
      index: 0,
      text: "1"
    })
    this.init()
  },
  onLoad() {
    uni.addInterceptor("navigateTo", {
      fail(err) {
        console.log("interceptor-fail", err)
      },
      complete(res) {
        console.log("interceptor-complete", res)
      },
      success(e) {
        console.log("interceptor", e)
      }
    })
  },
  onShow: function () {},
  onHide: function () {
    console.log("App Hide")
  },
  methods: {
    async init() {
      try {
        await this.refreshAccessTokenHandler()
        await getProvider()
        this.code = await GetCodeForUseUniLogin()
        await this.getOpenid()
        // await this.getAllTeamList()
      } catch (e) {
        console.error("刷新错误")
      }
    },
    //刷新token
    refreshAccessTokenHandler() {
      if (
        Number((new Date().getTime() / 1000).toFixed(0)) >
          Number(uni.getStorageSync(EXPIRES_IN)) &&
        uni.getStorageSync(REFRESH_TOKEN) &&
        uni.getStorageSync(WeChat_INFO) &&
        uni.getStorageSync(TEAM_ID) &&
        uni.getStorageSync(WeChat_INFO).openId
      ) {
        return new Promise((resolve, reject) => {
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
              resolve(res)
            })
            .catch(error => {
              console.error(error, "刷新失败")
              this.cancelAllRequestHandler()
              basicUser.refreshFailRemoveStorageSync()
              store.commit("IS_LOGIN")
              this.silentLogin()
              reject(error)
            })
        })
      } else {
        store.commit("IS_LOGIN")
        this.silentLogin()
      }
    },
    // 获取所有团队
    getAllTeamList() {
      if (uni.getStorageSync(TEAM_ID)) {
        return
      }
      getAllTeamList()
        .then(res => {
          this.TeamList = res.data
        })
        .catch(err => {
          console.error("获取所有与团队失败", err)
        })
    },
    // 切换团队(暂时没有使用这个方法)
    changeCurrentTeam() {
      changeTeam()
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.error(err)
          console.error("切换团队失败")
        })
    },
    // 获取openID
    getOpenid() {
      return new Promise((resolve, reject) => {
        hadRegister(this.code)
          .then(res => {
            uni.setStorageSync(WeChat_INFO, res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    async silentLogin() {
      if (
        this.SilentLoginMode() &&
        !store.state.user.isLogin &&
        this.judgeOpenidAndTeamId() &&
        uni.getStorageSync(USER_INFO).phone
      ) {
        try {
          let res = await loginByWX(
            uni.getStorageSync(WeChat_INFO).openId,
            uni.getStorageSync(USER_INFO).phone,
            this
          )
          await basicUser.setUserToken(res, this)
          await basicUser.getLoginUserInfo()
        } catch (e) {
          console.error(e, "静默登录失败")
        }
      }
    },
    //判断本地是否有登录用户的信息是不是第三方登录的
    SilentLoginMode() {
      if (
        uni.getStorageSync(USER_INFO).loginMode &&
        uni.getStorageSync(USER_INFO).loginMode == "third_plat"
      ) {
        return true
      } else {
        return false
      }
    },
    // 判断本地是不是存在用户的openId以及TEAM_ID
    judgeOpenidAndTeamId() {
      if (
        uni.getStorageSync(WeChat_INFO).openId &&
        uni.getStorageSync(TEAM_ID)
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
@import "theme/default.css";
@import "theme/dark.css";
.u-cell-hover {
  background-color: var(--bg-color-second) !important;
}
.u-cell-item-box {
  background-color: var(--bg-color-main) !important;
}
.u-model {
  background-color: var(--bg-color-main) !important;
}
/*富文本取消图片之间的缝隙 */
/deep/._img {
  vertical-align: top;
}
/deep/.uni-calendar-item__weeks-box-circle {
  background-color: #fff !important;
}
/deep/.uni-calendar-item--extra {
  //color: var(--theme-color-dark-blue) !important;
}
/deep/.uni-calendar-item--isDay {
  color: #fff !important;
}
/deep/.uni-calendar-item--checked {
  color: #fff !important;
}
</style>
