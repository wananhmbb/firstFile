import { getUserServicePackageList, servicePackageUser } from "@/api/service"
const server = {
  state: {
    servicePackageInfo: "",
    servicePackageIndex: 0,
    servicePackageList: [],
    servicePackage: 1,
    nowPrevieVideoArr: [],
    allPrevieVideoArr: [],
    vajraDistrictDictionaries: [],
    ServicePackQuestionnaireInfo: {},
	consultId:"1",//咨询id（暂用）
	drugType:'',//药类型（暂用）
  },

  mutations: {
	//暂用，清除咨询id 药类型
	CLEAN_SERVICE_CONSULT_DATA(state){
		state.consultId = ""
		state.drugType = ""
	},
	//暂用，设置咨询id 药类型
	SET_SERVICE_CONSULT_DATA(state,data){
		state.consultId = data.consultId
		state.drugType = data.drugType
	},
    SET_SERVICE_PACKAGE_LIST(state, list) {
      if (list) {
        list.forEach((item, index) => {
          item.label = item.name
          item.value = index
        })
        state.servicePackageList = list
      } else {
        state.servicePackageList = []
      }
    },
    SET_SERVICE_PACKAGE_INDEX(state, index) {
      state.servicePackageIndex = index
    },
    SET_SERVICE_PACKAGE_INFO(state, data) {
      state.servicePackageInfo = data
    },
    SET_SERVER_PACKAGE(state, data) {
      state.servicePackage = data
    },
    now_Previe_Video_Arr(state, data) {
      state.nowPrevieVideoArr = data
    },
    all_Previe_Video_Arr(state, data) {
      state.allPrevieVideoArr = data
    },
    getVajraDistrictDictionaries(state, data) {
      state.vajraDistrictDictionaries = data
    },
    getServicePackQuestionnaireInfo(state, data) {
      state.ServicePackQuestionnaireInfo = data
    }
  },
  actions: {
    getServicePackageInfo({ commit, state }) {
      getUserServicePackageList()
        .then(res => {
          if (res.code === 200 && res.data && res.data.length > 0) {
            commit("SET_SERVICE_PACKAGE_LIST", res.data)
            if (state.servicePackageIndex) {
              commit(
                "SET_SERVICE_PACKAGE_INFO",
                res.data[state.servicePackageIndex]
              )
            } else {
              commit("SET_SERVICE_PACKAGE_INFO", res.data[0])
            }

            commit("SET_SERVER_PACKAGE", 0)
          } else {
            commit("SET_SERVICE_PACKAGE_LIST", [])
            commit("SET_SERVICE_PACKAGE_INFO", "")
            commit("SET_SERVER_PACKAGE", 1)
          }
        })
        .catch(err => {
          if (err.code) {
            commit("SET_SERVICE_PACKAGE_LIST", [])
            commit("SET_SERVICE_PACKAGE_INFO", "")
            commit("SET_SERVER_PACKAGE", 2)
          }
        })
    },
    getServicePackageInfo1({ commit }) {
      servicePackageUser()
        .then(res => {
          if (res.code == "200" && res.data && res.data.id) {
            commit("SET_SERVICE_PACKAGE_INFO", res.data)
            commit("SET_SERVER_PACKAGE", 0)
          } else {
            commit("SET_SERVICE_PACKAGE_INFO", "")
            commit("SET_SERVER_PACKAGE", 1)
          }
        })
        .catch(err => {
          if (err.code) {
            commit("SET_SERVER_PACKAGE", 2)
          }
        })
    }
  }
}
export default server
