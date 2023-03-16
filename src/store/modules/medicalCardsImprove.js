import {getMedicalCardListApi} from "@/api/medicalCard"
import {RequestList} from "@/utils/requestCode"
import store from "store"
const improve = {
  state: {
    isImprove: false, // 判断是否完善进行，
    isImprovePage: false,
    currentImproveInfo: {},
    improveList: []
  },
  actions: {
    //获取就诊卡列表
    GET_IMPROVE_LIST({commit}) {
      getMedicalCardListApi()
        .then(res => {
          if (res.code === RequestList.SUCCESS_CODE) {
            // IS_IMPROVE
            commit("IS_IMPROVE", !res.data[0].toBeImproved)
            commit("SET_IMPROVE_LIST", res.data)
            commit("SET_CURRENT_IMPROVE_INFO", res.data[0])
          } else {
            console.error(res)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mutations: {
    // 判断是否完善信息
    IS_IMPROVE(state, data) {
      state.isImprove = data
    },
    //设置就诊卡的列表
    SET_IMPROVE_LIST(state, list) {
      state.improveList = list
    },
    //设置当前就诊卡的数据
    SET_CURRENT_IMPROVE_INFO(state, info) {
      state.currentImproveInfo = info
    }
  }
}
export default improve
