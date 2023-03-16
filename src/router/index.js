import {RouterMount, createRouter} from "uni-simple-router"
import {menueList} from "@/utils/Role-Permission-router"
//import { USER_INFO, USER_LOGIN_ALL_USERTYPE } from "@/const/storage-key"

import store from "@/store"
const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  applet: {
    animationDuration: 0 //默认 300ms  v2.0.6+
  },

  routes: [
    ...ROUTES,
    {
      path: "*",
      redirect: () => {
        // 这个页面没有，如果要打开请写一个页面，不然会导致死循环
        return {name: "login"}
      }
    }
  ]
})

//全局路由前置守卫

// 第一种是将登录页面作为首页， 相当于每个人进来就必须先走登录页面

router.beforeEach((to, from, next) => {
  store.commit("IS_LOGIN")

  // console.log(store.state.user.isLogin)
  if (store.state.user.isLogin) {
    // console.log(to, from)
    const getUserAllRouterList = getAllRouterToUser() // 拿到登录用户的路由

    if (getUserAllRouterList.indexOf(to.name) !== -1) {
      if (judgeVisitCard(to)) {
        next({
          name: "improvePage",
          NAVTYPE: "push",
          params: to.params,
          nextPath: to.path,
          query: to.query
        })
      } else {
        next()
      }
      // next()
      // AlreadyLoggedButOnLoginPage(to, getUserAllRouterList, next)
    } else {
      next({name: "404"})
    }
  } else {
    if (LoginFreeWhitelist(to)) {
      next()
    } else {
      // store.commit("SET_CURRENT_JUMP_TABBAR_PAGE", from.path)

      next({name: "login", NAVTYPE: "push"})
    }
  }
})
//判断去的页面需不需要完善就诊卡信息
function isToPageMedicalCardsImprove(to) {
  if ( menueList.medicalCardsImproveList?.length && menueList.medicalCardsImproveList.indexOf(to.name) !== -1) {
    return true
  } else {
    return false
  }
}

function judgeVisitCard(to) {
  if (isToPageMedicalCardsImprove(to)) {
    if (store.state.improve.isImprove) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}
// 免登陆的页面(白名单)
function LoginFreeWhitelist(to) {
  if (menueList.LoginFreeWhitelist.indexOf(to.name) !== -1) {
    return true
  } else {
    return false
  }
}
// 登录后拿到所有的用户的路由
function getAllRouterToUser() {
  let arr = []
  arr = menueList.userTypeRouterList.concat(menueList.LoginFreeWhitelist)
  return [...new Set(arr)]
}
// 判断当前页面是不是登录页面
function isLoginPage(to) {
  if (to.name == "login") {
    return true
  } else {
    return false
  }
}
// 判断已经登录的情况下， 且当前页面在login页面， 应该进行跳转
function AlreadyLoggedButOnLoginPage(to, getUserAllRouterList, next) {
  if (isLoginPage(to)) {
    next({name: getUserAllRouterList[0]})
  } else {
    next()
  }
}
// 判断当前中是否是在首页
// function isInIndexPage(from, to) {}

// 全局路由后置守卫
router.afterEach((to, from) => {
  // console.log("跳转结束")
})

export {router, RouterMount}
