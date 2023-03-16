const heartRateValue = {
  state: {
    heartRateValue: ""
  },
  mutations: {
    // 获取心率
    getHeartRateValue(state, heartRateValue = []) {
      state.heartRateValue = heartRateValue
    }
  }
}

export default heartRateValue
